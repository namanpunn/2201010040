'use client'

import { useState, useEffect } from 'react'
import { LogInfo } from '../lib/logging'
import { loadURLs, URLData, isExpired } from '../lib/storage'

export default function Statistics() {
  const [urls, setUrls] = useState<URLData[]>([])

  useEffect(() => {
    const savedUrls = loadURLs()
    setUrls(savedUrls)
    LogInfo('component', 'Statistics component initialized')
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString()
  }

  const getTimeRemaining = (expiryDate: string) => {
    const now = new Date()
    const expiry = new Date(expiryDate)
    const diff = expiry.getTime() - now.getTime()
    
    if (diff <= 0) return 'Expired'
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (days > 0) return `${days}d ${hours}h remaining`
    if (hours > 0) return `${hours}h ${minutes}m remaining`
    return `${minutes}m remaining`
  }

  if (urls.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <h2 className="text-xl font-semibold mb-2">Statistics</h2>
        <p className="text-gray-600">No URLs have been shortened yet.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">URL Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600">Total URLs</h3>
            <p className="text-2xl font-bold text-blue-600">{urls.length}</p>
          </div>
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600">Active URLs</h3>
            <p className="text-2xl font-bold text-green-600">
              {urls.filter(url => !isExpired(url.expiryDate)).length}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-600">Total Clicks</h3>
            <p className="text-2xl font-bold text-purple-600">
              {urls.reduce((sum, url) => sum + url.clickCount, 0)}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {urls.map((url) => (
            <div key={url.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <h3 className="font-medium text-lg text-blue-600">
                    http://localhost:3000/{url.shortCode}
                  </h3>
                  <p className="text-gray-600 break-all">{url.originalUrl}</p>
                </div>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  isExpired(url.expiryDate) 
                    ? 'bg-red-100 text-red-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {isExpired(url.expiryDate) ? 'Expired' : 'Active'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                <div>
                  <span className="font-medium">Created:</span><br/>
                  {formatDate(url.createdAt)}
                </div>
                <div>
                  <span className="font-medium">Expires:</span><br/>
                  {formatDate(url.expiryDate)}
                </div>
                <div>
                  <span className="font-medium">Status:</span><br/>
                  {getTimeRemaining(url.expiryDate)}
                </div>
                <div>
                  <span className="font-medium">Clicks:</span><br/>
                  {url.clickCount} times
                </div>
              </div>

              {url.clicks.length > 0 && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Click History:</h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {url.clicks.map((click, index) => (
                      <div key={index} className="text-xs text-gray-600 flex justify-between">
                        <span>{formatDate(click.timestamp)}</span>
                        <span>{click.source} - {click.location}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}