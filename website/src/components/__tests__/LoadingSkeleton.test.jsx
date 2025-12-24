/**
 * LoadingSkeleton Component Tests
 * 
 * Tests untuk skeleton loading components.
 * Updated to match actual component implementation.
 */

import { render } from '@testing-library/react'
import '@testing-library/jest-dom'

// Mock framer-motion
jest.mock('framer-motion', () => ({
    motion: {
        div: ({ children, className, ...props }) => (
            <div className={className} {...props}>{children}</div>
        ),
    },
}))

// Import components after mocks
import { TreeCardSkeleton, TreeDetailSkeleton, LoadingSpinner } from '../LoadingSkeleton'

describe('TreeCardSkeleton', () => {
    it('renders skeleton structure with animate-pulse', () => {
        const { container } = render(<TreeCardSkeleton />)

        // Should have animate-pulse classes for loading animation
        const pulsingElements = container.querySelectorAll('.animate-pulse')
        expect(pulsingElements.length).toBeGreaterThan(0)
    })

    it('has glass-dark rounded container', () => {
        const { container } = render(<TreeCardSkeleton />)

        const wrapper = container.firstChild
        expect(wrapper.className).toContain('glass-dark')
        expect(wrapper.className).toContain('rounded-xl')
    })
})

describe('TreeDetailSkeleton', () => {
    it('renders without crashing', () => {
        const { container } = render(<TreeDetailSkeleton />)

        // Should render a main element
        const main = container.querySelector('main')
        expect(main).toBeInTheDocument()
    })

    it('has min-h-screen for full page skeleton', () => {
        const { container } = render(<TreeDetailSkeleton />)

        const main = container.querySelector('main')
        expect(main.className).toContain('min-h-screen')
    })
})

describe('LoadingSpinner', () => {
    it('renders spinner with default size', () => {
        const { container } = render(<LoadingSpinner />)

        // Should have a rotating element
        const spinner = container.querySelector('.border-4')
        expect(spinner).toBeInTheDocument()
        expect(spinner.className).toContain('w-8')
        expect(spinner.className).toContain('h-8')
    })

    it('renders small spinner when size="sm"', () => {
        const { container } = render(<LoadingSpinner size="sm" />)

        const spinner = container.querySelector('.border-4')
        expect(spinner.className).toContain('w-4')
        expect(spinner.className).toContain('h-4')
    })

    it('renders large spinner when size="lg"', () => {
        const { container } = render(<LoadingSpinner size="lg" />)

        const spinner = container.querySelector('.border-4')
        expect(spinner.className).toContain('w-12')
        expect(spinner.className).toContain('h-12')
    })

    it('has rounded-full class for circular shape', () => {
        const { container } = render(<LoadingSpinner />)

        const spinner = container.querySelector('.border-4')
        expect(spinner.className).toContain('rounded-full')
    })
})
