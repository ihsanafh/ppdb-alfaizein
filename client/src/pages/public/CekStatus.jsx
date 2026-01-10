import React, { useState } from 'react';
import UserLayout from '../../layouts/UserLayout';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';

export default function CekStatus() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [nik, setNik] = useState('');
  const [namaSapaan, setNamaSapaan] = useState('');
  const [tahunLahir, setTahunLahir] = useState('');

  const handleCheckNik = async () => {
    if (!nik || nik.length < 16) {
      Swal.fire('Periksa NIK', 'Mohon masukkan 16 digit NIK dengan benar.', 'warning');
      return;
    }

    setLoading(true);

    try {
      const response = await api.post('/pendaftaran/check-nik', { nik });
      setNamaSapaan(response.data.nama);
      setStep(2);

    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'NIK Tidak Ditemukan',
        text: 'NIK ini belum terdaftar di sistem PPDB kami.',
        confirmButtonText: 'Daftar Sekarang',
        showCancelButton: true,
        cancelButtonText: 'Coba Lagi'
      }).then((result) => {
        if (result.isConfirmed) navigate('/daftar');
      });
    } finally {
      setLoading(false);
    }
  };

  // === BAGIAN YANG DISESUAIKAN ===
  const handleVerify = async (e) => {
    e.preventDefault();
    if (!tahunLahir) return;

    setLoading(true);

    try {
      const response = await api.post('/pendaftaran/cek-status', {
        nik: nik,
        tahun_lahir: tahunLahir
      });

      // 1. Ambil data dari Backend (Siswa, Dokumen, DAN RIWAYAT)
      const dataSiswa = response.data.data.siswa;
      const dataDokumen = response.data.data.dokumen;
      const dataRiwayat = response.data.data.riwayat; // <--- PENAMBAHAN DI SINI

      const nama = dataSiswa ? dataSiswa.nama_lengkap : 'Siswa';

      Swal.fire({
        icon: 'success',
        title: 'Verifikasi Berhasil!',
        text: `Mengalihkan ke data ${nama}...`,
        timer: 1000,
        showConfirmButton: false
      }).then(() => {
        // 2. Kirim paket lengkap ke halaman Detail
        navigate('/detail-status', { 
            state: { 
                siswa: dataSiswa, 
                dokumen: dataDokumen,
                riwayat: dataRiwayat // <--- PENAMBAHAN DI SINI
            } 
        });
      });

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.response?.data?.message || 'Tahun lahir tidak cocok.',
        confirmButtonColor: '#d33'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="flex-grow flex items-center justify-center py-16 px-4 relative overflow-hidden min-h-[80vh]">
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-3xl -z-10"></div>

        <div className="w-full max-w-xl mx-auto z-10">
          <div className="bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-xl border border-border-light dark:border-border-dark">
            <div className="text-center mb-8">
              <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="material-symbols-outlined text-primary text-4xl">search</span>
              </div>
              <h1 className="text-2xl font-bold text-text-light dark:text-text-dark-primary">Cek Status Pendaftaran</h1>
              <p className="mt-3 text-gray-600 dark:text-text-dark-secondary">Masukkan NIK calon siswa untuk melacak progres.</p>
            </div>

            <form onSubmit={handleVerify} className="space-y-6">
              {/* Input NIK */}
              <div>
                <label className="block text-sm font-semibold mb-2 text-text-light dark:text-text-dark-primary">NIK</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 material-symbols-outlined">badge</span>
                  <input 
                    type="text" 
                    value={nik}
                    onChange={(e) => setNik(e.target.value)}
                    disabled={step === 2 || loading}
                    className="block w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary outline-none transition-all disabled:opacity-60 text-text-light dark:text-text-dark-primary"
                    placeholder="Contoh: 3171..." 
                    maxLength={16}
                  />
                  {step === 2 && (
                    <button type="button" onClick={() => { setStep(1); setNamaSapaan(''); }} className="absolute inset-y-0 right-0 pr-4 flex items-center text-primary hover:underline text-sm font-medium">
                      Ubah NIK
                    </button>
                  )}
                </div>
              </div>

              {/* Step 2: Input Tahun Lahir */}
              {step === 2 && (
                <div className="animate-fade-in-down space-y-6">
                  <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 flex gap-3">
                    <span className="material-symbols-outlined text-primary">verified_user</span>
                    <div>
                      <h3 className="text-sm font-bold text-primary">Halo, {namaSapaan}!</h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400">Untuk keamanan, konfirmasi <strong>Tahun Lahir</strong> Anda.</p>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-text-light dark:text-text-dark-primary">Tahun Lahir</label>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400 material-symbols-outlined">calendar_month</span>
                      <input 
                        type="number" 
                        value={tahunLahir}
                        onChange={(e) => setTahunLahir(e.target.value)}
                        className="block w-full pl-11 pr-4 py-4 bg-gray-50 dark:bg-background-dark border border-border-light dark:border-border-dark rounded-xl focus:ring-2 focus:ring-primary outline-none text-text-light dark:text-text-dark-primary" 
                        placeholder="Contoh: 2018" 
                        autoFocus
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                {step === 1 ? (
                  <button 
                    type="button" 
                    onClick={handleCheckNik}
                    disabled={loading}
                    className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg transition-all flex justify-center items-center gap-2 disabled:bg-gray-400"
                  >
                    {loading ? 'Sedang Mengecek...' : 'Cek NIK'} 
                    {!loading && <span className="material-symbols-outlined">arrow_forward</span>}
                  </button>
                ) : (
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-primary-hover shadow-lg transition-all flex justify-center items-center gap-2 disabled:bg-gray-400"
                  >
                    {loading ? 'Memverifikasi...' : 'Lihat Detail Status'} 
                    {!loading && <span className="material-symbols-outlined">search</span>}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}