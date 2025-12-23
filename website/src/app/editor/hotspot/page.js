'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { loadTreesData } from '@/lib/data'

export default function HotspotEditorPage() {
    const [trees, setTrees] = useState([])
    const [selectedTreeId, setSelectedTreeId] = useState(null)
    const [coordinates, setCoordinates] = useState({ x: 0, y: 0 })
    const [hotspots, setHotspots] = useState([])
    const [copied, setCopied] = useState(false)
    const imageContainerRef = useRef(null)

    useEffect(() => {
        async function fetchTrees() {
            const data = await loadTreesData()
            setTrees(data)
            if (data.length > 0) {
                setSelectedTreeId(data[0].id)
            }
        }
        fetchTrees()
    }, [])

    const selectedTree = trees.find(t => t.id === selectedTreeId)
    const backgroundImage = selectedTree?.assets?.background || '/assets/tree-silhouette.png'

    const handleImageClick = (e) => {
        if (!imageContainerRef.current) return

        const rect = imageContainerRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        setCoordinates({
            x: Math.round(x * 10) / 10,
            y: Math.round(y * 10) / 10
        })
    }

    const handleMouseMove = (e) => {
        if (!imageContainerRef.current) return

        const rect = imageContainerRef.current.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        // Update live coordinates display
        document.getElementById('live-coords').textContent =
            `X: ${Math.round(x * 10) / 10}% | Y: ${Math.round(y * 10) / 10}%`
    }

    const addHotspot = () => {
        const newHotspot = {
            part: "Part Name",
            label: "Label Text",
            position: {
                x: coordinates.x,
                y: coordinates.y
            },
            text: "Description text here"
        }
        setHotspots([...hotspots, newHotspot])
    }

    const removeHotspot = (index) => {
        setHotspots(hotspots.filter((_, i) => i !== index))
    }

    const copyToClipboard = () => {
        const json = JSON.stringify(hotspots, null, 4)
        navigator.clipboard.writeText(json)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    const copyCoordinate = () => {
        const coordText = `"position": { "x": ${coordinates.x}, "y": ${coordinates.y} }`
        navigator.clipboard.writeText(coordText)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <main className="min-h-screen bg-gray-100 p-6">
            {/* Header */}
            <div className="max-w-7xl mx-auto mb-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Hotspot Editor</h1>
                        <p className="text-gray-600 text-sm">Click on the image to get coordinates for hotspots</p>
                    </div>
                    <Link
                        href="/"
                        className="bg-white px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm font-medium"
                    >
                        ← Kembali
                    </Link>
                </div>
            </div>

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Panel - Image */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-4">
                    {/* Tree Selector */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Pilih Pohon:</label>
                        <select
                            value={selectedTreeId || ''}
                            onChange={(e) => setSelectedTreeId(Number(e.target.value))}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                        >
                            {trees.map(tree => (
                                <option key={tree.id} value={tree.id}>
                                    {tree.id}. {tree.common_name} ({tree.scientific_name})
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Live Coordinates */}
                    <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-500">Live Position: </span>
                        <span id="live-coords" className="font-mono text-green-600">X: 0% | Y: 0%</span>
                    </div>

                    {/* Image Container */}
                    <div
                        ref={imageContainerRef}
                        className="relative w-full aspect-square bg-[#F4F6F8] rounded-lg overflow-hidden cursor-crosshair border-2 border-dashed border-gray-300"
                        onClick={handleImageClick}
                        onMouseMove={handleMouseMove}
                        style={{
                            backgroundImage: 'radial-gradient(#d1d5db 1px, transparent 1px)',
                            backgroundSize: '20px 20px'
                        }}
                    >
                        <Image
                            src={backgroundImage}
                            alt={selectedTree?.common_name || 'Tree'}
                            fill
                            className="object-contain"
                        />

                        {/* Clicked Position Marker */}
                        {coordinates.x > 0 || coordinates.y > 0 ? (
                            <div
                                className="absolute w-4 h-4 bg-red-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-20"
                                style={{ left: `${coordinates.x}%`, top: `${coordinates.y}%` }}
                            />
                        ) : null}

                        {/* Saved Hotspots */}
                        {hotspots.map((hotspot, idx) => (
                            <div
                                key={idx}
                                className="absolute w-3 h-3 bg-green-500 rounded-full border-2 border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-10"
                                style={{ left: `${hotspot.position.x}%`, top: `${hotspot.position.y}%` }}
                                title={hotspot.label}
                            />
                        ))}
                    </div>
                </div>

                {/* Right Panel - Controls */}
                <div className="space-y-4">
                    {/* Current Coordinate */}
                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <h3 className="font-bold text-gray-900 mb-3">📍 Selected Coordinate</h3>
                        <div className="bg-gray-900 text-green-400 font-mono p-4 rounded-lg text-center">
                            <div className="text-2xl mb-2">X: {coordinates.x}%</div>
                            <div className="text-2xl">Y: {coordinates.y}%</div>
                        </div>
                        <div className="mt-3 flex gap-2">
                            <button
                                onClick={copyCoordinate}
                                className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                            >
                                {copied ? '✓ Copied!' : 'Copy Coordinate'}
                            </button>
                            <button
                                onClick={addHotspot}
                                className="flex-1 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                            >
                                + Add Hotspot
                            </button>
                        </div>
                    </div>

                    {/* Hotspots List */}
                    <div className="bg-white rounded-xl shadow-lg p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-gray-900">🎯 Saved Hotspots ({hotspots.length})</h3>
                            {hotspots.length > 0 && (
                                <button
                                    onClick={copyToClipboard}
                                    className="bg-gray-800 text-white py-1 px-3 rounded-lg hover:bg-gray-900 transition-colors text-xs font-medium"
                                >
                                    {copied ? '✓ Copied!' : 'Copy JSON'}
                                </button>
                            )}
                        </div>

                        {hotspots.length === 0 ? (
                            <p className="text-gray-500 text-sm text-center py-4">
                                Click on image to select coordinates, then click "Add Hotspot"
                            </p>
                        ) : (
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                                {hotspots.map((hotspot, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                                        <div>
                                            <span className="font-mono text-xs text-gray-600">
                                                ({hotspot.position.x}%, {hotspot.position.y}%)
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => removeHotspot(idx)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* JSON Output */}
                    {hotspots.length > 0 && (
                        <div className="bg-white rounded-xl shadow-lg p-4">
                            <h3 className="font-bold text-gray-900 mb-3">📋 JSON Output</h3>
                            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg text-xs overflow-x-auto max-h-48">
                                {JSON.stringify(hotspots, null, 2)}
                            </pre>
                        </div>
                    )}

                    {/* Instructions */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                        <h3 className="font-bold text-yellow-800 mb-2">💡 Cara Pakai:</h3>
                        <ol className="text-sm text-yellow-700 space-y-1 list-decimal list-inside">
                            <li>Pilih pohon dari dropdown</li>
                            <li>Klik pada gambar untuk mendapat koordinat</li>
                            <li>Klik "Add Hotspot" untuk menyimpan</li>
                            <li>Copy JSON dan paste ke trees.json</li>
                        </ol>
                    </div>
                </div>
            </div>
        </main>
    )
}
