/**
 * Security utilities untuk input validation dan sanitization
 * 
 * File ini berisi fungsi-fungsi keamanan untuk mencegah:
 * - Path traversal attacks
 * - XSS (Cross-Site Scripting)
 * - Injection attacks
 * - Invalid input handling
 */

/**
 * Validasi dan sanitize ID pohon
 * Hanya menerima angka positif dalam range yang valid
 * 
 * @param {string|number} id - ID yang akan divalidasi
 * @param {number} maxId - ID maksimum yang diizinkan (default: 1000)
 * @returns {number|null} - ID yang sudah divalidasi atau null jika invalid
 * 
 * @example
 * sanitizeTreeId("1") // returns 1
 * sanitizeTreeId("../../etc/passwd") // returns null
 * sanitizeTreeId("-1") // returns null
 */
export function sanitizeTreeId(id, maxId = 1000) {
  // Convert to string untuk validasi
  const idStr = String(id).trim()
  
  // Reject jika kosong atau mengandung karakter non-numeric
  // Regex ini memastikan hanya angka positif yang diterima
  if (!/^\d+$/.test(idStr)) {
    return null
  }
  
  // Parse ke integer
  const parsedId = parseInt(idStr, 10)
  
  // Validasi range: harus positif dan tidak melebihi maxId
  // Menggunakan maxId untuk mencegah DoS dengan ID yang sangat besar
  if (isNaN(parsedId) || parsedId <= 0 || parsedId > maxId) {
    return null
  }
  
  return parsedId
}

/**
 * Validasi dan sanitize URL
 * Memastikan URL adalah valid dan aman untuk digunakan
 * 
 * @param {string} url - URL yang akan divalidasi
 * @param {string[]} allowedProtocols - Protocol yang diizinkan (default: ['http', 'https'])
 * @returns {string|null} - URL yang sudah divalidasi atau null jika invalid
 * 
 * @example
 * sanitizeUrl("https://example.com") // returns "https://example.com"
 * sanitizeUrl("javascript:alert('xss')") // returns null
 */
export function sanitizeUrl(url, allowedProtocols = ['http', 'https']) {
  if (!url || typeof url !== 'string') {
    return null
  }
  
  try {
    const urlObj = new URL(url)
    
    // Validasi protocol - hanya http/https yang diizinkan
    // Mencegah javascript:, data:, file: dan protocol berbahaya lainnya
    if (!allowedProtocols.includes(urlObj.protocol.replace(':', ''))) {
      return null
    }
    
    return urlObj.toString()
  } catch (error) {
    // URL tidak valid
    return null
  }
}

/**
 * Escape HTML untuk mencegah XSS
 * Mengkonversi karakter HTML berbahaya menjadi entity
 * 
 * @param {string} str - String yang akan di-escape
 * @returns {string} - String yang sudah di-escape
 * 
 * @example
 * escapeHtml("<script>alert('xss')</script>") // returns "&lt;script&gt;alert('xss')&lt;/script&gt;"
 */
export function escapeHtml(str) {
  if (typeof str !== 'string') {
    return String(str)
  }
  
  const htmlEscapes = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
    '/': '&#x2F;',
  }
  
  return str.replace(/[&<>"'/]/g, (char) => htmlEscapes[char] || char)
}

/**
 * Validasi path untuk mencegah path traversal
 * Memastikan path tidak mengandung karakter berbahaya seperti ../
 * 
 * @param {string} filePath - Path yang akan divalidasi
 * @param {string} baseDir - Base directory yang diizinkan
 * @returns {boolean} - True jika path valid dan aman
 * 
 * @example
 * validatePath("../etc/passwd", "/app/public") // returns false
 * validatePath("data/trees.json", "/app/public") // returns true
 */
/**
 * Validasi path untuk mencegah path traversal (server-side only)
 * 
 * Note: Function ini hanya digunakan di server-side utilities.
 * Client-side tidak memerlukan path validation karena tidak ada file operations.
 * 
 * @param {string} filePath - Path yang akan divalidasi
 * @param {string} baseDir - Base directory yang diizinkan
 * @returns {boolean} - True jika path valid dan aman
 */
export function validatePath(filePath, baseDir) {
  // Client-side: path validation tidak diperlukan
  // Return false untuk safety jika dipanggil di client
  if (typeof window !== 'undefined') {
    return false
  }
  
  // Server-side: import path module
  // Menggunakan require karena ini adalah server-only function
  try {
    const path = require('path')
    
    if (!filePath || typeof filePath !== 'string' || !baseDir) {
      return false
    }
    
    // Normalize path untuk menghindari path traversal
    // path.normalize() akan resolve . dan .. characters
    const normalizedPath = path.normalize(filePath)
    
    // Cek apakah path mengandung karakter berbahaya
    // Path traversal attempts seperti ../ atau ..\\ harus ditolak
    // Absolute paths juga ditolak untuk force relative paths
    if (normalizedPath.includes('..') || path.isAbsolute(normalizedPath)) {
      return false
    }
    
    // Resolve path relatif terhadap base directory
    const resolvedPath = path.resolve(baseDir, normalizedPath)
    const resolvedBase = path.resolve(baseDir)
    
    // Pastikan resolved path masih dalam base directory
    // Mencegah directory traversal dengan memastikan path tidak keluar dari baseDir
    // Menggunakan startsWith untuk check containment
    if (!resolvedPath.startsWith(resolvedBase)) {
      return false
    }
    
    return true
  } catch (error) {
    // Error saat validasi: return false untuk safety
    // Tidak log error untuk avoid information disclosure
    return false
  }
}

/**
 * Rate limiting helper (untuk future use)
 * Mencegah abuse dengan membatasi request per IP
 * 
 * @param {string} identifier - Identifier (IP address, user ID, etc.)
 * @param {number} maxRequests - Maximum requests allowed
 * @param {number} windowMs - Time window in milliseconds
 * @returns {boolean} - True jika request diizinkan
 */
export function checkRateLimit(identifier, maxRequests = 100, windowMs = 60000) {
  // Implementation placeholder untuk future rate limiting
  // Bisa diimplementasikan dengan Redis atau in-memory cache
  // Untuk sekarang, selalu return true
  return true
}

