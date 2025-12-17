'use client'

export default function Error({ error, reset }) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-forest-900 via-forest-800 to-earth-900 flex items-center justify-center px-4">
      <div className="glass-dark rounded-2xl p-8 max-w-md text-center">
        <h1 className="text-2xl font-bold text-white mb-4">⚠️ Terjadi Kesalahan</h1>
        <p className="text-gray-400 mb-2">
          {error?.message || 'Maaf, terjadi kesalahan yang tidak terduga.'}
        </p>
        <p className="text-gray-500 text-sm mb-6">
          Silakan coba lagi atau kembali ke beranda.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-forest-600 hover:bg-forest-500 text-white rounded-full transition-colors"
          >
            Kembali ke Beranda
          </button>
          <button
            onClick={reset}
            className="px-6 py-2 glass text-white rounded-full hover:bg-white/20 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    </div>
  )
}

