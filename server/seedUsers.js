const pool = require('./config/db');
const bcrypt = require('bcrypt');

const seedUsers = async () => {
  try {
    console.log('🌱 Mulai Seeding User Khusus...');
    
    // Password default: "123456"
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('123456', salt);

    // === 1. AKUN ADMIN PANITIA ===
    // PEG ID: 10405869194003
    // Role: admin
    const adminQuery = `
      INSERT INTO pengguna_sistem (nama_lengkap, pegid, password_hash, role)
      VALUES ('Admin Panitia', '10405869194003', $1, 'admin')
      ON CONFLICT (pegid) 
      DO UPDATE SET password_hash = $1, nama_lengkap = 'Admin Panitia';
    `;
    await pool.query(adminQuery, [passwordHash]);
    console.log('✅ Admin dibuat -> PEGID: 10405869194003 | Pass: 123456');

    // === 2. AKUN KEPALA MADRASAH ===
    // PEG ID: 2207113380
    // Role: kepsek
    const kepsekQuery = `
      INSERT INTO pengguna_sistem (nama_lengkap, pegid, password_hash, role)
      VALUES ('Kepala Madrasah', '2207113380', $1, 'kepsek')
      ON CONFLICT (pegid) 
      DO UPDATE SET password_hash = $1, nama_lengkap = 'Kepala Madrasah';
    `;
    await pool.query(kepsekQuery, [passwordHash]);
    console.log('✅ Kepsek dibuat -> PEGID: 2207113380 | Pass: 123456');

    console.log('🎉 Selesai! Silakan login.');
    process.exit();
  } catch (err) {
    console.error('❌ Gagal Seed:', err);
    process.exit(1);
  }
};

seedUsers();