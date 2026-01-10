// server/utils/whatsapp.js
const { default: makeWASocket, useMultiFileAuthState, DisconnectReason } = require('@whiskeysockets/baileys');
const pino = require('pino');
const qrcode = require('qrcode-terminal');
const { kirimSMS } = require('./sms'); // <--- IMPORT MODUL SMS TADI

let sock;

// 1. KONEKSI KE WHATSAPP
const connectToWhatsApp = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('auth_info_baileys');

    sock = makeWASocket({
        auth: state,
        printQRInTerminal: true,
        logger: pino({ level: 'silent' }),
        browser: ["PPDB System", "Chrome", "1.0.0"],
        connectTimeoutMs: 60000
    });

    sock.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            console.log('Scan QR Code untuk Login WA:');
            qrcode.generate(qr, { small: true });
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('Koneksi WA terputus. Mencoba reconnect...', shouldReconnect);
            if (shouldReconnect) {
                connectToWhatsApp();
            }
        } else if (connection === 'open') {
            console.log('✅ WhatsApp Terhubung!');
        }
    });

    sock.ev.on('creds.update', saveCreds);
};

// Helper Format Nomor (08xx -> 628xx@s.whatsapp.net)
const formatNomorWA = (nomor) => {
    if (!nomor) return null;
    let formatted = nomor.replace(/\D/g, '');
    if (formatted.startsWith('0')) {
        formatted = '62' + formatted.slice(1);
    }
    return formatted + '@s.whatsapp.net';
};

// 2. FUNGSI KIRIM PESAN ADAPTIF (WA -> SMS)
const kirimPesan = async (nomor, pesan) => {
    let statusPengiriman = 'GAGAL';

    // === JALUR 1: WHATSAPP ===
    try {
        if (sock) {
            const idWA = formatNomorWA(nomor);
            
            // Cek apakah nomor ini terdaftar di WA?
            const [onWA] = await sock.onWhatsApp(idWA);

            if (onWA?.exists) {
                // Jika ada WA, kirim pesan
                await sock.sendMessage(idWA, { text: pesan });
                console.log(`📤 [WA] Pesan terkirim ke ${nomor}`);
                return 'WhatsApp'; // Return jenis pengiriman
            } else {
                console.warn(`⚠️ [WA] Nomor ${nomor} tidak terdaftar WhatsApp.`);
            }
        } else {
            console.warn('⚠️ [WA] Server belum terkoneksi ke WhatsApp.');
        }
    } catch (error) {
        console.error(`❌ [WA] Error saat mengirim ke ${nomor}:`, error.message);
    }

    // === JALUR 2: SMS FALLBACK ===
    console.log('🔄 Mengalihkan ke Jalur SMS (Fallback)...');
    
    const smsBerhasil = await kirimSMS(nomor, pesan);
    
    if (smsBerhasil) {
        return 'SMS';
    } else {
        console.error(`❌ [GAGAL TOTAL] Tidak bisa mengirim via WA maupun SMS ke ${nomor}`);
        return 'Gagal';
    }
};

module.exports = { connectToWhatsApp, kirimPesan };