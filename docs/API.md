# API Documentation

## Overview

I.Q.R.A menggunakan Next.js App Router dengan server-side dan client-side data utilities. Tidak ada REST API endpoint karena data di-load langsung dari JSON file.

## Data Utilities

### Client-Side (`website/src/lib/data.js`)

#### `loadTreesData()`

Load semua data pohon dari JSON file.

**Returns:** `Promise<Array<Tree>>`

**Example:**
```javascript
import { loadTreesData } from '@/lib/data'

const trees = await loadTreesData()
console.log(trees.length) // 17
```

**Error Handling:**
- Returns empty array `[]` jika terjadi error
- Logs error ke console untuk debugging

---

#### `getTreeById(id, treesData?)`

Get tree berdasarkan ID.

**Parameters:**
- `id` (string|number): Tree ID (akan divalidasi)
- `treesData` (Array, optional): Pre-loaded trees data untuk avoid re-fetch

**Returns:** `Promise<Tree | null>`

**Security:**
- ID akan di-sanitize dengan `sanitizeTreeId()`
- Hanya menerima angka positif 1-1000
- Returns `null` untuk invalid ID

**Example:**
```javascript
import { getTreeById } from '@/lib/data'

const tree = await getTreeById(1)
if (tree) {
  console.log(tree.common_name) // "Rambutan"
}
```

---

#### `validateTreeData(tree)`

Validasi struktur data tree.

**Parameters:**
- `tree` (Object): Tree object untuk divalidasi

**Returns:** `boolean`

**Validates:**
- Required fields: `id`, `common_name`, `scientific_name`, `family`, `location`, `content`
- Content structure: `sky_section`, `canopy_section`, `trunk_section`, `root_section`

**Example:**
```javascript
import { validateTreeData } from '@/lib/data'

const isValid = validateTreeData(treeData)
if (!isValid) {
  console.error('Invalid tree data structure')
}
```

---

#### `getDefaultTree()`

Get default/fallback tree data untuk error states.

**Returns:** `Object` - Default tree dengan ID 0

**Use Case:**
- Error handling ketika tree tidak ditemukan
- Fallback UI untuk invalid data

---

### Server-Side (`website/src/lib/data-server.js`)

#### `loadTreesDataServer()`

Load data dari file system (server-side only).

**Returns:** `Promise<Array<Tree>>`

**Security:**
- Path hardcoded ke `public/data/trees.json`
- Path validation untuk mencegah path traversal
- Error handling yang tidak expose sensitive info

**Note:** Hanya bisa digunakan di server-side (Next.js server components).

---

#### `getTreeByIdServer(id)`

Get tree by ID (server-side).

**Parameters:**
- `id` (string|number): Tree ID

**Returns:** `Promise<Tree | null>`

**Security:**
- Input sanitization dengan `sanitizeTreeId()`
- Returns `null` untuk invalid input

---

## Security Utilities (`website/src/lib/security.js`)

### `sanitizeTreeId(id, maxId?)`

Validasi dan sanitize tree ID.

**Parameters:**
- `id` (string|number): ID untuk divalidasi
- `maxId` (number, optional): Maximum ID allowed (default: 1000)

**Returns:** `number | null`

**Validation Rules:**
- Hanya angka positif
- Range: 1 - maxId
- Rejects: negative numbers, strings, special characters

**Example:**
```javascript
import { sanitizeTreeId } from '@/lib/security'

sanitizeTreeId("1") // 1
sanitizeTreeId("../../etc/passwd") // null
sanitizeTreeId("-1") // null
sanitizeTreeId("9999") // null (if maxId = 1000)
```

---

### `sanitizeUrl(url, allowedProtocols?)`

Validasi dan sanitize URL.

**Parameters:**
- `url` (string): URL untuk divalidasi
- `allowedProtocols` (Array, optional): Allowed protocols (default: ['http', 'https'])

**Returns:** `string | null`

**Security:**
- Hanya mengizinkan http/https
- Rejects: javascript:, data:, file:, dll

---

### `escapeHtml(str)`

Escape HTML untuk mencegah XSS.

**Parameters:**
- `str` (string): String untuk di-escape

**Returns:** `string`

**Escaped Characters:**
- `&` → `&amp;`
- `<` → `&lt;`
- `>` → `&gt;`
- `"` → `&quot;`
- `'` → `&#39;`
- `/` → `&#x2F;`

---

## Data Structure

### Tree Object

```typescript
interface Tree {
  id: number
  common_name: string
  scientific_name: string
  family: string
  location: string
  content: {
    sky_section: {
      headline: string
      sub_headline: string
    }
    canopy_section: {
      title: string
      description: string
    }
    trunk_section: Array<{
      type: string
      title: string
      description: string
    }>
    root_section: {
      description: string
    }
  }
}
```

---

## Error Handling

Semua functions menggunakan graceful error handling:

1. **Input Validation**: Invalid input returns `null` atau empty array
2. **Error Logging**: Errors logged ke console untuk debugging
3. **User-Friendly Messages**: Error messages tidak expose sensitive information
4. **Fallback Data**: Default tree data untuk error states

---

## Performance Considerations

- **Client-side**: Uses fetch API dengan `cache: 'no-store'` untuk fresh data
- **Server-side**: Uses `fs.readFileSync` untuk synchronous file reading
- **Caching**: No caching untuk ensure data selalu up-to-date
- **Code Splitting**: Dynamic imports untuk server utilities

---

## Security Best Practices

1. **Input Validation**: Semua user input divalidasi sebelum digunakan
2. **Path Traversal Protection**: File paths divalidasi untuk mencegah directory traversal
3. **XSS Prevention**: HTML escaping untuk user-generated content
4. **URL Validation**: Hanya http/https URLs yang diizinkan
5. **Error Handling**: Tidak expose sensitive information dalam error messages

