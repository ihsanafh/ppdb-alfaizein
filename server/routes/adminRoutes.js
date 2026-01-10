const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/authMiddleware'); // Import authorize

// === 1. READ ONLY (Bisa Admin & Kepsek) ===
// Dashboard Analisa
router.get('/stats', protect, authorize('admin', 'kepsek'), adminController.getDashboardStats);
// Lihat Daftar Pendaftar
router.get('/pendaftar', protect, authorize('admin', 'kepsek'), adminController.getAllPendaftar);
// Lihat Detail Pendaftar
router.get('/pendaftar/:nik', protect, authorize('admin', 'kepsek'), adminController.getPendaftarByNik);
// Lihat Riwayat Notifikasi
router.get('/riwayat-notifikasi', protect, authorize('admin', 'kepsek'), adminController.getRiwayatNotifikasi);


// === 2. WRITE/EDIT (HANYA ADMIN) ===
// Update Status Kelulusan
router.put('/pendaftar/:nik/status', protect, authorize('admin'), adminController.updateStatusSiswa);
// Bayar Tunai
router.post('/pendaftar/:nik/bayar-tunai', protect, authorize('admin'), adminController.bayarTunai);
// Update Data Siswa
router.put('/pendaftar/:nik/update-data', protect, authorize('admin'), adminController.updateDataSiswa);

// Verifikasi Pembayaran
router.get('/pembayaran/pending', protect, authorize('admin'), adminController.getPendingPayments);
router.post('/pembayaran/:id_transaksi/verifikasi', protect, authorize('admin'), adminController.verifyPayment);

// Verifikasi Dokumen
router.put('/dokumen/:id_dokumen/verifikasi', protect, authorize('admin'), adminController.verifyDokumen);

module.exports = router;