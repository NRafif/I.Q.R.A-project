'use client'

/**
 * ScrollProgress Component
 * 
 * Visual indicator untuk menunjukkan progress scroll di tree detail page.
 * 
 * UX Design:
 * - Reverse progress: bar terisi dari bawah (akar) ke atas (daun)
 * - Sesuai dengan konsep "Ground-to-Sky" scrolling
 * - Gradient colors: earth (bawah) → forest (atas)
 * 
 * Technical:
 * - Menggunakan Framer Motion untuk smooth animations
 * - useSpring untuk natural motion physics
 * - useTransform untuk reverse progress calculation
 * 
 * @param {Object} progress - Scroll progress dari useScroll() hook (0-1)
 * @component
 */

import { motion, useSpring, useTransform } from 'framer-motion'

export default function ScrollProgress({ progress }) {
  /**
   * Reverse progress calculation
   * 
   * Mengapa reverse?
   * - UX "Ground-to-Sky": user mulai dari bawah (akar), scroll ke atas (daun)
   * - Progress bar harus terisi dari bawah ke atas untuk match visual flow
   * - Transform: [0, 1] → [1, 0] untuk reverse direction
   */
  const reversedProgress = useTransform(progress, [0, 1], [1, 0])
  
  /**
   * Spring animation configuration
   * 
   * Parameter tuning:
   * - stiffness: 100 - Responsive tapi tidak terlalu bouncy
   * - damping: 30 - Smooth deceleration
   * - restDelta: 0.001 - Precision untuk stop animation
   * 
   * Mengapa useSpring?
   * - Natural motion physics untuk better UX
   * - Smooth transitions saat scroll
   */
  const scaleY = useSpring(reversedProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-2">
      {/* Labels - urutan: daun atas, akar bawah */}
      <span className="text-xs text-white/50">🍃</span>
      
      {/* Progress bar container */}
      <div className="w-1.5 h-32 bg-white/10 rounded-full overflow-hidden relative">
        <motion.div 
          className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-earth-500 via-earth-400 to-forest-500 rounded-full origin-bottom"
          style={{ scaleY, height: '100%' }}
        />
      </div>
      
      <span className="text-xs text-white/50">🌱</span>
    </div>
  )
}
