import { loadTreesDataServer, getTreeByIdServer } from '../data-server'
import fs from 'fs'
import path from 'path'

// Mock fs module
jest.mock('fs', () => ({
  existsSync: jest.fn(),
  readFileSync: jest.fn(),
}))

// Mock path
jest.mock('path', () => ({
  join: jest.fn((...args) => args.join('/')),
  resolve: jest.fn((...args) => args.join('/')),
}))

describe('Server Data Utilities', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Suppress console.error for expected errors
    jest.spyOn(console, 'error').mockImplementation(() => { })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })

  describe('loadTreesDataServer', () => {
    it('should load trees data successfully', async () => {
      const mockData = [
        {
          id: 1,
          common_name: 'Test Tree',
          scientific_name: 'Testus treeus',
          family: 'Testaceae',
          location: 'Test',
          story_mode: {
            sky_section: {},
            canopy_section: {},
            trunk_section: [],
            root_section: {},
          },
          anatomy_mode: {},
        },
      ]

      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify(mockData))

      const result = await loadTreesDataServer()
      expect(result).toEqual(mockData)
    })

    it('should return empty array if file does not exist', async () => {
      fs.existsSync.mockReturnValue(false)

      const result = await loadTreesDataServer()
      expect(result).toEqual([])
    })

    it('should return empty array on invalid JSON', async () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue('invalid json')

      const result = await loadTreesDataServer()
      expect(result).toEqual([])
    })

    it('should return empty array if data is not array', async () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify({ not: 'array' }))

      const result = await loadTreesDataServer()
      expect(result).toEqual([])
    })
  })

  describe('getTreeByIdServer', () => {
    it('should return tree by valid ID', async () => {
      const mockData = [
        {
          id: 1,
          common_name: 'Test Tree',
          scientific_name: 'Testus treeus',
          family: 'Testaceae',
          location: 'Test',
          story_mode: {
            sky_section: {},
            canopy_section: {},
            trunk_section: [],
            root_section: {},
          },
          anatomy_mode: {},
        },
      ]

      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify(mockData))

      const result = await getTreeByIdServer(1)
      expect(result).toEqual(mockData[0])
    })

    it('should return null for invalid ID', async () => {
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify([]))

      expect(await getTreeByIdServer('invalid')).toBeNull()
      expect(await getTreeByIdServer(-1)).toBeNull()
      expect(await getTreeByIdServer(999)).toBeNull()
    })

    it('should return null for out of range ID', async () => {
      const mockData = [{
        id: 1,
        common_name: 'Test',
        scientific_name: 'Test',
        family: 'Test',
        location: 'Test',
        story_mode: {},
        anatomy_mode: {}
      }]
      fs.existsSync.mockReturnValue(true)
      fs.readFileSync.mockReturnValue(JSON.stringify(mockData))

      const result = await getTreeByIdServer(9999) // Exceeds maxId default (1000)
      expect(result).toBeNull()
    })
  })
})
