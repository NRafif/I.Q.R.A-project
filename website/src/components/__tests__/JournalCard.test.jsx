/**
 * JournalCard Component Tests
 * 
 * Tests untuk JournalCard component dengan berbagai variants.
 */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }) => (
            <div className={className} {...props}>{children}</div>
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

        it('applies dark navy styling', () => {
            const { container } = render(
                <JournalCard variant="identity" title="Test" />
            )

            const card = container.firstChild
            expect(card.className).toContain('bg-[#1e293b]')
        })
    })

    describe('Root Variant', () => {
        it('renders with centered text', () => {
            render(
                <JournalCard
                    variant="root"
                    title="Mulai Dari Sini"
                    content="Deskripsi pohon"
                    badgeText="🌱 Awal Perjalanan"
                    icon="🌱"
                />
            )

            expect(screen.getByText('Mulai Dari Sini')).toBeInTheDocument()
            expect(screen.getByText('Deskripsi pohon')).toBeInTheDocument()
        })

        it('shows scroll indicator', () => {
            render(
                <JournalCard variant="root" title="Test" />
            )

            expect(screen.getByText(/Scroll ke atas/i)).toBeInTheDocument()
        })

        it('applies dark green styling', () => {
            const { container } = render(
                <JournalCard variant="root" title="Test" />
            )

            const card = container.firstChild
            expect(card.className).toContain('bg-[#1f4028]')
        })
    })

    describe('History Variant', () => {
        it('renders badge with correct styling', () => {
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
        })

        it('applies beige/paper styling', () => {
            const { container } = render(
                <JournalCard variant="history" title="Test" />
            )

            const card = container.firstChild
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
                    icon="🌿"
                />
            )

            expect(screen.getByText('Ekologi')).toBeInTheDocument()
            expect(screen.getByText('Lingkungan')).toBeInTheDocument()
            expect(screen.getByText('Konservasi')).toBeInTheDocument()
        })

        it('renders icon with manfaat label', () => {
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

        it('applies light/glass styling', () => {
            const { container } = render(
                <JournalCard variant="ecology" title="Test" />
            )

            const card = container.firstChild
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

            // Content should be wrapped in quotes for insight variant
            expect(screen.getByText(/"Kandungan hikmah"/)).toBeInTheDocument()
        })

        it('shows decorative icon', () => {
            render(
                <JournalCard variant="insight" title="Test" />
            )

            expect(screen.getByText('☪️')).toBeInTheDocument()
        })

        it('applies dark styling', () => {
            const { container } = render(
                <JournalCard variant="insight" title="Test" />
            )

            const card = container.firstChild
            expect(card.className).toContain('bg-[#1c1917]')
        })
    })

    describe('Default Behavior', () => {
        it('defaults to ecology variant when no variant specified', () => {
            const { container } = render(
                <JournalCard title="Test Title" content="Test content" />
            )

            const card = container.firstChild
            expect(card.className).toContain('bg-[#f1f3f0]')
        })

        it('accepts custom className', () => {
            const { container } = render(
                <JournalCard title="Test" className="custom-class" />
            )

            const card = container.firstChild
            expect(card.className).toContain('custom-class')
        })
    })

    describe('Responsive Styling', () => {
        it('has responsive padding classes', () => {
            const { container } = render(
                <JournalCard title="Test" />
            )

            const card = container.firstChild
            expect(card.className).toContain('p-4')
            expect(card.className).toContain('md:p-8')
        })

        it('has responsive border radius', () => {
            const { container } = render(
                <JournalCard title="Test" />
            )

            const card = container.firstChild
            expect(card.className).toContain('rounded-2xl')
            expect(card.className).toContain('md:rounded-3xl')
        })
    })
})
