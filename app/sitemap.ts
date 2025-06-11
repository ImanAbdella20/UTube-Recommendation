import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
  
  // Static pages
  const staticPages = ['', 'login', 'home', 'videos', 'profile', 'savednotes'].map((page) => ({
    url: `${baseUrl}/${page}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: page === '' ? 1 : 0.8,
  }));

  try {
    // Fetch videos from your YouTube API
    const res = await fetch(
      `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&maxResults=50&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
    );
    
    if (!res.ok) {
      throw new Error(`YouTube API error: ${res.status}`);
    }
    
    const data = await res.json();
    
    if (!data.items) {
      return staticPages;
    }

    // Create video pages for sitemap
    const videoPages = data.items.map((video: { id: string }) => ({
      url: `${baseUrl}/videos/${video.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    return [...staticPages, ...videoPages];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return just static pages if there's an error
    return staticPages;
  }
}