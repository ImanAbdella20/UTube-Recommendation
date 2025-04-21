'use client'

import { fetchInitialVideos, fetchVideos } from '@/lib/api/videos'
import VideoCard from './VideoCard'
import { Video } from '@/types/FilterState'
import { useEffect, useState } from 'react'

export default function VideoGrid({ searchParams }: { searchParams: any }) {
  const [videos, setVideos] = useState<Video[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadVideos = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const videosData = Object.keys(searchParams).length === 0
          ? await fetchInitialVideos()
          : await fetchVideos(searchParams)
        
        setVideos(videosData)
      } catch (err) {
        console.error('Failed to load videos:', err)
        setError('Failed to load videos. Please try again later.')
        setVideos([])
      } finally {
        setLoading(false)
      }
    }
    
    loadVideos()
  }, [searchParams])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-500">
        <h3 className="text-lg font-medium">{error}</h3>
      </div>
    )
  }

  if (!videos.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h3 className="text-lg font-medium text-gray-500">No videos found</h3>
        <p className="text-sm text-gray-400">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}