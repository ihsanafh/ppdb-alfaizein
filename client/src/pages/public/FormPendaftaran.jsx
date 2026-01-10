import React, { useState } from 'react';
import UserLayout from '../../layouts/UserLayout';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';

// Komponen Kecil untuk Bintang Merah
const RequiredMark = () => <span className="text-red-500 ml-1">*</span>;

export default function FormPendaftaran() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  // State Data Teks
  const [formData, setFormData] = useState({
    nik: '', nama_lengkap: '', tempat_lahir: '', tanggal_lahir: '',
    jenis_kelamin: 'L', alamat: '', asal_sekolah: '', // Asal sekolah opsional
    nama_ayah: '', pekerjaan_ayah: '',
    nama_ibu: '', pekerjaan_ibu: '',
    no_hp_ortu: ''
  });

  // State File
  const [files, setFiles] = useState({
    file_kk: null, file_akte: null, file_foto: null, file_ijazah: null
  });

  // State Preview Nama File
  const [fileNames, setFileNames] = useState({
    file_kk: 'Belum ada file dipilih',
    file_akte: 'Belum ada file dipilih',
    file_foto: 'Belum ada file dipilih',
    file_ijazah: 'Belum ada file dipilih'
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire('File Terlalu Besar', 'Maksimal ukuran file adalah 2MB', 'warning');
        return;
      }
      setFiles(prev => ({ ...prev, [fieldName]: file }));
      setFileNames(prev => ({ ...prev, [fieldName]: file.name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const dataToSend = new FormData();
      Object.keys(formData).forEach(key => dataToSend.append(key, formData[key]));
      Object.keys(files).forEach(key => {
        if (files[key]) dataToSend.append(key, files[key]);
      });

      await api.post('/pendaftaran/daftar', dataToSend, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      Swal.fire({
        icon: 'success',
        title: 'Alhamdulillah!',
        text: 'Pendaftaran berhasil dikirim. Silakan cek status berkala.',
        confirmButtonColor: '#34C759'
      }).then(() => {
        navigate('/sukses');
      });

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mendaftar',
        text: error.response?.data?.message || 'Terjadi kesalahan sistem',
        confirmButtonColor: '#d33'
      });
    } finally {
      setLoading(false);
    }
  };

  // Konfigurasi Dokumen (Ijazah tidak wajib)
  const documents = [
    { label: 'Kartu Keluarga (KK)', name: 'file_kk', required: true },
    { label: 'Akte Kelahiran', name: 'file_akte', required: true },
    { label: 'Pas Foto (Formal)', name: 'file_foto', required: true },
    { label: 'Ijazah TK/RA (Jika Ada)', name: 'file_ijazah', required: false } // Tidak wajib
  ];

  return (
    <UserLayout>
      <main className="flex-grow py-8 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark-primary">
              Formulir Pendaftaran
            </h1>
            <p className="text-sm text-gray-500 mt-2">Kolom bertanda <span className="text-red-500">*</span> wajib diisi.</p>
          </div>
          
          <div className="max-w-4xl mx-auto bg-surface-light dark:bg-surface-dark p-5 sm:p-8 rounded-xl shadow-lg border border-border-light dark:border-border-dark">
            <form onSubmit={handleSubmit} className="space-y-8 sm:space-y-10">
              
              {/* === FIELDSET 1: DATA CALON SISWA === */}
              <fieldset>
                <legend className="text-lg sm:text-xl font-semibold border-b border-border-light dark:border-border-dark pb-3 mb-6 w-full text-text-light dark:text-text-dark-primary">
                  Data Calon Siswa
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">NIK <RequiredMark /></label>
                    <input name="nik" onChange={handleChange} required className="w-full border rounded-md p-2 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary" type="text" placeholder="16 digit NIK" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama Lengkap <RequiredMark /></label>
                    <input name="nama_lengkap" onChange={handleChange} required className="w-full border rounded-md p-2 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary" type="text" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tempat Lahir <RequiredMark /></label>
                    <input name="tempat_lahir" onChange={handleChange} required className="w-full border rounded-md p-2 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary" type="text" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Tanggal Lahir <RequiredMark /></label>
                    <input name="tanggal_lahir" onChange={handleChange} required className="w-full border rounded-md p-2 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary" type="date" />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-2">Jenis Kelamin <RequiredMark /></label>
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center">
                        <input onChange={handleChange} className="h-4 w-4 text-primary" id="laki-laki" name="jenis_kelamin" type="radio" value="L" defaultChecked />
                        <label className="ml-2 text-sm" htmlFor="laki-laki">Laki-laki</label>
                      </div>
                      <div className="flex items-center">
                        <input onChange={handleChange} className="h-4 w-4 text-primary" id="perempuan" name="jenis_kelamin" type="radio" value="P" />
                        <label className="ml-2 text-sm" htmlFor="perempuan">Perempuan</label>
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Alamat <RequiredMark /></label>
                    <textarea name="alamat" onChange={handleChange} required className="w-full border rounded-md p-2 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary" rows="3"></textarea>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Asal Sekolah</label>
                    {/* TIDAK ADA REQUIRED DI SINI */}
                    <input name="asal_sekolah" onChange={handleChange} className="w-full border rounded-md p-2 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary" type="text" placeholder="(Opsional)" />
                  </div>
                </div>
              </fieldset>

              {/* === FIELDSET 2: DATA ORANG TUA === */}
              <fieldset>
                <legend className="text-lg sm:text-xl font-semibold border-b border-border-light dark:border-border-dark pb-3 mb-6 w-full text-text-light dark:text-text-dark-primary">
                  Data Orang Tua/Wali
                </legend>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama Ayah <RequiredMark /></label>
                    <input name="nama_ayah" onChange={handleChange} required className="w-full border rounded-md p-2 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary" type="text" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pekerjaan Ayah <RequiredMark /></label>
                    <input name="pekerjaan_ayah" onChange={handleChange} required className="w-full border rounded-md p-2 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary" type="text" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Nama Ibu <RequiredMark /></label>
                    <input name="nama_ibu" onChange={handleChange} required className="w-full border rounded-md p-2 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary" type="text" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Pekerjaan Ibu <RequiredMark /></label>
                    <input name="pekerjaan_ibu" onChange={handleChange} required className="w-full border rounded-md p-2 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary" type="text" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Nomor HP (WhatsApp) <RequiredMark /></label>
                    <input name="no_hp_ortu" onChange={handleChange} required className="w-full border rounded-md p-2 bg-gray-50 dark:bg-gray-800 outline-none focus:ring-2 focus:ring-primary" type="number" placeholder="Contoh: 08123456789" />
                  </div>
                </div>
              </fieldset>

              {/* === FIELDSET 3: UNGGAH BERKAS === */}
              <fieldset>
                <legend className="text-lg sm:text-xl font-semibold border-b border-border-light dark:border-border-dark pb-3 mb-6 w-full text-text-light dark:text-text-dark-primary">
                  Unggah Berkas
                </legend>
                <div className="space-y-6">
                  {documents.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg border border-gray-200 dark:border-gray-700">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="flex-1">
                          <p className="font-semibold text-text-light dark:text-text-dark-primary">
                            {item.label} {item.required && <RequiredMark />}
                          </p>
                          <div className="flex items-center gap-2 mt-1">
                              <span className={`material-symbols-outlined text-sm ${files[item.name] ? 'text-green-500' : 'text-gray-400'}`}>
                                {files[item.name] ? 'check_circle' : 'pending'}
                              </span>
                              <p className={`text-sm ${files[item.name] ? 'text-green-600 font-medium' : 'text-gray-500 italic'}`}>
                                {fileNames[item.name]}
                              </p>
                          </div>
                        </div>

                        <div className="flex gap-2 w-full sm:w-auto">
                          <input type="file" id={`file-${item.name}`} accept=".jpg,.jpeg,.png,.pdf" className="hidden" onChange={(e) => handleFileChange(e, item.name)} />
                          <input type="file" id={`camera-${item.name}`} accept="image/*" capture="environment" className="hidden" onChange={(e) => handleFileChange(e, item.name)} />

                          <button type="button" onClick={() => document.getElementById(`file-${item.name}`).click()} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-white dark:bg-surface-dark border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium shadow-sm">
                            <span className="material-symbols-outlined text-lg">folder_open</span> File
                          </button>
                          <button type="button" onClick={() => document.getElementById(`camera-${item.name}`).click()} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium shadow-sm">
                            <span className="material-symbols-outlined text-lg">photo_camera</span> Foto
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </fieldset>

              <div className="pt-4">
                <button disabled={loading} className="w-full bg-primary text-white py-4 px-6 rounded-lg text-lg font-bold hover:bg-opacity-90 transition-all shadow-lg hover:shadow-green-500/20 flex justify-center items-center gap-2 disabled:bg-gray-400" type="submit">
                  {loading ? 'Sedang Mengirim...' : 'Selesaikan Pendaftaran'}
                  {!loading && <span className="material-symbols-outlined">send</span>}
                </button>
              </div>

            </form>
          </div>
        </div>
      </main>
    </UserLayout>
  );
}