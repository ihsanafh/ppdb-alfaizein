const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'rahasia_super_aman_ppdb_2025';

// 1. Cek Token (Apakah dia login?)
const protect = (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded; // Simpan data user (id, role, nama) ke request
      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ success: false, message: 'Sesi habis, login ulang.' });
    }
  }

  if (!token) {
    res.status(401).json({ success: false, message: 'Tidak ada akses token.' });
  }
};

// 2. Cek Role (Apakah jabatannya sesuai?)
const authorize = (...roles) => {
  return (req, res, next) => {
    // req.user.role didapat dari fungsi protect di atas
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Akses ditolak. Jabatan '${req.user.role}' tidak diizinkan mengakses halaman ini.` 
      });
    }
    next();
  };
};

module.exports = { protect, authorize };