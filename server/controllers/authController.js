const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_super_aman_ppdb_2025';

exports.login = async (req, res) => {
  try {
    const { pegid, password } = req.body;

    // 1. Cari User di Database
    const result = await pool.query('SELECT * FROM pengguna_sistem WHERE pegid = $1', [pegid]);
    
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: 'PEGID tidak terdaftar.' });
    }

    const user = result.rows[0];

    // 2. Cek Password (Hash vs Plaintext)
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Kata sandi salah.' });
    }

    // 3. Buat Token JWT (Simpan Role di dalam token)
    const token = jwt.sign(
      { id: user.id_pengguna, role: user.role, nama: user.nama_lengkap },
      JWT_SECRET,
      { expiresIn: '12h' }
    );

    // 4. Kirim Respon
    res.json({
      success: true,
      message: 'Login Berhasil!',
      token: token,
      user: {
        nama: user.nama_lengkap,
        role: user.role, // 'admin' atau 'kepsek'
        pegid: user.pegid
      }
    });

  } catch (err) {
    console.error('SERVER ERROR:', err);
    res.status(500).json({ success: false, message: 'Terjadi kesalahan server.' });
  }
};