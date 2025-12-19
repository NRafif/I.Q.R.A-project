'use client'

/**
 * JournalCard Component
 * 
 * Komponen kartu multifungsi untuk halaman detail pohon dengan tema "Botanical Journal".
 * 
 * Variants:
 * 1. 'identity' (Dark Navy): Untuk header info utama.
 * 2. 'root' (Dark Green): Untuk section akar/intro.
 * 3. 'history' (Paper/Beige): Untuk sejarah/asal-usul, fun facts.
 * 4. 'ecology' (Light): Untuk manfaat ekologis.
 * 5. 'insight' (Dark Grey): Untuk filosofi/religius.
 * 
 * @param {Object} props
 * @param {'identity'|'root'|'history'|'ecology'|'insight'} props.variant - Card style variant
 * @param {string} props.title - Main title
 * @param {string} props.badgeText - Text for badge/label (e.g., "SEJARAH", "Islamic Insight")
 * @param {string|React.ReactNode} props.content - Body content
 * @param {string[]} props.tags - Array of tag strings
 * @param {string} props.icon - Emoji or icon
 * @component
 */

import { motion } from 'framer-motion'

export default function JournalCard({
    variant = 'ecology',
    title,
    badgeText,
    subtitle,
    content,
    tags = [],
    icon,
    className = '',
    ...props
}) {

    const baseStyles = "rounded-3xl p-8 transition-transform hover:scale-[1.01] duration-500"

    const variants = {
        // Dark Navy - Compact Identity Card
        identity: {
            wrapper: "bg-[#1e293b] text-white max-w-sm shadow-xl border border-white/10",
            badge: "text-emerald-400 font-bold tracking-widest text-xs uppercase mb-2",
            title: "font-serif text-3xl font-bold mb-1 text-white",
            subtitle: "font-serif italic text-gray-400 text-sm mb-3",
            content: "text-gray-300 text-sm",
            footer: "flex items-center gap-2 text-gray-300 text-sm mt-4",
        },

        // Dark Green - Root/Start Card
        root: {
            wrapper: "bg-[#1f4028] text-white text-center shadow-2xl border border-white/10 max-w-lg mx-auto",
            badge: "flex items-center justify-center gap-2 text-gray-300 text-sm mb-4 font-medium",
            title: "font-serif text-4xl font-bold mb-4 text-white",
            subtitle: "",
            content: "text-gray-200 leading-relaxed font-light text-sm md:text-base",
            footer: "",
        },

        // Paper/Beige - History/Facts Card (Image 0 - Asal Usul)
        history: {
            wrapper: "bg-[#e8e6dc] text-[#2c2c2c] text-center shadow-lg max-w-md mx-auto relative",
            badge: "inline-block bg-[#a8e6cf] text-[#1a5c3a] px-4 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-4",
            title: "font-serif text-2xl md:text-3xl font-bold mb-4 text-[#1a1a1a]",
            subtitle: "",
            content: "text-[#4a4a4a] leading-relaxed text-sm md:text-base font-light",
            footer: "",
        },

        // Light/White - Ecology Card (Image 2)
        ecology: {
            wrapper: "bg-[#f1f3f0]/95 backdrop-blur-sm text-[#1a1a1a] shadow-lg max-w-lg mx-auto border border-white",
            badge: "",
            title: "font-serif text-2xl font-bold mb-4 text-[#1a3826]",
            subtitle: "",
            content: "text-[#4a554a] leading-relaxed text-sm md:text-base mb-6",
            footer: "flex flex-wrap gap-2 mt-4",
            tagItem: "bg-[#d1fae5] text-[#065f46] px-3 py-1 rounded-full text-xs font-medium",
        },

        // Dark Grey - Islamic Insight Card (Image 1)
        insight: {
            wrapper: "bg-[#1c1917] text-white shadow-xl border border-white/5 max-w-md mx-auto relative",
            badge: "inline-block bg-[#00a86b] text-white px-4 py-1.5 rounded-full text-sm font-semibold mb-6",
            title: "font-serif text-2xl md:text-3xl font-bold mb-6 text-[#e8f3ee]",
            subtitle: "",
            content: "border-l-2 border-[#00a86b] pl-6 italic text-gray-300 leading-relaxed text-sm md:text-base",
            footer: "",
        }
    }

    const currentVariant = variants[variant] || variants.ecology

    return (
        <motion.div
            className={`${baseStyles} ${currentVariant.wrapper} ${className}`}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            {...props}
        >
            {/* Badge/Label Area */}
            {badgeText && currentVariant.badge && (
                <div className={currentVariant.badge}>
                    {icon && variant === 'root' && <span>{icon}</span>}
                    {badgeText}
                </div>
            )}

            {/* Ecology Card: Custom Icon Header */}
            {variant === 'ecology' && icon && (
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-[#dcfce7] flex items-center justify-center shadow-sm">
                        <span className="text-lg">{icon}</span>
                    </div>
                    <span className="text-xs text-[#4a7c59] font-semibold uppercase tracking-wider">Manfaat</span>
                </div>
            )}

            {/* Main Title */}
            {title && <h3 className={currentVariant.title}>{title}</h3>}

            {/* Subtitle (identity only) */}
            {variant === 'identity' && subtitle && (
                <p className={currentVariant.subtitle}>{subtitle}</p>
            )}

            {/* Content Body */}
            {content && (
                <div className={currentVariant.content}>
                    {variant === 'insight' ? `"${content}"` : content}
                </div>
            )}

            {/* Tags (ecology only) */}
            {variant === 'ecology' && tags.length > 0 && (
                <div className={currentVariant.footer}>
                    {tags.map((tag, idx) => (
                        <span key={idx} className={currentVariant.tagItem}>
                            {tag}
                        </span>
                    ))}
                </div>
            )}

            {/* Identity Footer */}
            {variant === 'identity' && (
                <div className={currentVariant.footer}>
                    <span className="text-red-400">📍</span>
                    <span>{tags[1] || 'Lokasi'}</span>
                </div>
            )}

            {/* Insight Decorative Icon */}
            {variant === 'insight' && (
                <div className="absolute top-6 right-6 opacity-30 text-3xl">
                    ☪️
                </div>
            )}

            {/* Root Scroll Indicator */}
            {variant === 'root' && (
                <div className="mt-8 text-center animate-bounce">
                    <span className="block text-sm text-[#86efac] mb-1">Scroll ke atas untuk menjelajah</span>
                    <span className="text-2xl text-[#86efac]">↑</span>
                </div>
            )}

        </motion.div>
    )
}
