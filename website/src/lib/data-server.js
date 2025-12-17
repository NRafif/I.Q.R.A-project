/**
 * Server-side data utilities
 * 
 * File ini menangani operasi file system untuk membaca data pohon di server-side.
 * Menggunakan fs.readFileSync karena Next.js server components adalah synchronous.
 * 
 * Security considerations:
 * - Path construction menggunakan path.join untuk mencegah path traversal
 * - File path hardcoded ke public/data/trees.json untuk mencegah arbitrary file access
 * - Input validation dilakukan di getTreeByIdServer sebelum digunakan
 */

import fs from 'fs'
import path from 'path'
import { sanitizeTreeId } from './security'

// Hardcode path ke data file untuk mencegah path traversal attacks
// Menggunakan path.join untuk cross-platform compatibility
const DATA_DIR = path.join(process.cwd(), 'public', 'data')
const DATA_FILE = 'trees.json'
const dataFilePath = path.join(DATA_DIR, DATA_FILE)

/**
 * Load data pohon dari JSON file (server-side only)
 * 
 * Mengapa menggunakan readFileSync?
 * - Next.js server components adalah synchronous, jadi kita tidak bisa menggunakan async/await
 * - File ini hanya dipanggil saat build time atau server-side rendering
 * - File size kecil (JSON), jadi blocking tidak menjadi masalah
 * 
 * @returns {Promise<Array>} Array of tree objects
 * @throws {Error} Jika file tidak ditemukan atau format tidak valid
 */
export async function loadTreesDataServer() {
  try {
    // Validasi bahwa file path masih dalam directory yang diizinkan
    // Double check untuk mencegah path manipulation
    const resolvedPath = path.resolve(dataFilePath)
    const expectedBase = path.resolve(DATA_DIR)
    
    if (!resolvedPath.startsWith(expectedBase)) {
      throw new Error('Invalid file path: potential path traversal detected')
    }
    
    // Check if file exists sebelum membaca
    if (!fs.existsSync(dataFilePath)) {
      console.warn(`Data file not found: ${dataFilePath}`)
      return []
    }
    
    const fileContents = fs.readFileSync(dataFilePath, 'utf8')
    const data = JSON.parse(fileContents)
    
    // Validasi bahwa data adalah array
    // Mencegah jika file JSON diubah menjadi object atau tipe lain
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format: expected array')
    }
    
    return data
  } catch (error) {
    // Log error untuk debugging, tapi return empty array untuk graceful degradation
    // Tidak expose error details ke client untuk security
    console.error('Error loading trees data (server):', error.message)
    return []
  }
}

/**
 * Get tree by ID (server-side)
 * 
 * Security: Menggunakan sanitizeTreeId untuk mencegah injection attacks
 * Validasi dilakukan sebelum query untuk mencegah NoSQL injection (jika menggunakan DB)
 * 
 * @param {number|string} id - Tree ID (akan divalidasi dan disanitize)
 * @returns {Promise<Object|null>} Tree object or null if not found
 */
export async function getTreeByIdServer(id) {
  try {
    // Sanitize dan validasi ID sebelum digunakan
    // Mencegah path traversal, injection, dan invalid input
    const sanitizedId = sanitizeTreeId(id)
    
    if (!sanitizedId) {
      // Return null untuk invalid ID, jangan throw error
      // Mencegah information disclosure tentang struktur data
      return null
    }
    
    const trees = await loadTreesDataServer()
    
    // Find tree dengan strict equality untuk mencegah type coercion issues
    const tree = trees.find(t => t.id === sanitizedId)
    
    return tree || null
  } catch (error) {
    // Log error untuk debugging, tapi return null untuk security
    // Tidak expose error details ke client
    console.error('Error getting tree by ID (server):', error.message)
    return null
  }
}

