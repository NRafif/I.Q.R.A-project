'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, useScroll } from 'framer-motion'
import ScrollProgress from '@/components/ScrollProgress'
import treesData from '@/../../public/data/trees.json'

export default function TreePage({ params }) {
  const [currentSection, setCurrentSection] = useState('akar')
  const [isLoaded, setIsLoaded] = useState(false)
  const { scrollYProgress } = useScroll()
  const containerRef = useRef(null)
  
  // Cari pohon berdasarkan ID
  const tree = treesData.find(t => t.id === parseInt(params.id)) || treesData[0]

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' })
      setIsLoaded(true)
    }, 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight)
      if (scrollPercent > 0.7) setCurrentSection('akar')
      else if (scrollPercent > 0.3) setCurrentSection('batang')
      else setCurrentSection('daun')
    }
    window.addEventListener('scroll', handleScroll)
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main 
      ref={containerRef}
      className={`relative transition-opacity duration-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
    >
      <ScrollProgress progress={scrollYProgress} />
      
      {/* Fixed Info Header */}
      <div className="fixed top-4 left-4 right-4 z-50 pointer-events-none">
        <motion.div 
          className="glass-dark rounded-2xl p-4 max-w-sm pointer-events-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-forest-400 text-xs uppercase tracking-wider">{tree.family}</p>
          <h1 className="text-white text-xl font-bold">{tree.common_name}</h1>
          <p className="text-gray-400 text-sm italic">{tree.scientific_name}</p>
          <p className="text-forest-300 text-xs mt-1">📍 {tree.location}</p>
        </motion.div>
      </div>

      {/* ===== SECTION DAUN/SKY (PALING ATAS) - HEADLINE TOP + CANOPY BOTTOM ===== */}
      <section className="relative">
        <div className="relative w-full">
          <img src="/assets/Tree-2D/background/skysun.png" alt="sky" className="w-full h-auto block" />
          <img src="/assets/Tree-2D/background/sky-3.png" alt="sky" className="w-full h-auto block" />
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
          <motion.div className="text-center max-w-5xl mx-auto"
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="  text-6xl md:text-7xl font-semibold tracking-wide text-[#4B4036] drop-shadow-[0_1px_2px_rgba(255,255,255,0.25)] mb-6">
              {tree.content.sky_section.headline}
            </h2>

            <p className="  text-xl md:text-2xl font-light leading-relaxed tracking-normal text-[#6B5F54] drop-shadow-[0_1px_2px_rgba(255,255,255,0.25)] px-6">
              "{tree.content.sky_section.sub_headline}"
            </p>
          </motion.div>

          {/* Canopy Info - BOTTOM CENTER */}
          <motion.div 
            className="glass-dark rounded-2xl p-6 md:p-8 max-w-lg mx-auto text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-xl md:text-2xl font-semibold text-forest-300 mb-4">
              🌿 {tree.content.canopy_section.title}
            </h3>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              {tree.content.canopy_section.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* ===== SECTION BATANG (TENGAH) - 3 INFO CARDS ===== */}
      <section className="relative min-h-[350vh]">
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
        
        {/* Content - 3 Trunk Info Cards */}
        <div className="relative z-10 flex flex-col items-center justify-around min-h-[350vh] py-20 px-4 gap-8">
          {tree.content.trunk_section.map((info, index) => (
            <motion.div 
              key={index}
              className="glass-dark rounded-2xl p-6 md:p-8 max-w-lg w-full text-center"
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-3 py-1 bg-forest-600/50 rounded-full text-xs text-forest-200 mb-3">
                {info.type}
              </span>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">{info.title}</h3>
              <p className="text-gray-300 text-sm md:text-base leading-relaxed">{info.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ===== SECTION AKAR (PALING BAWAH) ===== */}
      <section className="relative min-h-[70vh] md:min-h-[120vh] bg-[#7cb342]">
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
        
        {/* Content - Root Description */}
        <div className="relative z-10 flex items-end justify-center min-h-[70vh] md:min-h-[120vh] pb-20 px-4">
          <motion.div 
            className="text-center p-6 md:p-8 rounded-3xl max-w-lg mx-auto"
            style={{
              background: 'rgba(20, 83, 45, 0.85)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-forest-300 text-sm mb-2">🌱 Mulai dari sini</p>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              {tree.common_name}
            </h2>
            <p className="text-gray-200 text-sm md:text-base leading-relaxed">
              {tree.content.root_section.description}
            </p>
            
            <motion.div 
              className="mt-8 text-white/80 text-sm flex flex-col items-center"
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <span className="text-2xl">↑</span>
              <span>Scroll ke atas untuk menjelajah</span>
            </motion.div>
          </motion.div>
        </div>
      </section>

      <footer className="bg-forest-900 py-8 text-center">
        <p className="text-white text-base font-bold">I.Q.R.A - Intelligent Quick-Response Arboretum</p>
        <p className="text-forest-300 text-sm mt-2">© 2025 - Proyek Edukasi Digital</p>
      </footer>
    </main>
  )
}
