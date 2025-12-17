# Architecture Documentation

## Overview

I.Q.R.A menggunakan Next.js 16 dengan App Router, React 19, dan konsep "Ground-to-Sky" UX untuk menampilkan informasi pohon.

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    User (Mobile/Web)                    │
│                    QR Code Scanner                      │
└────────────────────┬──────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js Application (Vercel)                │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Client-Side (Browser)                            │  │
│  │  - React Components                               │  │
│  │  - Framer Motion Animations                       │  │
│  │  - Fetch API untuk data loading                   │  │
│  └──────────────────────────────────────────────────┘  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  Server-Side (Node.js)                            │  │
│  │  - Server Components                              │  │
│  │  - File System Operations                         │  │
│  │  - Metadata Generation                            │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬──────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              Data Layer                                  │
│  ┌──────────────────────────────────────────────────┐  │
│  │  JSON Files (Static Data)                         │  │
│  │  - website/public/data/trees.json                 │  │
│  │  - qr-generator/data/trees_update.json           │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
```

## Component Architecture

### Page Components

#### Home Page (`website/src/app/page.js`)
- **Type**: Client Component
- **Purpose**: Landing page dengan daftar semua pohon
- **Data Flow**: Client-side fetch → Validation → Render
- **State Management**: useState untuk data, loading, error

#### Tree Detail Page (`website/src/app/tree/[id]/page.js`)
- **Type**: Client Component
- **Purpose**: Detail page untuk setiap pohon
- **Data Flow**: 
  1. Unwrap params dengan React.use()
  2. Fetch tree data
  3. Validate data
  4. Render dengan reverse scroll UX
- **State Management**: Multiple useState untuk different concerns

### Utility Components

#### Navigation (`website/src/components/Navigation.jsx`)
- **Purpose**: Navigation menu di pojok kanan atas
- **Features**: Conditional rendering, hydration-safe

#### ScrollProgress (`website/src/components/ScrollProgress.jsx`)
- **Purpose**: Visual scroll indicator
- **Features**: Reverse progress, smooth animations

#### LoadingSkeleton (`website/src/components/LoadingSkeleton.jsx`)
- **Purpose**: Loading states untuk better UX
- **Components**: TreeCardSkeleton, TreeDetailSkeleton, LoadingSpinner

## Data Flow

### Client-Side Data Flow

```
User Action
    ↓
Component (useEffect)
    ↓
loadTreesData() / getTreeById()
    ↓
Environment Detection (window check)
    ↓
┌─────────────────┬─────────────────┐
│  Client-Side     │  Server-Side     │
│  fetch() API     │  fs.readFileSync │
└─────────────────┴─────────────────┘
    ↓
Validation (validateTreeData)
    ↓
State Update
    ↓
UI Render
```

### Server-Side Data Flow

```
Request (SSR/SSG)
    ↓
Server Component / generateMetadata
    ↓
getTreeByIdServer() / loadTreesDataServer()
    ↓
File System Read (fs.readFileSync)
    ↓
JSON Parse
    ↓
Validation
    ↓
Return Data
```

## Security Architecture

### Input Validation Layer

```
User Input
    ↓
sanitizeTreeId() / sanitizeUrl()
    ↓
Validation Rules
    ↓
┌──────────────┬──────────────┐
│  Valid       │  Invalid     │
│  Continue    │  Return null │
└──────────────┴──────────────┘
```

### Path Traversal Protection

```
File Operation Request
    ↓
Path Construction (path.join)
    ↓
Path Validation
    ↓
┌──────────────┬──────────────┐
│  Safe Path   │  Unsafe     │
│  Allow       │  Reject     │
└──────────────┴──────────────┘
```

## UX Architecture

### Reverse Scrolling Flow

```
Page Load
    ↓
Scroll to Bottom (Akar)
    ↓
User Scrolls Up
    ↓
┌──────────────┬──────────────┬──────────────┐
│  > 70%       │  30-70%      │  < 30%       │
│  Akar        │  Batang      │  Daun        │
└──────────────┴──────────────┴──────────────┘
```

### Section Detection Logic

```javascript
// Scroll percentage calculation
scrollPercent = scrollY / (totalHeight - viewportHeight)

// Section mapping
if (scrollPercent > 0.7) → 'akar'    // Bottom section
else if (scrollPercent > 0.3) → 'batang'  // Middle section
else → 'daun'  // Top section
```

## File Structure Rationale

### Why This Structure?

```
website/src/
├── app/              # Next.js App Router pages
│   ├── page.js       # Homepage (client component)
│   └── tree/[id]/    # Dynamic route untuk tree detail
├── components/       # Reusable React components
├── lib/              # Utility functions
│   ├── data.js       # Client-side data utilities
│   ├── data-server.js # Server-side data utilities
│   └── security.js   # Security utilities
└── data/             # (Empty, data di public/)
```

**Decisions:**
- `app/` untuk Next.js App Router convention
- `components/` untuk reusable UI components
- `lib/` untuk business logic dan utilities
- Separation of concerns: client vs server utilities

## Performance Optimizations

### 1. Code Splitting
- Dynamic imports untuk server utilities
- Next.js automatic code splitting
- Lazy loading untuk non-critical components

### 2. Data Loading
- Client-side: fetch dengan cache control
- Server-side: synchronous file read (small files)
- No unnecessary re-fetches

### 3. Image Optimization
- Next.js Image component
- Lazy loading untuk below-the-fold images
- Priority loading untuk above-the-fold

## Error Handling Strategy

### Error Boundaries
```
Error Occurs
    ↓
ErrorBoundary catches
    ↓
┌─────────────────┬─────────────────┐
│  Development    │  Production     │
│  Show details   │  Show generic   │
└─────────────────┴─────────────────┘
    ↓
Fallback UI
```

### Data Loading Errors
```
Fetch Fails
    ↓
Try-Catch
    ↓
Log Error (console)
    ↓
Return Safe Default
    ↓
Show User-Friendly Message
```

## Testing Strategy

### Unit Tests
- **Location**: `website/src/**/__tests__/`
- **Coverage**: Utility functions, components
- **Framework**: Jest + React Testing Library

### Test Structure
```
Component/Function
    ↓
Test Cases:
  - Happy path
  - Error cases
  - Edge cases
  - Security cases
```

## Deployment Architecture

### Vercel Deployment
```
GitHub Repository
    ↓
Vercel Integration
    ↓
Build Process
    ↓
┌─────────────────┬─────────────────┐
│  Static Pages   │  Server Functions│
│  (SSG)          │  (SSR/API)       │
└─────────────────┴─────────────────┘
    ↓
CDN Distribution
    ↓
User Access
```

## Future Enhancements

### Potential Improvements
1. **Database Integration**: Replace JSON dengan database
2. **Caching Layer**: Redis untuk data caching
3. **API Routes**: REST API untuk data access
4. **Real-time Updates**: WebSocket untuk live data
5. **Analytics**: User behavior tracking

## Decision Log

### Why Next.js App Router?
- Modern routing dengan file-based system
- Better performance dengan React Server Components
- Built-in optimizations

### Why Client Components for Tree Detail?
- Requires browser APIs (scroll, window)
- Interactive animations dengan Framer Motion
- Real-time scroll tracking

### Why JSON Files Instead of Database?
- Simple untuk MVP
- No database setup required
- Easy to maintain
- Fast untuk static data

### Why Reverse Scrolling?
- Unique UX yang sesuai filosofi "Ground-to-Sky"
- Different dari conventional scrolling
- Memorable user experience

