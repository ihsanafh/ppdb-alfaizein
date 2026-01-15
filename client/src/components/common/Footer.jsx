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
                <a href="https://www.facebook.com/mi.faizein/" className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white hover:bg-blue-700 transition-colors" aria-label="Facebook">
                  {/* Facebook (inline SVG) */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M22 12.07C22 6.49 17.52 2 12 2S2 6.49 2 12.07c0 5.02 3.66 9.18 8.44 9.93v-7.03H8.07V12h2.37V9.65c0-2.34 1.39-3.63 3.52-3.63 1.02 0 2.08.18 2.08.18v2.28h-1.17c-1.15 0-1.5.71-1.5 1.44V12h2.56l-.41 2.97h-2.15v7.03C18.34 21.25 22 17.1 22 12.07z" />
                  </svg>
                </a>
                <a href="https://www.tiktok.com/@alfaizein" className="w-8 h-8 bg-black border border-gray-600 rounded flex items-center justify-center text-white hover:bg-gray-800 transition-colors" aria-label="TikTok">
                  {/* Musical note icon as TikTok representation */}
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-4 h-4 fill-current" aria-hidden="true">
                    <path d="M12 3v10.55A4 4 0 1 0 14 17V7h4V3h-6z" />
                  </svg>
                </a>
            </div>
          </div>

          {/* KOLOM 2: KONTAK */}
          <div>
            <h3 className="font-bold text-white text-lg mb-4">Informasi Pendaftaran</h3>
            <ul className="space-y-3 text-sm text-gray-400">
              <li>
                <a href="https://wa.me/6282171223236" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline" aria-label="Chat WhatsApp 0821-7122-3236">
                  <span className="material-symbols-outlined text-green-500">call</span>
                  <span>0821-7122-3236</span>
                </a>
              </li>
              <li>
                <a href="https://wa.me/6285365438089" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 hover:underline" aria-label="Chat WhatsApp 0853-6543-8089">
                  <span className="material-symbols-outlined text-green-500">call</span>
                  <span>0853-6543-8089</span>
                </a>
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