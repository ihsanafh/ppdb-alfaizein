const pool = require('../config/db');
const { kirimPesan } = require('../utils/whatsapp');
const fs = require('fs');
const path = require('path');

// === [BARU] FUNGSI HAPUS FILE JIKA GAGAL ===
const hapusFileUploaded = (files) => {
  if (!files) return;

  // Loop semua field file (file_kk, file_foto, dll)
  Object.values(files).forEach(fileArray => {
    fileArray.forEach(file => {
      // Hapus file dari disk
      fs.unlink(file.path, (err) => {
        if (err) console.error(`Gagal menghapus file sampah: ${file.path}`, err);
        else console.log(`File sampah dihapus: ${file.path}`);
      });
    });
  });
};

// === 1. DAFTAR BARU ===
exports.daftarBaru = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { 
      nik, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, asal_sekolah,
      nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu, no_hp_ortu
    } = req.body;

    // === VALIDASI 1: WILAYAH PELALAWAN ===
    // if (!nik.startsWith('1405')) {
    //     // [PENTING] Hapus file sebelum return error
    //     hapusFileUploaded(req.files); 

    //     return res.status(400).json({ 
    //         success: false, 
    //         message: 'Maaf, pendaftaran khusus domisili Kabupaten Pelalawan.' 
    //     });
    // }

    await client.query('BEGIN');

    // A. Simpan Data Siswa
    const querySiswa = `
      INSERT INTO calon_siswa (
        nik, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, asal_sekolah,
        nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu, no_hp_ortu, status_pendaftaran
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'Menunggu Pembayaran')
      RETURNING nik;
    `;
    
    await client.query(querySiswa, [
      nik, nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, asal_sekolah,
      nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu, no_hp_ortu
    ]);

    // B. Simpan Dokumen
    if (req.files) {
      const dokumenQuery = `INSERT INTO dokumen_pendaftar (nik_siswa, jenis_dokumen, path_file) VALUES ($1, $2, $3)`;
      const fileMapping = { 'file_kk': 'Kartu Keluarga', 'file_akte': 'Akta Kelahiran', 'file_foto': 'Pas Foto', 'file_ijazah': 'Ijazah' };

      for (const [fieldName, fileArray] of Object.entries(req.files)) {
        const jenis = fileMapping[fieldName];
        // Normalisasi path windows (\) ke linux (/)
        const normalizedPath = fileArray[0].path.replace(/\\/g, '/');

        if (jenis) await client.query(dokumenQuery, [nik, jenis, normalizedPath]);
      }
    }

    // C. Catat Log
    await client.query(`INSERT INTO log_status_pendaftaran (nik_siswa, status_baru, keterangan) VALUES ($1, 'Menunggu Pembayaran', 'Pendaftaran mandiri via Website')`, [nik]);

    await client.query('COMMIT');

    // === KIRIM NOTIFIKASI ADAPTIF ===
    const pesanWA = `Halo Bapak/Ibu dari *${nama_lengkap}*,\n\nTerima kasih telah mendaftar di PPDB MI Al-Faizein.\nData Anda telah kami terima dengan NIK: *${nik}*.\n\nSilakan cek status pendaftaran berkala.\nTahap selanjutnya: *Pembayaran Biaya Pendaftaran*.`;
    
    // 1. Kirim Pesan & Tunggu Hasilnya (WhatsApp/SMS/Gagal)
    const metodeKirim = await kirimPesan(no_hp_ortu, pesanWA); 
    
    // 2. Simpan Log sesuai metode yang berhasil
    await pool.query(`
        INSERT INTO riwayat_notifikasi (nik_siswa, jenis_pesan, status_pengiriman, isi_pesan) 
        VALUES ($1, $2, 'Terkirim', $3)
    `, [nik, metodeKirim, pesanWA]);

    res.status(201).json({ success: true, message: 'Pendaftaran Berhasil!', nik: nik });

  } catch (err) {
    await client.query('ROLLBACK');
    
    // [PENTING] Hapus file jika terjadi error apapun (Duplikat NIK, DB Error, dll)
    hapusFileUploaded(req.files);

    console.error('Error Pendaftaran:', err);
    
    if (err.code === '23505') { 
      return res.status(400).json({ success: false, message: 'NIK ini sudah terdaftar. Silakan Cek Status.' });
    }
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  } finally {
    client.release();
  }
};

