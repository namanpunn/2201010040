'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { LogInfo, LogError } from '../lib/logging'
import { loadURLs, saveURLs, URLData, isExpired, ClickData } from '../lib/storage'

export default function RedirectPage() {
  const params = useParams()
  const router = useRouter()
  const [status, setStatus] = useState<'loading' | 'redirecting' | 'expired' | 'not-found'>('loading')
  const [url, setUrl] = useState<URLData | null>(null)

  useEffect(() => {
    const shortcode = params.shortcode as string
    
    if (!shortcode) {
      setStatus('not-found')
      return
    }

    const urls = loadURLs()
    const foundUrl = urls.find(u => u.shortCode === shortcode)

    if (!foundUrl) {
      LogError('page', `Short URL not found: ${shortcode}`)
      setStatus('not-found')
      return
    }

    setUrl(foundUrl)

    if (isExpired(foundUrl.expiryDate)) {
      LogError('page', `Attempted to access expired URL: ${shortcode}`)
      setStatus('expired')
      return
    }

    const clickData: ClickData = {
      timestamp: new Date().toISOString(),
      source: 'Direct',
      location: 'Mumbai, India'
    }

    const updatedUrls = urls.map(u => 
      u.id === foundUrl.id 
        ? { ...u, clickCount: u.clickCount + 1, clicks: [...u.clicks, clickData] }
        : u
    )

    saveURLs(updatedUrls)
    LogInfo('page', `URL clicked: ${shortcode}, redirecting to: ${foundUrl.originalUrl}`)
    
    setStatus('redirecting')
    
    setTimeout(() => {
      window.location.href = foundUrl.originalUrl
    }, 2000)

  }, [params.shortcode])

  const goHome = () => {
    router.push('/')
  }

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (status === 'redirecting') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center bg-white rounded-lg shadow-sm p-8 max-w-md">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <h1 className="text-xl font-semibold mb-2">Redirecting...</h1>
          <p className="text-gray-600 mb-4">
            You are being redirected to:
          </p>
          <p className="text-blue-600 font-medium break-all">
            {url?.originalUrl}
          </p>
          <p className="text-sm text-gray-500 mt-4">
            If you are not redirected automatically, 
            <a 
              href={url?.originalUrl} 
              className="text-blue-500 hover:underline ml-1"
            >
              click here
            </a>
          </p>
        </div>
      </div>
    )
  }

  if (status === 'expired') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center bg-white rounded-lg shadow-sm p-8 max-w-md">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h1 className="text-xl font-semibold mb-2">Link Expired</h1>
          <p className="text-gray-600 mb-4">
            This short URL has expired and is no longer valid.
          </p>
          {url && (
            <p className="text-sm text-gray-500 mb-4">
              Original URL: {url.originalUrl}
            </p>
          )}
          <button
            onClick={goHome}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Create New Short URL
          </button>
        </div>
      </div>
    )
  }

  if (status === 'not-found') {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center bg-white rounded-lg shadow-sm p-8 max-w-md">
          <div className="text-gray-400 text-6xl mb-4">🔍</div>
          <h1 className="text-xl font-semibold mb-2">URL Not Found</h1>
          <p className="text-gray-600 mb-4">
            The short URL you&apos;re looking for doesn&apos;t exist or has been removed.
          </p>
          <button
            onClick={goHome}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition-colors"
          >
            Go to Homepage
          </button>
        </div>
      </div>
    )
  }

  return null
}