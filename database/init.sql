-- 1. Buat Tipe Data ENUM untuk Status (Agar data konsisten)
CREATE TYPE status_pendaftaran AS ENUM (
    'Menunggu Pembayaran',
    'Menunggu Verifikasi',
    'Lulus Seleksi Administrasi',
    'Perbaikan Berkas',
    'Diterima',
    'Tidak Diterima',
    'Cadangan'
);

CREATE TYPE status_berkas AS ENUM (
    'Menunggu',
    'Disetujui',
    'Ditolak'
);

CREATE TYPE jenis_kelamin AS ENUM ('L', 'P');

-- 2. Tabel Pengguna Sistem (Admin/Panitia)
-- Sesuai Tabel 3.2 (Login Admin)
CREATE TABLE pengguna_sistem (
    id_pengguna SERIAL PRIMARY KEY,
    nama_lengkap VARCHAR(100) NOT NULL,
    pegid VARCHAR(50) UNIQUE NOT NULL, -- ID Pegawai untuk Login
    password_hash VARCHAR(255) NOT NULL, -- Password terenkripsi
    role VARCHAR(20) DEFAULT 'admin',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Tabel Calon Siswa (Data Utama)
-- Sesuai Gambar 3.29 (Formulir) & ERD Gambar 3.24
CREATE TABLE calon_siswa (
    nik VARCHAR(16) PRIMARY KEY, -- NIK sebagai Primary Key (Unik)
    nama_lengkap VARCHAR(100) NOT NULL,
    tempat_lahir VARCHAR(50),
    tanggal_lahir DATE NOT NULL,
    jenis_kelamin jenis_kelamin NOT NULL,
    alamat TEXT,
    asal_sekolah VARCHAR(100),
    
    -- Data Orang Tua & Kontak (Kunci untuk Notifikasi WA/SMS)
    nama_ayah VARCHAR(100),
    pekerjaan_ayah VARCHAR(50),
    nama_ibu VARCHAR(100),
    pekerjaan_ibu VARCHAR(50),
    no_hp_ortu VARCHAR(15) NOT NULL, -- Wajib untuk Notifikasi Adaptif
    
    -- Status Terkini
    status_pendaftaran status_pendaftaran DEFAULT 'Menunggu Pembayaran',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Tabel Dokumen Pendaftar (Berkas Digital)
-- Sesuai kebutuhan Unggah Berkas & Perbaikan
CREATE TABLE dokumen_pendaftar (
    id_dokumen SERIAL PRIMARY KEY,
    nik_siswa VARCHAR(16) REFERENCES calon_siswa(nik) ON DELETE CASCADE,
    jenis_dokumen VARCHAR(50) NOT NULL, -- Contoh: 'KK', 'Akta', 'Foto'
    path_file VARCHAR(255) NOT NULL,    -- Lokasi file di server
    status_validasi status_berkas DEFAULT 'Menunggu',
    catatan_penolakan TEXT,             -- Diisi admin jika ditolak
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Tabel Transaksi Pembayaran
-- Sesuai Gambar 3.37 & 3.39
CREATE TABLE transaksi_pembayaran (
    id_transaksi SERIAL PRIMARY KEY,
    nik_siswa VARCHAR(16) REFERENCES calon_siswa(nik) ON DELETE CASCADE,
    bank_pengirim VARCHAR(50),
    nama_pengirim VARCHAR(100),
    bukti_transfer VARCHAR(255), -- Path file gambar bukti
    metode_pembayaran VARCHAR(20) DEFAULT 'Transfer', -- 'Transfer' atau 'Tunai'
    status_verifikasi BOOLEAN DEFAULT FALSE,
    verified_by INT REFERENCES pengguna_sistem(id_pengguna), -- Siapa admin yang memverifikasi
    verified_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Tabel Riwayat Notifikasi (Log WA/SMS)
-- Untuk mencatat apakah pesan dikirim via WA atau SMS (Fallback)
CREATE TABLE riwayat_notifikasi (
    id_notifikasi SERIAL PRIMARY KEY,
    nik_siswa VARCHAR(16) REFERENCES calon_siswa(nik) ON DELETE CASCADE,
    jenis_pesan VARCHAR(20), -- 'WhatsApp' atau 'SMS'
    status_pengiriman VARCHAR(20), -- 'Terkirim', 'Gagal'
    isi_pesan TEXT,
    waktu_kirim TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Tabel Log Perubahan Status (Audit Trail)
-- Sesuai ERD Log_status_pendaftaran
CREATE TABLE log_status_pendaftaran (
    id_log SERIAL PRIMARY KEY,
    nik_siswa VARCHAR(16) REFERENCES calon_siswa(nik) ON DELETE CASCADE,
    status_lama VARCHAR(50),
    status_baru VARCHAR(50),
    diubah_oleh INT REFERENCES pengguna_sistem(id_pengguna), -- NULL jika sistem otomatis
    waktu_ubah TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DATA DUMMY (Untuk Tes Login Admin)
-- Password: 'admin' (Hash bcrypt contoh, nanti diganti di backend)
INSERT INTO pengguna_sistem (nama_lengkap, pegid, password_hash) 
VALUES ('Panitia PPDB', 'admin123', '$2b$10$X7V.j5...HashPasswordNanti...');


SELECT * FROM calon_siswa;

SELECT * FROM pengguna_sistem;

SELECT * FROM dokumen_pendaftar;

SELECT * FROM transaksi_pembayaran;

SELECT * FROM riwayat_notifikasi;

SELECT * FROM log_status_pendaftaran;



