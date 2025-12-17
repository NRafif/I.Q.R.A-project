'use client'

/**
 * Home Page Component
 * 
 * Landing page untuk I.Q.R.A dengan daftar semua pohon yang tersedia.
 * 
 * Architecture:
 * - Client-side data fetching untuk real-time updates
 * - Data validation untuk ensure UI consistency
 * - Loading states untuk better UX
 * - Error handling dengan user-friendly messages
 * 
 * Sections:
 * 1. Hero section - Introduction dan CTA
 * 2. Trees list - Grid of tree cards
 * 3. About section - Project information
 * 
 * @component
 */

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Navigation from '@/components/Navigation'
import { loadTreesData, validateTreeData } from '@/lib/data'
import { TreeCardSkeleton, LoadingSpinner } from '@/components/LoadingSkeleton'

export default function Home() {
  // State management
  const [treesData, setTreesData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Data fetching dengan validation
   * 
   * Mengapa validasi di sini?
   * - Filter invalid data sebelum render untuk prevent UI errors
   * - Early detection jika data structure berubah
   * - Graceful degradation: show error jika semua data invalid
   * 
   * Error handling strategy:
   * - Try-catch untuk catch unexpected errors
   * - User-friendly error messages
   * - Fallback UI untuk error states
   */
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null)
        
        // Fetch data (dengan error handling di dalam loadTreesData)
        const data = await loadTreesData()
        
        // Validate setiap tree sebelum digunakan
        // Filter invalid data untuk prevent runtime errors
        const validData = data.filter(tree => validateTreeData(tree))
        
        // Check jika ada data tapi semua invalid
        // Ini bisa terjadi jika JSON structure berubah
        if (validData.length === 0 && data.length > 0) {
          setError('Data pohon tidak valid')
        } else {
          setTreesData(validData)
        }
      } catch (err) {
        // Catch unexpected errors
        // Log untuk debugging, tapi jangan expose ke user
        console.error('Error loading trees:', err)
        setError('Gagal memuat data pohon. Silakan refresh halaman.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-b from-forest-900 via-forest-800 to-earth-900" suppressHydrationWarning>
      <Navigation />
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4">
            I.Q.R.A
          </h1>
          <p className="text-forest-300 text-lg md:text-xl mb-2">
            Intelligent Quick-Response Arboretum
          </p>
          <p className="text-gray-400 text-sm md:text-base max-w-md mx-auto mb-8">
            "Bacalah" - Mengubah pohon yang diam menjadi berbicara melalui teknologi
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link 
            href="#trees"
            className="px-8 py-3 bg-forest-600 hover:bg-forest-500 text-white rounded-full transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label="Jelajahi koleksi pohon"
          >
            Jelajahi Pohon
          </Link>
          <Link 
            href="#about"
            className="px-8 py-3 glass text-white rounded-full hover:bg-white/20 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label="Pelajari tentang proyek I.Q.R.A"
          >
            Tentang Proyek
          </Link>
        </motion.div>

        <motion.div 
          className="absolute bottom-8"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full"></div>
          </div>
        </motion.div>
      </section>

      {/* Trees List Section */}
      <section id="trees" className="py-20 px-4" aria-labelledby="trees-heading">
        <div className="max-w-6xl mx-auto">
          <motion.h2 
            id="trees-heading"
            className="text-3xl md:text-4xl font-bold text-white text-center mb-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <span aria-hidden="true">🌳</span> Koleksi Pohon
          </motion.h2>
          
          {isLoading ? (
            <div className="text-center py-12">
              <LoadingSpinner size="lg" />
              <p className="text-gray-400 mt-4">Memuat data pohon...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <div className="glass-dark rounded-xl p-6 max-w-md mx-auto">
                <p className="text-red-400 mb-4">⚠️ {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-2 bg-forest-600 hover:bg-forest-500 text-white rounded-full transition-colors"
                >
                  Refresh Halaman
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-gray-400 text-center mb-12">
                {treesData.length} spesies tanaman tersedia untuk dijelajahi
              </p>

              {treesData.length === 0 ? (
                <div className="text-center py-12">
                  <div className="glass-dark rounded-xl p-6 max-w-md mx-auto">
                    <p className="text-gray-400">Tidak ada data pohon yang tersedia.</p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {treesData.map((tree, i) => (
                    <motion.div
                      key={tree.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.05 }}
                    >
                <Link 
                  href={`/tree/${tree.id}`}
                  aria-label={`Pelajari tentang ${tree.common_name} (${tree.scientific_name})`}
                  className="focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-offset-2 focus:ring-offset-transparent rounded-xl"
                >
                  <div className="glass-dark rounded-xl p-5 hover:bg-white/10 transition-all duration-300 group cursor-pointer h-full">
                          <div className="flex items-start justify-between mb-2">
                            <span className="text-forest-400 text-xs font-mono">#{tree.id.toString().padStart(2, '0')}</span>
                            <span className="text-xs text-gray-500">{tree.location}</span>
                          </div>
                          <h3 className="text-lg font-semibold text-white group-hover:text-forest-300 transition-colors">
                            {tree.common_name}
                          </h3>
                          <p className="text-gray-400 text-sm italic mb-2">{tree.scientific_name}</p>
                          <p className="text-gray-500 text-xs">{tree.family}</p>
                          <div className="mt-3 pt-3 border-t border-white/10">
                            <p className="text-forest-300 text-xs font-medium mb-1">
                              "{tree.content?.sky_section?.headline || 'N/A'}"
                            </p>
                            <p className="text-gray-500 text-xs line-clamp-2">
                              {tree.content?.sky_section?.sub_headline || 'Tidak ada deskripsi'}
                            </p>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 px-4 bg-black/20" aria-labelledby="about-heading">
        <div className="max-w-4xl mx-auto">
          <motion.h2 
            id="about-heading"
            className="text-3xl md:text-4xl font-bold text-white text-center mb-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            Tentang I.Q.R.A
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: '🔬', title: 'Teknologi', desc: 'QR Code + Web Interaktif untuk akses informasi instan' },
              { icon: '📖', title: 'Religius', desc: 'Mengambil esensi "Iqra" - perintah pertama untuk membaca' },
              { icon: '🌳', title: 'Filosofis', desc: 'Mengubah alam yang diam menjadi berbicara' }
            ].map((item, i) => (
              <motion.article
                key={i}
                className="glass-dark rounded-2xl p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                role="article"
                aria-labelledby={`about-item-${i}-title`}
              >
                <div className="text-4xl mb-4" aria-hidden="true">{item.icon}</div>
                <h3 id={`about-item-${i}-title`} className="text-xl font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-forest-900 py-8 text-center">
        <p className="text-white text-base font-bold">I.Q.R.A - Intelligent Quick-Response Arboretum</p>
        <p className="text-forest-300 text-sm mt-2">© 2025 - Proyek Edukasi Digital</p>
      </footer>
    </main>
  )
}
