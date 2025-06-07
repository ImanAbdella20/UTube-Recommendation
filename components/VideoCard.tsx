import Image from 'next/image';
import Link from 'next/link';

export default function VideoCard({ video, basePath }: { video: any; basePath: string }) {
  // Validate thumbnail URL
  const thumbnailSrc = video.thumbnail || '/default-thumbnail.jpg';
  
  return (
    <Link href={`/${basePath}/${video.id}`} className="group">
      <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-video">
          <Image
            src={thumbnailSrc}
            alt={video.title || 'Video thumbnail'}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform"
            loader={({ src }) => src} // Required for external URLs
            unoptimized={true} // Keep true for external images
            priority={true} // Better than loading="eager"
            onError={(e) => {
              // Fallback to default image on error
              const target = e.target as HTMLImageElement;
              target.src = '/default-thumbnail.jpg';
            }}
          />
        </div>
        <div className="p-4">
          <h3 className="font-medium line-clamp-2">{video.title || 'Untitled Video'}</h3>
          <p className="text-sm text-gray-500 mt-1">{video.channel || 'Unknown channel'}</p>
          <div className="flex items-center mt-2 text-xs text-gray-400">
            <span>{video.views || '0'} views</span>
            <span className="mx-2">•</span>
            <span>{video.uploaded || 'Recently'}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}