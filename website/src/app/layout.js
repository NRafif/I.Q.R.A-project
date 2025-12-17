/**
 * Root Layout Component
 * 
 * Root layout untuk seluruh aplikasi Next.js.
 * 
 * Responsibilities:
 * - Global metadata untuk SEO
 * - Error boundary untuk catch errors
 * - Global styles
 * - HTML structure
 * 
 * Security:
 * - suppressHydrationWarning untuk prevent warnings dari browser extensions
 * - Error boundary untuk prevent app crashes
 */

import './globals.css'
import { ErrorBoundary } from '@/components/ErrorBoundary'

/**
 * Global metadata untuk SEO
 * 
 * Mengapa metadata di sini?
 * - Default metadata untuk semua pages
 * - Template untuk dynamic metadata di child pages
 * - Open Graph dan Twitter Card untuk social sharing
 */
export const metadata = {
  title: {
    default: 'I.Q.R.A - Intelligent Quick-Response Arboretum',
    template: '%s | I.Q.R.A',
  },
  description: 'Sistem Informasi Digital Pohon - Belajar tentang pohon melalui teknologi QR Code. Mengubah pohon yang diam menjadi berbicara melalui teknologi.',
  keywords: ['I.Q.R.A', 'arboretum', 'pohon', 'edukasi lingkungan', 'QR Code', 'digital information system', 'Indonesia'],
  authors: [{ name: 'I.Q.R.A Team' }],
  creator: 'I.Q.R.A Project',
  publisher: 'I.Q.R.A Project',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'),
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: '/',
    siteName: 'I.Q.R.A - Intelligent Quick-Response Arboretum',
    title: 'I.Q.R.A - Intelligent Quick-Response Arboretum',
    description: 'Sistem Informasi Digital Pohon - Belajar tentang pohon melalui teknologi QR Code',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'I.Q.R.A - Intelligent Quick-Response Arboretum',
    description: 'Sistem Informasi Digital Pohon - Belajar tentang pohon melalui teknologi QR Code',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  )
}
