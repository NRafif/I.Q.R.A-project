import { loadTreesData, getTreeById, validateTreeData, getDefaultTree } from '../data'

// Mock fetch dan window object
global.fetch = jest.fn()

// Mock window object untuk client-side tests
Object.defineProperty(window, 'location', {
  value: {
    origin: 'http://localhost',
  },
  writable: true,
})

describe('Data Utilities', () => {
  beforeEach(() => {
    fetch.mockClear()
    // Ensure window is defined untuk client-side tests
    global.window = { location: { origin: 'http://localhost' } }
  })

  describe('loadTreesData', () => {
    it('should load trees data successfully', async () => {
      const mockData = [
        {
          id: 1,
          common_name: 'Test Tree',
          scientific_name: 'Testus treeus',
          family: 'Testaceae',
          location: 'Test Location',
          content: {
            sky_section: { headline: 'Test', sub_headline: 'Test desc' },
            canopy_section: { title: 'Test', description: 'Test' },
            trunk_section: [],
            root_section: { description: 'Test' },
          },
        },
      ]

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockData,
      })

      const result = await loadTreesData()
      expect(result).toEqual(mockData)
      // Update expectation untuk match actual implementation dengan baseUrl dan headers
      expect(fetch).toHaveBeenCalledWith(
        'http://localhost/data/trees.json',
        {
          cache: 'no-store',
          headers: {
            'Accept': 'application/json',
          },
        }
      )
    })

    it('should return empty array on error', async () => {
      fetch.mockRejectedValueOnce(new Error('Network error'))

      const result = await loadTreesData()
      expect(result).toEqual([])
    })

    it('should return empty array on invalid response', async () => {
      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      })

      const result = await loadTreesData()
      expect(result).toEqual([])
    })
  })

  describe('getTreeById', () => {
    it('should return tree by id', async () => {
      const mockTree = {
        id: 1,
        common_name: 'Test Tree',
        scientific_name: 'Testus treeus',
        family: 'Testaceae',
        location: 'Test Location',
        content: {
          sky_section: { headline: 'Test', sub_headline: 'Test desc' },
          canopy_section: { title: 'Test', description: 'Test' },
          trunk_section: [],
          root_section: { description: 'Test' },
        },
      }

      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [mockTree],
      })

      const result = await getTreeById(1)
      expect(result).toEqual(mockTree)
    })

    it('should return null for non-existent id', async () => {
      fetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      })

      const result = await getTreeById(999)
      expect(result).toBeNull()
    })

    it('should return null for invalid id', async () => {
      const result = await getTreeById('invalid')
      expect(result).toBeNull()
    })
  })

  describe('validateTreeData', () => {
    it('should validate correct tree data', () => {
      const validTree = {
        id: 1,
        common_name: 'Test',
        scientific_name: 'Test',
        family: 'Test',
        location: 'Test',
        content: {
          sky_section: {},
          canopy_section: {},
          trunk_section: [],
          root_section: {},
        },
      }

      expect(validateTreeData(validTree)).toBe(true)
    })

    it('should reject invalid tree data', () => {
      expect(validateTreeData(null)).toBe(false)
      expect(validateTreeData({})).toBe(false)
      expect(validateTreeData({ id: 1 })).toBe(false)
      expect(validateTreeData({ id: 1, common_name: 'Test' })).toBe(false)
    })
  })

  describe('getDefaultTree', () => {
    it('should return default tree structure', () => {
      const defaultTree = getDefaultTree()
      expect(defaultTree).toHaveProperty('id', 0)
      expect(defaultTree).toHaveProperty('common_name')
      expect(defaultTree).toHaveProperty('content')
      expect(defaultTree.content).toHaveProperty('sky_section')
      expect(defaultTree.content).toHaveProperty('canopy_section')
      expect(defaultTree.content).toHaveProperty('trunk_section')
      expect(defaultTree.content).toHaveProperty('root_section')
    })
  })
})

