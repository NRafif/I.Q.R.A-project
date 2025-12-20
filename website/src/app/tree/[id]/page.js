'use client'

import { useState, useEffect, useRef, use } from 'react'
import { motion, useScroll } from 'framer-motion'
import { useRouter } from 'next/navigation'
import ScrollProgress from '@/components/ScrollProgress'
import Navigation from '@/components/Navigation'
import JournalCard from '@/components/JournalCard'
import { getTreeById, getDefaultTree, validateTreeData } from '@/lib/data'
import { TreeDetailSkeleton } from '@/components/LoadingSkeleton'

/**
 * Tree Detail Page - Museum/Specimen Edition
 * 
 * LAYOUT POHON TIDAK DIUBAH - hanya background & cards
 */
export default function TreePage({ params }) {
  const { id } = use(params)
  const router = useRouter()

  const [currentSection, setCurrentSection] = useState('root')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [tree, setTree] = useState(null)
  const [error, setError] = useState(null)
  const [activeTrunkCard, setActiveTrunkCard] = useState(0)

  const { scrollYProgress } = useScroll()
  const containerRef = useRef(null)

  useEffect(() => {
    async function fetchTree() {
      try {
        setIsLoading(true)
        setError(null)

        if (!id) {
          setError('ID pohon tidak valid')
          setTree(getDefaultTree())
          return
        }

        const treeData = await getTreeById(id)

        if (!treeData) {
          setError('Pohon tidak ditemukan')
          setTree(getDefaultTree())
        } else if (!validateTreeData(treeData)) {
          setError('Data pohon tidak valid')
          setTree(getDefaultTree())
        } else {
          setTree(treeData)
        }
      } catch (err) {
        console.error('Error loading tree:', err)
        setError('Gagal memuat data pohon')
        setTree(getDefaultTree())
      } finally {
        setIsLoading(false)
      }
    }

    fetchTree()
  }, [id])

  useEffect(() => {
    if (!isLoading && tree) {
      const timer = setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })
        setIsLoaded(true)
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isLoading, tree])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight)

      if (scrollPercent > 0.7) {
        setCurrentSection('root')
      } else if (scrollPercent > 0.3) {
        setCurrentSection('trunk')
        const trunkCards = tree?.content?.trunk_section?.length || 1
        const trunkProgress = (scrollPercent - 0.3) / 0.4
        setActiveTrunkCard(Math.min(Math.floor(trunkProgress * trunkCards), trunkCards - 1))
      } else if (scrollPercent > 0.1) {
        setCurrentSection('canopy')
      } else {
        setCurrentSection('sky')
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [tree])

  if (isLoading || !tree) {
    return <TreeDetailSkeleton />
  }

  if (error && tree.id === 0) {
    return (
      <main className="min-h-screen bg-gradient-to-b from-[#f8f9fa] to-[#e8e6dc] flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl p-8 max-w-md text-center shadow-xl">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">⚠️ {error}</h1>
          <p className="text-gray-600 mb-6">Pohon dengan ID "{id}" tidak ditemukan.</p>
          <button onClick={() => router.push('/')} className="px-6 py-2 bg-[#2d5a3c] text-white rounded-full">
            Kembali ke Beranda
          </button>
        </div>
      </main>
    )
  }

  const currentTrunkData = tree.content?.trunk_section?.[activeTrunkCard]
  const isInsight = currentTrunkData?.type?.toLowerCase().includes('islamic') ||
    currentTrunkData?.type?.toLowerCase().includes('insight') ||
    currentTrunkData?.type?.toLowerCase().includes('religius')

  return (
    <main
      ref={containerRef}
      className={`relative transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      suppressHydrationWarning
    >
      <Navigation />
      <ScrollProgress progress={scrollYProgress} />

      {/* ===== FIXED IDENTITY CARD (TOP-LEFT) ===== */}
      <div className="fixed top-4 left-4 z-50">
        <JournalCard
          variant="identity"
          badgeText={tree.family}
          title={tree.common_name}
          subtitle={tree.scientific_name}
          tags={[tree.family, tree.location]}
        />
      </div>

      {/* ===== FIXED CONTENT CARD (BOTTOM-CENTER) ===== */}
      {currentSection !== 'sky' && (
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2  z-40 w-full max-w-lg px-4">
          {currentSection === 'canopy' && (
            <motion.div key="canopy-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <JournalCard
                variant="ecology"
                icon="🌿"
                title={tree.content?.canopy_section?.title || 'Manfaat Ekologis'}
                content={tree.content?.canopy_section?.description}
                tags={["Habitat", "Nektar", "Oksigen"]}
              />
            </motion.div>
          )}

          {currentSection === 'trunk' && currentTrunkData && (
            <motion.div key={`trunk-card-${activeTrunkCard}`} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <JournalCard
                variant={isInsight ? 'insight' : 'history'}
                badgeText={currentTrunkData.type}
                title={currentTrunkData.title}
                content={currentTrunkData.description}
              />
            </motion.div>
          )}

          {currentSection === 'root' && (
            <motion.div key="root-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <JournalCard
                variant="root"
                badgeText="🌱 Mulai Dari Sini"
                title={tree.common_name}
                content={tree.content?.root_section?.description}
              />
            </motion.div>
          )}
        </div>
      )}

      {/* Trunk card indicator */}
      {currentSection === 'trunk' && (
        <div className="fixed right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-3">
          {(tree.content?.trunk_section || []).map((_, idx) => (
            <div
              key={idx}
              className={`w-3 h-3 rounded-full transition-all ${activeTrunkCard === idx ? 'bg-[#2d5a3c] scale-125' : 'bg-[#2d5a3c]/30'}`}
            />
          ))}
        </div>
      )}

      {/* ===== SECTION SKY (PALING ATAS) - HEADLINE ===== */}
      <section className="relative min-h-[40vh] md:min-h-[70vh] bg-gradient-to-b from-[#e0f2fe] via-[#f0fdf4] to-[#fefce8]">
        <motion.div
          className="text-center max-w-4xl mx-auto pt-56 pb-4 md:pb-16 px-4"
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl italic font-medium text-[#2d5a3c] mb-6">
            {tree.content?.sky_section?.headline}
          </h2>
          <p className="font-serif text-lg md:text-xl italic text-[#2d5a3c]/70 leading-relaxed max-w-3xl mx-auto">
            "{tree.content?.sky_section?.sub_headline}"
          </p>
        </motion.div>
      </section>

      {/* ===== SECTION CANOPY (DAUN) - FULL WIDTH ===== */}
      <section className="relative min-h-[215vh] z-10" aria-label="Bagian daun">
        {/* Clean gradient background */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fefce8] to-transparent" />

        {/* ORIGINAL LAYOUT: Daun asset FULL - tidak terpotong */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/assets/daun.png)',
          backgroundSize: '100% auto',
          backgroundPosition: 'center bottom',
          backgroundRepeat: 'no-repeat',
          filter: 'drop-shadow(0 25px 50px rgba(0,0,0,0.3))',
        }} />
      </section>

      {/* ===== SECTION BATANG (MIDDLE) - LAYOUT ORIGINAL ===== */}
      <section className="relative min-h-[400vh] -mt-[40vh] pt-[40vh] z-0" aria-label="Bagian batang pohon">
        {/* CLEAN GRADIENT (replaces sky-2 image) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fefce8] via-[#fef3c7] to-[#fde68a]" />

        {/* ORIGINAL LAYOUT: Batang asset with CSS background */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/assets/batang.png)',
          backgroundRepeat: 'repeat-y',
          backgroundSize: '100% auto',
          backgroundPosition: 'center top',
          filter: 'drop-shadow(0 0 40px rgba(0,0,0,0.25))',
        }} />
      </section>

      {/* ===== SECTION AKAR (BOTTOM) - LAYOUT ORIGINAL ===== */}
      <section className="relative min-h-[40vh] md:min-h-[120vh]" aria-label="Bagian akar pohon">
        {/* CLEAN GRADIENT (replaces sky-3-picsay & rumput) */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#fde68a] via-[#d4a574] to-[#8b6f4e]" />

        {/* ORIGINAL LAYOUT: Akar asset with CSS background */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'url(/assets/akar.png)',
          backgroundSize: 'contain',
          backgroundPosition: 'center top',
          backgroundRepeat: 'no-repeat',
          filter: 'drop-shadow(0 -20px 40px rgba(0,0,0,0.3))',
        }} />
      </section>

      <footer className="bg-[#1f4028] py-8 text-center">
        <p className="text-white text-base font-bold">I.Q.R.A - Intelligent Quick-Response Arboretum</p>
        <p className="text-[#86efac] text-sm mt-2">© 2025 - Proyek Edukasi Digital</p>
      </footer>
    </main>
  )
}
