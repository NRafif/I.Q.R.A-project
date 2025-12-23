/**
 * SWR Hooks for Data Fetching with Caching
 * 
 * File ini berisi custom hooks menggunakan SWR untuk:
 * - Automatic caching
 * - Revalidation on focus
 * - Deduplication of requests
 * - Error retry
 * 
 * @see https://swr.vercel.app/
 */

import useSWR from 'swr'

/**
 * Fetcher function untuk SWR
 * Menggunakan fetch API dengan error handling
 */
const fetcher = async (url) => {
    const response = await fetch(url)

    if (!response.ok) {
        const error = new Error('Failed to fetch data')
        error.status = response.status
        throw error
    }

    return response.json()
}

/**
 * SWR Configuration defaults
 * 
 * - revalidateOnFocus: Refresh data saat user kembali ke tab
 * - revalidateOnReconnect: Refresh saat internet kembali
 * - dedupingInterval: Hindari request duplikat dalam 5 detik
 * - errorRetryCount: Retry 3 kali jika error
 */
const defaultConfig = {
    revalidateOnFocus: true,
    revalidateOnReconnect: true,
    dedupingInterval: 5000,
    errorRetryCount: 3,
    errorRetryInterval: 1000,
}

/**
 * Hook untuk mengambil semua data pohon dengan caching
 * 
 * Features:
 * - Automatic caching - data di-cache di memory
 * - Stale-while-revalidate - tampilkan cache sambil fetch fresh data
 * - Focus revalidation - refresh saat user kembali ke tab
 * 
 * @returns {Object} { trees, isLoading, isError, mutate }
 * 
 * @example
 * const { trees, isLoading, isError } = useTreesData()
 */
export function useTreesData() {
    const { data, error, isLoading, mutate } = useSWR(
        '/data/trees.json',
        fetcher,
        {
            ...defaultConfig,
            // Cache trees data for longer since it rarely changes
            dedupingInterval: 60000, // 1 minute
        }
    )

    return {
        trees: data || [],
        isLoading,
        isError: error,
        mutate, // Function to manually revalidate
    }
}

/**
 * Hook untuk mengambil data pohon spesifik dengan caching
 * 
 * @param {number|string} id - Tree ID
 * @returns {Object} { tree, isLoading, isError, mutate }
 * 
 * @example
 * const { tree, isLoading, isError } = useTreeById(13)
 */
export function useTreeById(id) {
    // Use all trees endpoint and filter client-side
    // This leverages SWR's cache if trees are already loaded
    const { data, error, isLoading, mutate } = useSWR(
        id ? '/data/trees.json' : null, // Don't fetch if no ID
        fetcher,
        defaultConfig
    )

    // Find specific tree from cached data
    const tree = data?.find(t => t.id === Number(id)) || null

    return {
        tree,
        isLoading,
        isError: error,
        notFound: !isLoading && !error && !tree,
        mutate,
    }
}

/**
 * Hook untuk prefetch data pohon
 * Berguna untuk preloading sebelum navigasi
 * 
 * @example
 * // Di TreeCard component
 * onMouseEnter={() => prefetchTree(tree.id)}
 */
export function usePrefetch() {
    const prefetchTrees = () => {
        // Trigger SWR to fetch and cache
        fetch('/data/trees.json')
    }

    return {
        prefetchTrees,
    }
}
