/**
 * JournalCard Component Tests
 * 
 * Tests untuk JournalCard component dengan berbagai variants.
 * Updated to match actual component implementation.
 */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }) => (
            <div className={className} data-testid="journal-card" {...props}>{children}</div>
        ),
    },
}))

// Import component after mocks
import JournalCard from '../JournalCard'

describe('JournalCard', () => {
    describe('Identity Variant', () => {
        it('renders title and subtitle correctly', () => {
            render(
                <JournalCard
                    variant="identity"
                    title="Rambutan"
                    subtitle="Nephelium lappaceum"
                    badgeText="SAPINDACEAE"
                />
            )

            expect(screen.getByText('Rambutan')).toBeInTheDocument()
            expect(screen.getByText('Nephelium lappaceum')).toBeInTheDocument()
            expect(screen.getByText('SAPINDACEAE')).toBeInTheDocument()
        })

        it('applies identity variant styling', () => {
            render(<JournalCard variant="identity" title="Test" />)

            const card = screen.getByTestId('journal-card')
            expect(card.className).toContain('bg-[#1e293b]')
            expect(card.className).toContain('text-white')
        })

        it('shows location footer', () => {
            render(
                <JournalCard
                    variant="identity"
                    title="Test"
                    tags={['Family', 'Location A']}
                />
            )

            expect(screen.getByText('📍')).toBeInTheDocument()
        })
    })

    describe('Root Variant', () => {
        it('renders title and content', () => {
            render(
                <JournalCard
                    variant="root"
                    title="Mulai Dari Sini"
                    content="Deskripsi pohon"
                    badgeText="🌱 Awal Perjalanan"
                />
            )

            expect(screen.getByText('Mulai Dari Sini')).toBeInTheDocument()
            expect(screen.getByText('Deskripsi pohon')).toBeInTheDocument()
            expect(screen.getByText('🌱 Awal Perjalanan')).toBeInTheDocument()
        })

        it('shows scroll indicator', () => {
            render(<JournalCard variant="root" title="Test" />)

            expect(screen.getByText(/Scroll ke atas/i)).toBeInTheDocument()
            expect(screen.getByText('↑')).toBeInTheDocument()
        })

        it('applies root variant styling', () => {
            render(<JournalCard variant="root" title="Test" />)

            const card = screen.getByTestId('journal-card')
            expect(card.className).toContain('bg-[#1f4028]')
        })
    })

    describe('History Variant', () => {
        it('renders badge and title', () => {
            render(
                <JournalCard
                    variant="history"
                    title="Asal Usul"
                    badgeText="SEJARAH"
                    content="Konten sejarah"
                />
            )

            expect(screen.getByText('SEJARAH')).toBeInTheDocument()
            expect(screen.getByText('Asal Usul')).toBeInTheDocument()
            expect(screen.getByText('Konten sejarah')).toBeInTheDocument()
        })

        it('applies history variant styling', () => {
            render(<JournalCard variant="history" title="Test" />)

            const card = screen.getByTestId('journal-card')
            expect(card.className).toContain('bg-[#e8e6dc]')
        })
    })

    describe('Ecology Variant', () => {
        it('renders tags correctly', () => {
            const tags = ['Ekologi', 'Lingkungan', 'Konservasi']

            render(
                <JournalCard
                    variant="ecology"
                    title="Manfaat Ekologis"
                    content="Deskripsi manfaat"
                    tags={tags}
                />
            )

            expect(screen.getByText('Ekologi')).toBeInTheDocument()
            expect(screen.getByText('Lingkungan')).toBeInTheDocument()
            expect(screen.getByText('Konservasi')).toBeInTheDocument()
        })

        it('renders icon with Manfaat label when icon provided', () => {
            render(
                <JournalCard
                    variant="ecology"
                    title="Test"
                    icon="🌿"
                />
            )

            expect(screen.getByText('🌿')).toBeInTheDocument()
            expect(screen.getByText('Manfaat')).toBeInTheDocument()
        })

        it('applies ecology variant styling', () => {
            render(<JournalCard variant="ecology" title="Test" />)

            const card = screen.getByTestId('journal-card')
            expect(card.className).toContain('bg-[#f1f3f0]')
        })
    })

    describe('Insight Variant', () => {
        it('renders content with quotes', () => {
            render(
                <JournalCard
                    variant="insight"
                    title="Hikmah Islami"
                    content="Kandungan hikmah"
                    badgeText="Islamic Insight"
                />
            )

            // Content wrapped in quotes for insight variant
            expect(screen.getByText(/"Kandungan hikmah"/)).toBeInTheDocument()
            expect(screen.getByText('Islamic Insight')).toBeInTheDocument()
        })

        it('shows decorative crescent icon', () => {
            render(<JournalCard variant="insight" title="Test" />)

            expect(screen.getByText('☪️')).toBeInTheDocument()
        })

        it('applies insight variant styling', () => {
            render(<JournalCard variant="insight" title="Test" />)

            const card = screen.getByTestId('journal-card')
            expect(card.className).toContain('bg-[#1c1917]')
        })
    })

    describe('Default Behavior', () => {
        it('defaults to ecology variant when no variant specified', () => {
            render(<JournalCard title="Test Title" content="Test content" />)

            const card = screen.getByTestId('journal-card')
            expect(card.className).toContain('bg-[#f1f3f0]')
        })

        it('accepts and applies custom className', () => {
            render(<JournalCard title="Test" className="custom-class" />)

            const card = screen.getByTestId('journal-card')
            expect(card.className).toContain('custom-class')
        })
    })

    describe('Base Styling', () => {
        it('has rounded corners', () => {
            render(<JournalCard title="Test" />)

            const card = screen.getByTestId('journal-card')
            expect(card.className).toContain('rounded-2xl')
        })

        it('has padding', () => {
            render(<JournalCard title="Test" />)

            const card = screen.getByTestId('journal-card')
            expect(card.className).toContain('p-4')
        })
    })
})
