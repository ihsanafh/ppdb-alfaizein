import React from 'react';
// Pastikan path gambar ini sesuai dengan lokasi file Anda
import LogoKemenag from '../../assets/images/logo-kemenag.png'; 
import LogoSekolah from '../../assets/logo.png'; 

export default function Footer() {
  return (
    <footer id="kontak" className="bg-[#1F2937] dark:bg-black text-gray-300">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          
          {/* KOLOM 1: IDENTITAS */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-4">
                {/* Container Dua Logo */}
                <div className="flex items-center gap-3">
                    <img src={LogoKemenag} alt="Logo Kemenag" className="h-12 w-auto object-contain" />
                    <img src={LogoSekolah} alt="Logo MI Al-Faizein" className="h-12 w-auto object-contain" />
                </div>
                
                {/* Teks Nama Sekolah */}
                <div>
                    <h3 className="text-xl font-bold text-white">MI AL-FAIZEIN</h3>
                    <p className="text-xs text-yellow-400 font-semibold tracking-wider">TERAKREDITASI</p>
                </div>
            </div>
            
            <p className="text-sm text-gray-400 leading-relaxed max-w-sm mt-2">
              Membentuk generasi islami yang berakhlak mulia, cerdas, dan berprestasi sesuai dengan tuntunan Al-Qur'an dan Sunnah.
            </p>
            
            {/* Sosmed */}
            <div className="flex gap-4 mt-4">
                <a href="#" className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                  <span className="font-bold text-xs">FB</span>
                </a>
                <a href="#" className="w-8 h-8 bg-black border border-gray-600 rounded flex items-center justify-center text-white hover:bg-gray-800 transition-colors">
                  <span className="font-bold text-xs">Tik</span>
                </a>
            </div>
          </div>

          {/* KOLOM 2: KONTAK */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Informasi Pendaftaran</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500">call</span>
                <span>0821-7122-3236</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500">call</span>
                <span>0853-6543-8089</span>
              </li>
            </ul>
          </div>

          {/* KOLOM 3: ALAMAT */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Alamat Sekolah</h3>
            <div className="flex gap-3 text-sm text-gray-400">
                <span className="material-symbols-outlined flex-shrink-0 mt-1 text-red-500">location_on</span>
                <p>
                  Jl. M Yusuf, Belakangan Pasar Baru,<br />
                  Kec. Pangkalan Kerinci,<br />
                  Kab. Pelalawan, Riau
                </p>
            </div>
          </div>

        </div>
        <div className="mt-12 border-t border-gray-700 pt-8 text-center text-sm text-gray-500">
          <p>© 2025 MI AL-FAIZEIN. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}