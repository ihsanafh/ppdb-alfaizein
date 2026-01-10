import React from 'react';
import Navbar from '../components/common/Navbar';
import Footer from '../components/common/Footer';

export default function UserLayout({ children }) {
  return (
    <div className="font-sans bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark-primary flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}