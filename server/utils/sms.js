// server/utils/sms.js
const axios = require('axios');

// === KONFIGURASI GATEWAY ===
// Pastikan IP ini sesuai dengan yang ada di HP Anda
const SMS_API_URL = 'http://192.168.1.91:8080'; 
const SMS_USER = 'admin';    
const SMS_PASS = '12345678'; 

const kirimSMS = async (nomorTujuan, pesan) => {
  try {
    // 1. FORMAT NOMOR LEBIH PINTAR
    // Hapus semua karakter selain angka
    let cleanNum = nomorTujuan.toString().replace(/\D/g, ''); 

    // Logika standarisasi ke format +62
    if (cleanNum.startsWith('0')) {
      // Ubah 08xxx jadi +628xxx
      cleanNum = '+62' + cleanNum.slice(1);
    } else if (cleanNum.startsWith('8')) {
      // Ubah 8xxx jadi +628xxx (Kasus Anda saat ini)
      cleanNum = '+62' + cleanNum;
    } else if (cleanNum.startsWith('62')) {
      // Ubah 628xxx jadi +628xxx
      cleanNum = '+' + cleanNum;
    }
    
    // Jika tidak masuk kondisi di atas, biarkan apa adanya (mungkin sudah +62)
    
    console.log(`[SMS] Mengirim ke: ${cleanNum} (Format Asli: ${nomorTujuan})`);

    // 2. Buat Header Auth
    const auth = Buffer.from(`${SMS_USER}:${SMS_PASS}`).toString('base64');

    // 3. Kirim Request ke HP
    const response = await axios.post(`${SMS_API_URL}/message`, {
      phoneNumbers: [cleanNum],
      message: pesan
    }, {
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json'
      },
      timeout: 10000 
    });

    console.log(`✅ SMS Gateway Menerima Request! ID: ${response.data.id}`);
    return true;

  } catch (error) {
    console.error('❌ Gagal Request SMS ke HP:', error.message);
    return false;
  }
};

module.exports = { kirimSMS };