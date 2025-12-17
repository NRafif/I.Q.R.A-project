/**
 * Client-side data utilities
 * 
 * File ini menangani data loading di client-side menggunakan fetch API.
 * Menggunakan environment detection untuk memilih antara client/server utilities.
 * 
 * Architecture decision:
 * - Client-side menggunakan fetch untuk consistency dengan browser APIs
 * - Server-side fallback ke data-server.js untuk performance
 * - Environment detection memastikan code bekerja di kedua context
 */

import { sanitizeTreeId } from './security'

/**
 * Load data pohon dari JSON
 * 
 * Mengapa environment detection?
 * - Next.js components bisa di-render di server (SSR) atau client
 * - fetch() tidak tersedia di Node.js < 18, jadi perlu fallback
 * - Server-side menggunakan fs untuk performance yang lebih baik
 * 
 * @returns {Promise<Array>} Array of tree objects
 */
export async function loadTreesData() {
  try {
    // Environment detection: check if running in browser
    // typeof window === 'undefined' berarti kita di server-side
    if (typeof window === 'undefined') {
      // Server-side: use server utility untuk performance
      // Dynamic import untuk code splitting
      const { loadTreesDataServer } = await import('./data-server')
      return await loadTreesDataServer()
    }
    
    // Client-side: use fetch API
    // Menggunakan window.location.origin untuk absolute URL
    // Mencegah issues dengan relative URLs di production
    const baseUrl = window.location.origin
    const response = await fetch(`${baseUrl}/data/trees.json`, { 
      cache: 'no-store', // Always fetch fresh data
      headers: {
        'Accept': 'application/json',
      },
    })
    
    if (!response.ok) {
      throw new Error(`Failed to load trees data: ${response.status} ${response.statusText}`)
    }
    
    const data = await response.json()
    
    // Type validation: memastikan response adalah array
    // Mencegah jika server mengembalikan object atau tipe lain
    if (!Array.isArray(data)) {
      throw new Error('Invalid data format: expected array')
    }
    
    return data
  } catch (error) {
    // Graceful error handling: return empty array instead of throwing
    // Mencegah app crash dan memberikan fallback UI
    console.error('Error loading trees data:', error)
    return []
  }
}

/**
 * Get tree by ID (works in both client and server)
 * 
 * Security: Menggunakan sanitizeTreeId untuk input validation
 * Architecture: Environment-aware untuk optimal performance
 * 
 * @param {number|string} id - Tree ID (akan divalidasi)
 * @param {Array} treesData - Array of trees (optional, untuk avoid re-fetch)
 * @returns {Promise<Object|null>} Tree object or null if not found
 */
export async function getTreeById(id, treesData = null) {
  try {
    // Input sanitization: validasi ID sebelum digunakan
    // Mencegah injection attacks dan invalid input
    const sanitizedId = sanitizeTreeId(id)
    
    if (!sanitizedId) {
      return null
    }
    
    let trees = treesData
    
    if (!trees) {
      // Environment detection untuk optimal path
      if (typeof window === 'undefined') {
        // Server-side: use server utility
        const { getTreeByIdServer } = await import('./data-server')
        return await getTreeByIdServer(sanitizedId)
      }
      // Client-side: fetch data
      trees = await loadTreesData()
    }
    
    // Find dengan strict equality untuk type safety
    // Menggunakan sanitizedId yang sudah divalidasi
    const tree = trees.find(t => t.id === sanitizedId)
    
    return tree || null
  } catch (error) {
    // Error handling: return null untuk graceful degradation
    // Tidak expose error details untuk security
    console.error('Error getting tree by ID:', error)
    return null
  }
}

/**
 * Validate tree data structure
 * 
 * Mengapa validasi ini penting?
 * - Mencegah runtime errors jika data JSON corrupted
 * - Memastikan UI components menerima data dengan struktur yang diharapkan
 * - Type safety untuk TypeScript-like validation di JavaScript
 * 
 * @param {Object} tree - Tree object to validate
 * @returns {boolean} True if valid
 */
export function validateTreeData(tree) {
  // Type check: memastikan tree adalah object
  // Null check untuk mencegah null/undefined errors
  if (!tree || typeof tree !== 'object' || Array.isArray(tree)) {
    return false
  }
  
  // Required fields untuk tree object
  // Setiap field diperlukan untuk rendering UI yang proper
  const requiredFields = ['id', 'common_name', 'scientific_name', 'family', 'location', 'content']
  
  // Check required fields dengan hasOwnProperty untuk strict check
  // Menggunakan 'in' operator untuk check existence
  for (const field of requiredFields) {
    if (!(field in tree)) {
      return false
    }
  }
  
  // Validate content structure
  // Content adalah nested object dengan struktur spesifik
  if (!tree.content || typeof tree.content !== 'object' || Array.isArray(tree.content)) {
    return false
  }
  
  // Required fields untuk content object
  // Setiap section diperlukan untuk UX "Ground-to-Sky"
  const requiredContentFields = ['sky_section', 'canopy_section', 'trunk_section', 'root_section']
  
  for (const field of requiredContentFields) {
    if (!(field in tree.content)) {
      return false
    }
  }
  
  return true
}

/**
 * Get default/fallback tree data
 * @returns {Object} Default tree object
 */
export function getDefaultTree() {
  return {
    id: 0,
    common_name: 'Pohon Tidak Ditemukan',
    scientific_name: 'Unknown species',
    family: 'Unknown',
    location: 'Tidak diketahui',
    content: {
      sky_section: {
        headline: 'Pohon Tidak Ditemukan',
        sub_headline: 'Maaf, informasi pohon yang Anda cari tidak tersedia dalam database kami.'
      },
      canopy_section: {
        title: 'Informasi Tidak Tersedia',
        description: 'Silakan kembali ke halaman utama untuk melihat daftar pohon yang tersedia.'
      },
      trunk_section: [
        {
          type: 'Error',
          title: 'Data Tidak Ditemukan',
          description: 'Pohon dengan ID yang diminta tidak ditemukan dalam database.'
        }
      ],
      root_section: {
        description: 'Data pohon tidak tersedia.'
      }
    }
  }
}

