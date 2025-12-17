'use client'

import { useState, useEffect, useRef, use } from 'react'
import { motion, useScroll } from 'framer-motion'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ScrollProgress from '@/components/ScrollProgress'
import Navigation from '@/components/Navigation'
import { getTreeById, getDefaultTree, validateTreeData } from '@/lib/data'
import { TreeDetailSkeleton, LoadingSpinner } from '@/components/LoadingSkeleton'

/**
 * Tree Detail Page Component
 * 
 * Architecture decisions:
 * - Menggunakan 'use client' karena memerlukan browser APIs (scroll, window)
 * - React.use() untuk unwrap params Promise (Next.js 16 requirement)
 * - Reverse scroll UX: mulai dari bawah (akar) ke atas (daun)
 * 
 * Security:
 * - ID parameter divalidasi oleh getTreeById() yang menggunakan sanitizeTreeId()
 * - Data validation dengan validateTreeData() sebelum render
 * - Error handling yang tidak expose sensitive information
 */
export default function TreePage({ params }) {
  // Next.js 16: params adalah Promise, harus di-unwrap dengan React.use()
  // Mengapa React.use()? Next.js 16 menggunakan async params untuk better streaming
  const { id } = use(params)
  const router = useRouter()
  
  // State management untuk UI
  const [currentSection, setCurrentSection] = useState('akar') // Track scroll position
  const [isLoaded, setIsLoaded] = useState(false) // Control initial scroll
  const [isLoading, setIsLoading] = useState(true) // Loading state
  const [tree, setTree] = useState(null) // Tree data
  const [error, setError] = useState(null) // Error state
  
  // Refs dan hooks untuk scroll tracking
  const { scrollYProgress } = useScroll() // Framer Motion scroll progress
  const containerRef = useRef(null) // Container ref untuk scroll calculations

  /**
   * Fetch tree data berdasarkan ID
   * 
   * Mengapa validasi berlapis?
   * - getTreeById() sudah melakukan sanitization, tapi kita double-check
   * - validateTreeData() memastikan struktur data sesuai dengan yang diharapkan UI
   * - Fallback ke getDefaultTree() untuk graceful degradation
   */
  useEffect(() => {
    async function fetchTree() {
      try {
        setIsLoading(true)
        setError(null)
        
        // Input validation: check if ID exists
        // getTreeById() akan melakukan sanitization lebih lanjut
        if (!id) {
          setError('ID pohon tidak valid')
          setTree(getDefaultTree())
          return
        }

        // Fetch tree data (dengan sanitization di dalam getTreeById)
        const treeData = await getTreeById(id)
        
        // Validation chain: check existence, then structure
        if (!treeData) {
          setError('Pohon tidak ditemukan')
          setTree(getDefaultTree())
        } else if (!validateTreeData(treeData)) {
          // Structure validation: memastikan data sesuai schema
          setError('Data pohon tidak valid')
          setTree(getDefaultTree())
        } else {
          // Data valid, set untuk rendering
          setTree(treeData)
        }
      } catch (err) {
        // Error handling: log untuk debugging, tapi jangan expose ke user
        console.error('Error loading tree:', err)
        setError('Gagal memuat data pohon')
        setTree(getDefaultTree())
      } finally {
        setIsLoading(false)
      }
    }

    fetchTree()
  }, [id])

  /**
   * Initial scroll position: scroll ke bawah (akar) saat page load
   * 
   * Mengapa scroll ke bawah?
   * - UX "Ground-to-Sky": user mulai dari akar (bawah), scroll ke atas ke daun
   * - Reverse scrolling memberikan experience yang unik dan sesuai filosofi proyek
   * - Timeout 100ms untuk memastikan DOM sudah fully rendered
   */
  useEffect(() => {
    if (!isLoading && tree) {
      const timer = setTimeout(() => {
        // Scroll ke bottom untuk memulai dari akar
        // behavior: 'instant' untuk avoid animation yang mengganggu
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })
        setIsLoaded(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isLoading, tree])

  /**
   * Scroll tracking untuk section detection
   * 
   * Logic:
   * - > 70% scroll: akar (bagian bawah)
   * - 30-70% scroll: batang (bagian tengah)
   * - < 30% scroll: daun (bagian atas)
   * 
   * Mengapa threshold ini?
   * - Berdasarkan tinggi konten: akar lebih pendek, batang lebih panjang, daun di atas
   * - Threshold disesuaikan dengan proporsi visual dari tree sections
   */
  useEffect(() => {
    const handleScroll = () => {
      // Calculate scroll percentage
      // Formula: current scroll / (total height - viewport height)
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      
      // Section detection berdasarkan scroll position
      // Threshold disesuaikan dengan proporsi visual tree
      if (scrollPercent > 0.7) {
        setCurrentSection('akar') // Bottom section
      } else if (scrollPercent > 0.3) {
        setCurrentSection('batang') // Middle section
      } else {
        setCurrentSection('daun') // Top section
      }
    }
    
    // Add scroll listener
    window.addEventListener('scroll', handleScroll, { passive: true })
    
    // Initial call untuk set section saat page load
    handleScroll()
    
    // Cleanup: remove listener untuk prevent memory leaks
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Show loading skeleton
  if (isLoading || !tree) {
    return <TreeDetailSkeleton />
  }

  // Show error state with fallback
  if (error && tree.id === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-forest-900 via-forest-800 to-earth-900 flex items-center justify-center px-4">
        <div className="glass-dark rounded-2xl p-8 max-w-md text-center">
          <h1 className="text-2xl font-bold text-white mb-4">⚠️ {error}</h1>
          <p className="text-gray-400 mb-6">
            Pohon dengan ID "{id}" tidak ditemukan dalam database.
          </p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2 bg-forest-600 hover:bg-forest-500 text-white rounded-full transition-colors"
            >
              Kembali ke Beranda
            </button>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 glass text-white rounded-full hover:bg-white/20 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main 
      ref={containerRef}
      className={`relative transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      suppressHydrationWarning
    >
      <Navigation />
      <ScrollProgress progress={scrollYProgress} />
      
      {/* Fixed Info Header */}
      <div className="fixed top-4 left-4 right-4 z-50 pointer-events-none" role="banner" aria-label="Informasi pohon">
        <motion.div 
          className="glass-dark rounded-2xl p-4 max-w-sm pointer-events-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          role="region"
          aria-labelledby="tree-info-title"
        >
          <p className="text-forest-400 text-xs uppercase tracking-wider" aria-label="Family">{tree.family || 'Unknown'}</p>
          <h1 id="tree-info-title" className="text-white text-xl font-bold">{tree.common_name || 'Unknown'}</h1>
          <p className="text-gray-400 text-sm italic" aria-label="Nama ilmiah">{tree.scientific_name || 'Unknown'}</p>
          <p className="text-forest-300 text-xs mt-1" aria-label="Lokasi">
            <span aria-hidden="true">📍</span> {tree.location || 'Tidak diketahui'}
          </p>
        </motion.div>
      </div>

      {/* ===== SECTION DAUN/SKY (PALING ATAS) - HEADLINE TOP + CANOPY BOTTOM ===== */}
      <section className="relative" aria-label="Bagian daun dan langit">
        <div className="relative w-full">
          {/* Background images - using img for decorative backgrounds that need to repeat */}
          <img 
            src="/assets/Tree-2D/background/skysun.png" 
            alt="" 
            className="w-full h-auto block"
            role="presentation"
            aria-hidden="true"
            loading="eager"
          />
          <img 
            src="/assets/Tree-2D/background/sky-3.png" 
            alt="" 
            className="w-full h-auto block"
            role="presentation"
            aria-hidden="true"
            loading="eager"
          />
        </div>
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/assets/daun.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
        }} />
        {/* Content - Headline + Sub-headline di TOP, Canopy di BOTTOM */}
        <div className="absolute inset-0 z-10 flex flex-col justify-between pt-28 pb-8 px-4">
          {/* Headline + Sub-headline - TOP CENTER */}
          <motion.div 
            className="text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            role="region"
            aria-labelledby="tree-headline"
          >
            <h2 
              id="tree-headline"
              className="text-6xl md:text-7xl font-semibold tracking-wide text-[#4B4036] drop-shadow-[0_1px_2px_rgba(255,255,255,0.25)] mb-6"
            >
              {tree.content?.sky_section?.headline || 'Tidak ada headline'}
            </h2>

            <p className="text-xl md:text-2xl font-light leading-relaxed tracking-normal text-[#6B5F54] drop-shadow-[0_1px_2px_rgba(255,255,255,0.25)] px-6">
              "{tree.content?.sky_section?.sub_headline || 'Tidak ada deskripsi'}"
            </p>
          </motion.div>

          {/* Canopy Info - BOTTOM CENTER dengan Sticky Scroll */}
          {/* 
            Sticky behavior untuk canopy card:
            - Card akan tetap terlihat selama beberapa saat saat user scroll
            - Memberikan waktu yang cukup untuk membaca informasi manfaat ekologis
            - Sticky di bagian bawah untuk memberikan waktu membaca sebelum scroll ke batang
          */}
          <div className="w-full flex justify-center" style={{ minHeight: '100vh' }}>
            <motion.div 
              className="glass-dark rounded-2xl p-6 md:p-8 max-w-lg w-full text-center"
              style={{
                position: 'sticky',
                bottom: '10vh', // Sticky di bagian bawah viewport
                alignSelf: 'flex-end',
              }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              role="article"
              aria-labelledby="canopy-title"
            >
            <h3 id="canopy-title" className="text-xl md:text-2xl font-semibold text-forest-300 mb-4">
              <span aria-hidden="true">🌿</span> {tree.content?.canopy_section?.title || 'Manfaat Ekologis'}
            </h3>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              {tree.content?.canopy_section?.description || 'Tidak ada deskripsi'}
            </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ===== SECTION BATANG (TENGAH) - 3 INFO CARDS ===== */}
      {/* 
        Section container dengan tinggi yang cukup untuk multiple sticky cards.
        Perhitungan: 3 cards × 100vh (minHeight per card) + padding ≈ 350vh minimal.
        min-h-[400vh] memberikan ruang yang cukup untuk sticky behavior dengan margin.
      */}
      <section className="relative min-h-[400vh]" aria-label="Bagian batang pohon">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/assets/Tree-2D/background/sky-2.png)',
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/assets/batang.png)',
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto',
        }} />
        
        {/* Content - 3 Trunk Info Cards dengan Sticky Scroll */}
        {/* 
          Sticky scroll behavior (mengikuti pola canopy dan root):
          - Card sticky dengan bottom fixed (10vh) untuk konsistensi dengan reverse scroll UX
          - Setiap card container memiliki minHeight yang cukup untuk memberikan ruang scroll
          - Card akan tetap terlihat di bagian bawah viewport saat user scroll melalui container-nya
          - Card berikutnya akan menggantikan card sebelumnya saat container card sebelumnya selesai di-scroll
        */}
        <div className="relative z-10 flex flex-col items-center py-20 px-4">
          {(tree.content?.trunk_section || []).map((info, index) => (
            <div
              key={index}
              className="w-full flex justify-center"
              style={{ minHeight: '100vh' }} // Ruang scroll yang cukup untuk sticky behavior
            >
              <motion.article 
                className="glass-dark rounded-2xl p-6 md:p-8 max-w-lg w-full text-center shadow-2xl"
                style={{
                  position: 'sticky',
                  bottom: '10vh', // Konsisten dengan canopy dan root - sticky di bagian bawah viewport
                  alignSelf: 'flex-end', // Sejajar dengan pattern canopy
                }}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6 }}
                role="article"
                aria-labelledby={`trunk-info-${index}-title`}
                tabIndex={0}
              >
                <span className="inline-block px-3 py-1 bg-forest-600/50 rounded-full text-xs text-forest-200 mb-3" aria-label="Kategori informasi">
                  {info.type}
                </span>
                <h3 id={`trunk-info-${index}-title`} className="text-2xl md:text-3xl font-bold text-white mb-4">{info.title}</h3>
                <p className="text-gray-300 text-sm md:text-base leading-relaxed">{info.description}</p>
              </motion.article>
            </div>
          ))}
        </div>
      </section>

      {/* ===== SECTION AKAR (PALING BAWAH) ===== */}
      <section className="relative min-h-[70vh] md:min-h-[120vh] bg-[#7cb342]" aria-label="Bagian akar pohon">
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/assets/Tree-2D/background/sky-3-picsay.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center top',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/assets/Tree-2D/background/rumput-hill.png)',
          backgroundSize: '100% auto',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }} />
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/assets/akar.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
        }} />
        
        {/* Content - Root Description dengan Sticky Scroll */}
        {/* 
          Sticky behavior untuk root card:
          - Card akan tetap terlihat saat user mulai scroll dari bawah
          - Memberikan waktu yang cukup untuk membaca informasi sebelum scroll ke atas
        */}
        <div className="relative z-10 flex items-end justify-center min-h-[70vh] md:min-h-[120vh] pb-20 px-4">
          <motion.article 
            className="text-center p-6 md:p-8 rounded-3xl max-w-lg mx-auto"
            style={{
              background: 'rgba(20, 83, 45, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
              position: 'sticky',
              bottom: '10vh', // Sticky di bagian bawah viewport
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            role="article"
            aria-labelledby="root-title"
          >
            <p className="text-forest-300 text-sm mb-2">
              <span aria-hidden="true">🌱</span> Mulai dari sini
            </p>
            <h2 id="root-title" className="text-2xl md:text-3xl font-bold text-white mb-4">
              {tree.common_name}
            </h2>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              {tree.content?.root_section?.description || 'Tidak ada deskripsi'}
            </p>
            
            <motion.div 
              className="mt-8 text-white/80 text-sm flex flex-col items-center"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              aria-label="Instruksi scroll"
            >
              <span className="text-2xl" aria-hidden="true">↑</span>
              <span>Scroll ke atas untuk menjelajah</span>
            </motion.div>
          </motion.article>
        </div>
      </section>

      <footer className="bg-forest-900 py-8 text-center">
        <p className="text-white text-base font-bold">I.Q.R.A - Intelligent Quick-Response Arboretum</p>
        <p className="text-forest-300 text-sm mt-2">© 2025 - Proyek Edukasi Digital</p>
      </footer>
    </main>
  )
}
