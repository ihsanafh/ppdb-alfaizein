import React, { useEffect, useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function Dashboard() {
  // State untuk menyimpan data statistik dari API
  const [stats, setStats] = useState({ 
    total: 0, 
    menunggu_bayar: 0, 
    verifikasi: 0, 
    perbaikan: 0, 
    diterima: 0, 
    pendaftar_terbaru: [], 
    verifikasi_pending: [] 
  });

  // Ambil data saat halaman dibuka
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await api.get('/admin/stats', { headers: { Authorization: `Bearer ${token}` } });
        
        if (res.data.success) {
          setStats(res.data.data);
        }
      } catch (err) { 
        console.error("Gagal mengambil statistik:", err); 
      }
    };
    fetchData();
  }, []);

  return (
    <AdminLayout title="Dashboard" subtitle="Sistem Penerimaan Peserta Didik Baru">
      
      {/* === BAGIAN 1: KARTU STATISTIK === */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4 lg:gap-6 mb-8">
        <StatCard label="Total Pendaftar" value={stats.total} icon="groups" color="text-blue-500" bg="bg-blue-100 dark:bg-blue-900" />
        <StatCard label="Menunggu Bayar" value={stats.menunggu_bayar} icon="hourglass_top" color="text-orange-500" bg="bg-orange-100 dark:bg-orange-900" />
        <StatCard label="Verifikasi" value={stats.verifikasi} icon="pending_actions" color="text-orange-500" bg="bg-orange-100 dark:bg-orange-900" />
        <StatCard label="Perbaikan" value={stats.perbaikan} icon="cancel" color="text-red-500" bg="bg-red-100 dark:bg-red-900" />
        <StatCard label="Diterima" value={stats.diterima} icon="check_circle" color="text-green-500" bg="bg-green-100 dark:bg-green-900" />
      </div>

      {/* === BAGIAN 2: TABEL GANDA === */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-8">
        
        {/* Tabel Kiri: Pendaftar Terbaru */}
        <div className="bg-card-light dark:bg-card-dark p-4 lg:p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">Pendaftar Terbaru</h3>
                <Link to="/admin/data-pendaftar" className="text-primary font-medium text-sm hover:underline">Lihat Semua</Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap text-text-light dark:text-text-dark">
                    <thead>
                        <tr className="border-b border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark">
                            <th className="py-2 px-2 font-medium">NIK</th>
                            <th className="py-2 px-2 font-medium">Nama</th>
                            <th className="py-2 px-2 font-medium">Tanggal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.pendaftar_terbaru && stats.pendaftar_terbaru.length > 0 ? (
                            stats.pendaftar_terbaru.map((s, i) => (
                                <tr key={i} className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                    <td className="py-3 px-2">{s.nik}</td>
                                    <td className="py-3 px-2 font-medium">{s.nama_lengkap}</td>
                                    <td className="py-3 px-2 text-text-muted-light dark:text-text-muted-dark">
                                        {new Date(s.created_at).toLocaleDateString('id-ID', {day: 'numeric', month: 'short'})}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="3" className="py-4 text-center text-text-muted-light">Belum ada data pendaftar.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

        {/* Tabel Kanan: Verifikasi Menunggu */}
        <div className="bg-card-light dark:bg-card-dark p-4 lg:p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-text-light dark:text-text-dark">Verifikasi Menunggu</h3>
                <Link to="/admin/verifikasi-bayar" className="text-primary font-medium text-sm hover:underline">Lihat Semua</Link>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm whitespace-nowrap text-text-light dark:text-text-dark">
                    <thead>
                        <tr className="border-b border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark">
                            <th className="py-2 px-2 font-medium">Nama</th>
                            <th className="py-2 px-2 font-medium">Waktu Daftar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {stats.verifikasi_pending && stats.verifikasi_pending.length > 0 ? (
                            stats.verifikasi_pending.map((s, i) => (
                                <tr key={i} className="border-b border-border-light dark:border-border-dark hover:bg-gray-50 dark:hover:bg-gray-700/30">
                                    <td className="py-3 px-2 font-medium">{s.nama_lengkap}</td>
                                    <td className="py-3 px-2 text-text-muted-light dark:text-text-muted-dark">
                                        {new Date(s.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="2" className="py-4 text-center text-text-muted-light">Tidak ada antrian verifikasi.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
      </div>

      {/* === BAGIAN 3: AKSES CEPAT (QUICK ACTIONS) === */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
         <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-blue-100 dark:bg-blue-900 rounded-lg inline-block mb-4">
                <span className="material-symbols-outlined text-blue-500">group</span>
            </div>
            <h3 className="font-semibold text-lg mb-1 text-text-light dark:text-text-dark">Data Pendaftar</h3>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4">Kelola detail pendaftar</p>
            <Link to="/admin/data-pendaftar" className="text-primary font-semibold text-sm flex items-center gap-2 hover:underline">
                Buka <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
         </div>
         
         <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-orange-100 dark:bg-orange-900 rounded-lg inline-block mb-4">
                <span className="material-symbols-outlined text-orange-500">fact_check</span>
            </div>
            <h3 className="font-semibold text-lg mb-1 text-text-light dark:text-text-dark">Verifikasi Bayar</h3>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4">Konfirmasi transfer</p>
            <Link to="/admin/verifikasi-bayar" className="text-primary font-semibold text-sm flex items-center gap-2 hover:underline">
                Buka <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
         </div>
         
         <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <div className="p-3 bg-teal-100 dark:bg-teal-900 rounded-lg inline-block mb-4">
                <span className="material-symbols-outlined text-teal-500">assessment</span>
            </div>
            <h3 className="font-semibold text-lg mb-1 text-text-light dark:text-text-dark">Laporan</h3>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4">Lihat statistik</p>
            {/* Link laporan masih dummy karena belum ada halamannya */}
            <Link to="/admin/laporan" className="text-primary font-semibold text-sm flex items-center gap-2 hover:underline">
                Buka <span className="material-symbols-outlined">arrow_forward</span>
            </Link>
         </div>
      </div>

    </AdminLayout>
  );
}

// Komponen Kecil untuk Kartu Statistik
const StatCard = ({ label, value, icon, color, bg }) => (
    <div className="bg-card-light dark:bg-card-dark p-4 lg:p-6 rounded-lg shadow-sm flex items-start gap-4 border border-gray-100 dark:border-gray-700">
        <div className={`p-3 rounded-lg shrink-0 ${bg}`}>
            <span className={`material-symbols-outlined ${color}`}>{icon}</span>
        </div>
        <div>
            <p className="text-2xl lg:text-3xl font-bold text-text-light dark:text-text-dark">{value}</p>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">{label}</p>
        </div>
    </div>
);