'use client'

/**
 * Navigation Component
 * 
 * Komponen navigasi yang muncul di pojok kanan atas untuk kembali ke homepage.
 * 
 * Architecture decisions:
 * - Menggunakan mounted state untuk prevent hydration mismatch
 * - Conditional rendering: hanya muncul di halaman selain homepage
 * - Framer Motion untuk smooth animations
 * 
 * Accessibility:
 * - ARIA labels untuk screen readers
 * - Keyboard navigation support dengan focus indicators
 * - Semantic HTML dengan <nav> element
 * 
 * @component
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'

export default function Navigation({ children }) {
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const isHomePage = pathname === '/'

  /**
   * Hydration mismatch prevention
   * 
   * Mengapa diperlukan?
   * - usePathname() bisa return different values di server vs client
   * - Server tidak tahu current pathname, client tahu setelah hydration
   * - Return null saat belum mounted untuk avoid mismatch warnings
   */
  useEffect(() => {
    setMounted(true)
  }, [])

  // Return null saat belum mounted untuk prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <nav className="fixed top-4 right-4 z-50 flex items-center gap-3">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex gap-3"
      >
        {children}

        {!isHomePage && (
          <Link
            href="/"
            className="glass-dark rounded-full px-4 py-2 flex items-center gap-2 text-white hover:bg-white/20 transition-all duration-300 group focus:outline-none focus:ring-2 focus:ring-forest-400 focus:ring-offset-2 focus:ring-offset-transparent"
            aria-label="Kembali ke halaman beranda"
            role="button"
            tabIndex={0}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 group-hover:translate-x-[-2px] transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="text-sm font-medium">Beranda</span>
          </Link>
        )}
      </motion.div>
    </nav>
  )
}

