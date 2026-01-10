import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Swal from 'sweetalert2';
import LogoMI from '../../assets/logo.png'; 

export default function LoginAdmin() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  // State Data Form
  const [formData, setFormData] = useState({
    pegid: '',
    password: ''
  });

  // === CEK STATUS LOGIN SAAT HALAMAN DIBUKA ===
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    // Jika token & user ada, jangan biarkan login lagi, lempar ke dashboard
    if (token && user) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Panggil API Login
      const response = await api.post('/auth/login', formData);

      if (response.data.success) {
        const userData = response.data.user;

        // Simpan Token & Info User
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(userData));

        // === LOGIKA SAPAAN DINAMIS ===
        let sapaan = 'Selamat datang kembali, Panitia PPDB!';
        if (userData.role === 'kepsek') {
            sapaan = 'Selamat datang, Bapak/Ibu Kepala Madrasah.';
        }

        Swal.fire({
          icon: 'success',
          title: 'Login Berhasil',
          text: sapaan,
          timer: 1500,
          showConfirmButton: false,
          confirmButtonColor: '#34C759'
        }).then(() => {
          navigate('/admin/dashboard');
        });
      }

    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Masuk',
        text: error.response?.data?.message || 'Periksa PEGID dan Kata Sandi Anda.',
        confirmButtonColor: '#d33'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display flex items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-4xl mx-auto">
        <div className="bg-surface-light dark:bg-surface-dark rounded-lg shadow-lg overflow-hidden grid md:grid-cols-2 min-h-[450px]">
          
          {/* Bagian Kiri: Logo & Background Hijau */}
          <div className="bg-primary flex flex-col items-center justify-center p-8 md:p-12">
            <img 
              alt="Logo MI AL-FAIZEIN" 
              className="w-48 h-48 object-contain drop-shadow-md" 
              src={LogoMI}
            />
            <h2 className="text-white text-2xl font-bold mt-6 tracking-wide">PORTAL ADMIN</h2>
          </div>

          {/* Bagian Kanan: Form Login */}
          <div className="p-8 md:p-12 flex flex-col justify-center bg-white dark:bg-surface-dark">
            <div className="w-full max-w-sm mx-auto">
              <h2 className="text-2xl font-bold mb-6 text-text-light dark:text-text-dark-primary">Login Sistem</h2>
              
              <form onSubmit={handleLogin}>
                <div className="space-y-5">
                  
                  {/* Input PEGID */}
                  <div>
                    <label className="block text-sm font-bold text-black dark:text-white mb-2" htmlFor="pegid">
                      PEGID
                    </label>
                    <input
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 border border-transparent focus:bg-white focus:border-primary rounded-md text-text-light dark:text-text-dark placeholder:text-gray-500 focus:ring-primary transition-colors outline-none"
                      id="pegid" 
                      name="pegid" 
                      value={formData.pegid}
                      onChange={handleChange}
                      placeholder="Masukkan ID Pegawai" 
                      type="text" 
                      required
                    />
                  </div>

                  {/* Input Kata Sandi */}
                  <div>
                    <label className="block text-sm font-bold text-black dark:text-white mb-2" htmlFor="password">
                      Kata Sandi
                    </label>
                    <div className="relative">
                      <input
                        className="w-full px-4 py-3 pr-10 bg-gray-100 dark:bg-gray-800 border border-transparent focus:bg-white focus:border-primary rounded-md text-text-light dark:text-text-dark placeholder:text-gray-500 focus:ring-primary transition-colors outline-none"
                        id="password" 
                        name="password" 
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Masukkan Kata Sandi" 
                        type={showPassword ? "text" : "password"} 
                        required
                      />
                      <button 
                        aria-label="Toggle password visibility"
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400 hover:text-gray-600 focus:outline-none"
                        type="button"
                        onClick={togglePasswordVisibility}
                      >
                        <span className="material-symbols-outlined text-xl select-none">
                          {showPassword ? 'visibility' : 'visibility_off'}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Tombol Login */}
                  <div className="pt-2">
                    <button
                      className="w-full bg-primary text-white font-semibold py-3 px-4 rounded hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary dark:focus:ring-offset-background-dark transition-colors duration-200 shadow-sm disabled:bg-gray-400"
                      type="submit"
                      disabled={loading}
                    >
                      {loading ? 'Memuat...' : 'Masuk'}
                    </button>
                  </div>

                </div>
              </form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}