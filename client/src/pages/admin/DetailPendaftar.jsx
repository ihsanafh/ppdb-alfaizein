import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { Link, useParams } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';

const SERVER_URL = 'http://localhost:5000/';

export default function DetailPendaftar() {
  const { nik } = useParams();
  const [loading, setLoading] = useState(true);
  const [siswa, setSiswa] = useState(null);
  const [dokumen, setDokumen] = useState([]);
  const [riwayat, setRiwayat] = useState([]);
  const [pembayaran, setPembayaran] = useState(null);
  
  // State UI
  const [rejectReason, setRejectReason] = useState({});
  const [docStatus, setDocStatus] = useState({});
  const [selectedStatus, setSelectedStatus] = useState(""); 
  const [isEditMode, setIsEditMode] = useState(false); // State untuk mode edit
  const [formData, setFormData] = useState({}); // State untuk data form edit

  const statusOptions = [
    "Menunggu Pembayaran", "Menunggu Verifikasi", "Pembayaran Terkonfirmasi", 
    "Perbaikan Berkas", "Lulus Administrasi Berkas", "Diterima", "Tidak Diterima", "Cadangan"
  ];

  useEffect(() => {
    fetchData();
  }, [nik]);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/admin/pendaftar/${nik}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.success) {
        setSiswa(response.data.data.siswa);
        setDokumen(response.data.data.dokumen);
        setPembayaran(response.data.data.pembayaran);
        setRiwayat(response.data.data.riwayat || []);
        setSelectedStatus(response.data.data.siswa.status_pendaftaran);
        setFormData(response.data.data.siswa); // Set initial form data
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewFile = (path) => {
    window.open(SERVER_URL + path, '_blank');
  };

  const handleVerifyDoc = async (id_dokumen, status) => {
    const alasan = rejectReason[id_dokumen] || '';
    try {
      const token = localStorage.getItem('token');
      await api.put(`/admin/dokumen/${id_dokumen}/verifikasi`, 
        { status, catatan: status === 'Ditolak' ? alasan : null },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setDokumen(prev => prev.map(doc => doc.id_dokumen === id_dokumen ? { ...doc, status_validasi: status, catatan_penolakan: status === 'Ditolak' ? alasan : null } : doc));
      setDocStatus(prev => ({ ...prev, [id_dokumen]: null })); 
      Swal.fire({ icon: 'success', title: 'Berhasil', text: `Dokumen ${status}`, timer: 1000, showConfirmButton: false });
    } catch (error) {
      Swal.fire('Gagal', 'Gagal update dokumen', 'error');
    }
  };

  const handleSaveStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.put(`/admin/pendaftar/${nik}/status`, 
        { status_baru: selectedStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSiswa(prev => ({ ...prev, status_pendaftaran: selectedStatus }));
      fetchData(); // Refresh untuk update riwayat
      Swal.fire('Tersimpan', 'Status pendaftaran berhasil diperbarui dan notifikasi telah dikirim.', 'success');
    } catch (error) {
      Swal.fire('Gagal', 'Gagal menyimpan status.', 'error');
    }
  };

  const handleBayarTunai = async () => {
    try {
      const result = await Swal.fire({
        title: 'Konfirmasi Bayar Tunai',
        text: "Tandai siswa ini sudah membayar lunas?",
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Ya',
        confirmButtonColor: '#34C759'
      });
      if(result.isConfirmed) {
        const token = localStorage.getItem('token');
        await api.post(`/admin/pendaftar/${nik}/bayar-tunai`, {}, { headers: { Authorization: `Bearer ${token}` } });
        fetchData();
        Swal.fire('Berhasil', 'Pembayaran tunai dicatat dan notifikasi telah dikirim.', 'success');
      }
    } catch (error) { 
      Swal.fire('Error', 'Gagal memproses', 'error'); 
    }
  };

  // === FUNGSI EDIT DATA SISWA ===
  const handleEditToggle = () => {
    if (isEditMode) {
      // Jika cancel, reset form data ke data siswa asli
      setFormData(siswa);
    }
    setIsEditMode(!isEditMode);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const token = localStorage.getItem('token');
      
      // PERBAIKAN: Ubah URL dari '/data' menjadi '/update-data' sesuai routes backend
      await api.put(`/admin/pendaftar/${nik}/update-data`, formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setSiswa(formData);
      setIsEditMode(false);
      Swal.fire('Berhasil', 'Data siswa berhasil diperbarui.', 'success');
    } catch (error) {
      console.error("Error updating data:", error); // Tambahkan log di browser console juga
      Swal.fire('Gagal', 'Gagal memperbarui data siswa.', 'error');
    }
  };

  if (loading || !siswa) return <AdminLayout title="Memuat..."><div className="p-8 text-center">Loading...</div></AdminLayout>;

  return (
    <AdminLayout title={`Detail Pendaftar: ${siswa.nama_lengkap}`} subtitle={`NIK: ${siswa.nik}`}>
      
      <Link to="/admin/data-pendaftar" className="inline-flex items-center gap-2 mb-6 text-sm text-text-muted-light dark:text-text-muted-dark hover:text-primary transition-colors">
        <span className="material-symbols-outlined text-sm">arrow_back</span> Kembali
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* === KOLOM KIRI === */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* 1. DATA PENDAFTAR */}
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">Data Pendaftar</h2>
              <button 
                onClick={handleEditToggle}
                className="text-sm px-4 py-1.5 rounded bg-primary text-white hover:bg-green-500 transition-colors"
              >
                {isEditMode ? 'Batal' : 'Edit Data'}
              </button>
            </div>

            {!isEditMode ? (
              // Mode Tampilan (Read-only)
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm text-text-light dark:text-text-dark">
                <div><label className="block text-text-muted-light dark:text-text-muted-dark text-xs mb-1">NIK</label><p className="font-medium">{siswa.nik}</p></div>
                <div><label className="block text-text-muted-light dark:text-text-muted-dark text-xs mb-1">Nama Lengkap</label><p className="font-medium">{siswa.nama_lengkap}</p></div>
                <div><label className="block text-text-muted-light dark:text-text-muted-dark text-xs mb-1">TTL</label><p className="font-medium">{siswa.tempat_lahir}, {new Date(siswa.tanggal_lahir).toLocaleDateString('id-ID')}</p></div>
                <div><label className="block text-text-muted-light dark:text-text-muted-dark text-xs mb-1">Jenis Kelamin</label><p className="font-medium">{siswa.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</p></div>
                <div className="md:col-span-2"><label className="block text-text-muted-light dark:text-text-muted-dark text-xs mb-1">Alamat</label><p className="font-medium">{siswa.alamat}</p></div>
                <div><label className="block text-text-muted-light dark:text-text-muted-dark text-xs mb-1">Asal Sekolah</label><p className="font-medium">{siswa.asal_sekolah}</p></div>
                <div><label className="block text-text-muted-light dark:text-text-muted-dark text-xs mb-1">Nama Ayah</label><p className="font-medium">{siswa.nama_ayah}</p></div>
                <div><label className="block text-text-muted-light dark:text-text-muted-dark text-xs mb-1">Pekerjaan Ayah</label><p className="font-medium">{siswa.pekerjaan_ayah}</p></div>
                <div><label className="block text-text-muted-light dark:text-text-muted-dark text-xs mb-1">Nama Ibu</label><p className="font-medium">{siswa.nama_ibu}</p></div>
                <div><label className="block text-text-muted-light dark:text-text-muted-dark text-xs mb-1">Pekerjaan Ibu</label><p className="font-medium">{siswa.pekerjaan_ibu}</p></div>
                <div><label className="block text-text-muted-light dark:text-text-muted-dark text-xs mb-1">No. HP (WA)</label><p className="font-medium text-green-600 cursor-pointer hover:underline" onClick={() => window.open(`https://wa.me/62${siswa.no_hp_ortu.substring(1)}`)}>{siswa.no_hp_ortu}</p></div>
              </div>
            ) : (
              // Mode Edit
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs text-text-muted-light dark:text-text-muted-dark mb-1">NIK</label>
                    <input type="text" name="nik" value={formData.nik} disabled className="w-full text-sm bg-gray-100 dark:bg-gray-700 border border-border-light dark:border-border-dark rounded px-3 py-2 text-text-light dark:text-text-dark" />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted-light dark:text-text-muted-dark mb-1">Nama Lengkap</label>
                    <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleInputChange} className="w-full text-sm bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded px-3 py-2 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted-light dark:text-text-muted-dark mb-1">Tempat Lahir</label>
                    <input type="text" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleInputChange} className="w-full text-sm bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded px-3 py-2 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted-light dark:text-text-muted-dark mb-1">Tanggal Lahir</label>
                    <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir?.split('T')[0]} onChange={handleInputChange} className="w-full text-sm bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded px-3 py-2 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted-light dark:text-text-muted-dark mb-1">Jenis Kelamin</label>
                    <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleInputChange} className="w-full text-sm bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded px-3 py-2 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary">
                      <option value="L">Laki-laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted-light dark:text-text-muted-dark mb-1">Asal Sekolah</label>
                    <input type="text" name="asal_sekolah" value={formData.asal_sekolah} onChange={handleInputChange} className="w-full text-sm bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded px-3 py-2 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-xs text-text-muted-light dark:text-text-muted-dark mb-1">Alamat</label>
                    <textarea name="alamat" value={formData.alamat} onChange={handleInputChange} rows="2" className="w-full text-sm bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded px-3 py-2 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary"></textarea>
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted-light dark:text-text-muted-dark mb-1">Nama Ayah</label>
                    <input type="text" name="nama_ayah" value={formData.nama_ayah} onChange={handleInputChange} className="w-full text-sm bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded px-3 py-2 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted-light dark:text-text-muted-dark mb-1">Pekerjaan Ayah</label>
                    <input type="text" name="pekerjaan_ayah" value={formData.pekerjaan_ayah} onChange={handleInputChange} className="w-full text-sm bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded px-3 py-2 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted-light dark:text-text-muted-dark mb-1">Nama Ibu</label>
                    <input type="text" name="nama_ibu" value={formData.nama_ibu} onChange={handleInputChange} className="w-full text-sm bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded px-3 py-2 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted-light dark:text-text-muted-dark mb-1">Pekerjaan Ibu</label>
                    <input type="text" name="pekerjaan_ibu" value={formData.pekerjaan_ibu} onChange={handleInputChange} className="w-full text-sm bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded px-3 py-2 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary" />
                  </div>
                  <div>
                    <label className="block text-xs text-text-muted-light dark:text-text-muted-dark mb-1">No. HP Orang Tua</label>
                    <input type="text" name="no_hp_ortu" value={formData.no_hp_ortu} onChange={handleInputChange} className="w-full text-sm bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded px-3 py-2 text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary" />
                  </div>
                </div>
                <div className="flex gap-2 justify-end mt-4">
                  <button onClick={handleEditToggle} className="px-4 py-2 text-sm bg-gray-200 dark:bg-gray-700 text-text-light dark:text-text-dark rounded hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors">
                    Batal
                  </button>
                  <button onClick={handleSaveEdit} className="px-4 py-2 text-sm bg-primary text-white rounded hover:bg-green-500 transition-colors">
                    Simpan Perubahan
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* 2. RIWAYAT STATUS (Timeline) */}
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-semibold mb-6 text-text-light dark:text-text-dark">Riwayat Status</h2>
            <div className="relative pl-6 border-l-2 border-border-light dark:border-border-dark">
                
              {riwayat.map((log, idx) => (
                <div key={idx} className="mb-8 last:mb-0 relative">
                  <div className={`absolute -left-[31px] top-1 w-6 h-6 rounded-full flex items-center justify-center border-4 border-card-light dark:border-card-dark ${idx === 0 ? 'bg-primary text-white' : 'bg-gray-200 dark:bg-gray-600 text-gray-500'}`}>
                    <span className="material-symbols-outlined text-[14px]">
                      {idx === 0 ? 'check' : (log.status_baru.includes('Upload') ? 'cloud_upload' : 'schedule')}
                    </span>
                  </div>
                  <h3 className="text-base font-semibold text-text-light dark:text-text-dark">{log.status_baru}</h3>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                    {new Date(log.waktu_ubah).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                  {log.keterangan && <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-1">{log.keterangan}</p>}
                </div>
              ))}

              {/* Item Awal */}
              <div className="relative">
                <div className="absolute -left-[31px] top-1 w-6 h-6 bg-gray-200 dark:bg-gray-600 text-gray-500 rounded-full flex items-center justify-center border-4 border-card-light dark:border-card-dark">
                  <span className="material-symbols-outlined text-[14px]">edit_document</span>
                </div>
                <h3 className="text-base font-semibold text-text-light dark:text-text-dark">Pendaftaran</h3>
                <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                  {new Date(siswa.created_at).toLocaleString('id-ID', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* === KOLOM KANAN === */}
        <div className="space-y-6">
            
          {/* 1. PEMBAYARAN */}
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm">
            <h3 className="text-md font-semibold mb-2 text-text-light dark:text-text-dark">Pembayaran</h3>
            {pembayaran && pembayaran.status_verifikasi ? (
              <div className="bg-green-100 dark:bg-green-900/30 border-l-4 border-green-500 text-green-700 dark:text-green-300 p-3 text-sm rounded mb-4">
                <p className="font-bold">Lunas / Terverifikasi</p>
                <p>Metode: {pembayaran.metode_pembayaran || pembayaran.bank_pengirim}</p>
              </div>
            ) : (
              <>
                <div className="bg-yellow-100 dark:bg-yellow-900/40 border-l-4 border-yellow-400 text-yellow-700 dark:text-yellow-300 p-3 text-sm rounded mb-4">
                  <p className="font-bold">Menunggu Verifikasi</p>
                  <p>Jika pendaftar membayar secara tunai di sekolah, tandai sebagai sudah lunas.</p>
                </div>
                <button onClick={handleBayarTunai} className="w-full bg-primary text-white py-2 px-4 rounded font-semibold hover:bg-green-500 transition-colors">
                  Tandai Sudah Bayar Tunai
                </button>
              </>
            )}
          </div>

          {/* 2. VERIFIKASI BERKAS */}
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm">
            <h3 className="text-md font-semibold mb-4 text-text-light dark:text-text-dark">Verifikasi Berkas</h3>
            <div className="space-y-4">
              {dokumen.map((doc, idx) => (
                <div key={idx}>
                  <p className="text-sm font-medium mb-1 text-text-light dark:text-text-dark">{doc.jenis_dokumen}</p>
                  <button onClick={() => handleViewFile(doc.path_file)} className="text-primary text-sm font-medium hover:underline mb-2 block">
                    Lihat File
                  </button>
                  
                  <div className="flex items-center gap-2 mt-2">
                    <button 
                      onClick={() => handleVerifyDoc(doc.id_dokumen, 'Disetujui')}
                      className={`flex-1 text-sm py-1.5 px-3 rounded transition-colors ${doc.status_validasi === 'Disetujui' ? 'bg-green-100 text-green-700 border border-green-200' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    >
                      {doc.status_validasi === 'Disetujui' ? '✓ Disetujui' : 'Setujui'}
                    </button>
                    <button 
                      onClick={() => setDocStatus(prev => ({ ...prev, [doc.id_dokumen]: true }))}
                      className={`flex-1 text-sm py-1.5 px-3 rounded transition-colors ${doc.status_validasi === 'Ditolak' ? 'bg-red-100 text-red-700 border border-red-200' : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                    >
                      {doc.status_validasi === 'Ditolak' ? '✕ Ditolak' : 'Tolak'}
                    </button>
                  </div>

                  {/* Input Alasan */}
                  {(docStatus[doc.id_dokumen] || (doc.status_validasi === 'Ditolak' && doc.catatan_penolakan)) && doc.status_validasi !== 'Disetujui' && (
                    <div className="mt-2">
                      {doc.status_validasi !== 'Ditolak' ? (
                        <>
                          <textarea 
                            className="w-full text-sm bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded focus:ring-primary focus:border-primary p-2"
                            placeholder="Catatan penolakan (jika ditolak)..."
                            onChange={(e) => setRejectReason({ ...rejectReason, [doc.id_dokumen]: e.target.value })}
                          ></textarea>
                          <button onClick={() => handleVerifyDoc(doc.id_dokumen, 'Ditolak')} className="mt-1 text-xs bg-danger text-white px-3 py-1 rounded">Kirim</button>
                        </>
                      ) : (
                        <p className="text-xs text-danger mt-1">Alasan: {doc.catatan_penolakan}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 3. SELEKSI FINAL */}
          <div className="bg-card-light dark:bg-card-dark p-6 rounded-lg shadow-sm">
            <h3 className="text-md font-semibold mb-2 text-text-light dark:text-text-dark">Seleksi Final</h3>
            <label className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1">Ubah Status Menjadi</label>
            
            <div className="relative">
              <select 
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark text-sm rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary appearance-none"
              >
                {statusOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-text-muted-light pointer-events-none">expand_more</span>
            </div>

            <button onClick={handleSaveStatus} className="mt-4 w-full bg-primary text-white py-2 px-4 rounded font-semibold hover:bg-green-500 transition-colors">
              Simpan & Kirim Notifikasi
            </button>
            <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-2 text-center">Notifikasi akan dikirim via WhatsApp.</p>
          </div>

        </div>
      </div>
    </AdminLayout>
  );
}