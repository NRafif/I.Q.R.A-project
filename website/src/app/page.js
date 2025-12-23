'use client'

/**
 * Home Page Component
 * 
 * Landing page untuk I.Q.R.A dengan desain "Arboretum Digital".
 * 
 * Architecture:
 * - Menggunakan SWR untuk data fetching dengan caching
 * - Komponen modular untuk maintainability
 * - Light theme dengan typography serif/sans
 * 
 * Performance:
 * - SWR provides automatic caching and revalidation
 * - Stale-while-revalidate pattern for fast loading
 * - Focus revalidation for fresh data
 * 
 * Sections:
 * 1. Navbar - Fixed navigation
 * 2. Hero Section - Introduction dengan image dan stats
 * 3. Tree Collection - Grid of tree cards
 * 4. About Section - Filosofi proyek
 * 5. Footer - Contact dan navigation
 * 
 * @component
 */

import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import TreeCollection from '@/components/TreeCollection'
import AboutSection from '@/components/AboutSection'
import Footer from '@/components/Footer'
import { useTreesData } from '@/lib/hooks'
import { validateTreeData } from '@/lib/data'
import { useMemo } from 'react'

export default function Home() {
  // SWR hook for cached data fetching
  // - Automatic caching di memory
  // - Revalidation saat focus kembali ke tab
  // - Deduplication untuk avoid double fetch
  const { trees, isLoading, isError } = useTreesData()

  /**
   * Validate tree data dengan memoization
   * Hanya re-validate jika trees berubah
   */
  const validTrees = useMemo(() => {
    if (!trees || trees.length === 0) return []
    return trees.filter(tree => validateTreeData(tree))
  }, [trees])

  // Determine error message
  const errorMessage = isError
    ? 'Gagal memuat data pohon. Silakan refresh halaman.'
    : (trees.length > 0 && validTrees.length === 0)
      ? 'Data pohon tidak valid'
      : null

  return (
    <main className="bg-bg-light text-text-main font-sans antialiased" suppressHydrationWarning>
      <Navbar />
      <HeroSection treeCount={validTrees.length || 17} />
      <TreeCollection
        trees={validTrees}
        isLoading={isLoading}
        error={errorMessage}
      />
      <AboutSection />
      <Footer />
    </main>
  )
}

