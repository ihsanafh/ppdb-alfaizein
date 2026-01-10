import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Link } from 'react-router-dom';
import api from '../../services/api';

export default function DataPendaftar() {
  const [pendaftar, setPendaftar] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // State Pagination & Search
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState(""); // Fitur filter status
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [userRole, setUserRole] = useState(""); // State Role

  // Cek Role saat halaman dimuat
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) setUserRole(user.role);
  }, []);

  // Panggil data setiap kali page, searchTerm, atau filterStatus berubah
  useEffect(() => {
    // Debounce search agar tidak memanggil API tiap ketik 1 huruf
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [page, searchTerm, filterStatus]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Kirim parameter page, search, dan status ke Backend
      const response = await api.get(`/admin/pendaftar?page=${page}&limit=10&search=${searchTerm}&status=${filterStatus}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setPendaftar(response.data.data);
        setTotalPages(response.data.pagination.totalPages);
        setTotalData(response.data.pagination.totalData);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Helper Warna Badge
  const getStatusBadge = (status) => {
    if (status === 'Diterima' || status === 'Lulus Administrasi Berkas' || status === 'Pembayaran Terkonfirmasi') 
      return "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300";
    if (status === 'Menunggu Verifikasi') 
      return "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300";
    if (status === 'Perbaikan Berkas' || status === 'Pembayaran Ditolak') 
      return "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300";
    return "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300";
  };

  const getBayarBadge = (status) => {
    if (status === 'Pembayaran Terkonfirmasi' || status === 'Lulus Administrasi Berkas' || status === 'Diterima')
        return <span className="inline-block px-2 py-1 text-xs font-semibold text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-300 rounded-full">Lunas</span>;
    if (status === 'Menunggu Verifikasi')
        return <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 dark:bg-blue-900 dark:text-blue-300 rounded-full">Verifikasi</span>;
    if (status === 'Pembayaran Ditolak')
        return <span className="inline-block px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300 rounded-full">Ditolak</span>;
    
    return <span className="inline-block px-2 py-1 text-xs font-semibold text-red-700 bg-red-100 dark:bg-red-900 dark:text-red-300 rounded-full">Belum Bayar</span>;
  };

  return (
    <AdminLayout title="Data Pendaftar" subtitle="Kelola dan lihat detail calon peserta didik">
      
      <div className="bg-card-light dark:bg-card-dark p-4 lg:p-6 rounded-lg shadow-sm">
        
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:max-w-xs">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark">search</span>
            <input 
              className="w-full pl-10 pr-4 py-2 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark focus:ring-primary focus:border-primary outline-none transition-colors"
              placeholder="Cari NIK / Nama..." 
              type="text" 
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1); // Reset ke halaman 1 jika mencari
              }}
            />
          </div>
          
          <div className="relative w-full sm:w-auto z-20">
            <div className="relative">
                <select 
                    className="w-full sm:w-48 pl-4 pr-10 py-2 border border-border-light dark:border-border-dark rounded-md bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setPage(1); // Reset ke halaman 1 jika filter berubah
                    }}
                >
                    <option value="">Semua Status</option>
                    <option value="Menunggu Pembayaran">Belum Bayar</option>
                    <option value="Menunggu Verifikasi">Verifikasi</option>
                    <option value="Diterima">Diterima</option>
                </select>
                <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-muted-light pointer-events-none">expand_more</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-text-muted-light dark:text-text-muted-dark mb-4">
            Total Data: <strong>{totalData}</strong> siswa
        </p>
        
        <div className="overflow-x-auto w-full mb-4">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="border-b border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark">
              <tr>
                <th className="py-3 px-4 font-medium">NIK</th>
                <th className="py-3 px-4 font-medium">Nama Siswa</th>
                <th className="py-3 px-4 font-medium">HP Ortu</th>
                <th className="py-3 px-4 font-medium">Status Pembayaran</th>
                <th className="py-3 px-4 font-medium">Status Pendaftaran</th>
                <th className="py-3 px-4 font-medium text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-light dark:divide-border-dark text-text-light dark:text-text-dark">
              {loading ? (
                <tr><td colSpan="6" className="py-8 text-center">Memuat data...</td></tr>
              ) : pendaftar.length === 0 ? (
                <tr><td colSpan="6" className="py-8 text-center text-text-muted-light">Tidak ada data ditemukan.</td></tr>
              ) : (
                pendaftar.map((siswa) => (
                  <tr key={siswa.nik} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                    <td className="py-3 px-4">{siswa.nik}</td>
                    <td className="py-3 px-4 font-medium">{siswa.nama_lengkap}</td>
                    <td className="py-3 px-4">{siswa.no_hp_ortu}</td>
                    <td className="py-3 px-4">
                        {getBayarBadge(siswa.status_pendaftaran)}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadge(siswa.status_pendaftaran)}`}>
                        {siswa.status_pendaftaran}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      
                      {/* === LOGIKA TOMBOL UNTUK KEPSEK === */}
                      {userRole === 'kepsek' ? (
                        <button disabled className="px-4 py-1 border border-gray-300 text-gray-400 bg-gray-100 dark:bg-gray-800 dark:border-gray-700 rounded-md text-sm cursor-not-allowed inline-block">
                          Lihat Detail
                        </button>
                      ) : (
                        <Link 
                          to={`/admin/detail-pendaftar/${siswa.nik}`} 
                          className="px-4 py-1 border border-primary text-primary rounded-md text-sm hover:bg-primary hover:text-white transition-colors inline-block"
                        >
                          Lihat Detail
                        </Link>
                      )}

                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* KONTROL PAGINATION */}
        <div className="flex justify-between items-center border-t border-border-light dark:border-border-dark pt-4">
            <button 
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Sebelumnya
            </button>
            <span className="text-sm">Halaman {page} dari {totalPages}</span>
            <button 
                disabled={page === totalPages || totalPages === 0}
                onClick={() => setPage(page + 1)}
                className="px-4 py-2 text-sm border rounded hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                Selanjutnya
            </button>
        </div>

      </div>
    </AdminLayout>
  );
}