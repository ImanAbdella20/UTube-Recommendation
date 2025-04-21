import { fetchVideos } from '@/lib/api/videos'
import VideoCard from './VideoCard'
import { Video } from '@/types/FilterState'

export default async function VideoGrid({ searchParams }: { searchParams: any }) {
  const videos: Video[] = await fetchVideos(searchParams)


  if (!videos.length) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <h3 className="text-lg font-medium text-gray-500">No videos found</h3>
        <p className="text-sm text-gray-400">Try adjusting your filters</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {videos.map((video:Video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  )
}