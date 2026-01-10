import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  // Kelas untuk menu aktif/tidak aktif
  const getMenuClass = (path) => isActive(path) 
    ? "flex items-center gap-3 px-4 py-2 rounded-lg bg-primary text-white font-semibold"
    : "flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-green-200 dark:hover:bg-gray-700 text-text-muted-light dark:text-text-muted-dark";

  return (
    <>
      {/* Overlay Mobile */}
      <div onClick={toggleSidebar} className={`fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}></div>

      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-mint-green-light dark:bg-mint-green-dark flex flex-col justify-between transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0 lg:static'}`}>
        
        <div>
          {/* Logo Mobile */}
          <div className="lg:hidden bg-primary p-4 flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-white">close</span> 
              <h1 className="font-bold text-lg text-white">MI AL-FAIZEIN</h1>
            </div>
            <button onClick={toggleSidebar} className="text-white hover:bg-white/20 rounded p-1">
              <span className="material-symbols-outlined text-2xl">close</span>
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
            <Link to="/admin/dashboard" className={getMenuClass('/admin/dashboard')}>
              <span className="material-symbols-outlined">dashboard</span>
              Dasbor
            </Link>
            <Link to="/admin/data-pendaftar" className={getMenuClass('/admin/data-pendaftar')}>
              <span className="material-symbols-outlined">group</span>
              Data Pendaftar
            </Link>
            <Link to="/admin/verifikasi-bayar" className={getMenuClass('/admin/verifikasi-bayar')}>
              <span className="material-symbols-outlined">payment</span>
              Verifikasi Pembayaran
            </Link>
          </nav>
        </div>

        {/* Tombol Keluar */}
        <div className="p-6">
          <Link to="/admin/login" className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 text-danger font-semibold">
            <span className="material-symbols-outlined">logout</span>
            Keluar
          </Link>
        </div>
      </aside>
    </>
  );
}