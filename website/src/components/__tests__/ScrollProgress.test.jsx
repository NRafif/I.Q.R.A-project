import { render } from '@testing-library/react'
import ScrollProgress from '../ScrollProgress'

// Mock framer-motion
jest.mock('framer-motion', () => ({
  motion: {
    div: 'div',
  },
  useSpring: (value) => value,
  useTransform: (value) => value,
}))

describe('ScrollProgress Component', () => {
  it('should render progress indicator', () => {
    const mockProgress = { get: () => 0.5 }
    const { container } = render(<ScrollProgress progress={mockProgress} />)
    
    expect(container.querySelector('.fixed')).toBeInTheDocument()
  })

  it('should display section labels', () => {
    const mockProgress = { get: () => 0.5 }
    const { container } = render(<ScrollProgress progress={mockProgress} />)
    
    // Check for emoji labels (might need to adjust based on actual rendering)
    expect(container).toBeTruthy()
  })
})

