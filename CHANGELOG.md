# Changelog - Perbaikan Prioritas Tinggi

## Perubahan yang Dilakukan

### 1. ✅ Update Dependencies
- **Next.js**: 14.0.0 → 16.0.10
- **React**: 18.2.0 → 19.2.3
- **React DOM**: 18.2.0 → 19.2.3
- **Framer Motion**: 10.16.0 → 11.0.0

### 2. ✅ Unifikasi Data JSON
- Menggunakan `trees_update.json` sebagai source utama data
- Data terpusat di `website/public/data/trees.json`
- QR generator menggunakan `trees_update.json` dengan fallback ke `trees.json`

### 3. ✅ Environment Variables
- Dibuat `.env.example` dan `.env.local` untuk website
- Base URL sekarang menggunakan `NEXT_PUBLIC_BASE_URL` environment variable
- QR generator script diupdate untuk membaca dari `.env`

### 4. ✅ Error Handling
- **Utility Functions** (`website/src/lib/data.js`):
  - `loadTreesData()` - Load data dengan error handling
  - `getTreeById()` - Get tree by ID dengan validasi
  - `validateTreeData()` - Validasi struktur data
  - `getDefaultTree()` - Fallback tree data

- **Error Pages**:
  - `error.js` - Global error boundary untuk Next.js
  - `not-found.js` - 404 page custom
  - `ErrorBoundary.jsx` - React Error Boundary component

- **Error Handling di Components**:
  - Homepage: Loading states, error messages, fallback UI
  - Tree Detail Page: Error handling untuk tree tidak ditemukan, data tidak valid

### 5. ✅ Loading States
- **LoadingSkeleton.jsx**:
  - `TreeCardSkeleton` - Skeleton untuk tree cards
  - `TreeDetailSkeleton` - Skeleton untuk tree detail page
  - `LoadingSpinner` - Spinner component dengan animasi

- **Loading States di Components**:
  - Homepage: Loading spinner saat fetch data
  - Tree Detail Page: Skeleton loader sebelum data loaded

### 6. ✅ QR Generator Updates
- Menggunakan environment variable untuk base URL
- Support untuk `.env` file
- Fallback ke default URL jika env tidak ada
- Requirements.txt untuk Python dependencies

### 7. ✅ Next.js 16 Compatibility
- Fix params Promise unwrapping dengan `React.use()`
- Hydration error fixes dengan `suppressHydrationWarning`
- Navigation component dengan mounted state

### 8. ✅ Navigation Menu
- Menu homepage di pojok kanan atas
- Hanya muncul di halaman selain homepage
- Animasi dan hover effects
- Accessibility compliant

---

## Perbaikan Prioritas Menengah

### 1. ✅ SEO Optimization
- **Dynamic Metadata** (`website/src/app/tree/[id]/layout.js`):
  - `generateMetadata()` function untuk metadata dinamis per pohon
  - Open Graph tags untuk social sharing
  - Twitter Card support
  - Canonical URLs
  - Keywords optimization

- **Root Layout Metadata** (`website/src/app/layout.js`):
  - Enhanced metadata dengan template
  - Open Graph configuration
  - Twitter Card configuration
  - Robots configuration
  - MetadataBase untuk absolute URLs

### 2. ✅ Performance Optimization
- **Next.js Image Configuration** (`website/next.config.js`):
  - Image optimization enabled
  - Device sizes configuration
  - Image sizes configuration
  - AVIF and WebP format support

- **Image Loading**:
  - Decorative images menggunakan `role="presentation"` dan `aria-hidden="true"`
  - Proper alt text untuk semantic images
  - Lazy loading untuk non-critical images
  - Priority loading untuk above-the-fold images

### 3. ✅ Accessibility (A11y)
- **ARIA Labels**:
  - `aria-label` untuk semua interactive elements
  - `aria-labelledby` untuk sections dengan headings
  - `aria-hidden="true"` untuk decorative elements
  - `role` attributes untuk semantic HTML

- **Keyboard Navigation**:
  - Focus indicators dengan `focus:ring` classes
  - Tab order yang logical
  - Keyboard accessible links dan buttons
  - `tabIndex` untuk custom interactive elements

