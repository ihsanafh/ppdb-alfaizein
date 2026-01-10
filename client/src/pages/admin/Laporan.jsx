import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';

export default function Laporan() {
  const [pendaftar, setPendaftar] = useState([]);
  const [filterStatus, setFilterStatus] = useState("Semua"); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await api.get('/admin/pendaftar?limit=all', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data.success) {
          setPendaftar(response.data.data);
        }
      } catch (error) { console.error(error); }
    };
    fetchData();
  }, []);

  const filteredData = pendaftar.filter(siswa => 
    filterStatus === "Semua" || siswa.status_pendaftaran === filterStatus
  );

  return (
    <AdminLayout title="Laporan" subtitle="Cetak Data">
      
      <div className="bg-white p-8 rounded-lg">
        
        {/* Kontrol Filter (Akan hilang saat print karena class no-print di layout membungkus header, tapi ini bagian konten jd aman, 
            TAPI sebaiknya tombol ini diberi no-print juga) */}
        <div className="flex justify-between mb-6 no-print">
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="Semua">Semua Status</option>
              <option value="Diterima">Diterima</option>
              <option value="Lulus Administrasi Berkas">Lulus Administrasi</option>
            </select>
            <button onClick={() => window.print()} className="bg-blue-600 text-white px-4 py-2 rounded">
                Cetak PDF
            </button>
        </div>

        {/* KOP SURAT (Hanya muncul di Print/Layar Putih) */}
        <div className="text-center mb-8 border-b-2 border-black pb-4">
            <h1 className="text-2xl font-bold uppercase">Panitia PPDB MI AL-FAIZEIN</h1>
            <p>Jl. Pendidikan No. 123, Kota Contoh</p>
            <h2 className="text-xl font-bold mt-4 underline uppercase">Laporan Data Siswa</h2>
        </div>

        <table className="w-full border-collapse border border-black">
            <thead>
                <tr className="bg-gray-100">
                    <th className="border border-black p-2">No</th>
                    <th className="border border-black p-2">NIK</th>
                    <th className="border border-black p-2">Nama Siswa</th>
                    <th className="border border-black p-2">Asal Sekolah</th>
                    <th className="border border-black p-2">Status</th>
                </tr>
            </thead>
            <tbody>
                {filteredData.map((siswa, idx) => (
                    <tr key={idx}>
                        <td className="border border-black p-2 text-center">{idx + 1}</td>
                        <td className="border border-black p-2">{siswa.nik}</td>
                        <td className="border border-black p-2">{siswa.nama_lengkap}</td>
                        <td className="border border-black p-2">{siswa.asal_sekolah || '-'}</td>
                        <td className="border border-black p-2 text-center">{siswa.status_pendaftaran}</td>
                    </tr>
                ))}
            </tbody>
        </table>

        {/* Tanda Tangan */}
        <div className="flex justify-end mt-16">
            <div className="text-center">
                <p>Kota Contoh, {new Date().toLocaleDateString('id-ID')}</p>
                <p className="mt-20 font-bold underline">Kepala Madrasah</p>
            </div>
        </div>

      </div>
    </AdminLayout>
  );
}