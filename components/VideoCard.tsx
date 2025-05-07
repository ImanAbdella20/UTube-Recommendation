import Image from 'next/image';
import Link from 'next/link';

export default function VideoCard({ video, basePath }: { video: any; basePath: string }) {
  return (
    <Link href={`/${basePath}/${video.id}`} className="group">
      <div className="rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="relative aspect-video">
        <Image
            src={video.thumbnail}
            alt={video.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform"
            unoptimized={true}
            loading="eager"
            placeholder="blur"
            blurDataURL="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2YxZjFmMSIvPjwvc3ZnPg=="
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
  );
}
