'use client'

/**
 * Navbar Component
 * 
 * Navigation bar untuk homepage dengan desain glassmorphism.
 * 
 * Features:
 * - Fixed position dengan backdrop blur
 * - Responsive (hamburger menu di mobile)
 * - Smooth scroll ke sections
 * 
 * @component
 */

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
    const pathname = usePathname()
    const [mounted, setMounted] = useState(false)
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const isHomePage = pathname === '/'

    /**
     * Hydration mismatch prevention
     */
    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) {
        return null
    }

    const navLinks = [
        { href: '/', label: 'Beranda' },
        { href: '#trees', label: 'Koleksi' },
        { href: '#about', label: 'Tentang' },
    ]

    return (
        <nav className="fixed w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 py-4">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link
                    href="/"
                    className="font-serif text-2xl font-bold text-primary tracking-wide focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                    aria-label="I.Q.R.A - Kembali ke beranda"
                >
                    I.Q.R.A.
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex space-x-8 text-sm font-medium text-text-main">
                    {navLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 rounded px-2 py-1"
                        >
                            {link.label}
                        </Link>
                    ))}
                </div>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden text-text-main p-2 focus:outline-none focus:ring-2 focus:ring-primary/50 rounded"
                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                    aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
                    aria-expanded={isMenuOpen}
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        {isMenuOpen ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        )}
                    </svg>
                </button>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white border-t border-gray-100 py-4">
                    <div className="max-w-7xl mx-auto px-6 flex flex-col space-y-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="text-text-main hover:text-primary transition-colors py-2"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </nav>
    )
}
