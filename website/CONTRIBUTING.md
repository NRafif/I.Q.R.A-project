# Panduan Kontribusi

Terima kasih atas minat Anda untuk berkontribusi ke I.Q.R.A! 🎉

## 📋 Cara Berkontribusi

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR-USERNAME/I.Q.R.A-project.git
cd IQRA-Project/website
npm install
```

### 2. Buat Branch

```bash
git checkout -b feature/nama-fitur
# atau
git checkout -b fix/nama-bug
```

### 3. Development

```bash
npm run dev
```

### 4. Testing

```bash
# Pastikan semua test pass
npm test

# Check linting
npm run lint
```

### 5. Commit & Push

```bash
git add .
git commit -m "feat: deskripsi perubahan"
git push origin feature/nama-fitur
```

### 6. Pull Request

Buka Pull Request ke branch `main` dengan deskripsi perubahan.

---

## 📁 Struktur Kode

```
src/
├── app/          # Pages (Next.js App Router)
├── components/   # Komponen React
├── lib/          # Utilities, hooks, data functions
└── data/         # Type definitions (jika ada)
```

## ✨ Coding Standards

### Nama File

- Components: `PascalCase.jsx` (contoh: `TreeCard.jsx`)
- Utilities: `camelCase.js` (contoh: `data.js`)
- Tests: `*.test.jsx` atau `*.test.js`

### Komponen

```jsx
/**
 * Deskripsi komponen
 * 
 * @param {Object} props
 * @param {string} props.title - Deskripsi prop
 * @component
 */
export default function MyComponent({ title }) {
  return <div>{title}</div>
}
```

### Styling

- Gunakan Tailwind CSS classes
- Untuk responsive: `text-sm md:text-base lg:text-lg`
- Hindari inline styles kecuali untuk dynamic values

---

## 🌳 Menambah Data Pohon Baru

### 1. Siapkan Gambar

- Thumbnail: `public/assets/pohon/nama-pohon thumbnail.jpeg`
- Background: `public/assets/pohon/nama-pohon background.jpg`

### 2. Tambah ke trees.json

```json
{
    "id": 20,
    "common_name": "Nama Pohon",
    "scientific_name": "Nama Latin",
    "family": "Nama Family",
    "origin": "Asal",
    "location": "Lokasi di Arboretum",
    "assets": {
        "thumbnail": "/assets/pohon/nama-pohon thumbnail.jpeg",
        "background": "/assets/pohon/nama-pohon background.jpg"
    },
    "anatomy_mode": { ... },
    "story_mode": { ... }
}
```

### 3. Gunakan Hotspot Editor

```
http://localhost:3000/editor/hotspot
```

Klik pada gambar untuk mendapat koordinat hotspot yang tepat.

---

## 🧪 Testing Guidelines

### Test Files Location

- Component tests: `src/components/__tests__/`
- Lib tests: `src/lib/__tests__/`

### Running Tests

```bash
npm test                 # Run once
npm run test:watch       # Watch mode
npm run test:coverage    # With coverage
```

### Writing Tests

```jsx
import { render, screen } from '@testing-library/react'
import MyComponent from '../MyComponent'

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />)
    expect(screen.getByText('Test')).toBeInTheDocument()
  })
})
```

---

## 🐛 Melaporkan Bug

Buka issue dengan:
1. Deskripsi bug
2. Langkah reproduksi
3. Expected vs actual behavior
4. Screenshot (jika ada)

---

## 💬 Pertanyaan?

Buka issue dengan label `question` atau hubungi maintainer.

Terima kasih telah berkontribusi! 🙏
