const express = require('express');
const router = express.Router();
const pendaftaranController = require('../controllers/pendaftaranController');
const upload = require('../middleware/upload');
const { pendaftaranLimiter } = require('../middleware/security');

// Definisi Field Upload (Sesuai name di Form Frontend)
const uploadFields = upload.fields([
  { name: 'file_kk', maxCount: 1 },
  { name: 'file_akte', maxCount: 1 },
  { name: 'file_foto', maxCount: 1 },
  { name: 'file_ijazah', maxCount: 1 }
]);

// Route: POST /api/pendaftaran/daftar
router.post('/daftar', pendaftaranLimiter, uploadFields, pendaftaranController.daftarBaru);

// Route: POST /api/pendaftaran/check-nik (BARU: Untuk Step 1)
router.post('/check-nik', pendaftaranController.cekNik);

// Route: POST /api/pendaftaran/cek-status (LAMA: Untuk Step 2)
router.post('/cek-status', pendaftaranController.cekStatus);

// (Field name dari frontend nanti harus 'bukti_transfer')
router.post('/konfirmasi-bayar', upload.single('bukti_transfer'), pendaftaranController.konfirmasiPembayaran);

// Route Revisi Berkas
router.post('/revisi', uploadFields, pendaftaranController.revisiBerkas);

module.exports = router;