import Image from 'next/image'
import Link from 'next/link'

export default function VideoCard({ video }: { video: any }) {
  return (
    <Link href={`/videos/${video.id}`} className="group">
      <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-video">
          <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            className="object-cover group-hover:scale-105 transition-transform"
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium line-clamp-2">{video.title}</h3>
          <p className="text-sm text-gray-500 mt-1">{video.channel}</p>
          <div className="flex items-center mt-2 text-xs text-gray-400">
            <span>{video.views} views</span>
            <span className="mx-2">•</span>
            <span>{video.uploaded}</span>
          </div>
        </div>
      </div>
    </Link>
  )
}