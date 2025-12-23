# Data Structure: trees.json

Dokumen ini menjelaskan schema data untuk file `public/data/trees.json`.

---

## 📋 Overview

File `trees.json` berisi array dari object pohon. Setiap pohon memiliki informasi untuk:
- Identitas dasar
- Mode Lensa (anatomi)
- Mode Journey (cerita)

---

## 🌳 Schema Pohon

```json
{
    "id": 1,
    "common_name": "Rambutan",
    "scientific_name": "Nephelium lappaceum",
    "family": "Sapindaceae",
    "origin": "Asia Tenggara",
    "location": "Taman A",
    "assets": { ... },
    "anatomy_mode": { ... },
    "story_mode": { ... }
}
```

### Field Definitions

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | number | ✅ | Unique identifier (1-1000) |
| `common_name` | string | ✅ | Nama umum pohon |
| `scientific_name` | string | ✅ | Nama ilmiah (latin) |
| `family` | string | ✅ | Family taksonomi |
| `origin` | string | ❌ | Asal geografis |
| `location` | string | ✅ | Lokasi di arboretum |
| `assets` | object | ✅ | Gambar pohon |
| `anatomy_mode` | object | ✅ | Data untuk Mode Lensa |
| `story_mode` | object | ✅ | Data untuk Mode Journey |

---

## 📸 Assets Object

```json
{
    "assets": {
        "thumbnail": "/assets/pohon/rambutan thumbnail.jpeg",
        "background": "/assets/pohon/rambutan background.jpg"
    }
}
```

| Field | Purpose | Recommended Size |
|-------|---------|------------------|
| `thumbnail` | Card image di homepage | 400x300px, < 500KB |
| `background` | Full image di Lens Mode | 800x1000px, < 2MB |

---

## 🔬 Anatomy Mode (Mode Lensa)

```json
{
    "anatomy_mode": {
        "description": "Deskripsi singkat pohon",
        "hotspots": [
            {
                "part": "Morphology",
                "label": "Morfologi Daun",
                "position": {
                    "x": 30.5,
                    "y": 25.0
                },
                "text": "Daun majemuk dengan 2-4 pasang anak daun..."
            }
        ]
    }
}
```

### Hotspot Fields

| Field | Type | Description |
|-------|------|-------------|
| `part` | string | Kategori bagian (Morphology, Fruit, Trunk, Root) |
| `label` | string | Judul untuk popup |
| `position` | object | Koordinat x,y dalam persen (0-100) |
| `position.x` | number | Posisi horizontal (0 = kiri, 100 = kanan) |
| `position.y` | number | Posisi vertikal (0 = atas, 100 = bawah) |
| `text` | string | Deskripsi detail |

### Cara Mendapat Koordinat

Gunakan Hotspot Editor:
```
http://localhost:3000/editor/hotspot
```

1. Pilih pohon dari dropdown
2. Klik pada gambar
3. Copy koordinat yang muncul
4. Paste ke trees.json

---

## 📖 Story Mode (Mode Journey)

```json
{
    "story_mode": {
        "sky_section": {
            "headline": "The Hairy Sweetness",
            "sub_headline": "Di balik penampilan yang kasar..."
        },
        "canopy_section": {
            "title": "Ekologi",
            "description": "Manfaat ekologis pohon ini..."
        },
        "trunk_section": [
            {
                "type": "history",
                "title": "Asal Usul",
                "description": "Sejarah pohon ini..."
            },
            {
                "type": "insight",
                "title": "Hikmah",
                "quote": "Kutipan atau hikmah..."
            }
        ],
        "root_section": {
            "description": "Kesimpulan perjalanan..."
        }
    }
}
```

### Section Fields

#### sky_section (Header)
| Field | Type | Description |
|-------|------|-------------|
| `headline` | string | Tagline utama |
| `sub_headline` | string | Deskripsi singkat |

#### canopy_section (Ekologi)
| Field | Type | Description |
|-------|------|-------------|
| `title` | string | Judul section |
| `description` | string | Manfaat ekologis |

#### trunk_section (Array of Cards)
| Field | Type | Description |
|-------|------|-------------|
| `type` | string | Card type: "history", "insight", "facts" |
| `title` | string | Judul card |
| `description` | string | Konten card |
| `quote` | string | Kutipan (untuk type "insight") |

#### root_section (Footer)
| Field | Type | Description |
|-------|------|-------------|
| `description` | string | Kesimpulan atau intro |

---

## ✅ Validation

Data divalidasi dengan function `validateTreeData()`:

```javascript
// Required fields
const requiredFields = [
    'id', 
    'common_name', 
    'scientific_name', 
    'family', 
    'location', 
    'story_mode', 
    'anatomy_mode'
]

// Required story_mode fields
const requiredStoryFields = [
    'sky_section', 
    'canopy_section', 
    'trunk_section', 
    'root_section'
]
```

---

## 📝 Contoh Lengkap

```json
{
    "id": 1,
    "common_name": "Rambutan",
    "scientific_name": "Nephelium lappaceum",
    "family": "Sapindaceae",
    "origin": "Asia Tenggara",
    "location": "Taman A",
    "assets": {
        "thumbnail": "/assets/pohon/rambutan thumbnail.jpeg",
        "background": "/assets/pohon/rambutan background.jpg"
    },
    "anatomy_mode": {
        "description": "Pohon buah tropis dengan kulit berambut unik",
        "hotspots": [
            {
                "part": "Morphology",
                "label": "Morfologi Daun",
                "position": { "x": 30.3, "y": 39.3 },
                "text": "Daun majemuk menyirip genap dengan 2-4 pasang anak daun."
            },
            {
                "part": "Fruit",
                "label": "Anatomi Buah",
                "position": { "x": 55.0, "y": 50.0 },
                "text": "Buah tipe drupa dengan kulit berambut (spinterns)."
            }
        ]
    },
    "story_mode": {
        "sky_section": {
            "headline": "The Hairy Sweetness",
            "sub_headline": "Di balik penampilannya yang liar, tersimpan kemanisan murni."
        },
        "canopy_section": {
            "title": "Manfaat Ekologis",
            "description": "Pohon ini menyediakan habitat untuk berbagai fauna..."
        },
        "trunk_section": [
            {
                "type": "history",
                "title": "Asal Usul",
                "description": "Berasal dari Nusantara, menyebar ke Asia Tenggara..."
            },
            {
                "type": "insight",
                "title": "Hikmah Islami",
                "quote": "Jangan menilai dari penampilan luar..."
            }
        ],
        "root_section": {
            "description": "Mulai perjalanan memahami pohon ini dari akar."
        }
    }
}
```

---

## 🔧 Tips Menambah Pohon Baru

1. Copy template dari pohon existing
2. Ubah `id` ke angka berikutnya
3. Isi semua required fields
4. Siapkan gambar thumbnail dan background
5. Gunakan hotspot editor untuk koordinat
6. Validate dengan menjalankan website
