import { render, screen, waitFor } from '@testing-library/react'
import Navigation from '../Navigation'

// Mock usePathname
const mockUsePathname = jest.fn(() => '/tree/1')
jest.mock('next/navigation', () => ({
  usePathname: () => mockUsePathname(),
}))

describe('Navigation Component', () => {
  beforeEach(() => {
    // Reset mock before each test
    mockUsePathname.mockReturnValue('/tree/1')
  })

  it('should render navigation link when not on homepage', async () => {
    mockUsePathname.mockReturnValue('/tree/1')
    render(<Navigation />)
    
    // Wait for component to mount (Navigation has mounted state)
    // Note: Link has role="button" so we use getByRole('button') or getByLabelText
    await waitFor(() => {
      const link = screen.getByLabelText(/kembali ke halaman beranda/i)
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href', '/')
      expect(link).toHaveAttribute('role', 'button')
    })
  })

  it('should not render navigation link when on homepage', async () => {
    mockUsePathname.mockReturnValue('/')

    render(<Navigation />)
    
    // Wait for component to mount
    await waitFor(() => {
      // Link has role="button", so we check for button role
      const link = screen.queryByRole('button', { name: /kembali ke halaman beranda/i })
      expect(link).not.toBeInTheDocument()
    })
  })

  it('should have proper accessibility attributes', async () => {
    mockUsePathname.mockReturnValue('/tree/1')
    render(<Navigation />)
    
    // Wait for component to mount
    await waitFor(() => {
      // Link has role="button" so we use getByLabelText or getByRole('button')
      const link = screen.getByLabelText(/kembali ke halaman beranda/i)
      expect(link).toHaveAttribute('aria-label', 'Kembali ke halaman beranda')
      expect(link).toHaveAttribute('role', 'button')
      expect(link).toHaveAttribute('tabIndex', '0')
    })
  })
})

