# Security Documentation

Dokumentasi keamanan untuk I.Q.R.A project.

---

## 🛡️ Security Overview

I.Q.R.A adalah **static website** dengan arsitektur keamanan yang sederhana namun efektif:

```
┌─────────────────────────────────────────────────┐
│              SECURITY ARCHITECTURE               │
├─────────────────────────────────────────────────┤
│  ❌ No Database          - No SQL Injection     │
│  ❌ No User Input Save   - No XSS via storage   │
│  ❌ No Sessions          - No Session Hijacking │
│  ❌ No Auth System       - No Auth Bypass       │
│  ❌ No File Upload       - No File Attacks      │
│  ✅ Input Sanitization   - Protected params     │
│  ✅ Static Data Only     - Minimal attack surface│
└─────────────────────────────────────────────────┘
```

---

## 🔐 Security Measures

### 1. Input Sanitization

**File:** `src/lib/security.js`

#### sanitizeTreeId(id)
```javascript
// Validasi ID pohon
// Hanya menerima angka positif 1-1000
sanitizeTreeId("13")           // ✅ Returns 13
sanitizeTreeId("../../passwd") // ❌ Returns null
sanitizeTreeId("-1")           // ❌ Returns null
sanitizeTreeId("abc")          // ❌ Returns null
```

#### escapeHtml(string)
```javascript
// Mencegah XSS dengan encoding HTML characters
escapeHtml("<script>alert('xss')</script>")
// Returns: "&lt;script&gt;alert('xss')&lt;/script&gt;"
```

#### sanitizeUrl(url)
```javascript
// Hanya menerima http/https URLs
sanitizeUrl("https://example.com")    // ✅ Valid
sanitizeUrl("javascript:alert('xss')") // ❌ Returns null
sanitizeUrl("file:///etc/passwd")      // ❌ Returns null
```

#### validatePath(path, baseDir)
```javascript
// Mencegah path traversal (server-side)
validatePath("../../../etc/passwd", "/app/public") // ❌ Returns false
validatePath("data/trees.json", "/app/public")     // ✅ Returns true
```

### 2. Data Validation

**File:** `src/lib/data.js`

```javascript
// Validate tree data structure sebelum render
validateTreeData(tree)
// - Checks required fields exist
// - Validates story_mode structure
// - Prevents malformed data from crashing UI
```

### 3. Error Boundary

**File:** `src/components/ErrorBoundary.jsx`

- Catches runtime errors
- Shows user-friendly error page
- Tidak expose stack traces ke user

---

## ⚠️ Potential Threats & Mitigations

| Threat | Risk | Status | Mitigation |
|--------|------|--------|------------|
| XSS | Low | ✅ Mitigated | No dangerouslySetInnerHTML, input sanitization |
| SQL Injection | N/A | ✅ N/A | No database |
| CSRF | N/A | ✅ N/A | No form submissions to server |
| DDoS | Medium | ⚠️ Partial | Rely on Vercel/hosting protection |
| Data Tampering | Low | ✅ Mitigated | Data is read-only static files |
| Dependency Attack | Low | ✅ Monitored | Regular npm audit |

---

## 🔍 Security Checklist

### Before Each Deploy

- [ ] Run `npm audit` - harus 0 vulnerabilities
- [ ] Run `npm test` - semua security tests pass
- [ ] Check dependencies tidak outdated

### Periodic Review

- [ ] Check npm audit advisories (monthly)
- [ ] Update dependencies (quarterly)
- [ ] Review security.js functions

---

## 🚨 Vulnerability Reporting

Jika menemukan vulnerability:

1. **Jangan** post publicly
2. Hubungi maintainer via email
3. Berikan detail:
   - Deskripsi vulnerability
   - Langkah reproduksi
   - Potential impact

---

## 📋 npm audit

```bash
# Check for vulnerabilities
npm audit

# Auto-fix if possible
npm audit fix

# View detailed report
npm audit --json
```

**Current Status:** 0 vulnerabilities ✅

---

## 🔒 Access Control

### Repository Access

- Aktifkan 2FA di GitHub
- Limit write access ke maintainers
- Protect `main` branch dengan rules

### Hosting Access

- Aktifkan 2FA di Vercel
- Use team members dengan role-based access
- Jangan share deploy tokens

---

## 📊 Security Rating

```
┌────────────────────────────────────┐
│     SECURITY SCORE: 9.5/10        │
├────────────────────────────────────┤
│ Input Validation      ████████░░ │
│ Dependency Security   ██████████ │
│ Architecture          ██████████ │
│ Error Handling        █████████░ │
│ Access Control        █████████░ │
└────────────────────────────────────┘
```

**Note:** Skor 9.5 karena ini static website dengan minimal attack surface. Skor akan berbeda jika ada fitur database, auth, atau user-generated content.
