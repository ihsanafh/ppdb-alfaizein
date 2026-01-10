import React, { useState, useEffect } from 'react';
import UserLayout from '../../layouts/UserLayout';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';

export default function PerbaikanBerkas() {
  const location = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // Ambil data yang dikirim dari DetailStatus
  const { siswa, dokumen } = location.state || {};

  // Jika diakses langsung tanpa data, kembalikan ke Cek Status
  if (!siswa || !dokumen) {
    return <Navigate to="/cek-status" replace />;
  }

  // Filter: Hanya ambil dokumen yang DITOLAK
  const rejectedDocs = dokumen.filter(doc => doc.status_validasi === 'Ditolak');

  // State File Upload
  const [files, setFiles] = useState({});
  const [fileNames, setFileNames] = useState({});

  // Helper Mapping Jenis Dokumen DB -> Field Name Form
  const getFieldName = (jenisDokumen) => {
    if (jenisDokumen.includes('Kartu Keluarga')) return 'file_kk';
    if (jenisDokumen.includes('Akta')) return 'file_akte';
    if (jenisDokumen.includes('Foto')) return 'file_foto';
    if (jenisDokumen.includes('Ijazah')) return 'file_ijazah';
    return 'file_lain';
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire('Terlalu Besar', 'Maksimal 2MB', 'warning');
        return;
      }
      setFiles(prev => ({ ...prev, [fieldName]: file }));
      setFileNames(prev => ({ ...prev, [fieldName]: file.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi: Apakah semua file yang ditolak sudah dipilih ulang?
    const missingFiles = rejectedDocs.some(doc => !files[getFieldName(doc.jenis_dokumen)]);
    if (missingFiles) {
      Swal.fire('Belum Lengkap', 'Mohon unggah semua dokumen yang perlu diperbaiki.', 'warning');
      return;
    }

    setLoading(true);

    try {
      const dataToSend = new FormData();
      dataToSend.append('nik', siswa.nik);
      dataToSend.append('nama_lengkap', siswa.nama_lengkap); // Penting untuk penamaan file
      dataToSend.append('is_revisi', 'true'); // Flag untuk trigger suffix _PERBAIKAN di backend

      // Append file
      Object.keys(files).forEach(key => {
        dataToSend.append(key, files[key]);
      });

      await api.post('/pendaftaran/revisi', dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      Swal.fire({
        icon: 'success',
        title: 'Terkirim!',
        text: 'Berkas perbaikan berhasil dikirim. Admin akan melakukan verifikasi ulang.',
        confirmButtonColor: '#34C759'
      }).then(() => {
        navigate('/cek-status');
      });

    } catch (error) {
      console.error(error);
      Swal.fire('Gagal', 'Terjadi kesalahan saat mengirim berkas.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark-primary mb-3">
              Perbaikan Berkas Pendaftaran
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-text-dark-secondary px-4">
              Halo <strong>{siswa.nama_lengkap}</strong>, mohon unggah ulang dokumen berikut sesuai catatan panitia.
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {rejectedDocs.length === 0 ? (
              <div className="text-center p-8 bg-green-50 rounded-lg text-green-700">
                <p>Tidak ada berkas yang perlu diperbaiki saat ini.</p>
              </div>
            ) : (
              rejectedDocs.map((doc, idx) => {
                const fieldName = getFieldName(doc.jenis_dokumen);
                
                return (
                  <div key={idx} className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-sm p-6 md:p-8 border border-border-light dark:border-border-dark animate-fade-in-down">
                    <h2 className="text-lg sm:text-xl font-bold text-text-light dark:text-text-dark-primary mb-2">
                      Unggah Ulang {doc.jenis_dokumen}
                    </h2>
                    
                    {/* Alasan Penolakan */}
                    <div className="bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 text-red-700 dark:text-red-300 p-4 mb-6 rounded-r-lg">
                      <p className="font-bold text-sm sm:text-base">Alasan Penolakan:</p>
                      <p className="text-sm">{doc.catatan_penolakan || "Tidak ada catatan khusus."}</p>
                    </div>

                    {/* Area Upload */}
                    <div className="grid md:grid-cols-2 gap-6 items-center">
                      <div>
                        <label className="cursor-pointer border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:border-primary transition-colors group">
                          <span className="material-symbols-outlined text-4xl text-gray-400 group-hover:text-primary mb-2 transition-colors">
                            {files[fieldName] ? 'check_circle' : 'upload_file'}
                          </span>
                          <span className={`font-semibold transition-colors ${files[fieldName] ? 'text-green-600' : 'text-gray-600 dark:text-gray-300 group-hover:text-primary'}`}>
                            {fileNames[fieldName] || "Pilih file pengganti"}
                          </span>
                          <span className="text-xs text-gray-500 mt-1">PNG, JPG, PDF (maks 2MB)</span>
                          <input 
                            type="file" 
                            className="sr-only" 
                            accept=".jpg,.jpeg,.png,.pdf"
                            onChange={(e) => handleFileChange(e, fieldName)}
                          />
                        </label>
                      </div>

                      {/* Tombol Kamera (Opsional, untuk HP) */}
                      <div className="flex flex-col gap-2">
                         <button
                            type="button"
                            onClick={() => document.querySelector(`#camera-${fieldName}`).click()}
                            className="w-full bg-primary text-white px-6 py-3 rounded-lg text-base font-semibold transition-all flex items-center justify-center gap-2 hover:bg-green-600"
                          >
                            <span className="material-symbols-outlined">photo_camera</span>
                            Ambil Foto Baru
                          </button>
                          <input 
                            type="file" 
                            id={`camera-${fieldName}`}
                            className="hidden" 
                            accept="image/*"
                            capture="environment"
                            onChange={(e) => handleFileChange(e, fieldName)}
                          />
                      </div>
                    </div>
                  </div>
                );
              })
            )}

            {/* Tombol Submit */}
            {rejectedDocs.length > 0 && (
              <div className="mt-12 text-center pb-8">
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full sm:w-auto bg-primary text-white px-8 py-3 rounded-lg text-lg font-bold hover:bg-primary-hover transition-all shadow-lg shadow-green-500/30 transform hover:-translate-y-0.5 active:translate-y-0 disabled:bg-gray-400"
                >
                  {loading ? 'Mengirim...' : 'Kirim Perbaikan Berkas'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </UserLayout>
  );
}