# I.Q.R.A - Intelligent Quick-Response Arboretum

[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2-blue)](https://react.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> 🌳 Sistem Informasi Digital untuk Arboretum - Mengenal Pohon melalui QR Code

## 📖 Deskripsi

I.Q.R.A adalah website edukasi interaktif untuk menampilkan informasi pohon di arboretum. Pengunjung dapat memindai QR code pada setiap pohon untuk melihat:

- **Mode Lensa** 🔍 - Informasi anatomi pohon dengan hotspot interaktif
- **Mode Journey** 📚 - Cerita dan hikmah di balik setiap pohon

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/NRafif/I.Q.R.A-project.git
cd IQRA-Project/website

# Install dependencies
npm install

# Run development server
npm run dev

# Open http://localhost:3000
```

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Next.js 16 | React Framework dengan App Router |
| React 19 | UI Library |
| Tailwind CSS | Styling |
| Framer Motion | Animations |
| SWR | Data Caching |

## 📁 Struktur Project

```
website/
├── public/
│   ├── assets/pohon/     # Gambar pohon (thumbnail & background)
│   └── data/trees.json   # Data semua pohon
├── src/
│   ├── app/              # Next.js pages
│   │   ├── page.js       # Homepage
│   │   ├── tree/[id]/    # Journey Mode
│   │   ├── tree/lens/[id]/ # Lens Mode
│   │   └── editor/hotspot/ # Hotspot Editor
│   ├── components/       # Reusable UI components
│   └── lib/              # Utilities & hooks
├── docs/                 # Documentation
└── package.json
```

## 📄 Dokumentasi Lengkap

| Dokumen | Deskripsi |
|---------|-----------|
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Arsitektur teknis sistem |
| [DATA_STRUCTURE.md](docs/DATA_STRUCTURE.md) | Schema data trees.json |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Panduan kontribusi |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Panduan deploy ke Vercel |

## 🧪 Testing

```bash
# Run all tests
npm test

# Run with coverage
npm run test:coverage

# Watch mode
npm run test:watch
```

## 📊 Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm test` | Run Jest tests |

## 🔒 Security

- ✅ Input sanitization untuk semua parameter
- ✅ XSS prevention
- ✅ Path traversal protection
- ✅ 0 npm vulnerabilities

Lihat [SECURITY.md](docs/SECURITY.md) untuk detail.

## 🤝 Kontribusi

Kontribusi sangat diterima! Baca [CONTRIBUTING.md](CONTRIBUTING.md) untuk panduan.

## 📝 License

MIT License - Lihat [LICENSE](LICENSE) untuk detail.

---

**Dibuat dengan ❤️ untuk edukasi arboretum digital**
