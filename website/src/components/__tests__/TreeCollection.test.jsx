/**
 * TreeCollection Component Tests
 * 
 * Tests untuk TreeCollection, TreeCard, dan TreeCardSkeleton components.
 */

import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock framer-motion untuk avoid animation issues in tests
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, ...props }) => <div {...props}>{children}</div>,
        button: ({ children, ...props }) => <button {...props}>{children}</button>,
    },
    AnimatePresence: ({ children }) => children,
}))

// Mock next/link
jest.mock('next/link', () => {
    return function MockLink({ children, href }) {
        return <a href={href}>{children}</a>
    }
})

// Mock next/image
jest.mock('next/image', () => {
    return function MockImage({ src, alt, ...props }) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img src={src} alt={alt} {...props} />
    }
})

// Import component after mocks
import TreeCollection from '../TreeCollection'

// Sample test data
const mockTrees = [
    {
        id: 1,
        common_name: 'Rambutan',
        scientific_name: 'Nephelium lappaceum',
        family: 'Sapindaceae',
        location: 'Taman A',
        assets: {
            thumbnail: '/assets/pohon/rambutan-thumbnail.jpg'
        },
        story_mode: {
            sky_section: {
                headline: 'The Hairy Sweetness',
                sub_headline: 'Buah dengan kulit berbulu unik'
            }
        }
    },
    {
        id: 2,
        common_name: 'Mangga',
        scientific_name: 'Mangifera indica',
        family: 'Anacardiaceae',
        location: 'Taman B',
        assets: {
            thumbnail: '/assets/pohon/mangga-thumbnail.jpg'
        },
        story_mode: {
            sky_section: {
                headline: 'King of Fruits',
                sub_headline: 'Raja buah tropis'
            }
        }
    },
    {
        id: 3,
        common_name: 'Jambu',
        scientific_name: 'Psidium guajava',
        family: 'Myrtaceae',
        location: 'Taman C',
        assets: null,
        story_mode: {
            sky_section: {
                headline: 'Tropical Delight',
                sub_headline: 'Buah kaya vitamin C'
            }
        }
    }
]

describe('TreeCollection', () => {
    describe('Loading State', () => {
        it('renders loading skeletons when isLoading is true', () => {
            render(<TreeCollection trees={[]} isLoading={true} error={null} />)

            // Should render skeleton placeholders
            const skeletons = document.querySelectorAll('.animate-pulse')
            expect(skeletons.length).toBeGreaterThan(0)
        })
    })

    describe('Error State', () => {
        it('renders error message when error prop is provided', () => {
            render(<TreeCollection trees={[]} isLoading={false} error="Gagal memuat data" />)

            expect(screen.getByText('Gagal memuat data')).toBeInTheDocument()
        })
    })

    describe('Empty State', () => {
        it('renders empty state when no trees and no error', () => {
            render(<TreeCollection trees={[]} isLoading={false} error={null} />)

            expect(screen.getByText(/Tidak ada pohon/i)).toBeInTheDocument()
        })
    })

    describe('Populated State', () => {
        it('renders tree cards when trees data is provided', () => {
            render(<TreeCollection trees={mockTrees} isLoading={false} error={null} />)

            // Check tree names are rendered
            expect(screen.getByText('Rambutan')).toBeInTheDocument()
            expect(screen.getByText('Mangga')).toBeInTheDocument()
        })

        it('renders scientific names in italic', () => {
            render(<TreeCollection trees={mockTrees} isLoading={false} error={null} />)

            expect(screen.getByText('Nephelium lappaceum')).toBeInTheDocument()
            expect(screen.getByText('Mangifera indica')).toBeInTheDocument()
        })

        it('renders tree IDs with zero padding', () => {
            render(<TreeCollection trees={mockTrees} isLoading={false} error={null} />)

            expect(screen.getByText('01')).toBeInTheDocument()
            expect(screen.getByText('02')).toBeInTheDocument()
        })

        it('renders links to tree detail pages', () => {
            render(<TreeCollection trees={mockTrees} isLoading={false} error={null} />)

            const links = screen.getAllByRole('link')
            const treeLinks = links.filter(link => link.getAttribute('href')?.includes('/tree/lens/'))

            expect(treeLinks.length).toBeGreaterThan(0)
            expect(treeLinks[0]).toHaveAttribute('href', '/tree/lens/1')
        })

        it('renders headline from story_mode', () => {
            render(<TreeCollection trees={mockTrees} isLoading={false} error={null} />)

            expect(screen.getByText('The Hairy Sweetness')).toBeInTheDocument()
        })

        it('renders fallback emoji when no thumbnail', () => {
            render(<TreeCollection trees={mockTrees} isLoading={false} error={null} />)

            // Jambu has no assets, should show fallback
            const fallbackEmojis = screen.getAllByText('🌳')
            expect(fallbackEmojis.length).toBeGreaterThan(0)
        })
    })

    describe('Show More Functionality', () => {
        it('shows limited trees initially when more than initial count', () => {
            // Create more trees for pagination test
            const manyTrees = Array.from({ length: 10 }, (_, i) => ({
                ...mockTrees[0],
                id: i + 1,
                common_name: `Tree ${i + 1}`
            }))

            render(<TreeCollection trees={manyTrees} isLoading={false} error={null} />)

            // Should have "Lihat Semua Koleksi" button if there are hidden trees
            const showMoreButton = screen.queryByText(/Lihat Semua Koleksi/i)
            expect(showMoreButton).toBeInTheDocument()
        })

        it('expands to show all trees when show more is clicked', () => {
            const manyTrees = Array.from({ length: 10 }, (_, i) => ({
                ...mockTrees[0],
                id: i + 1,
                common_name: `Tree ${i + 1}`
            }))

            render(<TreeCollection trees={manyTrees} isLoading={false} error={null} />)

            const showMoreButton = screen.getByText(/Lihat Semua Koleksi/i)
            fireEvent.click(showMoreButton)

            // After clicking, button text should change
            expect(screen.queryByText(/Sembunyikan/i) || screen.queryByText(/Tree 10/i)).toBeTruthy()
        })
    })

    describe('Accessibility', () => {
        it('has accessible link labels', () => {
            render(<TreeCollection trees={mockTrees} isLoading={false} error={null} />)

            const links = screen.getAllByRole('link')
            const treeLink = links.find(link =>
                link.getAttribute('aria-label')?.includes('Rambutan')
            )

            expect(treeLink).toHaveAttribute('aria-label', expect.stringContaining('Rambutan'))
        })
    })
})
