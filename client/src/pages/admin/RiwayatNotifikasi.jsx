import React, { useState, useEffect } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import api from '../../services/api';

export default function RiwayatNotifikasi() {
  const [notifikasi, setNotifikasi] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/admin/riwayat-notifikasi', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setNotifikasi(response.data.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // --- HELPER UNTUK BADGE JENIS PESAN ---
  const getJenisBadge = (jenis) => {
    switch (jenis) {
      case 'WhatsApp':
        return {
          style: 'bg-green-100 text-green-700 border border-green-200',
          icon: 'chat',
          label: 'WhatsApp'
        };
      case 'SMS':
        return {
          style: 'bg-yellow-100 text-yellow-700 border border-yellow-200',
          icon: 'sms',
          label: 'SMS Fallback'
        };
      case 'Gagal':
        return {
          style: 'bg-red-100 text-red-700 border border-red-200',
          icon: 'report_problem',
          label: 'Gagal'
        };
      default:
        return {
          style: 'bg-gray-100 text-gray-700 border border-gray-200',
          icon: 'info',
          label: jenis
        };
    }
  };

  const filtered = notifikasi.filter(n => 
    n.nama_lengkap.toLowerCase().includes(filter.toLowerCase()) || 
    n.jenis_pesan.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <AdminLayout title="Riwayat Notifikasi" subtitle="Log pengiriman pesan otomatis (WA & SMS)">
      
      <div className="mb-6 flex justify-between items-center">
        <div className="relative w-64">
          <input 
            type="text" 
            placeholder="Cari nama atau jenis..." 
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary focus:border-primary text-sm"
          />
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-[18px]">search</span>
        </div>
        <button onClick={fetchData} className="text-primary hover:text-green-700 text-sm font-medium flex items-center gap-1">
          <span className="material-symbols-outlined text-[18px]">refresh</span> Refresh
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-50 text-gray-600 text-xs uppercase tracking-wider">
              <tr>
                <th className="p-4 border-b">No</th>
                <th className="p-4 border-b">Nama Siswa</th>
                <th className="p-4 border-b">Jenis</th>
                <th className="p-4 border-b">Waktu Kirim</th>
                <th className="p-4 border-b">Status</th>
                <th className="p-4 border-b">Isi Pesan</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">Memuat data...</td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-gray-500">Belum ada riwayat notifikasi.</td>
                </tr>
              ) : (
                filtered.map((item, idx) => {
                  const badge = getJenisBadge(item.jenis_pesan);
                  
                  return (
                    <tr key={idx} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-500">{idx + 1}</td>
                      <td className="p-4 font-medium text-gray-800">
                        {item.nama_lengkap}
                        <div className="text-xs text-gray-400">{item.nik_siswa}</div>
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold ${badge.style}`}>
                          <span className="material-symbols-outlined text-[14px]">{badge.icon}</span>
                          {badge.label}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600 whitespace-nowrap">
                        {new Date(item.waktu_kirim).toLocaleString('id-ID', {
                          day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                        })}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-xs font-semibold ${
                          item.status_pengiriman === 'Terkirim' 
                            ? 'bg-green-50 text-green-600' 
                            : 'bg-red-50 text-red-600'
                        }`}>
                          {item.status_pengiriman}
                        </span>
                      </td>
                      <td className="p-4 text-gray-500 max-w-xs truncate" title={item.isi_pesan}>
                        {item.isi_pesan}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AdminLayout>
  );
}