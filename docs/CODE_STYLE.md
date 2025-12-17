# Code Style Guide

## Overview

Dokumen ini menjelaskan standar penulisan kode untuk project I.Q.R.A. Tujuannya adalah memastikan konsistensi dan maintainability codebase.

## General Principles

### 1. Readability First
- Kode harus mudah dibaca dan dipahami
- Nama variabel dan function harus descriptive
- Hindari magic numbers dan strings

### 2. Documentation
- Setiap function harus memiliki JSDoc comments
- Komentar menjelaskan "mengapa", bukan "apa"
- Complex logic harus dijelaskan dengan komentar

### 3. Security
- Semua user input harus divalidasi
- Tidak ada hardcoded secrets
- Error messages tidak expose sensitive information

## Naming Conventions

### Variables
```javascript
// ✅ Good
const treeData = await getTreeById(id)
const isLoading = true
const currentSection = 'akar'

// ❌ Bad
const td = await getTreeById(i)
const ld = true
const cs = 'akar'
```

### Functions
```javascript
// ✅ Good
function loadTreesData() { }
function sanitizeTreeId(id) { }
function validateTreeData(tree) { }

// ❌ Bad
function load() { }
function clean(id) { }
function check(tree) { }
```

### Components
```javascript
// ✅ Good - PascalCase
export default function TreeDetailPage() { }
export function Navigation() { }

// ❌ Bad
export default function treeDetailPage() { }
export function nav() { }
```

## File Structure

### Component Files
```
ComponentName.jsx
├── Imports (external, then internal)
├── JSDoc comment
├── Component definition
└── Export
```

### Utility Files
```
utility-name.js
├── File-level JSDoc
├── Imports
├── Functions with JSDoc
└── Exports
```

## Comments

### Good Comments
```javascript
/**
 * Mengapa reverse progress?
 * - UX "Ground-to-Sky": user mulai dari bawah, scroll ke atas
 * - Progress bar harus terisi dari bawah ke atas untuk match visual flow
 */
const reversedProgress = useTransform(progress, [0, 1], [1, 0])
```

### Bad Comments
```javascript
// Reverse progress
const reversedProgress = useTransform(progress, [0, 1], [1, 0])
```

## Error Handling

### Pattern
```javascript
try {
  // Operation
} catch (error) {
  // Log untuk debugging
  console.error('Context:', error)
  // Return safe default
  return null
}
```

### Error Messages
```javascript
// ✅ Good - User-friendly, tidak expose details
setError('Gagal memuat data pohon. Silakan refresh halaman.')

// ❌ Bad - Expose internal details
setError(`Database error: ${error.stack}`)
```

## Security Best Practices

### Input Validation
```javascript
// ✅ Good
const sanitizedId = sanitizeTreeId(id)
if (!sanitizedId) {
  return null
}

// ❌ Bad
const treeId = parseInt(id) // No validation
```

### Path Construction
```javascript
// ✅ Good - Use path.join
const filePath = path.join(process.cwd(), 'public', 'data', 'trees.json')

// ❌ Bad - String concatenation
const filePath = process.cwd() + '/public/data/trees.json'
```

## React Patterns

### Hooks
```javascript
// ✅ Good - Clear dependencies
useEffect(() => {
  fetchData()
}, [id]) // Explicit dependency

// ❌ Bad - Missing dependencies
useEffect(() => {
  fetchData(id) // id not in dependencies
}, [])
```

### State Management
```javascript
// ✅ Good - Descriptive state names
const [isLoading, setIsLoading] = useState(false)
const [treeData, setTreeData] = useState(null)

// ❌ Bad - Unclear names
const [loading, setLoading] = useState(false)
const [data, setData] = useState(null)
```

## Testing

### Test Structure
```javascript
describe('FunctionName', () => {
  it('should handle valid input', () => {
    // Arrange
    const input = 'valid'
    
    // Act
    const result = functionName(input)
    
    // Assert
    expect(result).toBe(expected)
  })
})
```

## Accessibility

### ARIA Labels
```javascript
// ✅ Good
<button aria-label="Kembali ke halaman beranda">
  <span aria-hidden="true">←</span>
  Beranda
</button>

// ❌ Bad
<button>
  ← Beranda
</button>
```

## Performance

### Code Splitting
```javascript
// ✅ Good - Dynamic import
const { loadTreesDataServer } = await import('./data-server')

// ❌ Bad - Static import untuk server-only code
import { loadTreesDataServer } from './data-server'
```

## Git Commit Messages

Format: `type: description`

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code refactoring
- `test`: Tests
- `security`: Security fix

Example:
```
feat: add input validation for tree ID
fix: resolve hydration mismatch in Navigation
security: prevent path traversal in file operations
```

