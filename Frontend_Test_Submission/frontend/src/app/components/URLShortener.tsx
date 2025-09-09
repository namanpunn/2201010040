'use client'

import { useState, useEffect } from 'react'
import { LogInfo, LogError, LogWarn } from '../lib/logging'
import { saveURLs, loadURLs, generateShortCode, isValidUrl, URLData } from '../lib/storage'

export default function URLShortener() {
  const [urls, setUrls] = useState<URLData[]>([])
  const [originalUrl, setOriginalUrl] = useState('')
  const [customShortcode, setCustomShortcode] = useState('')
  const [validityMinutes, setValidityMinutes] = useState(30)
  const [errors, setErrors] = useState<{[key: string]: string}>({})
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const savedUrls = loadURLs()
    setUrls(savedUrls)
    LogInfo('component', 'URLShortener component initialized')
  }, [])

  const validateForm = (): boolean => {
    const newErrors: {[key: string]: string} = {}

    if (!originalUrl) {
      newErrors.originalUrl = 'URL is required'
    } else if (!isValidUrl(originalUrl)) {
      newErrors.originalUrl = 'Please enter a valid URL'
    }

    if (validityMinutes < 1 || validityMinutes > 10080) {
      newErrors.validityMinutes = 'Validity must be between 1 and 10080 minutes'
    }

    if (customShortcode) {
      if (!/^[a-zA-Z0-9-_]{3,20}$/.test(customShortcode)) {
        newErrors.customShortcode = 'Shortcode must be 3-20 characters (letters, numbers, hyphens, underscores)'
      } else if (urls.some(url => url.shortCode === customShortcode)) {
        newErrors.customShortcode = 'This shortcode is already taken'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      LogWarn('component', 'Form validation failed')
      return
    }

    try {
      let shortCode = customShortcode
      if (!shortCode) {
        do {
          shortCode = generateShortCode()
        } while (urls.some(url => url.shortCode === shortCode))
      }

      const now = new Date()
      const expiryDate = new Date(now.getTime() + validityMinutes * 60 * 1000)

      const newUrl: URLData = {
        id: Date.now().toString(),
        originalUrl,
        shortCode,
        createdAt: now.toISOString(),
        expiryDate: expiryDate.toISOString(),
        validityMinutes,
        clickCount: 0,
        clicks: []
      }

      const updatedUrls = [...urls, newUrl]
      setUrls(updatedUrls)
      saveURLs(updatedUrls)

      setOriginalUrl('')
      setCustomShortcode('')
      setValidityMinutes(30)
      setSuccess(`Short URL created: http://localhost:3000/${shortCode}`)
      
      LogInfo('component', `URL shortened successfully: ${shortCode}`)
      
      setTimeout(() => setSuccess(''), 5000)

    } catch (error) {
      LogError('component', `Error shortening URL: ${error}`)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setSuccess('Copied to clipboard!')
      setTimeout(() => setSuccess(''), 2000)
      LogInfo('component', 'URL copied to clipboard')
    })
  }

  const activeUrls = urls.filter(url => new Date() <= new Date(url.expiryDate))

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4">Shorten a URL</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Original URL *
            </label>
            <input
              type="url"
              value={originalUrl}
              onChange={(e) => setOriginalUrl(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="https://example.com"
            />
            {errors.originalUrl && (
              <p className="text-red-600 text-sm mt-1">{errors.originalUrl}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Validity (minutes) *
            </label>
            <input
              type="number"
              min="1"
              max="10080"
              value={validityMinutes}
              onChange={(e) => setValidityMinutes(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            {errors.validityMinutes && (
              <p className="text-red-600 text-sm mt-1">{errors.validityMinutes}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Custom Shortcode (optional)
            </label>
            <input
              type="text"
              value={customShortcode}
              onChange={(e) => setCustomShortcode(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="my-link"
            />
            {errors.customShortcode && (
              <p className="text-red-600 text-sm mt-1">{errors.customShortcode}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            Shorten URL
          </button>
        </form>

        {success && (
          <div className="mt-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-md">
            {success}
          </div>
        )}
      </div>

      {activeUrls.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold mb-4">Your Shortened URLs</h3>
          <div className="space-y-3">
            {activeUrls.map((url) => (
              <div key={url.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                <div className="flex-1">
                  <p className="font-medium text-blue-600">
                    http://localhost:3000/{url.shortCode}
                  </p>
                  <p className="text-sm text-gray-600 truncate">
                    {url.originalUrl}
                  </p>
                  <p className="text-xs text-gray-500">
                    Expires: {new Date(url.expiryDate).toLocaleString()}
                  </p>
                </div>
                <button
                  onClick={() => copyToClipboard(`http://localhost:3000/${url.shortCode}`)}
                  className="ml-2 px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 transition-colors"
                >
                  Copy
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}