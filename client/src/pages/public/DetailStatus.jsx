import React from 'react';
import UserLayout from '../../layouts/UserLayout';
import { Link, useLocation, useNavigate, Navigate } from 'react-router-dom';

export default function DetailStatus() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Ambil semua data (termasuk riwayat)
  const { siswa, dokumen, riwayat } = location.state || {};

  if (!siswa) {
    return <Navigate to="/cek-status" replace />;
  }

  // Helper Warna Status
  const getStatusColor = (status) => {
    switch (status) {
      case 'Menunggu Pembayaran': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Menunggu Verifikasi': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Pembayaran Terkonfirmasi': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'Lulus Administrasi Berkas': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'Perbaikan Berkas': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'Pembayaran Ditolak': return 'bg-red-100 text-red-700 border-red-200'; // <--- WARNA MERAH
      case 'Diterima': return 'bg-green-100 text-green-700 border-green-200';
      case 'Tidak Diterima': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  // Helper Ikon Timeline
  const getTimelineIcon = (status) => {
    if (status.includes('Diterima')) return 'celebration';
    if (status.includes('Perbaikan')) return 'edit_document';
    if (status.includes('Administrasi')) return 'assignment_turned_in';
    if (status.includes('Terkonfirmasi') || status.includes('Lulus')) return 'check_circle';
    if (status.includes('Verifikasi')) return 'hourglass_top';
    if (status.includes('Ditolak')) return 'cancel'; // <--- IKON SILANG
    if (status.includes('Pembayaran')) return 'payments';
    return 'radio_button_checked';
  };

  return (
    <UserLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        <div className="max-w-6xl mx-auto">
          
          {/* HEADER DATA SISWA */}
          <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 border border-border-light dark:border-border-dark">
            <div>
              <p className="text-sm text-gray-500 dark:text-text-dark-secondary">NIK</p>
              <p className="text-lg font-semibold text-text-light dark:text-text-dark-primary font-mono tracking-wide">
                {siswa.nik}
              </p>
            </div>
            <div className="sm:text-right w-full sm:w-auto">
              <p className="text-sm text-gray-500 dark:text-text-dark-secondary">Nama Calon Siswa</p>
              <p className="text-lg font-semibold text-text-light dark:text-text-dark-primary">
                {siswa.nama_lengkap}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            
            {/* KOLOM KIRI: STATUS UTAMA */}
            <div className="md:col-span-2 space-y-8">
              <div className="bg-surface-light dark:bg-surface-dark p-6 sm:p-8 rounded-xl shadow-sm border border-border-light dark:border-border-dark">
                
                {/* Badge Status Utama */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2">
                  <h2 className="text-xl font-bold text-text-light dark:text-text-dark-primary">Status Pendaftaran</h2>
                  <span className={`text-sm font-bold px-4 py-1.5 rounded-full border w-fit ${getStatusColor(siswa.status_pendaftaran)}`}>
                    {siswa.status_pendaftaran}
                  </span>
                </div>
                
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  
                  {/* === LOGIKA TAMPILAN BERDASARKAN STATUS === */}
                  
                  {/* 1. MENUNGGU PEMBAYARAN */}
                  {siswa.status_pendaftaran === 'Menunggu Pembayaran' && (
                    <div className="animate-fade-in-down">
                      <h3 className="font-bold text-lg text-text-light dark:text-text-dark-primary mb-2">Instruksi Pembayaran</h3>
                      <p className="text-gray-600 dark:text-text-dark-secondary mb-4">Silakan lakukan pembayaran biaya pendaftaran sebesar <span className="font-bold text-black dark:text-white">Rp 250.000</span>.</p>
                      <div className="bg-gray-50 dark:bg-background-dark p-4 rounded-lg mb-6 border border-gray-200 dark:border-gray-700">
                         <p className="text-text-light dark:text-text-dark-primary text-sm leading-relaxed">
                          Bank: <strong>Bank Syariah Indonesia (BSI)</strong><br />
                          No. Rek: <strong className="text-lg">7123456789</strong><br />
                          a.n. Yayasan Al-Faizein
                        </p>
                      </div>
                      <Link 
                        to="/konfirmasi-bayar" 
                        state={{ nik: siswa.nik }} // Pre-fill NIK
                        className="w-full bg-primary hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-lg shadow-green-500/30"
                      >
                        <span className="material-symbols-outlined">payments</span>
                        <span>Konfirmasi Pembayaran</span>
                      </Link>
                    </div>
                  )}

                  {/* 2. MENUNGGU VERIFIKASI / TERKONFIRMASI */}
                  {(siswa.status_pendaftaran === 'Menunggu Verifikasi' || siswa.status_pendaftaran === 'Pembayaran Terkonfirmasi') && (
                    <div className="text-center py-8 animate-fade-in-down">
                      <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${siswa.status_pendaftaran.includes('Terkonfirmasi') ? 'bg-teal-50 text-teal-500' : 'bg-blue-50 text-blue-500'}`}>
                        <span className="material-symbols-outlined text-4xl">
                          {siswa.status_pendaftaran.includes('Terkonfirmasi') ? 'check_circle' : 'hourglass_top'}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                        {siswa.status_pendaftaran.includes('Terkonfirmasi') ? 'Pembayaran Diterima' : 'Sedang Diverifikasi'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mt-2 max-w-md mx-auto">
                        {siswa.status_pendaftaran.includes('Terkonfirmasi') 
                          ? 'Pembayaran Anda telah dikonfirmasi. Data Anda sedang dalam tahap seleksi administrasi akhir.' 
                          : 'Terima kasih. Bukti pembayaran Anda sedang diperiksa oleh panitia. Mohon cek berkala.'}
                      </p>
                    </div>
                  )}

                  {/* 3. PEMBAYARAN DITOLAK (INI YANG BARU) */}
                  {siswa.status_pendaftaran === 'Pembayaran Ditolak' && (
                    <div className="animate-fade-in-down">
                      <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-r-lg">
                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-2xl">error</span>
                          <div>
                            <p className="font-bold">Pembayaran Ditolak</p>
                            <p className="text-sm mt-1">Bukti pembayaran yang Anda kirim tidak valid, buram, atau nominal tidak sesuai. Silakan lakukan pembayaran ulang atau unggah bukti yang lebih jelas.</p>
                          </div>
                        </div>
                      </div>
                      
                      <Link 
                        to="/konfirmasi-bayar" 
                        // TAMBAHKAN isRevisi: true DI SINI
                        state={{ nik: siswa.nik, isRevisi: true }} 
                        className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-lg shadow-red-500/30"
                      >
                        <span className="material-symbols-outlined">upload_file</span>
                        <span>Unggah Ulang Bukti Pembayaran</span>
                      </Link>
                    </div>
                  )}

                  {/* 4. PERBAIKAN BERKAS */}
                  {siswa.status_pendaftaran === 'Perbaikan Berkas' && (
                    <div className="animate-fade-in-down">
                      <div className="bg-orange-50 border-l-4 border-orange-500 text-orange-700 p-4 mb-6 rounded-r-lg">
                        <div className="flex items-start gap-3">
                          <span className="material-symbols-outlined text-2xl">warning</span>
                          <div>
                            <p className="font-bold">Perhatian!</p>
                            <p className="text-sm mt-1">Ada berkas yang ditolak oleh panitia. Silakan perbaiki segera.</p>
                          </div>
                        </div>
                      </div>
                      <button 
                        onClick={() => navigate('/perbaikan-berkas', { state: { siswa, dokumen } })}
                        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all shadow-lg shadow-orange-500/30"
                      >
                        <span className="material-symbols-outlined">edit_document</span>
                        <span>Perbaiki Berkas Sekarang</span>
                      </button>
                    </div>
                  )}

                  {/* 5. LULUS ADMINISTRASI BERKAS */}
                  {siswa.status_pendaftaran === 'Lulus Administrasi Berkas' && (
                    <div className="text-center py-8 animate-fade-in-down">
                      <div className="bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-5xl text-indigo-500">assignment_turned_in</span>
                      </div>
                      <h3 className="text-xl font-bold text-indigo-700 mb-2">Administrasi Lengkap</h3>
                      <p className="text-gray-800 dark:text-white font-medium text-lg">Selamat! Seluruh berkas Anda telah diverifikasi dan valid.</p>
                      <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm max-w-md mx-auto">
                        Anda berhak melanjutkan ke tahap selanjutnya. Jadwal akan diinformasikan kemudian.
                      </p>
                    </div>
                  )}

                  {/* 6. DITERIMA */}
                  {siswa.status_pendaftaran === 'Diterima' && (
                    <div className="text-center py-8 animate-fade-in-down">
                      <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-6xl text-green-500">celebration</span>
                      </div>
                      <h3 className="text-2xl font-bold text-green-600 mb-2">Selamat!</h3>
                      <p className="text-gray-800 dark:text-white font-medium text-lg">Calon siswa dinyatakan DITERIMA</p>
                      <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                        Silakan hubungi sekretariat sekolah untuk informasi daftar ulang.
                      </p>
                    </div>
                  )}

                   {/* 7. TIDAK DITERIMA */}
                   {siswa.status_pendaftaran === 'Tidak Diterima' && (
                    <div className="text-center py-8 animate-fade-in-down">
                      <div className="bg-red-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="material-symbols-outlined text-6xl text-red-500">mood_bad</span>
                      </div>
                      <h3 className="text-2xl font-bold text-red-600 mb-2">Mohon Maaf</h3>
                      <p className="text-gray-800 dark:text-white font-medium text-lg">Calon siswa dinyatakan TIDAK DITERIMA</p>
                    </div>
                  )}

                </div>
              </div>
            </div>

            {/* KOLOM KANAN: TIMELINE RIWAYAT DINAMIS */}
            <div className="md:col-span-1">
              <div className="bg-surface-light dark:bg-surface-dark p-6 rounded-xl shadow-sm border border-border-light dark:border-border-dark sticky top-24">
                <h2 className="text-lg font-bold text-text-light dark:text-text-dark-primary mb-6 flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary">history</span> Riwayat Status
                </h2>
                
                {/* TIMELINE CONTAINER */}
                <div className="relative pl-4 border-l-2 border-gray-200 dark:border-gray-700 ml-2 space-y-0">
                  
                  {/* Mapping Data Riwayat */}
                  {riwayat && riwayat.length > 0 ? (
                    riwayat.map((log, index) => (
                      <div key={index} className="relative pl-6 pb-8 last:pb-0">
                        <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 border-white dark:border-surface-dark ${index === 0 ? 'bg-primary ring-4 ring-primary/20' : 'bg-gray-300 dark:bg-gray-600'}`}></div>
                        
                        <div className={`${index === 0 ? 'opacity-100' : 'opacity-70'}`}>
                          <p className={`text-sm font-bold flex items-center gap-2 ${index === 0 ? 'text-primary' : 'text-gray-700 dark:text-gray-300'}`}>
                            {/* Ikon Kecil di samping status */}
                            <span className="material-symbols-outlined text-sm">{getTimelineIcon(log.status_baru)}</span>
                            {log.status_baru}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 pl-6">
                            {new Date(log.waktu_ubah).toLocaleDateString('id-ID', {
                              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                            })}
                          </p>
                          {log.keterangan && (
                            <div className="pl-6 mt-1">
                                <p className="text-xs text-gray-500 italic bg-gray-50 dark:bg-gray-800 p-2 rounded border border-gray-100 dark:border-gray-700">
                                "{log.keterangan}"
                                </p>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-gray-500 italic pl-6">Belum ada riwayat.</div>
                  )}

                  {/* Item Pendaftaran Awal */}
                  <div className="relative pl-6 pt-8">
                     <div className="absolute -left-[9px] top-8 w-4 h-4 rounded-full border-2 border-white dark:border-surface-dark bg-gray-300 dark:bg-gray-600"></div>
                     <div className="opacity-70">
                        <p className="text-sm font-bold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                            <span className="material-symbols-outlined text-sm">edit_document</span> Pendaftaran Masuk
                        </p>
                        <p className="text-xs text-gray-500 mt-1 pl-6">
                          {new Date(siswa.created_at).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'short', year: 'numeric'
                          })}
                        </p>
                     </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </UserLayout>
  );
}