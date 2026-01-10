import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import Pages (Admin)
import LoginAdmin from './pages/admin/LoginAdmin';
import Dashboard from './pages/admin/Dashboard';
import DataPendaftar from './pages/admin/DataPendaftar';
import VerifikasiBayar from './pages/admin/VerifikasiBayar';
import DetailPendaftar from './pages/admin/DetailPendaftar'; // Pastikan sudah di-import
import RiwayatNotifikasi from './pages/admin/RiwayatNotifikasi';
import Laporan from './pages/admin/Laporan';

// Import Pages (Public)
import LandingPage from './pages/public/LandingPage';
import FormPendaftaran from './pages/public/FormPendaftaran';
import PendaftaranSukses from './pages/public/PendaftaranSukses';
import CekStatus from './pages/public/CekStatus';
import DetailStatus from './pages/public/DetailStatus';
import KonfirmasiBayar from './pages/public/KonfirmasiBayar';
import PerbaikanBerkas from './pages/public/PerbaikanBerkas';
import Galeri from './pages/public/Galeri';

// --- Import Components ---
import ProtectedRoute from './components/common/ProtectedRoute';


function App() {
  return (
    <Router>
      <Routes>
        {/* === ROUTE PUBLIK === */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/daftar" element={<FormPendaftaran />} />
        <Route path="/sukses" element={<PendaftaranSukses />} />
        <Route path="/cek-status" element={<CekStatus />} />
        <Route path="/detail-status" element={<DetailStatus />} />
        <Route path="/konfirmasi-bayar" element={<KonfirmasiBayar />} />
        <Route path="/perbaikan-berkas" element={<PerbaikanBerkas />} />
        <Route path="/admin/laporan" element={<Laporan />} />
        <Route path="/galeri" element={<Galeri />} />

        {/* === ROUTE ADMIN === */}
        <Route path="/admin/login" element={<LoginAdmin />} />
        {/* === RUTE ADMIN (DIPROTEKSI) === */}
        {/* Semua rute di dalam sini hanya bisa diakses jika punya Token */}
        <Route element={<ProtectedRoute />}>
            <Route path="/admin/dashboard" element={<Dashboard />} />
            <Route path="/admin/data-pendaftar" element={<DataPendaftar />} />
            <Route path="/admin/detail-pendaftar/:nik" element={<DetailPendaftar />} />
            <Route path="/admin/verifikasi-bayar" element={<VerifikasiBayar />} />
            <Route path="/admin/laporan" element={<Laporan />} />
            <Route path="/admin/riwayat-notifikasi" element={<RiwayatNotifikasi />} />
        </Route>
        
        {/* Fallback untuk 404 */}
        <Route path="*" element={
          <div className="flex items-center justify-center h-screen">
            <h1 className="text-2xl font-bold">404 Not Found</h1>
          </div>
        } />
      </Routes>
    </Router>
  );
}

export default App;