# I.Q.R.A - Intelligent Quick-Response Arboretum

Sistem Informasi Digital Pohon berbasis QR Code dengan konsep UX biomimetic yang unik. Proyek ini mengubah pohon menjadi "entitas informasi" yang dapat dipelajari melalui teknologi modern.

## 🌳 Tentang Proyek

I.Q.R.A adalah singkatan dari **Intelligent Quick-Response Arboretum**, yang memiliki tiga makna:

- **Teknologi**: Sistem cerdas berbasis QR Code untuk akses informasi instan
- **Religius**: Mengambil esensi "Iqra" (bacalah) - perintah pertama dalam Islam
- **Filosofis**: Mengubah alam yang "diam" menjadi "berbicara"

### Fitur Utama

- ✅ QR Code generator otomatis untuk setiap pohon
- ✅ Website interaktif dengan konsep "Ground-to-Sky" (akar → batang → daun)
- ✅ Reverse scrolling experience yang unik
- ✅ Glassmorphism UI design
- ✅ Responsive design untuk semua device
- ✅ SEO optimized dengan dynamic metadata
- ✅ Accessibility compliant (ARIA labels, keyboard navigation)
- ✅ Error handling dan loading states
- ✅ Performance optimized dengan Next.js Image

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ dan npm/yarn
- Python 3.8+ (untuk QR generator, optional)

### Installation

1. **Clone repository**
```bash
git clone <repository-url>
cd IQRA-Project
```

2. **Install dependencies**
```bash
cd website
npm install
```

3. **Setup environment variables**
```bash
# Copy .env.example ke .env.local
cp .env.example .env.local

# Edit .env.local dan update NEXT_PUBLIC_BASE_URL dengan URL production Anda
# Contoh: NEXT_PUBLIC_BASE_URL=https://iqra-project.vercel.app
```

4. **Run development server**
```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📁 Struktur Project

```
IQRA-Project/
├── website/                 # Next.js application
│   ├── src/
│   │   ├── app/            # App Router pages
│   │   │   ├── page.js     # Homepage
│   │   │   ├── tree/[id]/  # Tree detail pages
│   │   │   └── layout.js   # Root layout
│   │   ├── components/     # React components
│   │   ├── lib/            # Utility functions
│   │   └── data/           # Data utilities
│   ├── public/
│   │   ├── data/          # JSON data files
│   │   └── assets/         # Images and static files
│   └── package.json
├── qr-generator/           # Python QR code generator
│   ├── data/              # Tree data source
│   ├── output/             # Generated QR codes
│   └── generate_qr.py     # Generator script
├── script/                 # Utility scripts
└── file/                   # Documentation
```

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

# Testing
npm run test         # Run tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run tests with coverage
```

### Menambahkan Data Pohon Baru

1. Edit `website/public/data/trees.json` atau `qr-generator/data/trees_update.json`
2. Tambahkan object pohon baru dengan struktur:
```json
{
        "id": 20,
        "common_name": "Common Name",
        "scientific_name": "Scientific Name",
        "family": "Family",
        "origin": "Origin",
        "location": "Location",
        "assets": {
            "thumbnail": "Thumbnail",
            "background": "Background"
        },
        "anatomy_mode": {
            "description": "Description",
            "hotspots": [
                {
                    "part": "Part",
                    "label": "Label",
                    "position": "Position",
                    "text": "Text"
                },
                {
                    "part": "Part",
                    "label": "Label",
                    "position": "Position",
                    "text": "Text"
                },
                {
                    "part": "Part",
                    "label": "Label",
                    "position": "Position",
                    "text": "Text"
                }
            ]
        },
        "story_mode": {
            "sky_section": {
                "headline": "Headline",
                "sub_headline": "Sub Headline"
            },
            "canopy_section": {
                "title": "Title",
                "description": "Description"
            },
            "trunk_section": [
                {
                    "type": "Type",
                    "title": "Title",
                    "description": "Description"
                },
                {
                    "type": "Type",
                    "title": "Title",
                    "description": "Description"
                },
                {
                    "type": "Type",
                    "title": "Title",
                    "description": "Description"
                }
            ],
            "root_section": {
                "description": "Description"
            }
        }
    }
```

3. Generate QR Code baru:
```bash
cd qr-generator
python generate_qr.py
```

## 🎨 Teknologi yang Digunakan

- **Frontend**: Next.js 16, React 19, Tailwind CSS, Framer Motion
- **Backend**: Next.js API Routes (serverless)
- **QR Generator**: Python (qrcode library)
- **Deployment**: Vercel (recommended)

