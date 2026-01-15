const axios = require('axios');

// === KONFIGURASI SERVER CLOUD ===
// Dokumentasi: https://github.com/capcom6/android-sms-gateway/blob/master/docs/api.md
// Perhatikan: Endpoint harus jamak '/messages'
const SMS_API_URL = 'https://api.sms-gate.app/3rdparty/v1/messages';

// === KREDENSIAL DARI APLIKASI DI HP ===
const API_USERNAME = 'K4SV7D';        // Sesuaikan dengan 'username' di HP
const API_PASSWORD = 'qwerty12345678'; // Sesuaikan dengan 'password' di HP

const kirimSMS = async (nomorTujuan, pesan) => {
  try {
    // 1. FORMAT NOMOR (Pastikan +62)
    let cleanNum = nomorTujuan.toString().replace(/\D/g, ''); 
    if (cleanNum.startsWith('0')) cleanNum = '+62' + cleanNum.slice(1);
    else if (cleanNum.startsWith('8')) cleanNum = '+62' + cleanNum;
    else if (cleanNum.startsWith('62')) cleanNum = '+' + cleanNum;

    console.log(`[SMS Cloud] Mengirim ke: ${cleanNum}`);

    // 2. KIRIM REQUEST (Menggunakan Basic Auth)
    const response = await axios.post(SMS_API_URL, {
      message: pesan,
      phoneNumbers: [cleanNum], // Wajib array
    }, {
      // Axios otomatis meng-handle Basic Auth (base64 encode username:password)
      auth: {
        username: API_USERNAME,
        password: API_PASSWORD
      },
      timeout: 15000 
    });

    console.log(`✅ SMS Berhasil dikirim ke Cloud! ID: ${response.data.id}`);
    return true;

  } catch (error) {
    // Analisis Error yang lebih detail
    if (error.response) {
      console.error('❌ Gagal Kirim SMS (Server Response):', {
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      console.error('❌ Gagal Kirim SMS (Koneksi): Tidak ada respon dari server api.sms-gate.app');
    } else {
      console.error('❌ Gagal Kirim SMS (Internal):', error.message);
    }
    return false;
  }
};

module.exports = { kirimSMS };