- **Semantic HTML**:
  - `<article>` untuk content sections
  - `<section>` dengan proper labels
  - `<nav>` untuk navigation
  - Proper heading hierarchy (h1, h2, h3)

- **Screen Reader Support**:
  - Descriptive alt text
  - Hidden text untuk icon-only buttons
  - Proper label associations

### 4. ✅ Testing Setup
- **Jest Configuration** (`website/jest.config.js`):
  - Next.js Jest integration
  - Module name mapping untuk `@/` imports
  - Coverage configuration
  - Test environment setup

- **Jest Setup** (`website/jest.setup.js`):
  - Testing Library Jest DOM matchers
  - Next.js router mocks
  - Framer Motion mocks

- **Unit Tests**:
  - `website/src/lib/__tests__/data.test.js` - Data utility functions tests
  - `website/src/components/__tests__/Navigation.test.jsx` - Navigation component tests

- **Test Scripts**:
  - `npm run test` - Run all tests
  - `npm run test:watch` - Watch mode
  - `npm run test:coverage` - Coverage report

### 5. ✅ Documentation
- **README.md**:
  - Project overview dan filosofi
  - Quick start guide
  - Installation instructions
  - Development guide
  - Testing instructions
  - Deployment guide
  - Structure documentation
  - Technology stack
  - Performance notes
  - Accessibility notes
  - SEO notes

## File Baru yang Dibuat

### Prioritas Tinggi
1. `website/src/lib/data.js` - Utility functions untuk data handling
2. `website/src/components/LoadingSkeleton.jsx` - Loading skeleton components
3. `website/src/components/ErrorBoundary.jsx` - Error boundary component
4. `website/src/app/error.js` - Global error page
5. `website/src/app/not-found.js` - 404 not found page
6. `qr-generator/requirements.txt` - Python dependencies
7. `website/src/components/Navigation.jsx` - Navigation component

### Prioritas Menengah
8. `website/src/app/tree/[id]/layout.js` - Dynamic metadata generation
9. `website/jest.config.js` - Jest configuration
10. `website/jest.setup.js` - Jest setup file
11. `website/src/lib/__tests__/data.test.js` - Data utility tests
12. `website/src/components/__tests__/Navigation.test.jsx` - Navigation tests
13. `README.md` - Comprehensive documentation

## File yang Diupdate

### Prioritas Tinggi
1. `website/package.json` - Dependencies updated
2. `website/src/app/page.js` - Added loading states & error handling
3. `website/src/app/tree/[id]/page.js` - Added error handling, loading states, params fix
4. `website/src/app/layout.js` - Added ErrorBoundary, enhanced metadata
5. `qr-generator/generate_qr.py` - Environment variable support

### Prioritas Menengah
6. `website/src/app/layout.js` - Enhanced SEO metadata
7. `website/src/app/page.js` - Added accessibility attributes
8. `website/src/app/tree/[id]/page.js` - Added ARIA labels, semantic HTML, image optimization
9. `website/src/components/Navigation.jsx` - Added accessibility attributes
10. `website/next.config.js` - Image optimization configuration
11. `website/package.json` - Added testing dependencies and scripts

## Cara Menggunakan

### Setup Environment Variables

1. Copy `.env.example` ke `.env.local` di folder `website/`
2. Update `NEXT_PUBLIC_BASE_URL` dengan URL production Anda

### Install Dependencies

```bash
# Website dependencies
cd website
npm install

# QR Generator dependencies (optional)
cd ../qr-generator
pip install -r requirements.txt
```

### Run Development Server

```bash
cd website
npm run dev
```

### Run Tests

```bash
cd website
npm run test
```

## Catatan

- Semua perubahan kompatibel dengan Next.js 16 dan React 19
- Error handling sudah comprehensive dengan fallback UI
- Loading states memberikan UX yang lebih baik
- Data consistency terjaga dengan single source of truth
- SEO optimized dengan dynamic metadata per halaman
- Performance optimized dengan Next.js Image component
- Accessibility compliant dengan ARIA labels dan keyboard navigation
- Testing framework setup dengan unit tests untuk komponen kritis
- Dokumentasi lengkap dengan README yang comprehensive
