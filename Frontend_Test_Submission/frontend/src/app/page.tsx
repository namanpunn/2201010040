'use client'

import { useState } from 'react'
import URLShortener from './components/URLShortener'
import Statistics from './components/Statistics'

export default function Home() {
  const [activeTab, setActiveTab] = useState<'shortener' | 'statistics'>('shortener')

  return (
    <div className="space-y-6">
      {/* Navigation */}
      <div className="bg-white rounded-lg shadow-sm p-1">
        <div className="flex space-x-1">
          <button
            onClick={() => setActiveTab('shortener')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'shortener'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            URL Shortener
          </button>
          <button
            onClick={() => setActiveTab('statistics')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'statistics'
                ? 'bg-blue-500 text-white'
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Statistics
          </button>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'shortener' ? <URLShortener /> : <Statistics />}
    </div>
  )
}