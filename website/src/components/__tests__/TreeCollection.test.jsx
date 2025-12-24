/**
 * TreeCollection Component Tests
 * 
 * Tests untuk TreeCollection, TreeCard, dan TreeCardSkeleton components.
 * Updated to match actual component implementation.
 */

import { render, screen, fireEvent } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }) => <div className={className} {...props}>{children}</div>,
        h2: ({ children, className, ...props }) => <h2 className={className} {...props}>{children}</h2>,
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
            const { container } = render(<TreeCollection trees={[]} isLoading={true} error={null} />)

            // Should render skeleton placeholders with animate-pulse
            const skeletons = container.querySelectorAll('.animate-pulse')
            expect(skeletons.length).toBeGreaterThan(0)
        })
    })

    describe('Error State', () => {
        it('renders error message when error prop is provided', () => {
            render(<TreeCollection trees={[]} isLoading={false} error="Gagal memuat data" />)

            expect(screen.getByText(/Gagal memuat data/i)).toBeInTheDocument()
        })

        it('shows refresh button on error', () => {
            render(<TreeCollection trees={[]} isLoading={false} error="Error" />)

            expect(screen.getByText('Refresh Halaman')).toBeInTheDocument()
        })
    })

    describe('Empty State', () => {
        it('renders empty state message when no trees', () => {
            render(<TreeCollection trees={[]} isLoading={false} error={null} />)

            expect(screen.getByText(/Tidak ada data pohon/i)).toBeInTheDocument()
        })
    })

    describe('Populated State', () => {
        it('renders tree names', () => {
            render(<TreeCollection trees={mockTrees} isLoading={false} error={null} />)

            expect(screen.getByText('Rambutan')).toBeInTheDocument()
            expect(screen.getByText('Mangga')).toBeInTheDocument()
        })

        it('renders scientific names', () => {
            render(<TreeCollection trees={mockTrees} isLoading={false} error={null} />)

            expect(screen.getByText('Nephelium lappaceum')).toBeInTheDocument()
            expect(screen.getByText('Mangifera indica')).toBeInTheDocument()
        })

        it('renders tree IDs with zero padding', () => {
            render(<TreeCollection trees={mockTrees} isLoading={false} error={null} />)

            expect(screen.getByText('01')).toBeInTheDocument()
            expect(screen.getByText('02')).toBeInTheDocument()
        })

        it('renders links to tree lens pages', () => {
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

            // Jambu has null assets, should show fallback
            const fallbackEmojis = screen.getAllByText('🌳')
            expect(fallbackEmojis.length).toBeGreaterThan(0)
        })

        it('renders location badges', () => {
            render(<TreeCollection trees={mockTrees} isLoading={false} error={null} />)

            expect(screen.getByText('Taman A')).toBeInTheDocument()
            expect(screen.getByText('Taman B')).toBeInTheDocument()
        })
    })

    describe('Show More Functionality', () => {
        it('shows Lihat Semua button when more than 6 trees', () => {
            // Create 10 trees for pagination test
            const manyTrees = Array.from({ length: 10 }, (_, i) => ({
                ...mockTrees[0],
                id: i + 1,
                common_name: `Tree ${i + 1}`
            }))

            render(<TreeCollection trees={manyTrees} isLoading={false} error={null} />)

            expect(screen.getByText(/Lihat Semua Koleksi/i)).toBeInTheDocument()
        })

        it('shows Sembunyikan button after clicking show more', () => {
            const manyTrees = Array.from({ length: 10 }, (_, i) => ({
                ...mockTrees[0],
                id: i + 1,
                common_name: `Tree ${i + 1}`
            }))

            render(<TreeCollection trees={manyTrees} isLoading={false} error={null} />)

            const showMoreButton = screen.getByText(/Lihat Semua Koleksi/i)
            fireEvent.click(showMoreButton)

            expect(screen.getByText(/Sembunyikan/i)).toBeInTheDocument()
        })

        it('does not show button if 6 or fewer trees', () => {
            render(<TreeCollection trees={mockTrees} isLoading={false} error={null} />)

            expect(screen.queryByText(/Lihat Semua Koleksi/i)).not.toBeInTheDocument()
        })
    })

    describe('Section Structure', () => {
        it('renders section header', () => {
            render(<TreeCollection trees={mockTrees} isLoading={false} error={null} />)

            expect(screen.getByText('Koleksi Pohon')).toBeInTheDocument()
            expect(screen.getByText('Flora Library')).toBeInTheDocument()
        })
    })

    describe('Accessibility', () => {
        it('has accessible link labels', () => {
            render(<TreeCollection trees={mockTrees} isLoading={false} error={null} />)

            const links = screen.getAllByRole('link')
            const treeLink = links.find(link =>
                link.getAttribute('aria-label')?.includes('Rambutan')
            )

            expect(treeLink).toHaveAttribute('aria-label', expect.stringContaining('Pelajari tentang Rambutan'))
        })
    })
})
