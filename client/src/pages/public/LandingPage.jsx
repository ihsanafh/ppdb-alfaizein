import React from 'react';
import UserLayout from '../../layouts/UserLayout';
import { Link } from 'react-router-dom';
import FotoGuru from '../../assets/images/foto-guru.jpg'; // Pastikan foto ini sudah ada

export default function LandingPage() {
  return (
    <UserLayout>
      <main>
        {/* === HERO SECTION (HIJAU & KUNING) === */}
        <section className="bg-primary relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-20">
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Text Content */}
              <div className="text-white text-center lg:text-left z-10">
                <div className="inline-block px-4 py-1.5 bg-yellow-400 text-black rounded-full text-sm font-bold mb-6 shadow-md">
                  Tahun Ajaran 2025-2026
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight">
                  Penerimaan Peserta Didik Baru <br /> MI AL-FAIZEIN
                </h1>

                <p className="mt-6 text-base sm:text-lg text-white/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-medium">
                  "Terwujudnya Peserta didik yang taat kepada Allah, Berakhlak mulia dan Berprestasi."
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link to="/daftar" className="w-full sm:w-auto bg-yellow-400 text-black font-bold py-3 px-8 rounded-full shadow-lg hover:bg-yellow-300 transition-all transform hover:-translate-y-1">
                    Daftar Sekarang
                  </Link>
                  <Link to="/cek-status" className="w-full sm:w-auto bg-transparent border-2 border-white text-white font-bold py-3 px-8 rounded-full hover:bg-white/10 transition-all">
                    Cek Status
                  </Link>
                </div>
              </div>

              {/* Image Content (FOTO GURU) */}
              <div className="relative z-10 flex justify-center lg:justify-end">
                <div className="relative rounded-2xl p-3 bg-yellow-400/30 backdrop-blur-sm border border-yellow-400/50 shadow-2xl transform rotate-2 hover:rotate-0 transition-all duration-500">
                  <img
                    src={FotoGuru}
                    alt="Guru MI Al-Faizein"
                    className="rounded-xl w-full max-w-lg object-cover shadow-inner"
                  />
                  {/* LABEL TERAKREDITASI (REVISI: Tanpa 'A') */}
                  <div className="absolute -bottom-5 -left-4 bg-yellow-400 text-black px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 border-2 border-white">
                    <span className="material-symbols-outlined text-black">verified</span>
                    TERAKREDITASI
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Background decoration */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10 pointer-events-none">
            <span className="material-symbols-outlined absolute -top-10 -right-10 text-[300px] text-yellow-300">school</span>
          </div>
        </section>

        {/* === ALUR PENDAFTARAN (REVISI: KEMBALI KE DESAIN ASLI) === */}
        <section id="alur" className="py-16 lg:py-20 bg-background-light dark:bg-background-dark">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark-primary">Alur Pendaftaran</h2>
              <div className="h-1 w-20 bg-yellow-400 mx-auto rounded-full mt-2"></div>
              <p className="mt-3 text-sm text-gray-600 dark:text-text-dark-secondary">Proses pendaftaran yang mudah dan terstruktur</p>
            </div>

            {/* KODE INI DIKEMBALIKAN KE VERSI ASLI (Sesuai File Upload Anda) */}
            <div className="mt-12 flex flex-col md:flex-row items-center justify-center gap-6 md:gap-4 lg:gap-6">

              {/* Step 1 */}
              <div className="flex flex-col items-center text-center w-full sm:w-48 md:w-36">
                <div className="bg-white dark:bg-surface-dark p-4 rounded-lg shadow-sm w-full border border-gray-100 dark:border-gray-800 hover:border-primary transition-colors">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <span className="material-symbols-outlined">description</span>
                  </div>
                  <p className="mt-3 text-xs font-bold text-primary">1</p>
                  <h3 className="mt-1 font-bold text-sm text-text-light dark:text-text-dark-primary">Daftar</h3>
                  <p className="mt-1 text-xs text-gray-600 dark:text-text-dark-secondary">Isi formulir online</p>
                </div>
              </div>

              {/* Arrow */}
              <div className="hidden md:block"><span className="material-symbols-outlined text-gray-300 dark:text-gray-600">arrow_forward</span></div>
              <div className="md:hidden"><span className="material-symbols-outlined text-gray-300 dark:text-gray-600">arrow_downward</span></div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center w-full sm:w-48 md:w-36">
                <div className="bg-white dark:bg-surface-dark p-4 rounded-lg shadow-sm w-full border border-gray-100 dark:border-gray-800 hover:border-primary transition-colors">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <span className="material-symbols-outlined">payments</span>
                  </div>
                  <p className="mt-3 text-xs font-bold text-primary">2</p>
                  <h3 className="mt-1 font-bold text-sm text-text-light dark:text-text-dark-primary">Bayar</h3>
                  <p className="mt-1 text-xs text-gray-600 dark:text-text-dark-secondary">Transfer biaya</p>
                </div>
              </div>

              <div className="hidden md:block"><span className="material-symbols-outlined text-gray-300 dark:text-gray-600">arrow_forward</span></div>
              <div className="md:hidden"><span className="material-symbols-outlined text-gray-300 dark:text-gray-600">arrow_downward</span></div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center w-full sm:w-48 md:w-36">
                <div className="bg-white dark:bg-surface-dark p-4 rounded-lg shadow-sm w-full border border-gray-100 dark:border-gray-800 hover:border-primary transition-colors">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <span className="material-symbols-outlined">verified</span>
                  </div>
                  <p className="mt-3 text-xs font-bold text-primary">3</p>
                  <h3 className="mt-1 font-bold text-sm text-text-light dark:text-text-dark-primary">Verifikasi</h3>
                  <p className="mt-1 text-xs text-gray-600 dark:text-text-dark-secondary">Upload bukti</p>
                </div>
              </div>

              <div className="hidden md:block"><span className="material-symbols-outlined text-gray-300 dark:text-gray-600">arrow_forward</span></div>
              <div className="md:hidden"><span className="material-symbols-outlined text-gray-300 dark:text-gray-600">arrow_downward</span></div>

              {/* Step 4 */}
              <div className="flex flex-col items-center text-center w-full sm:w-48 md:w-36">
                <div className="bg-white dark:bg-surface-dark p-4 rounded-lg shadow-sm w-full border border-gray-100 dark:border-gray-800 hover:border-primary transition-colors">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <span className="material-symbols-outlined">checklist</span>
                  </div>
                  <p className="mt-3 text-xs font-bold text-primary">4</p>
                  <h3 className="mt-1 font-bold text-sm text-text-light dark:text-text-dark-primary">Cek Status</h3>
                  <p className="mt-1 text-xs text-gray-600 dark:text-text-dark-secondary">Pantau status</p>
                </div>
              </div>

              <div className="hidden md:block"><span className="material-symbols-outlined text-gray-300 dark:text-gray-600">arrow_forward</span></div>
              <div className="md:hidden"><span className="material-symbols-outlined text-gray-300 dark:text-gray-600">arrow_downward</span></div>

              {/* Step 5 */}
              <div className="flex flex-col items-center text-center w-full sm:w-48 md:w-36">
                <div className="bg-white dark:bg-surface-dark p-4 rounded-lg shadow-sm w-full border border-gray-100 dark:border-gray-800 hover:border-primary transition-colors">
                  <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center mx-auto shadow-md">
                    <span className="material-symbols-outlined">workspace_premium</span>
                  </div>
                  <p className="mt-3 text-xs font-bold text-primary">5</p>
                  <h3 className="mt-1 font-bold text-sm text-text-light dark:text-text-dark-primary">Lulus</h3>
                  <p className="mt-1 text-xs text-gray-600 dark:text-text-dark-secondary">Pengumuman</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* === VISI & MISI (HIJAU & KUNING) === */}
        <section className="py-16 bg-white dark:bg-surface-dark">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-3xl mx-auto mb-12">
              <h2 className="text-3xl font-bold text-primary mb-4">Visi & Misi</h2>
              <div className="h-1 w-20 bg-yellow-400 mx-auto rounded-full"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              {/* VISI - Background Hijau Muda */}
              <div className="bg-green-50 dark:bg-green-900/20 p-8 rounded-2xl border-l-8 border-primary shadow-sm">
                <h3 className="text-2xl font-bold text-primary dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-yellow-500 text-3xl">visibility</span> Visi
                </h3>
                <p className="text-lg text-gray-800 dark:text-gray-200 italic font-medium leading-relaxed">
                  "Terwujudnya Peserta didik yang taat kepada Allah, Berakhlak mulia dan Berprestasi"
                </p>
              </div>

              {/* MISI - Background Kuning Muda */}
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-8 rounded-2xl border-l-8 border-yellow-400 shadow-sm">
                <h3 className="text-2xl font-bold text-primary dark:text-white mb-4 flex items-center gap-2">
                  <span className="material-symbols-outlined text-yellow-500 text-3xl">target</span> Misi
                </h3>
                <ul className="space-y-3 text-gray-800 dark:text-gray-200">
                  {[
                    "Taat kepada Allah dengan melaksanakan sholat wajib, dhuha serta membaca Al-qur'an setiap hari.",
                    "Membaca do'a sesudah dan sebelum belajar.",
                    "Memiliki akhlak mulia dengan berbicara sopan, santun kepada orang tua, guru dan teman.",
                    "Membiasakan mengucapkan salam, senyum dan sapa ketika berjumpa.",
                    "Berprestasi dalam melaksanakan pembelajaran yang aktif, efektif dan menyenangkan.",
                    "Sekolah memberikan wadah kepada siswa, guna mengenali potensi sejak dini."
                  ].map((item, idx) => (
                    <li key={idx} className="flex gap-3">
                      <span className="text-primary font-bold bg-green-200 w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0">{idx + 1}</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* === PROGRAM & EKSTRAKURIKULER (HIJAU & KUNING) === */}
        <section className="py-16 bg-background-light dark:bg-background-dark">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="grid md:grid-cols-2 gap-12">

              {/* Program Unggulan */}
              <div>
                <h3 className="text-2xl font-bold text-primary dark:text-white mb-6 flex items-center gap-2 border-b-2 border-yellow-400 pb-2 inline-block">
                  <span className="material-symbols-outlined text-yellow-500">stars</span> Program Unggulan
                </h3>
                <div className="grid gap-4">
                  {['Shalat Duha Berjamaah', 'Mengaji (Setelah Shalat Duha)', "Tahfiz Qur'an"].map((prog, idx) => (
                    <div key={idx} className="flex items-center gap-4 bg-white dark:bg-surface-dark p-4 rounded-xl shadow-sm border border-green-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                      <div className="w-10 h-10 bg-yellow-400 text-black rounded-full flex items-center justify-center">
                        <span className="material-symbols-outlined">check_circle</span>
                      </div>
                      <span className="font-semibold text-gray-800 dark:text-white">{prog}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Ekstrakurikuler */}
              <div>
                <h3 className="text-2xl font-bold text-primary dark:text-white mb-6 flex items-center gap-2 border-b-2 border-yellow-400 pb-2 inline-block">
                  <span className="material-symbols-outlined text-green-600">sports_soccer</span> Ekstrakurikuler
                </h3>
                <div className="bg-white dark:bg-surface-dark p-6 rounded-2xl shadow-sm border-2 border-green-500/20">
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-3 gap-x-4">
                    {['Futsal', 'Pramuka', 'Rohis/Kultum', 'Hadroh', 'Seni Menggambar', 'Seni Mewarnai'].map((ekstra, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                        <span className="w-2.5 h-2.5 bg-yellow-400 rounded-full"></span>
                        {ekstra}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* === SYARAT PENDAFTARAN & KUOTA (MERAH) === */}
        <section className="py-16 lg:py-20 bg-white dark:bg-surface-dark relative">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h2 className="text-2xl md:text-3xl font-bold text-text-light dark:text-text-dark-primary">Syarat Pendaftaran</h2>
              <div className="h-1 w-20 bg-yellow-400 mx-auto rounded-full mt-2"></div>
            </div>

            <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                "Mengisi formulir pendaftaran",
                "Ijazah TK/RA (jika ada)",
                "Kartu Keluarga",
                "Akte Kelahiran",
                "Pas foto"
              ].map((syarat, idx) => (
                <div key={idx} className="flex items-center gap-4 bg-green-50 dark:bg-green-900/20 p-5 rounded-xl border-l-4 border-green-500 shadow-sm hover:translate-x-1 transition-transform">
                  <span className="material-symbols-outlined text-green-600">task_alt</span>
                  <span className="font-medium text-gray-800 dark:text-white">{syarat}</span>
                </div>
              ))}
            </div>

            {/* ALERT KUOTA TERBATAS (MERAH) */}
            <div className="mt-12 text-center">
              <p className="text-sm md:text-base font-bold uppercase tracking-wide text-red-600 mb-6 animate-pulse">
                <span className="material-symbols-outlined align-bottom mr-1">
                  warning
                </span>
                Kuota Terbatas!!
              </p>


              <div className="block">
                <Link to="/daftar" className="inline-block bg-primary hover:bg-green-700 text-white font-bold py-4 px-12 rounded-full shadow-xl transition-all transform hover:scale-105 border-4 border-yellow-400">
                  Ayo Daftar Sekarang!
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    </UserLayout>
  );
}