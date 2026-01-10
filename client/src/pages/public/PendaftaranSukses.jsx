import React from 'react';
import UserLayout from '../../layouts/UserLayout';
import { Link } from 'react-router-dom';

export default function PendaftaranSukses() {
  return (
    <UserLayout>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 dark:bg-green-900/50 p-4 rounded-full">
              <span className="material-symbols-outlined text-primary text-[64px]">check_circle</span>
            </div>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-light dark:text-text-dark-primary mb-3">
            Pendaftaran Berhasil Terkirim!
          </h1>
          <p className="text-base sm:text-lg text-gray-600 dark:text-text-dark-secondary px-4">
            Terima kasih telah mendaftar. Silakan lanjutkan ke tahap pembayaran.
          </p>
        </div>

        <div className="max-w-3xl mx-auto mt-10 sm:mt-12 grid gap-6 sm:gap-8">
          <div className="bg-surface-light dark:bg-surface-dark rounded-xl shadow-md overflow-hidden border border-border-light dark:border-border-dark">
            <div className="p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-semibold text-text-light dark:text-text-dark-primary mb-6">Instruksi Pembayaran</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Transfer Bank */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                  <h3 className="font-semibold text-text-light dark:text-text-dark-primary mb-3">Transfer Bank</h3>
                  <div className="space-y-2 text-sm text-gray-600 dark:text-text-dark-secondary">
                    <p><strong className="text-text-light dark:text-text-dark-primary">Bank:</strong> Bank BSI</p>
                    <p><strong className="text-text-light dark:text-text-dark-primary">No. Rekening:</strong> 123456</p>
                    <p><strong className="text-text-light dark:text-text-dark-primary">Atas Nama:</strong> Yayasan Al-Faizein</p>
                  </div>
                  <Link to="/konfirmasi-bayar" className="inline-block mt-5 text-sm font-medium text-primary hover:underline">
                    Sudah bayar? Konfirmasi di sini
                  </Link>
                </div>

                {/* Bayar Tunai */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-5">
                  <h3 className="font-semibold text-text-light dark:text-text-dark-primary mb-3">Bayar Tunai</h3>
                  <p className="text-sm text-gray-600 dark:text-text-dark-secondary">
                    Silakan datang langsung ke sekolah untuk pembayaran tunai di alamat:
                  </p>
                  <p className="mt-2 text-sm text-text-light dark:text-text-dark-primary font-medium">Jl. Contoh No. 1</p>
                </div>

              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center pb-8">
          <Link to="/" className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-semibold rounded-lg shadow-sm hover:bg-primary-hover transition-colors w-full sm:w-auto">
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </UserLayout>
  );
}