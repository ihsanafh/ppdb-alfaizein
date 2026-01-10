const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { globalLimiter } = require('./middleware/security');

// Import Routes
const pendaftaranRoutes = require('./routes/pendaftaranRoutes');
const authRoutes = require('./routes/authRoutes'); // Nanti dibuka saat modul Auth dibuat
const adminRoutes = require('./routes/adminRoutes'); // Nanti dibuka saat modul Admin dibuat
const { connectToWhatsApp } = require('./utils/whatsapp');

const app = express();
// 1. Keamanan Header HTTP
app.use(helmet({
    crossOriginResourcePolicy: false, // Agar gambar bisa diakses frontend
}));
const port = process.env.PORT || 5000;
connectToWhatsApp();
// Middleware Global
app.use(cors());
app.use(express.json()); // Parsing JSON
app.use(express.urlencoded({ extended: true })); // Parsing Form Data

// Static Folder untuk Uploads (Agar file bisa diakses Frontend)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routing API
app.use('/api/pendaftaran', pendaftaranRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);

// Route Default
app.get('/', (req, res) => {
  res.send('🚀 Backend PPDB Al-Faizein Berjalan Normal!');
});

app.set('trust proxy', 1);
app.use('/api', globalLimiter);

// GLOBAL ERROR HANDLER
app.use((err, req, res, next) => {
  console.error(err.stack); // Log error di terminal

  // Handle Error Multer (File terlalu besar/salah tipe)
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ success: false, message: 'Ukuran file terlalu besar! Maksimal 5MB.' });
  }
  
  if (err.message === 'Hanya file Gambar (JPG/PNG) dan PDF yang diperbolehkan!') {
    return res.status(400).json({ success: false, message: err.message });
  }

  // Error umum lainnya
  res.status(500).json({ 
    success: false, 
    message: 'Terjadi kesalahan pada server.',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Jalankan Server
app.listen(port, () => {
  console.log(`Server berjalan di port ${port}`);
});



