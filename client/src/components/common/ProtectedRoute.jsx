import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import Swal from 'sweetalert2';

const ProtectedRoute = () => {
  // 1. Cek apakah token ada di LocalStorage
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');

  // 2. Jika Token atau User tidak ada, tendang ke Login
  if (!token || !user) {
    // Opsional: Beri notifikasi kecil bahwa mereka harus login
    // (Bisa dihapus jika ingin redirect diam-diam)
    Swal.fire({
      icon: 'warning',
      title: 'Akses Ditolak',
      text: 'Silakan login terlebih dahulu.',
      timer: 1500,
      showConfirmButton: false
    });

    return <Navigate to="/admin/login" replace />;
  }

  // 3. Jika Ada, izinkan masuk ke rute tujuan (Outlet)
  return <Outlet />;
};

export default ProtectedRoute;