'use client'

/**
 * Home Page Component
 * 
 * Landing page untuk I.Q.R.A dengan desain "Arboretum Digital".
 * 
 * Architecture:
 * - Menggunakan komponen modular untuk maintainability
 * - Client-side data fetching untuk real-time updates
 * - Light theme dengan typography serif/sans
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

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import HeroSection from '@/components/HeroSection'
import TreeCollection from '@/components/TreeCollection'
import AboutSection from '@/components/AboutSection'
import Footer from '@/components/Footer'
import { loadTreesData, validateTreeData } from '@/lib/data'

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
   */
  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true)
        setError(null)

        // Fetch data (dengan error handling di dalam loadTreesData)
        const data = await loadTreesData()

        // Validate setiap tree sebelum digunakan
        const validData = data.filter(tree => validateTreeData(tree))

        // Check jika ada data tapi semua invalid
        if (validData.length === 0 && data.length > 0) {
          setError('Data pohon tidak valid')
        } else {
          setTreesData(validData)
        }
      } catch (err) {
        console.error('Error loading trees:', err)
        setError('Gagal memuat data pohon. Silakan refresh halaman.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  return (
    <main className="bg-bg-light text-text-main font-sans antialiased" suppressHydrationWarning>
      <Navbar />
      <HeroSection treeCount={treesData.length || 17} />
      <TreeCollection
        trees={treesData}
        isLoading={isLoading}
        error={error}
      />
      <AboutSection />
      <Footer />
    </main>
  )
}
