'use client'

/**
 * AboutSection Component
 * 
 * Section "Tentang I.Q.R.A" yang menjelaskan filosofi proyek.
 * 
 * Features:
 * - Split layout dengan quote
 * - Three pillars: Teknologi, Religius, Filosofis
 * - Hover effects pada cards
 * 
 * @component
 */

import { motion } from 'framer-motion'

/**
 * PillarCard Component
 * Card untuk satu pilar filosofi
 */
function PillarCard({ icon, iconBg, iconColor, title, description, index }) {
    return (
        <motion.article
            className="bg-white p-10 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 group border-t-4 border-transparent hover:border-primary"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.15 }}
            role="article"
            aria-labelledby={`pillar-${index}-title`}
        >
            <div className={`mb-6 w-14 h-14 ${iconBg} rounded-full flex items-center justify-center group-hover:scale-110 transition-transform`}>
                <span className={`text-3xl ${iconColor}`} aria-hidden="true">{icon}</span>
            </div>
            <h3 id={`pillar-${index}-title`} className="text-xl font-serif font-bold mb-3 text-text-main">
                {title}
            </h3>
            <p className="text-gray-500 text-sm leading-relaxed">
                {description}
            </p>
        </motion.article>
    )
}

export default function AboutSection() {
    const pillars = [
        {
            icon: '🔬',
            iconBg: 'bg-blue-50 group-hover:bg-blue-100',
            iconColor: 'text-blue-600',
            title: 'Teknologi',
            description: 'Sistem identifikasi berbasis QR Code yang memberikan akses instan ke database botani komprehensif.'
        },
        {
            icon: '📖',
            iconBg: 'bg-amber-50 group-hover:bg-amber-100',
            iconColor: 'text-amber-600',
            title: 'Religius',
            description: 'Mengambil esensi "Iqra" — sebuah perintah fundamental untuk membaca, meneliti, dan memahami tanda-tanda alam.'
        },
        {
            icon: '🌿',
            iconBg: 'bg-green-50 group-hover:bg-green-100',
            iconColor: 'text-green-600',
            title: 'Filosofis',
            description: 'Memberikan suara pada yang diam. Mengajak manusia untuk merenungi kebijaksanaan yang tumbuh dalam diam.'
        }
    ]

    return (
        <section id="about" className="py-32 bg-bg-subtle relative overflow-hidden" aria-labelledby="about-heading">
            {/* Background decoration */}
            <div
                className="absolute left-0 top-0 w-64 h-64 bg-primary/5 rounded-br-full -z-0"
                aria-hidden="true"
            />

            <div className="max-w-6xl mx-auto px-6 relative z-10">
                {/* Header and Quote */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-20">
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="text-primary text-sm font-semibold tracking-[0.2em] uppercase block mb-3">
                            Tentang I.Q.R.A
                        </span>
                        <h2
                            id="about-heading"
                            className="font-serif text-4xl md:text-5xl font-medium text-text-main mb-6 leading-tight"
                        >
                            Menjembatani Alam & <br />Teknologi
                        </h2>
                        <p className="text-text-muted text-lg font-light leading-relaxed">
                            Proyek ini bertujuan untuk menciptakan interaksi bermakna antara manusia
                            dan tumbuhan melalui integrasi QR Code dan informasi digital yang mendalam.
                        </p>
                    </motion.div>

                    <motion.div
                        className="relative h-64 md:h-full bg-white rounded-2xl shadow-soft p-8 flex items-center justify-center"
                        initial={{ opacity: 0, x: 30 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                    >
                        <p className="font-serif text-2xl text-center italic text-primary">
                            "Alam tidak bisu, kita hanya perlu belajar bahasanya."
                        </p>
                    </motion.div>
                </div>

                {/* Three Pillars */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {pillars.map((pillar, index) => (
                        <PillarCard key={index} {...pillar} index={index} />
                    ))}
                </div>
            </div>
        </section>
    )
}