// === 2. CEK STATUS LENGKAP ===
exports.cekStatus = async (req, res) => {
  try {
    const { nik, tahun_lahir } = req.body;

    // 1. Ambil Data Siswa
    const result = await pool.query(`
      SELECT * FROM calon_siswa 
      WHERE nik = $1 AND EXTRACT(YEAR FROM tanggal_lahir) = $2
    `, [nik, tahun_lahir]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Data tidak ditemukan atau Tahun Lahir salah.'
      });
    }

    const siswa = result.rows[0];

    // 2. Ambil Daftar Dokumen
    const dokRes = await pool.query(
      'SELECT * FROM dokumen_pendaftar WHERE nik_siswa = $1',
      [nik]
    );

    // 3. Ambil Riwayat Log
    const logRes = await pool.query(`
      SELECT status_baru, keterangan, waktu_ubah 
      FROM log_status_pendaftaran 
      WHERE nik_siswa = $1 
      ORDER BY waktu_ubah DESC
    `, [nik]);

    res.json({
      success: true,
      data: {
        siswa,
        dokumen: dokRes.rows,
        riwayat: logRes.rows
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// === 3. CEK KETERSEDIAAN NIK ===
exports.cekNik = async (req, res) => {
  try {
    const { nik } = req.body;

    const result = await pool.query(`
      SELECT nik, nama_lengkap FROM calon_siswa WHERE nik = $1
    `, [nik]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'NIK belum terdaftar. Silakan daftar terlebih dahulu.'
      });
    }

    res.json({
      success: true,
      nama: result.rows[0].nama_lengkap
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// === 4. KONFIRMASI PEMBAYARAN ===
exports.konfirmasiPembayaran = async (req, res) => {
  const client = await pool.connect();

  try {
    const { nik, nama_pengirim, nama_bank } = req.body;

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Bukti transfer wajib diupload!'
      });
    }

    const buktiTransferPath = req.file.path.replace(/\\/g, '/');

    await client.query('BEGIN');

    // 1. Cek Siswa
    const cekSiswa = await client.query(
      'SELECT nik, nama_lengkap, no_hp_ortu FROM calon_siswa WHERE nik = $1',
      [nik]
    );

    if (cekSiswa.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({
        success: false,
        message: 'NIK tidak ditemukan.'
      });
    }

    const { nama_lengkap, no_hp_ortu } = cekSiswa.rows[0];

    // 2. Simpan Transaksi
    const queryTransaksi = `
      INSERT INTO transaksi_pembayaran (nik_siswa, bank_pengirim, nama_pengirim, bukti_transfer, status_verifikasi)
      VALUES ($1, $2, $3, $4, FALSE)
    `;
    await client.query(queryTransaksi, [nik, nama_bank, nama_pengirim, buktiTransferPath]);

    // 3. Update Status Siswa
    await client.query(`
      UPDATE calon_siswa SET status_pendaftaran = 'Menunggu Verifikasi' WHERE nik = $1
    `, [nik]);

    // 4. Log Status
    await client.query(`
      INSERT INTO log_status_pendaftaran (nik_siswa, status_baru, keterangan)
      VALUES ($1, 'Menunggu Verifikasi', 'Siswa mengupload bukti transfer')
    `, [nik]);

    await client.query('COMMIT');

    // === KIRIM NOTIFIKASI WA & CATAT KE DB ===
    const pesanWA = `Halo Bapak/Ibu dari *${nama_lengkap}*,\n\n` +
      `Bukti pembayaran Anda telah kami terima.\n` +
      `Status: *Menunggu Verifikasi Admin*.\n\n` +
      `Kami akan memproses pembayaran Anda segera. Terima kasih!`;

    // === NOTIFIKASI ADAPTIF ===
    const metodeKirim = await kirimPesan(no_hp_ortu, pesanWA);

    await pool.query(`
      INSERT INTO riwayat_notifikasi (nik_siswa, jenis_pesan, status_pengiriman, isi_pesan)
      VALUES ($1, $2, 'Terkirim', $3)
    `, [nik, metodeKirim, pesanWA]);

    res.json({
      success: true,
      message: 'Konfirmasi pembayaran berhasil dikirim. Tunggu verifikasi admin.'
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Gagal menyimpan pembayaran.'
    });
  } finally {
    client.release();
  }
};

// === 5. KIRIM REVISI BERKAS ===
exports.revisiBerkas = async (req, res) => {
  const client = await pool.connect();

  try {
    const { nik } = req.body;

    await client.query('BEGIN');

    const fileMapping = {
      'file_kk': 'Kartu Keluarga',
      'file_akte': 'Akta Kelahiran',
      'file_foto': 'Pas Foto',
      'file_ijazah': 'Ijazah'
    };

    if (req.files) {
      for (const [fieldName, fileArray] of Object.entries(req.files)) {
        let jenis = fileMapping[fieldName];

        if (fieldName === 'file_ijazah') {
          jenis = 'Ijazah SD/Surat Keterangan Lulus';
        }

        const pathFile = fileArray[0].path.replace(/\\/g, '/');

        if (jenis) {
          await client.query(`
            UPDATE dokumen_pendaftar 
            SET path_file = $1, status_validasi = 'Menunggu', catatan_penolakan = NULL, uploaded_at = NOW()
            WHERE nik_siswa = $2 AND jenis_dokumen LIKE $3
          `, [pathFile, nik, `%${jenis.split(' ')[0]}%`]);
        }
      }
    }

    // Ambil data siswa untuk notifikasi
    const siswaResult = await client.query(
      'SELECT nama_lengkap, no_hp_ortu FROM calon_siswa WHERE nik = $1',
      [nik]
    );

    await client.query(`
      UPDATE calon_siswa SET status_pendaftaran = 'Menunggu Verifikasi' WHERE nik = $1
    `, [nik]);

    await client.query(`
      INSERT INTO log_status_pendaftaran (nik_siswa, status_baru, keterangan) 
      VALUES ($1, 'Menunggu Verifikasi', 'Siswa mengirim perbaikan berkas')
    `, [nik]);

    await client.query('COMMIT');

    // === KIRIM NOTIFIKASI WA & CATAT KE DB ===
    // === KIRIM NOTIFIKASI ADAPTIF & CATAT KE DB ===
    if (siswaResult.rows.length > 0) {
      const { nama_lengkap, no_hp_ortu } = siswaResult.rows[0];

      const pesanWA = `Halo Bapak/Ibu dari *${nama_lengkap}*,\n\n` +
        `Perbaikan berkas Anda telah kami terima.\n` +
        `Status: *Menunggu Verifikasi Ulang*.\n\n` +
        `Mohon menunggu konfirmasi dari admin. Terima kasih!`;

      // Kirim & Tangkap Metode
      const metodeKirim = await kirimPesan(no_hp_ortu, pesanWA);

      await pool.query(`
        INSERT INTO riwayat_notifikasi (nik_siswa, jenis_pesan, status_pengiriman, isi_pesan)
        VALUES ($1, $2, 'Terkirim', $3)
      `, [nik, metodeKirim, pesanWA]);
    }

    res.json({
      success: true,
      message: 'Berkas perbaikan berhasil dikirim.'
    });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({
      success: false,
      message: 'Gagal mengirim perbaikan.'
    });
  } finally {
    client.release();
  }
};