const pool = require('../config/db');
const { kirimPesan } = require('../utils/whatsapp');

// === 1. AMBIL STATISTIK DASHBOARD (LENGKAP) ===
exports.getDashboardStats = async (req, res) => {
  try {
    const total = await pool.query('SELECT COUNT(*) FROM calon_siswa');
    const menungguBayar = await pool.query("SELECT COUNT(*) FROM calon_siswa WHERE status_pendaftaran = 'Menunggu Pembayaran'");
    const verifikasi = await pool.query("SELECT COUNT(*) FROM transaksi_pembayaran WHERE status_verifikasi = FALSE");
    const perbaikan = await pool.query("SELECT COUNT(*) FROM calon_siswa WHERE status_pendaftaran = 'Perbaikan Berkas'");
    const diterima = await pool.query("SELECT COUNT(*) FROM calon_siswa WHERE status_pendaftaran = 'Diterima'");

    const terbaru = await pool.query(`
      SELECT nik, nama_lengkap, created_at 
      FROM calon_siswa 
      ORDER BY created_at DESC LIMIT 5
    `);
    
    const pendingVerif = await pool.query(`
      SELECT t.id_transaksi, c.nama_lengkap, t.created_at 
      FROM transaksi_pembayaran t
      JOIN calon_siswa c ON t.nik_siswa = c.nik
      WHERE t.status_verifikasi = FALSE
      ORDER BY t.created_at ASC LIMIT 5
    `);

    res.json({
      success: true,
      data: {
        total: parseInt(total.rows[0].count),
        menunggu_bayar: parseInt(menungguBayar.rows[0].count),
        verifikasi: parseInt(verifikasi.rows[0].count),
        perbaikan: parseInt(perbaikan.rows[0].count),
        diterima: parseInt(diterima.rows[0].count),
        pendaftar_terbaru: terbaru.rows,
        verifikasi_pending: pendingVerif.rows
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal mengambil statistik.' });
  }
};

// === 2. AMBIL DATA PENDAFTAR (DENGAN PAGINATION & MODE LAPORAN) ===
exports.getAllPendaftar = async (req, res) => {
  try {
    let { page = 1, limit = 10, search = '' } = req.query;

    // Konversi ke Integer agar aman
    const pageInt = parseInt(page) || 1;
    const limitInt = parseInt(limit) || 10;
    const offset = (pageInt - 1) * limitInt;

    // Base Query
    let queryData = `
      SELECT nik, nama_lengkap, asal_sekolah, no_hp_ortu, status_pendaftaran, created_at 
      FROM calon_siswa 
    `;
    let queryCount = `SELECT COUNT(*) FROM calon_siswa`;
    
    let params = [];
    let whereClauses = [];

    // Logika Pencarian (Search)
    if (search) {
      whereClauses.push(`(nama_lengkap ILIKE $${params.length + 1} OR nik ILIKE $${params.length + 1})`);
      params.push(`%${search}%`);
    }

    // Gabungkan WHERE jika ada
    if (whereClauses.length > 0) {
      const whereString = ' WHERE ' + whereClauses.join(' AND ');
      queryData += whereString;
      queryCount += whereString;
    }

    // Urutkan data terbaru
    queryData += ` ORDER BY created_at DESC`;

    // LOGIKA KHUSUS: Jika limit='all' atau limit > 1000 (Untuk Laporan), JANGAN PAKAI PAGINATION
    if (limit === 'all' || limitInt > 1000) {
       // Tidak pakai LIMIT/OFFSET
    } else {
       // Pakai Pagination (Untuk Tabel Admin)
       queryData += ` LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
       params.push(limitInt, offset);
    }

    // Eksekusi Query
    const dataRes = await pool.query(queryData, params);
    
    // Hitung Total Data (Untuk Pagination Frontend)
    // Note: Parameter count query harus sesuai dengan parameter search saja (tanpa limit/offset)
    const countParams = search ? [`%${search}%`] : [];
    const countRes = await pool.query(queryCount, countParams);

    const totalData = parseInt(countRes.rows[0].count);
    const totalPages = limit === 'all' ? 1 : Math.ceil(totalData / limitInt);

    res.json({
      success: true,
      data: dataRes.rows, // Array Data Siswa
      pagination: {
        totalData,
        totalPages,
        currentPage: pageInt,
        perPage: limit === 'all' ? totalData : limitInt
      }
    });

  } catch (err) {
    console.error("Error getAllPendaftar:", err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// === 3. AMBIL DETAIL SISWA ===
exports.getPendaftarByNik = async (req, res) => {
  try {
    const { nik } = req.params;

    const siswaRes = await pool.query('SELECT * FROM calon_siswa WHERE nik = $1', [nik]);
    if (siswaRes.rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Siswa tidak ditemukan' });
    }

    const dokRes = await pool.query('SELECT * FROM dokumen_pendaftar WHERE nik_siswa = $1', [nik]);
    const bayarRes = await pool.query('SELECT * FROM transaksi_pembayaran WHERE nik_siswa = $1', [nik]);
    const logRes = await pool.query(`
      SELECT status_baru, keterangan, waktu_ubah 
      FROM log_status_pendaftaran 
      WHERE nik_siswa = $1 
      ORDER BY waktu_ubah DESC
    `, [nik]);

    res.json({
      success: true,
      data: {
        siswa: siswaRes.rows[0],
        dokumen: dokRes.rows,
        pembayaran: bayarRes.rows[0] || null,
        riwayat: logRes.rows
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// === 4. EDIT DATA SISWA (ADMIN) ===
exports.updateDataSiswa = async (req, res) => {
  try {
    const { nik } = req.params;
    
    // [DEBUG LOG 1] Cek Data Masuk
    console.log('--- START UPDATE DATA SISWA ---');
    console.log('Target NIK:', nik);
    console.log('Body Data:', req.body);
    console.log('User Admin:', req.user);

    const { 
      nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, asal_sekolah,
      nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu, no_hp_ortu 
    } = req.body;

    // Validasi Admin ID
    const adminId = req.user ? req.user.id : null;
    if (!adminId) {
        console.error('ERROR: Admin ID (req.user) tidak ditemukan/undefined');
        return res.status(401).json({ success: false, message: 'Sesi Admin tidak valid. Silakan login ulang.' });
    }

    const queryUpdate = `
      UPDATE calon_siswa 
      SET nama_lengkap = $1, tempat_lahir = $2, tanggal_lahir = $3, jenis_kelamin = $4, 
          alamat = $5, asal_sekolah = $6, nama_ayah = $7, pekerjaan_ayah = $8, 
          nama_ibu = $9, pekerjaan_ibu = $10, no_hp_ortu = $11
      WHERE nik = $12
    `;

    const values = [
      nama_lengkap, tempat_lahir, tanggal_lahir, jenis_kelamin, alamat, asal_sekolah,
      nama_ayah, pekerjaan_ayah, nama_ibu, pekerjaan_ibu, no_hp_ortu, nik
    ];

    // Eksekusi Update
    const result = await pool.query(queryUpdate, values);

    // [DEBUG LOG 2] Cek Hasil Database
    console.log('Update Result RowCount:', result.rowCount);

    if (result.rowCount === 0) {
        return res.status(404).json({ success: false, message: 'NIK siswa tidak ditemukan di database.' });
    }

    // Log perubahan data ke tabel history
    await pool.query(`
      INSERT INTO log_status_pendaftaran (nik_siswa, status_baru, keterangan, diubah_oleh) 
      VALUES ($1, (SELECT status_pendaftaran FROM calon_siswa WHERE nik = $1::varchar), 'Data siswa diperbarui oleh Admin', $2)
    `, [nik, adminId]);

    console.log('--- SUKSES UPDATE DATA SISWA ---');
    res.json({ success: true, message: 'Data siswa berhasil diperbarui.' });

  } catch (err) {
    // [DEBUG LOG ERROR]
    console.error('=== ERROR UPDATE DATA SISWA ===');
    console.error('Error Message:', err.message);
    console.error('SQL Error Code:', err.code);
    console.error('Full Stack:', err);
    
    res.status(500).json({ 
        success: false, 
        message: 'Gagal update data: ' + err.message
    });
  }
};

// === 5. UPDATE STATUS SISWA (Lulus/Tidak) + NOTIFIKASI ADAPTIF ===
exports.updateStatusSiswa = async (req, res) => {
  try {
    const { nik } = req.params;
    const { status_baru } = req.body; 
    
    // Ambil data siswa
    const resHP = await pool.query(
      'SELECT nama_lengkap, no_hp_ortu FROM calon_siswa WHERE nik = $1', 
      [nik]
    );
    const siswa = resHP.rows[0];

    // Update status
    await pool.query(
      'UPDATE calon_siswa SET status_pendaftaran = $1 WHERE nik = $2', 
      [status_baru, nik]
    );

    // Catat log status
    await pool.query(`
      INSERT INTO log_status_pendaftaran (nik_siswa, status_baru, keterangan, diubah_oleh) 
      VALUES ($1, $2, 'Update oleh Admin', $3)
    `, [nik, status_baru, req.user.id]);

    // === KIRIM NOTIFIKASI ADAPTIF (WA -> SMS) ===
    const pesan = `Halo, status pendaftaran ananda *${siswa.nama_lengkap}* telah diperbarui menjadi:\n\n` +
                  `*${status_baru.toUpperCase()}*\n\n` +
                  `Silakan cek detailnya di website "Cek Status".`;
    
    // 1. Kirim & Tangkap Metode Berhasil
    const metodeKirim = await kirimPesan(siswa.no_hp_ortu, pesan);
    
    // 2. Simpan ke riwayat notifikasi sesuai metode
    await pool.query(`
      INSERT INTO riwayat_notifikasi (nik_siswa, jenis_pesan, status_pengiriman, isi_pesan)
      VALUES ($1, $2, 'Terkirim', $3)
    `, [nik, metodeKirim, pesan]);

    res.json({ success: true, message: 'Status berhasil diperbarui' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal update status' });
  }
};

// === 6. BAYAR TUNAI + NOTIFIKASI ADAPTIF ===
exports.bayarTunai = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { nik } = req.params;
    
    // Ambil data siswa
    const resSiswa = await pool.query(
      'SELECT nama_lengkap, no_hp_ortu FROM calon_siswa WHERE nik = $1', 
      [nik]
    );
    const siswa = resSiswa.rows[0];

    await client.query('BEGIN');

    // Insert transaksi tunai
    await client.query(`
      INSERT INTO transaksi_pembayaran (
        nik_siswa, bank_pengirim, nama_pengirim, metode_pembayaran, 
        status_verifikasi, verified_by, verified_at
      )
      VALUES ($1, 'TUNAI', 'Orang Tua/Wali', 'Tunai', TRUE, $2, NOW())
    `, [nik, req.user.id]);

    // Update status siswa
    await client.query(
      "UPDATE calon_siswa SET status_pendaftaran = 'Pembayaran Terkonfirmasi' WHERE nik = $1", 
      [nik]
    );

    // Log status
    await client.query(`
      INSERT INTO log_status_pendaftaran (nik_siswa, status_baru, keterangan) 
      VALUES ($1, 'Pembayaran Terkonfirmasi', 'Pembayaran Tunai di Sekolah')
    `, [nik]);

    await client.query('COMMIT');

    // === KIRIM NOTIFIKASI ADAPTIF (WA -> SMS) ===
    const pesan = `Pembayaran TUNAI untuk pendaftaran *${siswa.nama_lengkap}* telah kami terima di sekolah.\n\n` +
                  `Status saat ini: *LUNAS*.`;
    
    // 1. Kirim & Tangkap Metode Berhasil
    const metodeKirim = await kirimPesan(siswa.no_hp_ortu, pesan);
    
    // 2. Simpan ke riwayat notifikasi (gunakan pool, bukan client)
    await pool.query(`
      INSERT INTO riwayat_notifikasi (nik_siswa, jenis_pesan, status_pengiriman, isi_pesan)
      VALUES ($1, $2, 'Terkirim', $3)
    `, [nik, metodeKirim, pesan]);

    res.json({ success: true, message: 'Pembayaran tunai berhasil dicatat.' });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal memproses pembayaran tunai.' });
  } finally {
    client.release();
  }
};

// === 7. AMBIL LIST PEMBAYARAN (Pending) ===
exports.getPendingPayments = async (req, res) => {
  try {
    const query = `
      SELECT t.*, c.nama_lengkap 
      FROM transaksi_pembayaran t
      JOIN calon_siswa c ON t.nik_siswa = c.nik
      WHERE t.status_verifikasi = FALSE
      ORDER BY t.created_at DESC
    `;
    const result = await pool.query(query);
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal ambil data pembayaran' });
  }
};

// === 8. PROSES VERIFIKASI PEMBAYARAN (Transfer) + NOTIFIKASI ADAPTIF ===
exports.verifyPayment = async (req, res) => {
  const client = await pool.connect();
  
  try {
    const { id_transaksi } = req.params;
    const { aksi, nik_siswa } = req.body;

    // Ambil data siswa
    const resData = await client.query(
      'SELECT nama_lengkap, no_hp_ortu FROM calon_siswa WHERE nik = $1', 
      [nik_siswa]
    );
    const siswa = resData.rows[0];

    await client.query('BEGIN');

    let pesan = '';

    if (aksi === 'terima') {
      // Update transaksi
      await client.query(
        'UPDATE transaksi_pembayaran SET status_verifikasi = TRUE, verified_by = $1, verified_at = NOW() WHERE id_transaksi = $2',
        [req.user.id, id_transaksi]
      );
      
      // Update status siswa
      await client.query(
        "UPDATE calon_siswa SET status_pendaftaran = 'Pembayaran Terkonfirmasi' WHERE nik = $1",
        [nik_siswa]
      );
      
      // Log status
      await client.query(
        "INSERT INTO log_status_pendaftaran (nik_siswa, status_baru, keterangan) VALUES ($1, 'Pembayaran Terkonfirmasi', 'Pembayaran Diverifikasi Admin')",
        [nik_siswa]
      );
      
      // Pesan notifikasi
      pesan = `Pembayaran pendaftaran atas nama *${siswa.nama_lengkap}* telah *DITERIMA/LUNAS*.\n\nTerima kasih!`;

    } else if (aksi === 'tolak') {
      // Update status siswa
      await client.query(
        "UPDATE calon_siswa SET status_pendaftaran = 'Pembayaran Ditolak' WHERE nik = $1",
        [nik_siswa]
      );
      
      // Tandai transaksi processed
      await client.query(
        'UPDATE transaksi_pembayaran SET status_verifikasi = TRUE, verified_by = $1, verified_at = NOW() WHERE id_transaksi = $2',
        [req.user.id, id_transaksi]
      );
      
      // Log status
      await client.query(
        "INSERT INTO log_status_pendaftaran (nik_siswa, status_baru, keterangan) VALUES ($1, 'Pembayaran Ditolak', 'Bukti transfer tidak valid/buram')",
        [nik_siswa]
      );

      // Pesan notifikasi
      pesan = `Mohon maaf, bukti pembayaran untuk *${siswa.nama_lengkap}* *DITOLAK*.\n\n` +
              `Silakan unggah bukti yang valid melalui menu Cek Status.`;
    }

    await client.query('COMMIT');

    // === KIRIM NOTIFIKASI ADAPTIF (WA -> SMS) ===
    // 1. Kirim & Tangkap Metode Berhasil
    const metodeKirim = await kirimPesan(siswa.no_hp_ortu, pesan);
    
    // 2. Simpan ke riwayat notifikasi (gunakan pool, bukan client)
    await pool.query(`
      INSERT INTO riwayat_notifikasi (nik_siswa, jenis_pesan, status_pengiriman, isi_pesan)
      VALUES ($1, $2, 'Terkirim', $3)
    `, [nik_siswa, metodeKirim, pesan]);

    res.json({ success: true, message: `Pembayaran berhasil di-${aksi}` });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal memproses verifikasi' });
  } finally {
    client.release();
  }
};

// === 9. VERIFIKASI DOKUMEN + NOTIFIKASI ADAPTIF ===
exports.verifyDokumen = async (req, res) => {
  try {
    const { id_dokumen } = req.params;
    const { status, catatan } = req.body; 

    // Update status dokumen
    await pool.query(
      'UPDATE dokumen_pendaftar SET status_validasi = $1, catatan_penolakan = $2 WHERE id_dokumen = $3',
      [status, catatan || null, id_dokumen]
    );

    // === JIKA DITOLAK, KIRIM NOTIFIKASI ADAPTIF ===
    if (status === 'Ditolak') {
      const resDoc = await pool.query(`
        SELECT d.jenis_dokumen, d.nik_siswa, s.nama_lengkap, s.no_hp_ortu 
        FROM dokumen_pendaftar d 
        JOIN calon_siswa s ON d.nik_siswa = s.nik 
        WHERE d.id_dokumen = $1
      `, [id_dokumen]);
      
      const data = resDoc.rows[0];
      
      const pesan = `PENTING: Dokumen *${data.jenis_dokumen}* ananda *${data.nama_lengkap}* DITOLAK.\n\n` +
                    `Alasan: "${catatan}"\n\n` +
                    `Mohon segera perbaiki melalui menu Cek Status.`;
      
      // 1. Kirim & Tangkap Metode Berhasil
      const metodeKirim = await kirimPesan(data.no_hp_ortu, pesan);
      
      // 2. Simpan ke riwayat notifikasi
      await pool.query(`
        INSERT INTO riwayat_notifikasi (nik_siswa, jenis_pesan, status_pengiriman, isi_pesan)
        VALUES ($1, $2, 'Terkirim', $3)
      `, [data.nik_siswa, metodeKirim, pesan]);
    }

    res.json({ success: true, message: `Dokumen berhasil diubah menjadi ${status}` });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal verifikasi dokumen' });
  }
};

// === 10. AMBIL RIWAYAT NOTIFIKASI ===
exports.getRiwayatNotifikasi = async (req, res) => {
  try {
    // Join dengan calon_siswa agar kita tahu nama penerimanya siapa
    const result = await pool.query(`
      SELECT r.*, c.nama_lengkap 
      FROM riwayat_notifikasi r
      JOIN calon_siswa c ON r.nik_siswa = c.nik
      ORDER BY r.waktu_kirim DESC
    `);
    
    res.json({ success: true, data: result.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Gagal mengambil riwayat notifikasi' });
  }
};