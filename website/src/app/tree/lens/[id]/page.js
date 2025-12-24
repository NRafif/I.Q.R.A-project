'use client'

import { useState, useEffect, use } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { getTreeById, getDefaultTree, validateTreeData } from '@/lib/data'

export default function LensPage({ params }) {
    const { id } = use(params)
    const [tree, setTree] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [activeHotspot, setActiveHotspot] = useState(null)

    useEffect(() => {
        async function fetchTree() {
            setIsLoading(true)
            try {
                const data = await getTreeById(id)
                if (data && validateTreeData(data)) {
                    setTree(data)
                } else {
                    setTree(getDefaultTree())
                }
            } catch (error) {
                console.error("Failed to load tree", error)
                setTree(getDefaultTree())
            } finally {
                setIsLoading(false)
            }
        }
        fetchTree()
    }, [id])

    if (isLoading || !tree) return <div className="h-screen bg-[#F4F6F8] flex items-center justify-center">Loading...</div>

    // Helper to get position - supports multiple formats:
    // 1. hotspot.x and hotspot.y at root level
    // 2. hotspot.position as object { x, y }
    // 3. hotspot.position as preset string like "top-right"
    const getPositionStyle = (hotspot) => {
        // Check if x,y at root level
        if (typeof hotspot.x === 'number' && typeof hotspot.y === 'number') {
            return {
                left: `${hotspot.x}%`,
                top: `${hotspot.y}%`,
                transform: 'translate(-50%, -50%)'
            }
        }

        // Check if position is object with x,y
        if (hotspot.position && typeof hotspot.position === 'object') {
            const { x, y } = hotspot.position
            if (typeof x === 'number' && typeof y === 'number') {
                return {
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)'
                }
            }
        }

        // Fallback to preset position strings for backward compatibility
        const pos = hotspot.position || 'middle-center'
        switch (pos) {
            case 'top-left': return { top: '20%', left: '25%' }
            case 'top-right': return { top: '20%', right: '25%' }
            case 'top-center': return { top: '15%', left: '50%', transform: 'translateX(-50%)' }
            case 'middle-left': return { top: '50%', left: '20%', transform: 'translateY(-50%)' }
            case 'middle-right': return { top: '50%', right: '20%', transform: 'translateY(-50%)' }
            case 'middle-center': return { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
            case 'bottom-left': return { bottom: '25%', left: '25%' }
            case 'bottom-right': return { bottom: '25%', right: '25%' }
            case 'bottom-center': return { bottom: '15%', left: '50%', transform: 'translateX(-50%)' }
            default: return { top: '50%', left: '50%' }
        }
    }

    // Helper to determine info card side based on hotspot position
    const isLeftSide = (hotspot) => {
        // Check root level x
        if (typeof hotspot.x === 'number') {
            return hotspot.x < 50
        }
        // Check position object
        if (hotspot.position && typeof hotspot.position === 'object') {
            return hotspot.position.x < 50
        }
        // Fallback to string check
        return typeof hotspot.position === 'string' && hotspot.position.includes('left')
    }

    // Helper to check if hotspot is near horizontal edge (card might get cut off left/right)
    const isNearHorizontalEdge = (hotspot) => {
        let x = 50
        if (typeof hotspot.x === 'number') {
            x = hotspot.x
        } else if (hotspot.position && typeof hotspot.position === 'object') {
            x = hotspot.position.x
        }
        // Near left edge (< 25%) or near right edge (> 75%)
        return x < 25 || x > 75
    }

    // Helper to check if hotspot is near bottom (y > 65%)
    const isNearBottom = (hotspot) => {
        let y = 50
        if (typeof hotspot.y === 'number') {
            y = hotspot.y
        } else if (hotspot.position && typeof hotspot.position === 'object') {
            y = hotspot.position.y
        }
        return y > 65
    }

    // Backward compatibility alias
    const isNearEdge = isNearHorizontalEdge

    // Get card position class based on hotspot location
    const getCardPositionClass = (hotspot) => {
        const nearBottom = isNearBottom(hotspot)
        const leftSide = isLeftSide(hotspot)

        // Get x position
        let x = 50
        if (typeof hotspot.x === 'number') {
            x = hotspot.x
        } else if (hotspot.position && typeof hotspot.position === 'object') {
            x = hotspot.position.x
        }

        // Near right edge (x > 70%): show card to LEFT to prevent cutoff
        const nearRightEdge = x > 70
        // Near left edge (x < 30%): show card to RIGHT or below
        const nearLeftEdge = x < 30

        // PRIORITY 1: Near right edge - show card to LEFT on ALL devices
        if (nearRightEdge) {
            return 'right-[calc(100%+1rem)] left-auto top-1/2 -translate-y-1/2'
        }

        // PRIORITY 2: Near left edge - show card to RIGHT on ALL devices
        if (nearLeftEdge) {
            return 'left-[calc(100%+1rem)] right-auto top-1/2 -translate-y-1/2'
        }

        // PRIORITY 3: Near bottom (only if not near horizontal edges) - show card ABOVE
        if (nearBottom) {
            return 'left-1/2 -translate-x-1/2 bottom-8 top-auto'
        }

        // Default: Center zone - normal side positioning
        if (leftSide) {
            return 'left-1/2 -translate-x-1/2 top-8 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:left-[calc(100%+4rem)] md:right-auto'
        } else {
            return 'left-1/2 -translate-x-1/2 top-8 md:top-1/2 md:-translate-y-1/2 md:translate-x-0 md:right-[calc(100%+4rem)] md:left-auto'
        }
    }

    const anatomy = tree.anatomy_mode || {}
    const hotspots = anatomy.hotspots || []

    return (
        <main className="relative h-screen w-screen overflow-hidden bg-[#F4F6F8] text-[#0d1b0f] font-sans selection:bg-[#13ec25]/30">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-30 pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            {/* Decorative Corners */}
            <div className="absolute top-6 left-6 w-16 h-16 border-l-2 border-t-2 border-black/20 pointer-events-none z-0" />
            <div className="absolute top-6 right-6 w-16 h-16 border-r-2 border-t-2 border-black/20 pointer-events-none z-0" />
            <div className="absolute bottom-6 left-6 w-16 h-16 border-l-2 border-b-2 border-black/20 pointer-events-none z-0" />
            <div className="absolute bottom-6 right-6 w-16 h-16 border-r-2 border-b-2 border-black/20 pointer-events-none z-0" />

            {/* Header */}
            <header className="relative z-20 flex items-center justify-between px-6 md:px-10 py-5 bg-white/80 backdrop-blur-sm border-b border-black/5">
                <div className="flex items-center gap-4">
                    <Link href="/" className="size-8 text-[#13ec25]">
                        {/* Simple Icon Placeholder */}
                        <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L2 19h20L12 2zm0 3.8L17.4 17H6.6L12 5.8z" /></svg>
                    </Link>
                    <div>
                        <h1 className="text-xl font-bold uppercase tracking-wider leading-none">I.Q.R.A. <span className="text-black/40 font-light mx-2">|</span> The Lens</h1>
                    </div>
                </div>
                <div className="flex gap-3">
                    {/* Beranda Button */}
                    <Link href="/" className="hidden md:flex items-center gap-2 px-4 py-1.5 rounded-lg border border-gray-200 text-xs font-bold uppercase tracking-widest hover:border-[#13ec25] transition-colors group">
                        <span className="group-hover:-translate-x-1 transition-transform">←</span>
                        Beranda
                    </Link>
                </div>
            </header>

            {/* Main Content */}
            <div className="relative z-10 flex-1 h-[calc(100vh-80px)] flex flex-col items-center justify-center p-6">

                {/* Tree Header Info */}
                <div className="absolute top-4 md:top-8 left-6 md:left-10 z-20 max-w-sm">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 bg-[#13ec25]/20 text-green-900 border border-[#13ec25]/40 rounded text-[10px] font-bold uppercase tracking-widest">
                            Specimen #{tree.id}
                        </span>
                        <span className="px-2 py-0.5 bg-gray-100 text-gray-500 border border-gray-200 rounded text-[10px] font-bold uppercase tracking-widest">
                            {tree.family}
                        </span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-bold text-black tracking-tight leading-none mb-1">{tree.common_name}</h2>
                    <p className="text-gray-500 font-serif italic text-lg">{tree.scientific_name}</p>
                    <p className="mt-4 text-sm text-gray-600 leading-relaxed max-w-xs hidden md:block">
                        {anatomy.description}
                    </p>
                </div>

                {/* Central Tree Image - Wider container for hotspots */}
                <div className="relative w-full h-[60vh] md:h-[70vh] flex items-center justify-center">
                    <div className="relative h-full aspect-[3/4] md:aspect-square flex items-center justify-center">
                        {/* Tree Background Image */}
                        <Image
                            src={tree.assets?.background || "/assets/tree-silhouette.png"}
                            alt={tree.common_name}
                            fill
                            className="object-contain drop-shadow-2xl"
                            priority
                        />

                        {/* Hotspots */}
                        {hotspots.map((hotspot, idx) => (
                            <div
                                key={idx}
                                className="absolute group z-30"
                                style={getPositionStyle(hotspot)}
                                onMouseEnter={() => setActiveHotspot(idx)}
                                onMouseLeave={() => setActiveHotspot(null)}
                            >
                                <div className="relative flex items-center justify-center cursor-pointer">
                                    {/* Pulse Effect */}
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#13ec25] opacity-75 duration-1000"></span>
                                    {/* Dot */}
                                    <span className="relative inline-flex rounded-full h-4 w-4 bg-[#13ec25] border-2 border-white shadow-lg group-hover:scale-125 transition-transform"></span>

                                    {/* Connecting Line (Only visible on larger screens/hover, hidden for edge hotspots) */}
                                    {!isNearEdge(hotspot) && (
                                        <div className={`absolute top-1/2 h-[1px] bg-black/80 transition-all duration-300 origin-center
                                      ${isLeftSide(hotspot) ? 'right-full w-0 group-hover:w-16' : 'left-full w-0 group-hover:w-16'}
                                      hidden md:block
                                 `} />
                                    )}

                                    {/* Info Card - Smart Positioning */}
                                    <div className={`
                                absolute w-64 bg-white/95 backdrop-blur-sm shadow-xl rounded-lg p-4
                                transition-all duration-300 transform scale-95 opacity-0 pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100 group-hover:scale-100
                                z-50 border-l-4 border-[#13ec25]
                                ${getCardPositionClass(hotspot)}
                                ${!isNearEdge(hotspot) && isLeftSide(hotspot) ? 'md:border-l-0 md:border-r-4' : ''}
                             `}>
                                        <div className="flex items-center gap-2 mb-2 pb-2 border-b border-gray-100">
                                            <span className="text-[#13ec25] font-bold text-xs uppercase tracking-widest">{hotspot.part}</span>
                                        </div>
                                        <h4 className="font-bold text-lg leading-tight mb-1">{hotspot.label}</h4>
                                        <p className="text-xs text-gray-600 leading-relaxed font-mono">
                                            {hotspot.text}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bottom CTA to Journey Mode */}
                <div className="absolute bottom-8 md:bottom-12 z-40 w-full flex justify-center">
                    <Link href={`/tree/${id}`}>
                        <button className="group relative inline-flex items-center gap-3 bg-white text-black px-8 py-3 rounded-full border border-[#13ec25]/40 hover:border-[#13ec25] shadow-lg shadow-[#13ec25]/10 hover:shadow-[#13ec25]/30 transition-all duration-300">
                            <span className="absolute inset-0 rounded-full bg-[#13ec25]/5 opacity-0 group-hover:opacity-100 transition-opacity"></span>
                            <span className="relative flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#13ec25] opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-[#13ec25]"></span>
                            </span>
                            <span className="relative text-sm font-bold tracking-wide uppercase">✨ Jelajahi Kisah & Hikmahnya</span>
                            <span className="text-xl transition-transform group-hover:translate-x-1">→</span>
                        </button>
                    </Link>
                </div>



            </div>
        </main>
    )
}
