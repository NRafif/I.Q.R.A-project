'use client'

/**
 * TreeCollection Component
 * 
 * Flora Library section yang menampilkan grid cards pohon.
 * Items tambahan tersembunyi sampai klik "Lihat Semua Koleksi"
 */

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'

/**
 * TreeCard Component
 */
function TreeCard({ tree, index }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.05 }}
        >
            <Link
                href={`/tree/lens/${tree.id}`}
                className="group block bg-white rounded-2xl p-8 border border-gray-100 hover:border-primary/20 hover:shadow-soft transition-all duration-500 h-full focus:outline-none focus:ring-2 focus:ring-primary/50"
                aria-label={`Pelajari tentang ${tree.common_name} (${tree.scientific_name})`}
            >
                {/* Header: ID dan lokasi */}
                <div className="flex justify-between items-start mb-6">
                    <span className="font-serif text-4xl text-gray-100 group-hover:text-primary/10 transition-colors">
                        {String(tree.id).padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-bold tracking-widest uppercase bg-gray-50 px-3 py-1 rounded-full text-gray-500">
                        {tree.location}
                    </span>
                </div>

                {/* Tree Thumbnail Image */}
                <div className="mb-6 h-48 overflow-hidden rounded-lg bg-gray-50 relative">
                    {tree.assets?.thumbnail ? (
                        <Image
                            src={tree.assets.thumbnail}
                            alt={tree.common_name}
                            fill
                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    ) : (
                        <div className="absolute inset-0 bg-primary/5 flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                            <span className="text-6xl text-primary/20" aria-hidden="true">🌳</span>
                        </div>
                    )}
                </div>

                {/* Tree info */}
                <h3 className="font-serif text-2xl font-bold text-text-main mb-1 group-hover:text-primary transition-colors">
                    {tree.common_name}
                </h3>
                <p className="text-sm font-serif italic text-text-muted mb-4">
                    {tree.scientific_name}
                </p>

                {/* Content preview */}
                <div className="space-y-3 pt-4 border-t border-gray-100">
                    <p className="text-xs font-bold text-primary tracking-wide uppercase">
                        {tree.story_mode?.sky_section?.headline || 'Eksplorasi Alam'}
                    </p>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                        {tree.story_mode?.sky_section?.sub_headline || 'Pelajari lebih lanjut tentang pohon ini.'}
                    </p>
                </div>

                {/* Link text */}
                <span className="inline-block mt-6 text-sm font-medium text-text-main group-hover:text-primary transition-colors border-b border-transparent group-hover:border-primary pb-0.5">
                    Lihat Detail
                </span>
            </Link>
        </motion.div>
    )
}

/**
 * LoadingSkeleton for TreeCard
 */
function TreeCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl p-8 border border-gray-100 animate-pulse">
            <div className="flex justify-between items-start mb-6">
                <div className="h-10 w-10 bg-gray-100 rounded" />
                <div className="h-5 w-16 bg-gray-100 rounded-full" />
            </div>
            <div className="h-48 bg-gray-100 rounded-lg mb-6" />
            <div className="h-6 bg-gray-100 rounded w-3/4 mb-2" />
            <div className="h-4 bg-gray-100 rounded w-1/2 mb-4" />
            <div className="border-t border-gray-100 pt-4">
                <div className="h-3 bg-gray-100 rounded w-1/3 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-full" />
            </div>
        </div>
    )
}

export default function TreeCollection({ trees = [], isLoading = false, error = null }) {
    const [showAll, setShowAll] = useState(false)

    return (
        <section id="trees" className="py-32 px-6 bg-white" aria-labelledby="trees-heading">
            <div className="max-w-7xl mx-auto">
                {/* Section Header */}
                <div className="text-center mb-20">
                    <span className="text-primary text-sm font-semibold tracking-[0.2em] uppercase block mb-3">
                        Flora Library
                    </span>
                    <motion.h2
                        id="trees-heading"
                        className="font-serif text-4xl md:text-5xl font-medium text-text-main mb-6"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        Koleksi Pohon
                    </motion.h2>
                    <div className="w-16 h-0.5 bg-primary/30 mx-auto" aria-hidden="true" />
                    <p className="text-text-muted mt-6 max-w-xl mx-auto font-light">
                        Menjelajahi keanekaragaman hayati di sekitar kita.
                        Setiap spesies memiliki cerita, manfaat, dan filosofi yang unik.
                    </p>
                </div>

                {/* States: Loading, Error, Empty, Content */}
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[...Array(6)].map((_, i) => (
                            <TreeCardSkeleton key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <div className="text-center py-12">
                        <div className="bg-red-50 rounded-xl p-6 max-w-md mx-auto">
                            <p className="text-red-600 mb-4">⚠️ {error}</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="px-6 py-2 bg-primary hover:bg-secondary text-white rounded-full transition-colors"
                            >
                                Refresh Halaman
                            </button>
                        </div>
                    </div>
                ) : trees.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-text-muted">Tidak ada data pohon yang tersedia.</p>
                    </div>
                ) : (
                    <>
                        {/* Tree Grid - First 6 items always visible */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {trees.slice(0, 6).map((tree, index) => (
                                <TreeCard key={tree.id} tree={tree} index={index} />
                            ))}
                        </div>

                        {/* View All Button - only show if more than 6 items and not expanded */}
                        {trees.length > 6 && !showAll && (
                            <div className="text-center mt-16">
                                <button
                                    onClick={() => setShowAll(true)}
                                    className="inline-flex items-center gap-2 px-8 py-3 border border-gray-200 rounded-full hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                                    aria-label={`Lihat semua ${trees.length} koleksi pohon`}
                                >
                                    <span>Lihat Semua Koleksi</span>
                                    <span aria-hidden="true">↓</span>
                                </button>
                            </div>
                        )}

                        {/* Additional items - HIDDEN until button clicked */}
                        <AnimatePresence>
                            {showAll && trees.length > 6 && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.5 }}
                                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16"
                                >
                                    {trees.slice(6).map((tree, index) => (
                                        <TreeCard key={tree.id} tree={tree} index={index + 6} />
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>

                        {/* Collapse button - show when expanded */}
                        {showAll && trees.length > 6 && (
                            <div className="text-center mt-16">
                                <button
                                    onClick={() => setShowAll(false)}
                                    className="inline-flex items-center gap-2 px-8 py-3 border border-gray-200 rounded-full hover:bg-gray-100 transition-all duration-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/50"
                                >
                                    <span>Sembunyikan</span>
                                    <span aria-hidden="true">↑</span>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </section>
    )
}

