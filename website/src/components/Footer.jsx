/**
 * Footer Component
 * 
 * Footer untuk homepage dengan navigation dan contact info.
 * 
 * Features:
 * - Multi-column layout
 * - Navigation links
 * - Contact information
 * - Copyright notice
 * 
 * Note: Komponen ini bukan 'use client' karena tidak memerlukan interactivity
 * 
 * @component
 */

import Link from 'next/link'

export default function Footer() {
    return (
        <footer className="bg-primary text-white py-20 border-t border-primary/10">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12">
                {/* Brand */}
                <div className="md:col-span-2">
                    <h3 className="font-serif text-3xl font-bold mb-6">I.Q.R.A.</h3>
                    <p className="text-white/70 max-w-sm leading-relaxed font-light">
                        Intelligent Quick-Response Arboretum. Sebuah inisiatif digital untuk
                        mendekatkan manusia dengan alam melalui teknologi dan edukasi.
                    </p>
                </div>

                {/* Navigation */}
                <nav aria-label="Footer navigation">
                    <h4 className="font-semibold mb-6 tracking-wider uppercase text-sm text-white/90">
                        Navigasi
                    </h4>
                    <ul className="space-y-4 text-white/60 font-light">
                        <li>
                            <Link href="/" className="hover:text-white transition-colors">
                                Beranda
                            </Link>
                        </li>
                        <li>
                            <Link href="#trees" className="hover:text-white transition-colors">
                                Koleksi Pohon
                            </Link>
                        </li>
                        <li>
                            <Link href="#about" className="hover:text-white transition-colors">
                                Tentang Kami
                            </Link>
                        </li>
                    </ul>
                </nav>

                {/* Contact */}
                <div>
                    <h4 className="font-semibold mb-6 tracking-wider uppercase text-sm text-white/90">
                        Kontak
                    </h4>
                    <ul className="space-y-4 text-white/60 font-light">
                        <li className="flex items-center gap-3">
                            <span aria-hidden="true">📧</span>
                            <span>info@iqra-arboretum.id</span>
                        </li>
                        <li className="flex items-center gap-3">
                            <span aria-hidden="true">📍</span>
                            <span>Student One, Indonesia</span>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Copyright */}
            <div className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center text-sm text-white/40">
                <p>© 2025 I.Q.R.A Project. All rights reserved.</p>
                <p className="mt-2 md:mt-0">Designed with nature in mind.</p>
            </div>
        </footer>
    )
}
