import { Metadata } from 'next';

interface VideoParams {
  videoId: string
}

export async function generateMetadata({
  params
}: {
  params: VideoParams
}): Promise<Metadata> {

  const video = {
    title: 'Videos', 
    description: 'Video description',
    videoUrl: `${process.env.NEXT_PUBLIC_SITE_URL}/videos/${params.videoId}`,
    thumbnail: `/thumbnails/${params.videoId}.jpg`
  };

  try {
    
    return {
      title: `${video.title}`,
      description: video.description,
      alternates: {
        canonical: `/videos/${params.videoId}`,
      },
      openGraph: {
        title: video.title,
        description: video.description,
        url: `/videos/${params.videoId}`,
        type: 'video.other',
        videos: {
          url: video.videoUrl,
          width: 1280,
          height: 720,
        },
        images: [
          {
            url: video.thumbnail,
            width: 1280,
            height: 720,
            alt: video.title,
          },
        ],
      },
      robots: {
        index: true,
        follow: true,
      }
    };
  } catch (error) {
    console.error('Error fetching video metadata:', error);
    return {
      title: 'Video | UTube',
      description: 'Watch this video on UTube',
      alternates: {
        canonical: `/videos/${params.videoId}`,
      },
    };
  }
}

export default function VideoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Simple layout with no state to prevent re-renders
  return (
    <div className="flex flex-col lg:flex-row w-full min-h-screen">
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}