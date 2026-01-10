import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Logo from '../../assets/logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState('home');

  const location = useLocation();
  const navigate = useNavigate();

  // 1. CEK STATUS LOGIN (Setiap kali pindah halaman)
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location]);

  // 2. LOGIKA SCROLL & NAVIGASI (Fitur Scroll Otomatis)
  useEffect(() => {
    if (location.state && location.state.targetSection) {
      const target = location.state.targetSection;
      setActiveSection(target);
      
      window.history.replaceState({}, document.title);
      
      setTimeout(() => {
        const element = document.getElementById(target);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } 
    else if (location.pathname === '/') {
      // Biarkan handleNavClick yang atur
    } 
    else {
      setActiveSection('');
    }
  }, [location]);

  const handleNavClick = (sectionId) => {
    setActiveSection(sectionId);
    setIsOpen(false);

    if (location.pathname !== '/') {
      navigate('/', { state: { targetSection: sectionId } });
    } 
    else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else if (sectionId === 'home') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const getMenuClass = (id) => {
    if (activeSection === id && location.pathname === '/') {
      return "text-primary font-bold transition-colors duration-200 cursor-pointer";
    }
    return "text-gray-600 hover:text-primary transition-colors duration-200 cursor-pointer";
  };

  return (
    // NAVBAR UTAMA: bg-white (Putih Solid) + border-b (Garis Bawah) - TIDAK ADA DARK MODE
    <header className="bg-white sticky top-0 z-50 border-b border-gray-200 shadow-sm transition-colors duration-300">
      <div className="container mx-auto px-4 md:px-6 py-4">
        <nav className="flex items-center justify-between">
          
          {/* LOGO */}
          <button 
            onClick={() => handleNavClick('home')} 
            className="flex items-center gap-3 z-50 focus:outline-none"
          >
            <div className="bg-primary p-2 rounded-lg shadow-sm">
              <img 
                src={Logo} 
                alt="Logo MI Al-Faizein" 
                className="w-10 h-10 md:w-12 md:h-12 object-contain" 
              />
            </div>
            <span className="text-lg font-bold text-gray-900 tracking-tight">
              PPDB MI AL-FAIZEIN
            </span>
          </button>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium transition-all">
            
            <button onClick={() => handleNavClick('home')} className={getMenuClass('home')}>
              Beranda
            </button>
            
            <Link 
              to="/galeri" 
              className={location.pathname === '/galeri' ? "text-primary font-bold" : "text-gray-600 hover:text-primary transition-colors"}
            >
              Galeri
            </Link>

            <Link 
              to="/cek-status" 
              className={location.pathname === '/cek-status' ? "text-primary font-bold" : "text-gray-600 hover:text-primary"}
            >
              Cek Status
            </Link>

            <button onClick={() => handleNavClick('kontak')} className={getMenuClass('kontak')}>
              Kontak
            </button>
          </div>

          {/* TOMBOL DINAMIS DESKTOP (KOTAK / ROUNDED-LG) */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <Link 
                to="/admin/dashboard" 
                className="bg-primary text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-green-600 transition-colors flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <span className="material-symbols-outlined text-[18px]">dashboard</span>
                <span>Dashboard {user.role === 'kepsek' ? 'Kamad' : 'Admin'}</span>
              </Link>
            ) : (
              <Link 
                to="/admin/login" 
                className="border border-primary text-primary px-5 py-2 rounded-lg text-sm font-semibold hover:bg-primary hover:text-white transition-all shadow-sm"
              >
                Masuk Admin
              </Link>
            )}
          </div>

          {/* MOBILE BURGER */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden flex items-center text-gray-600 focus:outline-none p-2 rounded-md hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-3xl">
              {isOpen ? 'close' : 'menu'}
            </span>
          </button>
        </nav>
      </div>

      {/* MENU MOBILE (BACKGROUND PUTIH SOLID) */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 absolute w-full left-0 top-full shadow-xl z-50">
          <div className="flex flex-col p-5 space-y-3 font-medium text-gray-700">
            
            <button 
              onClick={() => handleNavClick('home')}
              className={`text-left py-3 px-4 rounded-lg w-full ${activeSection === 'home' && location.pathname === '/' ? 'bg-green-50 text-primary font-bold' : 'hover:bg-gray-50'}`}
            >
              Beranda
            </button>

            <Link 
              to="/galeri" 
              onClick={() => setIsOpen(false)}
              className={`block py-3 px-4 rounded-lg w-full ${location.pathname === '/galeri' ? 'bg-green-50 text-primary font-bold' : 'hover:bg-gray-50'}`}
            >
              Galeri
            </Link>

            <Link 
              to="/cek-status" 
              onClick={() => setIsOpen(false)}
              className={`block py-3 px-4 rounded-lg w-full ${location.pathname === '/cek-status' ? 'bg-green-50 text-primary font-bold' : 'hover:bg-gray-50'}`}
            >
              Cek Status
            </Link>

            <button 
              onClick={() => handleNavClick('kontak')}
              className={`text-left py-3 px-4 rounded-lg w-full ${activeSection === 'kontak' && location.pathname === '/' ? 'bg-green-50 text-primary font-bold' : 'hover:bg-gray-50'}`}
            >
              Kontak
            </button>

            {/* TOMBOL DINAMIS MOBILE (KOTAK / ROUNDED-LG) */}
            <div className="pt-2 border-t mt-2">
              {user ? (
                <Link 
                  to="/admin/dashboard" 
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-primary text-white text-center py-3 rounded-lg font-bold hover:bg-green-600 transition-colors shadow-sm"
                >
                  Dashboard {user.role === 'kepsek' ? 'Kamad' : 'Admin'}
                </Link>
              ) : (
                <Link 
                  to="/admin/login" 
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-primary text-white text-center py-3 rounded-lg font-bold hover:bg-green-600 transition-colors shadow-sm"
                >
                  Masuk Admin
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}