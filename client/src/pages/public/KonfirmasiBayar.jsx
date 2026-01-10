import React, { useState, useEffect } from 'react';
import UserLayout from '../../layouts/UserLayout';
import api from '../../services/api';
import Swal from 'sweetalert2';
import { useNavigate, useLocation } from 'react-router-dom';

export default function KonfirmasiBayar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    nik: '',
    nama_bank: '',
    nama_pengirim: ''
  });
  
  const [fileBukti, setFileBukti] = useState(null);
  const [fileName, setFileName] = useState('Belum ada file dipilih');

  // Isi NIK otomatis jika dari halaman DetailStatus (Revisi/Baru)
  useEffect(() => {
    if (location.state && location.state.nik) {
      setFormData(prev => ({ ...prev, nik: location.state.nik }));
    }
  }, [location]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire('File Terlalu Besar', 'Maksimal 2MB', 'warning');
        return;
      }
      setFileBukti(file);
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!fileBukti) {
      Swal.fire('Bukti Kosong', 'Mohon upload foto bukti transfer.', 'warning');
      return;
    }

    setLoading(true);

    try {
      const dataToSend = new FormData();
      
      // === URUTAN SANGAT PENTING UTK MULTER ===
      // 1. Masukkan Data Teks Terlebih Dahulu
      dataToSend.append('nik', formData.nik);
      dataToSend.append('nama_bank', formData.nama_bank);
      dataToSend.append('nama_pengirim', formData.nama_pengirim);

      // 2. Cek Flag Revisi (Kirim SEBELUM File)
      if (location.state && location.state.isRevisi) {
        dataToSend.append('is_revisi', 'true'); 
      }

      // 3. Baru Masukkan File Terakhir
      dataToSend.append('bukti_transfer', fileBukti);

      await api.post('/pendaftaran/konfirmasi-bayar', dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      Swal.fire({
        icon: 'success',
        title: 'Terkirim!',
        text: 'Bukti pembayaran berhasil dikirim. Admin akan memverifikasi dalam 1x24 jam.',
        confirmButtonColor: '#34C759'
      }).then(() => {
        navigate('/cek-status');
      });

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.response?.data?.message || 'Gagal mengirim konfirmasi.',
        confirmButtonColor: '#d33'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="flex-grow flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-lg mx-auto">
          <div className="bg-surface-light dark:bg-surface-dark p-6 sm:p-8 rounded-xl shadow-lg border border-border-light dark:border-border-dark space-y-8">
            <div className="text-center">
              <h1 className="text-2xl sm:text-3xl font-bold text-text-light dark:text-text-dark-primary">Konfirmasi Pembayaran</h1>
              <p className="mt-2 text-sm text-gray-600 dark:text-text-dark-secondary">Lengkapi formulir di bawah ini untuk mengonfirmasi pembayaran Anda.</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark-primary mb-1">NIK Calon Siswa</label>
                <input 
                  name="nik"
                  value={formData.nik}
                  onChange={handleChange}
                  required
                  type="text" 
                  className="w-full px-4 py-2 bg-white dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md shadow-sm outline-none focus:ring-primary focus:border-primary text-text-light dark:text-text-dark-primary" 
                  placeholder="Masukkan NIK Siswa" 
                  // Jika NIK otomatis terisi, bisa dibuat readonly agar tidak salah edit
                  readOnly={location.state?.nik ? true : false}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark-primary mb-1">Nama Bank Pengirim</label>
                <input 
                  name="nama_bank"
                  value={formData.nama_bank}
                  onChange={handleChange}
                  required
                  type="text" 
                  className="w-full px-4 py-2 bg-white dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md shadow-sm outline-none focus:ring-primary focus:border-primary text-text-light dark:text-text-dark-primary" 
                  placeholder="Contoh: BCA, Mandiri, BRI" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark-primary mb-1">Nama Pemilik Rekening</label>
                <input 
                  name="nama_pengirim"
                  value={formData.nama_pengirim}
                  onChange={handleChange}
                  required
                  type="text" 
                  className="w-full px-4 py-2 bg-white dark:bg-background-dark border border-border-light dark:border-border-dark rounded-md shadow-sm outline-none focus:ring-primary focus:border-primary text-text-light dark:text-text-dark-primary" 
                  placeholder="Atas Nama Siapa?" 
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text-light dark:text-text-dark-primary mb-2">Bukti Transfer</label>
                
                <p className={`text-xs mb-2 ${fileBukti ? 'text-green-600 font-bold' : 'text-gray-500'}`}>
                   Status: {fileName}
                </p>

                <div className="flex flex-col sm:flex-row gap-3">
                   <input 
                      type="file" 
                      id="file-bukti" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileChange} 
                   />
                   <input 
                      type="file" 
                      id="camera-bukti" 
                      accept="image/*" 
                      capture="environment" 
                      className="hidden" 
                      onChange={handleFileChange} 
                   />

                  <button type="button" onClick={() => document.getElementById('camera-bukti').click()} className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-green-600 transition-colors">
                    <span className="material-symbols-outlined mr-2 text-lg">photo_camera</span>
                    Foto Struk
                  </button>
                  <button type="button" onClick={() => document.getElementById('file-bukti').click()} className="w-full flex items-center justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-text-light dark:text-text-dark-primary bg-white dark:bg-surface-dark hover:bg-gray-50 transition-colors">
                    <span className="material-symbols-outlined mr-2 text-lg">upload_file</span>
                    Upload File
                  </button>
                </div>
              </div>
              
              <div>
                <button disabled={loading} type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-primary hover:bg-primary-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors disabled:bg-gray-400">
                  {loading ? 'Mengirim...' : 'Kirim Konfirmasi'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </UserLayout>
  );
}