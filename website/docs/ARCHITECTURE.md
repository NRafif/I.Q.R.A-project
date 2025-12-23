# Arsitektur Teknis I.Q.R.A

Document ini menjelaskan arsitektur teknis sistem I.Q.R.A untuk memudahkan maintenance dan development.

---

## 🏗️ Overview Arsitektur

```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENT BROWSER                        │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌──────────────┐   ┌──────────────┐   ┌──────────────┐   │
│   │   Homepage   │   │  Lens Mode   │   │ Journey Mode │   │
│   │   /          │   │ /tree/lens/  │   │   /tree/     │   │
│   └──────────────┘   └──────────────┘   └──────────────┘   │
│          │                  │                  │            │
│          └──────────────────┼──────────────────┘            │
│                             │                               │
│                    ┌────────▼────────┐                      │
│                    │   SWR Cache     │                      │
│                    │   (In-Memory)   │                      │
│                    └────────┬────────┘                      │
│                             │                               │
│                    ┌────────▼────────┐                      │
│                    │  trees.json     │                      │
│                    │  (Static File)  │                      │
│                    └─────────────────┘                      │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## 📂 Struktur Folder Detail

```
website/
├── public/
│   ├── assets/
│   │   ├── pohon/              # Gambar pohon
│   │   │   ├── *-thumbnail.jpg # Card images (max 500KB)
│   │   │   └── *-background.jpg # Full images (max 2MB)
│   │   └── *.png               # Icons & misc
│   └── data/
│       └── trees.json          # Database utama
│
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.js           # Root layout
│   │   ├── page.js             # Homepage
│   │   ├── error.js            # Error page
│   │   ├── not-found.js        # 404 page
│   │   ├── globals.css         # Global styles
│   │   ├── tree/
│   │   │   ├── [id]/page.js    # Journey Mode (dynamic)
│   │   │   └── lens/[id]/page.js # Lens Mode (dynamic)
│   │   └── editor/
│   │       └── hotspot/page.js # Hotspot Editor (admin tool)
│   │
│   ├── components/             # Reusable UI Components
│   │   ├── Navbar.jsx
│   │   ├── HeroSection.jsx
│   │   ├── TreeCollection.jsx  # Tree grid dengan cards
│   │   ├── JournalCard.jsx     # Multi-variant card
│   │   ├── ErrorBoundary.jsx   # Error handling
│   │   ├── LoadingSkeleton.jsx # Loading states
│   │   ├── Navigation.jsx
│   │   ├── ScrollProgress.jsx
│   │   ├── AboutSection.jsx
│   │   ├── Footer.jsx
│   │   └── __tests__/          # Component tests
│   │
│   └── lib/                    # Utilities & Logic
│       ├── data.js             # Data fetching (client)
│       ├── data-server.js      # Data fetching (server)
│       ├── security.js         # Input sanitization
│       ├── hooks.js            # SWR custom hooks
│       └── __tests__/          # Unit tests
│
└── docs/                       # Documentation
```

---

## 🔄 Data Flow

### Homepage Load

```
1. User visits /
   │
2. page.js renders
   │
3. useTreesData() hook called (SWR)
   │
   ├── Cache hit? → Return cached data immediately
   │
   └── Cache miss? → Fetch /data/trees.json
                     │
                     └── Cache response for 60s
   │
4. validateTreeData() filters invalid entries
   │
5. TreeCollection renders valid trees
```

### Tree Detail Load

```
1. User visits /tree/lens/13
   │
2. Lens page.js extracts id from params
   │
3. getTreeById(13) called
   │
   ├── sanitizeTreeId(13) → Validate input
   │
   └── Find tree in data array
   │
4. Render tree details with hotspots
```

---

## 🧩 Component Hierarchy

```
<Home>
├── <Navbar />
├── <HeroSection treeCount={} />
├── <TreeCollection trees={} isLoading={} error={} />
│   ├── <TreeCard tree={} /> (repeated)
│   └── <TreeCardSkeleton /> (when loading)
├── <AboutSection />
└── <Footer />

<LensPage>
├── <Header />
├── <TreeImage />
│   └── <Hotspot /> (repeated, positioned by x,y)
└── <CTA to Journey />

<JourneyPage>
├── <Navigation />
├── <JournalCard variant="identity" />
├── <Section sky />
├── <Section canopy />
├── <Section trunk />
├── <Section root />
└── <Footer />
```

---

## 🔐 Security Layer

```
┌─────────────────────────────────────────────────┐
│                   security.js                    │
├─────────────────────────────────────────────────┤
│                                                  │
│  sanitizeTreeId(id)                             │
│  ├── Validate: only positive integers           │
│  ├── Range check: 1 to 1000                     │
│  └── Return: number | null                      │
│                                                  │
│  escapeHtml(string)                             │
│  └── Encode: < > & " ' /                        │
│                                                  │
│  sanitizeUrl(url)                               │
│  └── Allow only: http, https                    │
│                                                  │
│  validatePath(path, baseDir)                    │
│  └── Prevent: ../ traversal                     │
│                                                  │
└─────────────────────────────────────────────────┘
```

---

## 📦 Dependencies

### Production

| Package | Version | Purpose |
|---------|---------|---------|
| next | 16.x | Framework |
| react | 19.x | UI Library |
| react-dom | 19.x | DOM Rendering |
| framer-motion | 11.x | Animations |
| swr | 2.x | Data Caching |

### Development

| Package | Purpose |
|---------|---------|
| tailwindcss | CSS Framework |
| jest | Testing |
| @testing-library/react | Component Testing |

---

## 🔧 Configuration Files

| File | Purpose |
|------|---------|
| `next.config.js` | Next.js configuration |
| `tailwind.config.js` | Tailwind theme & plugins |
| `postcss.config.js` | PostCSS plugins |
| `jest.config.js` | Jest test configuration |
| `jsconfig.json` | Path aliases (@/) |

---

## 🚀 Build & Deploy

```bash
# Development
npm run dev          # Start dev server (port 3000)

# Production Build
npm run build        # Build optimized bundle
npm run start        # Start production server

# Testing
npm test            # Run all tests
npm run lint        # Check code quality
```

---

## 📝 Environment

Tidak ada environment variables yang diperlukan. Semua konfigurasi sudah hardcoded untuk simplicity.

Jika perlu environment variables di masa depan:
1. Buat `.env.local`
2. Prefix dengan `NEXT_PUBLIC_` untuk client-side
3. Access via `process.env.NEXT_PUBLIC_VAR`
