'use client'

import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-900 via-forest-800 to-earth-900 flex items-center justify-center px-4">
      <div className="glass-dark rounded-2xl p-8 max-w-md text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-forest-300 mb-4">Halaman Tidak Ditemukan</h2>
        <p className="text-gray-400 mb-6">
          Maaf, halaman yang Anda cari tidak ditemukan. Mungkin pohon yang Anda cari tidak ada dalam database.
        </p>
        <Link
          href="/"
          className="inline-block px-6 py-2 bg-forest-600 hover:bg-forest-500 text-white rounded-full transition-colors"
        >
          Kembali ke Beranda
        </Link>
      </div>
    </div>
  )
}

