'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

/**
 * Skeleton loading component untuk tree cards
 */
export function TreeCardSkeleton() {
  return (
    <div className="glass-dark rounded-xl p-5 h-full">
      <div className="flex items-start justify-between mb-2">
        <div className="h-4 w-12 bg-white/10 rounded animate-pulse" />
        <div className="h-4 w-20 bg-white/10 rounded animate-pulse" />
      </div>
      <div className="h-6 w-3/4 bg-white/10 rounded mb-2 animate-pulse" />
      <div className="h-4 w-full bg-white/10 rounded mb-2 animate-pulse" />
      <div className="h-4 w-2/3 bg-white/10 rounded mb-3 animate-pulse" />
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="h-4 w-5/6 bg-white/10 rounded mb-2 animate-pulse" />
        <div className="h-3 w-full bg-white/10 rounded animate-pulse" />
      </div>
    </div>
  )
}

/**
 * Skeleton untuk tree detail page
 * Menggunakan mounted state untuk prevent hydration mismatch
 */
export function TreeDetailSkeleton() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <main className="relative min-h-screen bg-gradient-to-b from-forest-900 via-forest-800 to-earth-900">
        <div className="fixed top-4 left-4 right-4 z-50 pointer-events-none">
          <div className="glass-dark rounded-2xl p-4 max-w-sm" />
        </div>
      </main>
    )
  }

  return (
    <main className="relative min-h-screen">
      {/* Header Skeleton */}
      <div className="fixed top-4 left-4 right-4 z-50 pointer-events-none">
        <div className="glass-dark rounded-2xl p-4 max-w-sm">
          <div className="h-3 w-24 bg-white/10 rounded mb-2 animate-pulse" />
          <div className="h-6 w-3/4 bg-white/10 rounded mb-2 animate-pulse" />
          <div className="h-4 w-full bg-white/10 rounded mb-2 animate-pulse" />
          <div className="h-3 w-32 bg-white/10 rounded animate-pulse" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="min-h-screen bg-gradient-to-b from-forest-900 via-forest-800 to-earth-900">
        <div className="pt-32 pb-8 px-4">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <div className="h-16 w-3/4 bg-white/10 rounded mx-auto animate-pulse" />
            <div className="h-8 w-full bg-white/10 rounded animate-pulse" />
          </div>
        </div>
      </div>
    </main>
  )
}

/**
 * Loading spinner component
 */
export function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  }

  return (
    <div className="flex items-center justify-center">
      <motion.div
        className={`${sizeClasses[size]} border-4 border-forest-600 border-t-transparent rounded-full`}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

