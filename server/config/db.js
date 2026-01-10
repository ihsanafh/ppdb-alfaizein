const { Pool } = require('pg');
require('dotenv').config();

// Buat koneksi pool (kolam koneksi) agar efisien
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST, // 'db' dari docker-compose
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT || 5432,
});

// Cek koneksi saat pertama kali jalan
pool.connect((err) => {
  if (err) {
    console.error('❌ Gagal koneksi ke Database:', err.message);
  } else {
    console.log('✅ Terhubung ke Database PostgreSQL');
  }
});

module.exports = pool;