const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Fungsi Helper untuk memastikan folder ada
const ensureDir = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Konfigurasi Penyimpanan
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // ... logika folder sama ...
    let uploadPath = 'uploads/';
    if (['file_kk', 'file_akte', 'file_foto', 'file_ijazah'].includes(file.fieldname)) {
      uploadPath = 'uploads/dokumen/';
    } else if (file.fieldname === 'bukti_transfer') {
      uploadPath = 'uploads/pembayaran/';
    }
    ensureDir(uploadPath);
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const nik = req.body.nik || 'TANPA-NIK';
    const rawNama = req.body.nama_lengkap || req.body.nama_pengirim || 'TANPA-NAMA';
    const namaBersih = rawNama.replace(/[^a-zA-Z0-9]/g, '');

    let prefix = 'DOC';
    switch (file.fieldname) {
      case 'file_kk': prefix = 'KK'; break;
      case 'file_akte': prefix = 'AKTA'; break;
      case 'file_foto': prefix = 'FOTO'; break;
      case 'file_ijazah': prefix = 'IJAZAH'; break;
      case 'bukti_transfer': prefix = 'BUKTI-TF'; break;
    }

    // CEK APAKAH INI REVISI? (Dikirim dari Frontend)
    const suffix = req.body.is_revisi === 'true' ? '_PERBAIKAN' : '';
    
    // Tambahkan timestamp agar unik
    const timestamp = Date.now(); 
    const ext = path.extname(file.originalname);
    
    // Format: KK_123456_Ahmad_PERBAIKAN.jpg
    const finalName = `${prefix}_${nik}_${namaBersih}${suffix}${ext}`;

    cb(null, finalName);
  }
});

// Filter File
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Hanya file Gambar (JPG/PNG) dan PDF yang diperbolehkan!'));
  }
};

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: fileFilter
});

module.exports = upload;