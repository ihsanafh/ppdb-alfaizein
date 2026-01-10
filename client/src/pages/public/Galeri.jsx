import React from 'react';
import UserLayout from '../../layouts/UserLayout';
import FotoGuru from '../../assets/images/foto-guru.jpg'; // Menggunakan foto guru sebagai sampel

export default function Galeri() {
  // Data sementara (Anda bisa menambah foto lain ke folder assets nanti)
  const galeriItems = [
    {
      type: 'image',
      src: FotoGuru,
      title: 'Dewan Guru & Staf',
      desc: 'Foto bersama guru dan staf pengajar MI Al-Faizein yang profesional dan berdedikasi.'
    },
    // Tambahkan item lain di sini nanti sesuai kebutuhan
    {
      type: 'video', // Contoh jika nanti ada video
      src: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Link youtube embed
      title: 'Profil Madrasah',
      desc: 'Video profil singkat kegiatan belajar mengajar.'
    }
  ];

  return (
    <UserLayout>
      <div className="bg-background-light dark:bg-background-dark min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6">
          
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-primary mb-4">Galeri Madrasah</h1>
            <p className="text-gray-600 dark:text-gray-300">
              Dokumentasi kegiatan, fasilitas, dan kebersamaan di MI Al-Faizein.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {galeriItems.map((item, idx) => (
              <div key={idx} className="bg-white dark:bg-surface-dark rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow border border-gray-100 dark:border-gray-800">
                <div className="h-64 overflow-hidden bg-gray-200 relative">
                  {item.type === 'image' ? (
                    <img 
                      src={item.src} 
                      alt={item.title} 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <iframe 
                      className="w-full h-full"
                      src={item.src} 
                      title={item.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                      allowFullScreen
                    ></iframe>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-text-light dark:text-text-dark-primary mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-text-dark-secondary">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </UserLayout>
  );
}