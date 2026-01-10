import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function AdminLayout({ children, title, subtitle }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Default state agar tidak error jika data belum dimuat
  const [currentUser, setCurrentUser] = useState({ nama: 'Pengguna', role: 'guest', pegid: '-' });
  
  const location = useLocation();
  const navigate = useNavigate();

  // === 1. AMBIL DATA USER DARI PENYIMPANAN BROWSER ===
  useEffect(() => {
    const userStored = localStorage.getItem('user');
    if (userStored) {
      setCurrentUser(JSON.parse(userStored));
    }
  }, []);

  // === 2. FUNGSI LOGOUT ===
  const handleLogout = () => {
    Swal.fire({
      title: 'Keluar?',
      text: "Anda harus login kembali untuk mengakses halaman ini.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Keluar'
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/admin/login');
      }
    });
  };

  // Helper untuk menandai menu yang sedang aktif
  const isActive = (path) => location.pathname === path 
    ? 'bg-primary text-white font-semibold shadow-md' 
    : 'hover:bg-green-200 dark:hover:bg-gray-700 text-text-muted-light dark:text-text-muted-dark';

  return (
    <div className="flex h-screen overflow-hidden font-display bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
      
      {/* Overlay untuk Mobile */}
      <div 
        onClick={() => setSidebarOpen(false)} 
        className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      ></div>

      {/* === SIDEBAR === */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-mint-green-light dark:bg-mint-green-dark flex flex-col justify-between transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none lg:static lg:translate-x-0 no-print ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div>
          {/* Logo Mobile */}
          <div className="lg:hidden bg-primary p-4 flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-white">school</span> 
              <h1 className="font-bold text-lg text-white">MI AL-FAIZEIN</h1>
            </div>
            <button onClick={() => setSidebarOpen(false)} className="text-white hover:bg-white/20 rounded p-1">
              <span className="material-symbols-outlined text-[28px]">close</span>
            </button>
          </div>

          {/* Logo Desktop */}
          <div className="hidden lg:flex items-center gap-3 mb-10 p-6">
            <div className="bg-primary p-2 rounded-lg">
              <span className="material-symbols-outlined text-white">school</span>
            </div>
            <h1 className="font-bold text-lg text-text-light dark:text-text-dark">MI AL-FAIZEIN</h1>
          </div>

          {/* Menu Navigasi */}
          <nav className="space-y-2 px-6">
            <Link to="/admin/dashboard" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive('/admin/dashboard')}`}>
              <span className="material-symbols-outlined">dashboard</span>
              Dasbor
            </Link>
            <Link to="/admin/data-pendaftar" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive('/admin/data-pendaftar')}`}>
              <span className="material-symbols-outlined">group</span>
              Data Pendaftar
            </Link>
            <Link to="/admin/verifikasi-bayar" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive('/admin/verifikasi-bayar')}`}>
              <span className="material-symbols-outlined">payment</span>
              Verifikasi Pembayaran
            </Link>
            <Link to="/admin/riwayat-notifikasi" className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-colors ${isActive('/admin/riwayat-notifikasi')}`}>
              <span className="material-symbols-outlined">history</span>
              Riwayat Pesan
            </Link>
          </nav>
        </div>
        
        {/* Tombol Logout */}
        <div className="p-6">
          <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 w-full rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 text-danger font-semibold transition-colors">
            <span className="material-symbols-outlined">logout</span>
            Keluar
          </button>
        </div>
      </aside>

      {/* === KONTEN UTAMA === */}
      <div className="flex-1 flex flex-col h-full w-full relative">
        
        {/* Header */}
        <header className="bg-primary text-white p-4 lg:p-6 flex justify-between items-center shadow-md z-30 no-print">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden p-1 hover:bg-white/20 rounded-md focus:outline-none">
              <span className="material-symbols-outlined text-[28px]">menu</span>
            </button>
            <div>
              <h2 className="text-xl lg:text-2xl font-bold truncate max-w-[200px] sm:max-w-md">{title}</h2>
              {subtitle && <p className="text-xs lg:text-sm opacity-80 hidden sm:block">{subtitle}</p>}
            </div>
          </div>

          {/* BAGIAN PROFIL KANAN ATAS (DINAMIS) */}
          <div className="flex items-center gap-3 lg:gap-4">
            <div className="text-right hidden sm:block">
              {/* Menampilkan Nama User yang Login */}
              <p className="font-semibold text-sm">{currentUser.nama}</p>
              
              {/* Menampilkan Jabatan berdasarkan Role */}
              <p className="text-xs opacity-80 uppercase">
                {currentUser.role === 'kepsek' ? 'Kepala Madrasah' : 'Panitia Admin'}
              </p>
            </div>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white/20 rounded-full flex items-center justify-center border border-white/30">
              <span className="material-symbols-outlined text-white text-2xl lg:text-3xl">account_circle</span>
            </div>
          </div>
        </header>

        {/* Area Isi Halaman */}
        <main className="flex-1 p-4 lg:p-8 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}