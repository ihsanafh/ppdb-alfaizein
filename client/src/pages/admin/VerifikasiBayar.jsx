import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';
import Swal from 'sweetalert2';

const SERVER_URL = 'http://localhost:5000/';

export default function VerifikasiBayar() {
  const [antrian, setAntrian] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBukti, setSelectedBukti] = useState(null);
  const [userRole, setUserRole] = useState(""); // State Role

  const fetchAntrian = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/pembayaran/pending', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setAntrian(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setUserRole(user.role);
    fetchAntrian();
  }, []);

  const handleProses = async (id, nik, aksi) => {
    try {
      const token = localStorage.getItem('token');
      
      const confirm = await Swal.fire({
        title: aksi === 'terima' ? 'Setujui Pembayaran?' : 'Tolak Pembayaran?',
        text: "Status siswa akan diperbarui otomatis.",
        icon: aksi === 'terima' ? 'question' : 'warning',
        showCancelButton: true,
        confirmButtonColor: aksi === 'terima' ? '#34C759' : '#d33',
        confirmButtonText: 'Ya, Lanjutkan'
      });

      if (confirm.isConfirmed) {
        await api.post(`/admin/pembayaran/${id}/verifikasi`, 
          { aksi, nik_siswa: nik },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        Swal.fire('Berhasil', 'Data berhasil diperbarui', 'success');
        setSelectedBukti(null); 
        fetchAntrian(); 
      }

    } catch (error) {
      Swal.fire('Gagal', 'Terjadi kesalahan server', 'error');
    }
  };

  return (
    <AdminLayout title="Verifikasi Pembayaran" subtitle="Konfirmasi bukti transfer pembayaran pendaftaran">
      
      <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm">
        <h3 className="text-lg font-semibold mb-1 text-text-light dark:text-text-dark">Daftar Menunggu Verifikasi</h3>
        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-6">Total {antrian.length} pembayaran menunggu verifikasi</p>
        
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark">
              <tr>
                <th className="p-4 font-medium">NIK</th>
                <th className="p-4 font-medium">Nama Pendaftar</th>
                <th className="p-4 font-medium">Bank / Pengirim</th>
                <th className="p-4 font-medium">Waktu Upload</th>
                <th className="p-4 font-medium">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark text-text-light dark:text-text-dark">
              {loading ? (
                 <tr><td colSpan="5" className="p-4 text-center">Memuat data...</td></tr>
              ) : antrian.length === 0 ? (
                 <tr><td colSpan="5" className="p-4 text-center text-text-muted-light">Tidak ada antrian pembayaran.</td></tr>
              ) : (
                antrian.map((item) => (
                  <tr key={item.id_transaksi} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="p-4">{item.nik_siswa}</td>
                    <td className="p-4 font-medium">{item.nama_lengkap}</td>
                    <td className="p-4">
                      <div className="font-semibold">{item.bank_pengirim}</div>
                      <div className="text-xs text-text-muted-light">{item.nama_pengirim}</div>
                    </td>
                    <td className="p-4 text-text-muted-light dark:text-text-muted-dark">
                      {new Date(item.created_at).toLocaleString('id-ID')}
                    </td>
                    <td className="p-4">
                      
                      {/* === LOGIKA TOMBOL UNTUK KEPSEK === */}
                      {userRole === 'kepsek' ? (
                        <button disabled className="bg-gray-200 text-gray-400 px-4 py-2 rounded-md text-sm font-medium cursor-not-allowed dark:bg-gray-700 dark:text-gray-500">
                            Lihat Bukti
                        </button>
                      ) : (
                        <button 
                            onClick={() => setSelectedBukti(item)}
                            className="bg-primary/10 text-primary px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/20 transition-colors"
                        >
                            Lihat Bukti
                        </button>
                      )}

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL POPUP BUKTI TRANSFER */}
      {selectedBukti && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 transition-opacity animate-fade-in-down">
          <div className="bg-card-light dark:bg-card-dark rounded-lg shadow-xl w-full max-w-lg overflow-hidden">
            
            <div className="p-6 border-b border-border-light dark:border-border-dark flex justify-between items-start">
              <div>
                <h3 className="text-xl font-semibold text-text-light dark:text-text-dark">Bukti Pembayaran</h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{selectedBukti.nama_lengkap} - {selectedBukti.nik_siswa}</p>
              </div>
              <button onClick={() => setSelectedBukti(null)} className="text-text-muted-light hover:text-text-light dark:hover:text-text-dark">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-6">
              <div className="flex justify-between mb-6 text-sm">
                <div>
                  <p className="text-text-muted-light dark:text-text-muted-dark">Bank Pengirim</p>
                  <p className="font-semibold text-text-light dark:text-text-dark">{selectedBukti.bank_pengirim} - {selectedBukti.nama_pengirim}</p>
                </div>
                <div className="text-right">
                  <p className="text-text-muted-light dark:text-text-muted-dark">Waktu Upload</p>
                  <p className="font-semibold text-text-light dark:text-text-dark">{new Date(selectedBukti.created_at).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})}</p>
                </div>
              </div>
              
              <div className="bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden mb-6 border border-border-light dark:border-border-dark flex justify-center">
                <img 
                  alt="Bukti Transfer" 
                  className="w-full h-auto max-h-[400px] object-contain" 
                  src={SERVER_URL + selectedBukti.bukti_transfer} 
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button 
                  onClick={() => handleProses(selectedBukti.id_transaksi, selectedBukti.nik_siswa, 'terima')}
                  className="w-full bg-green-500 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-green-600 transition-colors"
                >
                  <span className="material-symbols-outlined">check_circle</span>
                  Setujui Pembayaran
                </button>
                <button 
                  onClick={() => handleProses(selectedBukti.id_transaksi, selectedBukti.nik_siswa, 'tolak')}
                  className="w-full bg-red-500 text-white py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-semibold hover:bg-red-600 transition-colors"
                >
                  <span className="material-symbols-outlined">cancel</span>
                  Tolak Pembayaran
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </AdminLayout>
  );
}