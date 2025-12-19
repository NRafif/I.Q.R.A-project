'use client'

/**
 * HeroSection Component
 * 
 * Hero section untuk homepage dengan desain "Arboretum Digital".
 * 
 * Design features:
 * - Serif typography untuk headline (Playfair Display)
 * - Split layout (text left, image right)
 * - Stats counter untuk spesies dan akses
 * - Animated QR badge
 * 
 * @param {Object} props
 * @param {number} props.treeCount - Jumlah total pohon di database
 * @component
 */

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

export default function HeroSection({ treeCount = 17 }) {
    return (
        <header className="relative min-h-screen flex items-center justify-center overflow-hidden bg-bg-light pt-20">
            {/* Background accent */}
            <div
                className="absolute top-0 right-0 w-1/3 h-full bg-bg-subtle -z-10 hidden lg:block"
                aria-hidden="true"
            />

            <div className="max-w-7xl mx-auto w-full px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Text Content */}
                <motion.div
                    className="space-y-8 order-2 lg:order-1 text-center lg:text-left"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8 }}
                >
                    <div className="space-y-4">
                        <span className="inline-block py-1 px-3 border border-primary/20 rounded-full text-xs font-semibold tracking-wider text-primary uppercase">
                            Arboretum Digital
                        </span>
                        <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-medium leading-tight text-text-main">
                            Intelligent <br />
                            <span className="text-primary italic">Arboretum</span>
                        </h1>
                        <p className="text-text-muted text-lg md:text-xl font-light max-w-lg mx-auto lg:mx-0 leading-relaxed">
                            "Bacalah" — Mengubah pohon yang diam menjadi berbicara.
                            Sebuah eksplorasi botani melalui lensa teknologi modern.
                        </p>
                    </div>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
                        <Link
                            href="#trees"
                            className="bg-primary hover:bg-secondary text-white font-medium py-4 px-10 rounded-full transition-all duration-300 shadow-soft hover:shadow-lg transform hover:-translate-y-0.5 tracking-wide focus:outline-none focus:ring-2 focus:ring-primary/50"
                            aria-label="Jelajahi koleksi pohon"
                        >
                            Jelajahi Koleksi
                        </Link>
                        <Link
                            href="#about"
                            className="group flex items-center justify-center gap-2 text-text-main font-medium py-4 px-8 rounded-full transition-all hover:text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
                            aria-label="Pelajari tentang proyek I.Q.R.A"
                        >
                            <span>Tentang Proyek</span>
                            <span
                                className="transform group-hover:translate-x-1 transition-transform"
                                aria-hidden="true"
                            >
                                →
                            </span>
                        </Link>
                    </div>

                    {/* Stats */}
                    <div
                        className="pt-12 flex items-center justify-center lg:justify-start gap-12 border-t border-gray-100 mt-12 w-full max-w-md mx-auto lg:mx-0"
                        role="region"
                        aria-label="Statistik koleksi"
                    >
                        <div>
                            <p className="font-serif text-3xl font-bold text-text-main">{treeCount}</p>
                            <p className="text-xs text-text-muted uppercase tracking-wider mt-1">Spesies Tanaman</p>
                        </div>
                        <div>
                            <p className="font-serif text-3xl font-bold text-text-main">24/7</p>
                            <p className="text-xs text-text-muted uppercase tracking-wider mt-1">Akses Digital</p>
                        </div>
                    </div>
                </motion.div>

                {/* Hero Image */}
                <motion.div
                    className="relative order-1 lg:order-2 flex justify-center items-center h-[50vh] lg:h-auto"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    {/* Glow effect */}
                    <div
                        className="absolute w-[80%] h-[80%] rounded-full bg-secondary/5 blur-3xl -z-10"
                        aria-hidden="true"
                    />

                    {/* Tree Image - using external placeholder, can be replaced with local asset */}
                    <Image
                        src="/assets/tree-silhouette.png"
                        alt="Siluet pohon majestic"
                        width={500}
                        height={600}
                        className="w-full max-w-md lg:max-w-lg object-contain drop-shadow-2xl transform hover:scale-105 transition-transform duration-700 ease-out"
                        priority
                        style={{ filter: 'brightness(1.05) contrast(1.05)' }}
                    />

                    {/* QR Code Badge */}
                    <motion.div
                        className="absolute -bottom-6 -left-6 bg-white p-4 rounded-xl shadow-xl hidden md:block"
                        animate={{ y: [0, -8, 0] }}
                        transition={{ repeat: Infinity, duration: 3 }}
                        aria-label="Fitur scan QR code"
                    >
                        <div className="flex items-center gap-3">
                            <div className="bg-green-100 p-2 rounded-full text-primary">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h2M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Scan & Learn</p>
                                <p className="font-bold text-sm text-primary">Instant Info</p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </header>
    )
}
