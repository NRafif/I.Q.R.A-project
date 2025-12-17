import { sanitizeTreeId, sanitizeUrl, escapeHtml } from '../security'

describe('Security Utilities', () => {
  describe('sanitizeTreeId', () => {
    it('should accept valid positive integers', () => {
      expect(sanitizeTreeId('1')).toBe(1)
      expect(sanitizeTreeId('100')).toBe(100)
      expect(sanitizeTreeId(1)).toBe(1)
      expect(sanitizeTreeId(17)).toBe(17)
    })

    it('should reject negative numbers', () => {
      expect(sanitizeTreeId('-1')).toBeNull()
      expect(sanitizeTreeId(-1)).toBeNull()
    })

    it('should reject non-numeric strings', () => {
      expect(sanitizeTreeId('abc')).toBeNull()
      expect(sanitizeTreeId('1a')).toBeNull()
      expect(sanitizeTreeId('../../etc/passwd')).toBeNull()
      expect(sanitizeTreeId('1; DROP TABLE trees')).toBeNull()
    })

    it('should respect maxId limit', () => {
      expect(sanitizeTreeId('1000', 1000)).toBe(1000)
      expect(sanitizeTreeId('1001', 1000)).toBeNull()
      expect(sanitizeTreeId('9999', 1000)).toBeNull()
    })

    it('should reject zero', () => {
      expect(sanitizeTreeId('0')).toBeNull()
      expect(sanitizeTreeId(0)).toBeNull()
    })

    it('should handle empty or null input', () => {
      expect(sanitizeTreeId('')).toBeNull()
      expect(sanitizeTreeId(null)).toBeNull()
      expect(sanitizeTreeId(undefined)).toBeNull()
    })

    it('should trim whitespace', () => {
      expect(sanitizeTreeId('  1  ')).toBe(1)
      expect(sanitizeTreeId(' 100 ')).toBe(100)
    })
  })

  describe('sanitizeUrl', () => {
    it('should accept valid http URLs', () => {
      expect(sanitizeUrl('http://example.com')).toBe('http://example.com/')
      expect(sanitizeUrl('http://localhost:3000')).toBe('http://localhost:3000/')
    })

    it('should accept valid https URLs', () => {
      expect(sanitizeUrl('https://example.com')).toBe('https://example.com/')
      expect(sanitizeUrl('https://iqra-project.vercel.app')).toBe('https://iqra-project.vercel.app/')
    })

    it('should reject javascript URLs', () => {
      expect(sanitizeUrl('javascript:alert("xss")')).toBeNull()
      expect(sanitizeUrl('javascript:void(0)')).toBeNull()
    })

    it('should reject data URLs', () => {
      expect(sanitizeUrl('data:text/html,<script>alert("xss")</script>')).toBeNull()
    })

    it('should reject file URLs', () => {
      expect(sanitizeUrl('file:///etc/passwd')).toBeNull()
    })

    it('should reject invalid URLs', () => {
      expect(sanitizeUrl('not-a-url')).toBeNull()
      expect(sanitizeUrl('')).toBeNull()
      expect(sanitizeUrl(null)).toBeNull()
    })

    it('should respect allowedProtocols', () => {
      expect(sanitizeUrl('http://example.com', ['http'])).toBe('http://example.com/')
      expect(sanitizeUrl('https://example.com', ['http'])).toBeNull()
    })
  })

  describe('escapeHtml', () => {
    it('should escape HTML special characters', () => {
      // Note: '/' juga di-escape menjadi '&#x2F;' untuk security
      expect(escapeHtml('<script>alert("xss")</script>')).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;&#x2F;script&gt;')
      expect(escapeHtml('Hello & World')).toBe('Hello &amp; World')
      expect(escapeHtml("It's a test")).toBe('It&#39;s a test')
    })

    it('should handle non-string input', () => {
      expect(escapeHtml(123)).toBe('123')
      expect(escapeHtml(null)).toBe('null')
      expect(escapeHtml(undefined)).toBe('undefined')
    })

    it('should not escape safe characters', () => {
      expect(escapeHtml('Hello World')).toBe('Hello World')
      expect(escapeHtml('123')).toBe('123')
    })
  })
})

