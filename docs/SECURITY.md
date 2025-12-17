# Security Documentation

## Overview

Dokumen ini menjelaskan security measures yang diimplementasikan di project I.Q.R.A.

## Security Measures

### 1. Input Validation

#### Tree ID Validation
- **Location**: `website/src/lib/security.js` → `sanitizeTreeId()`
- **Protection**: Path traversal, injection attacks, invalid input
- **Rules**:
  - Hanya menerima angka positif
  - Range: 1 - 1000 (configurable)
  - Rejects: negative numbers, strings, special characters

**Example:**
```javascript
sanitizeTreeId("1") // ✅ 1
sanitizeTreeId("../../etc/passwd") // ❌ null
sanitizeTreeId("-1") // ❌ null
```

#### URL Validation
- **Location**: `website/src/lib/security.js` → `sanitizeUrl()`
- **Protection**: XSS via malicious URLs
- **Rules**:
  - Hanya http/https protocols
  - Rejects: javascript:, data:, file:, dll

### 2. Path Traversal Protection

#### File Operations
- **Location**: `website/src/lib/data-server.js`
- **Protection**: Directory traversal attacks
- **Measures**:
  - Hardcoded file paths
  - Path validation sebelum file access
  - Path normalization

**Implementation:**
```javascript
// ✅ Safe - Hardcoded path
const dataFilePath = path.join(process.cwd(), 'public', 'data', 'trees.json')

// ❌ Unsafe - User input
const filePath = path.join(process.cwd(), userInput)
```

### 3. XSS Prevention

#### HTML Escaping
- **Location**: `website/src/lib/security.js` → `escapeHtml()`
- **Protection**: Cross-Site Scripting
- **Usage**: Untuk user-generated content (jika ada)

#### React Default Protection
- React secara default escape semua output
- Tidak perlu manual escaping untuk props

### 4. Error Handling

#### Information Disclosure Prevention
- Error messages tidak expose:
  - File paths
  - Stack traces
  - Internal implementation details
  - Database structure

**Example:**
```javascript
// ✅ Good
catch (error) {
  console.error('Error:', error) // Log untuk debugging
  return null // Safe default untuk user
}

// ❌ Bad
catch (error) {
  throw new Error(`File ${filePath} not found: ${error.stack}`)
}
```

### 5. Environment Variables

#### Secure Storage
- `.env.local` di `.gitignore`
- `.env.example` untuk documentation
- No hardcoded secrets

#### Validation
- URL validation untuk `NEXT_PUBLIC_BASE_URL`
- Default values untuk development

### 6. QR Code Generator Security

#### Filename Sanitization
- **Location**: `qr-generator/generate_qr.py` → `sanitize_filename()`
- **Protection**: Path traversal, invalid characters
- **Rules**:
  - Remove special characters
  - Replace spaces dengan underscores
  - Limit length untuk prevent DoS

#### URL Validation
- Validate base URL sebelum digunakan
- Reject malicious protocols

## Security Checklist

### Input Validation
- [x] Tree ID validation
- [x] URL validation
- [x] Filename sanitization
- [x] Path validation

### Output Encoding
- [x] HTML escaping utility
- [x] React default escaping
- [x] URL encoding

### Error Handling
- [x] No information disclosure
- [x] Graceful error handling
- [x] Safe default values

### File Operations
- [x] Path traversal protection
- [x] Hardcoded safe paths
- [x] File existence checks

### Environment Security
- [x] .env in .gitignore
- [x] No hardcoded secrets
- [x] Environment variable validation

## Security Best Practices

### 1. Always Validate Input
```javascript
// ✅ Good
const sanitizedId = sanitizeTreeId(id)
if (!sanitizedId) return null

// ❌ Bad
const treeId = parseInt(id) // No validation
```

### 2. Use Safe Path Construction
```javascript
// ✅ Good
const path = require('path')
const filePath = path.join(baseDir, 'data', 'file.json')

// ❌ Bad
const filePath = `${baseDir}/data/${filename}` // Path traversal risk
```

### 3. Sanitize User Input
```javascript
// ✅ Good
const safeName = sanitizeFilename(userInput)

// ❌ Bad
const filename = userInput // Direct use
```

### 4. Error Handling
```javascript
// ✅ Good
try {
  // Operation
} catch (error) {
  console.error('Context:', error) // Log untuk debugging
  return null // Safe default
}

// ❌ Bad
try {
  // Operation
} catch (error) {
  throw error // Expose error details
}
```

## Known Limitations

1. **No Authentication**: Project ini adalah public-facing, tidak ada user authentication
2. **No Rate Limiting**: Belum diimplementasikan (placeholder ada di security.js)
3. **Static Data**: Data dari JSON file, tidak ada database (reduces attack surface)

## Future Security Enhancements

1. **Rate Limiting**: Implement rate limiting untuk prevent abuse
2. **CSP Headers**: Content Security Policy headers
3. **HTTPS Enforcement**: Force HTTPS di production
4. **Input Sanitization**: Enhanced sanitization untuk future user inputs

## Reporting Security Issues

Jika menemukan security vulnerability, silakan:
1. Jangan buat public issue
2. Contact maintainers secara private
3. Berikan detail tentang vulnerability
4. Tunggu fix sebelum disclose

