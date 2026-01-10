const rateLimit = require('express-rate-limit');

// 1. LIMITER UMUM (Untuk seluruh API)
// Mencegah DDoS ringan. Max 100 request per 15 menit per IP.
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 200, // Limit tiap IP ke 200 request per windowMs
    standardHeaders: true, // Mengembalikan info limit di header `RateLimit-*`
    legacyHeaders: false, // Nonaktifkan header `X-RateLimit-*`
    message: { success: false, message: 'Terlalu banyak permintaan dari IP ini, silakan coba lagi setelah 15 menit.' }
});

// 2. LIMITER KHUSUS PENDAFTARAN (Anti Spam)
// Mencegah orang iseng spam formulir pendaftaran.
// Max 5 pendaftaran per 1 jam dari IP yang sama.
const pendaftaranLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 jam
    max: 5, 
    message: { success: false, message: 'Anda sudah melakukan pendaftaran terlalu sering. Mohon tunggu 1 jam lagi.' }
});

// 3. LIMITER KHUSUS LOGIN (Anti Brute Force)
// Mencegah hacker menebak password admin/kepsek.
// Max 5 percobaan gagal per 15 menit.
const loginLimiter = rateLimit({
    windowMs: 15 * 1000, // 15 menit
    max: 5,
    message: { success: false, message: 'Terlalu banyak percobaan login gagal. Akses dikunci selama 15 detik.' }
});

module.exports = { globalLimiter, pendaftaranLimiter, loginLimiter };