'use client'

import { Component } from 'react'

export class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-forest-900 via-forest-800 to-earth-900 flex items-center justify-center px-4">
          <div className="glass-dark rounded-2xl p-8 max-w-md text-center">
            <h1 className="text-2xl font-bold text-white mb-4">⚠️ Terjadi Kesalahan</h1>
            <p className="text-gray-400 mb-6">
              Maaf, terjadi kesalahan yang tidak terduga. Silakan refresh halaman atau kembali ke beranda.
            </p>
            <div className="flex gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 bg-forest-600 hover:bg-forest-500 text-white rounded-full transition-colors"
              >
                Kembali ke Beranda
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 glass text-white rounded-full hover:bg-white/20 transition-colors"
              >
                Refresh
              </button>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

