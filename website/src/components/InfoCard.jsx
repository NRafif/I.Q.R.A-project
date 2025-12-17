'use client'

/**
 * InfoCard Component
 * 
 * Component untuk menampilkan informasi pohon dan section indicator.
 * 
 * Note: Component ini dibuat tapi belum digunakan di tree detail page.
 * Digunakan sebagai reference untuk future enhancements.
 * 
 * @param {Object} tree - Tree data object
 * @param {string} currentSection - Current section ('akar', 'batang', 'daun')
 * @component
 */

import { motion, AnimatePresence } from 'framer-motion'

export default function InfoCard({ tree, currentSection }) {
  const sectionLabels = {
    akar: { label: 'Akar', icon: '🌱', color: 'bg-earth-600' },
    batang: { label: 'Batang', icon: '🪵', color: 'bg-earth-500' },
    daun: { label: 'Daun', icon: '🍃', color: 'bg-forest-600' }
  }

  const current = sectionLabels[currentSection]

  return (
    <motion.div 
      className="fixed top-4 left-4 z-50 glass-dark rounded-2xl p-4 min-w-[200px]"
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Tree Name */}
      <h1 className="text-white font-bold text-lg">{tree.name}</h1>
      <p className="text-forest-300 text-xs italic mb-3">{tree.latinName}</p>
      
      {/* Current Section Indicator */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSection}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={`${current.color} rounded-lg px-3 py-2 flex items-center gap-2`}
        >
          <span className="text-xl">{current.icon}</span>
          <span className="text-white text-sm font-medium">{current.label}</span>
        </motion.div>
      </AnimatePresence>

      {/* Section Navigation */}
      <div className="flex gap-1 mt-3">
        {Object.entries(sectionLabels).map(([key, value]) => (
          <div
            key={key}
            className={`flex-1 h-1 rounded-full transition-all duration-300 ${
              currentSection === key ? value.color : 'bg-white/20'
            }`}
          />
        ))}
      </div>
    </motion.div>
  )
}
