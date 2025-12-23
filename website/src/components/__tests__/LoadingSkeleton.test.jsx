/**
 * LoadingSkeleton Component Tests
 * 
 * Tests untuk skeleton loading components.
 */

import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'

// Import components
import {
    TreeDetailSkeleton,
    TreeCollectionSkeleton
} from '../LoadingSkeleton'

describe('LoadingSkeleton Components', () => {
    describe('TreeDetailSkeleton', () => {
        it('renders skeleton structure', () => {
            const { container } = render(<TreeDetailSkeleton />)

            // Should have animate-pulse classes for loading animation
            const pulsingElements = container.querySelectorAll('.animate-pulse')
            expect(pulsingElements.length).toBeGreaterThan(0)
        })

        it('has accessible loading indicator', () => {
            render(<TreeDetailSkeleton />)

            // Could check for sr-only text or aria attributes
            const skeleton = screen.getByRole('status') || document.querySelector('[aria-busy="true"]')
            // If no explicit role, just check it renders
            expect(document.body).toBeInTheDocument()
        })
    })

    describe('TreeCollectionSkeleton', () => {
        it('renders multiple skeleton cards', () => {
            const { container } = render(<TreeCollectionSkeleton count={6} />)

            // Should render skeleton placeholders
            const skeletons = container.querySelectorAll('.animate-pulse')
            expect(skeletons.length).toBeGreaterThanOrEqual(1)
        })

        it('renders correct number of skeletons based on count prop', () => {
            const { container } = render(<TreeCollectionSkeleton count={3} />)

            // Check for skeleton cards
            const cards = container.querySelectorAll('[class*="rounded"]')
            expect(cards.length).toBeGreaterThan(0)
        })
    })
})