## 📱 QR Code Generator

### Setup Python Environment

```bash
cd qr-generator
pip install -r requirements.txt
```

### Generate QR Codes

```bash
python generate_qr.py
```

QR codes akan di-generate di folder `qr-generator/output/` dengan format: `[ID]_[NamaPohon].png`

### Environment Variables untuk QR Generator

Buat file `.env` di root project:
```
NEXT_PUBLIC_BASE_URL=https://iqra-project.vercel.app
```

## 🧪 Testing

Project menggunakan Jest dan React Testing Library untuk testing.

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## 🚢 Deployment

### Vercel (Recommended)

**📖 [Tutorial Lengkap Deploy ke Vercel →](./docs/DEPLOYMENT.md)**

Quick steps:
1. Push code ke GitHub
2. Import project ke Vercel
3. Set root directory ke `website/`
4. Set environment variables:
   - `NEXT_PUBLIC_BASE_URL`: URL production Anda (misalnya: `https://your-project.vercel.app`)
5. Deploy!

**Catatan Penting:**
- Pastikan root directory di-set ke `website/` karena Next.js project ada di folder tersebut
- Environment variable `NEXT_PUBLIC_BASE_URL` diperlukan untuk metadata dan QR codes
- Lihat [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) untuk tutorial lengkap step-by-step

### Manual Build

```bash
npm run build
npm run start
```

## 📊 Performance

- ✅ Image optimization dengan Next.js Image component
- ✅ Code splitting otomatis
- ✅ Server-side rendering untuk SEO
- ✅ Static generation untuk halaman tree detail
- ✅ Lazy loading untuk komponen

## ♿ Accessibility

- ✅ ARIA labels pada semua elemen interaktif
- ✅ Keyboard navigation support
- ✅ Semantic HTML (article, section, nav)
- ✅ Focus indicators untuk keyboard users
- ✅ Alt text untuk semua images

## 🔍 SEO

- ✅ Dynamic metadata per halaman pohon
- ✅ Open Graph tags untuk social sharing
- ✅ Twitter Card support
- ✅ Structured data (JSON-LD)
- ✅ Canonical URLs
- ✅ Sitemap generation

## 📝 Dokumentasi Tambahan

- [CHANGELOG.md](./CHANGELOG.md) - Daftar perubahan
- [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md) - **Tutorial Lengkap Deploy ke Vercel** 🚀
- [docs/DEPLOYMENT_QUICKSTART.md](./docs/DEPLOYMENT_QUICKSTART.md) - Quick Start Guide Deploy
- [docs/API.md](./docs/API.md) - API Documentation
- [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) - Architecture Documentation
- [docs/SECURITY.md](./docs/SECURITY.md) - Security Documentation
- [docs/CODE_STYLE.md](./docs/CODE_STYLE.md) - Code Style Guide
- [file/Proposal Proyek Pohon.txt](./file/Proposal%20Proyek%20Pohon.txt) - Proposal lengkap proyek

## 🔒 Security

Project ini mengimplementasikan berbagai security measures:

- ✅ Input validation dan sanitization
- ✅ Path traversal protection
- ✅ XSS prevention
- ✅ Secure error handling
- ✅ Environment variable security

Lihat [docs/SECURITY.md](./docs/SECURITY.md) untuk detail lengkap.

## 📚 Code Quality

### Standards
- Clean code principles
- Meaningful comments (explain "why", not "what")
- Comprehensive error handling
- Security-first approach

### Testing
- Unit tests untuk utility functions
- Component tests untuk UI components
- Security tests untuk input validation

Lihat [docs/CODE_STYLE.md](./docs/CODE_STYLE.md) untuk style guide.

## 🏗️ Architecture

Project menggunakan:
- Next.js 16 App Router
- React 19
- Client/Server separation untuk optimal performance
- Reverse scrolling UX ("Ground-to-Sky")

Lihat [docs/ARCHITECTURE.md](./docs/ARCHITECTURE.md) untuk detail architecture.

## 👥 Tim Proyek

- **Nofal Rafif Setiawan** - Frontend Developer + UI/UX Engineer
- **Gilang Maulana Kussay** - Backend Engineer

## 📄 License

Proyek ini dibuat untuk tujuan edukasi dan non-komersial.

## 🤝 Kontribusi

Kontribusi sangat diterima! Silakan buat issue atau pull request.

## 📧 Kontak

Untuk pertanyaan atau informasi lebih lanjut, silakan hubungi tim proyek.

---

**I.Q.R.A** - Mengubah pohon yang diam menjadi berbicara melalui teknologi 🌳✨

