import { Video, YouTubeApiResponse, YouTubeThumbnails, YouTubeVideo, YouTubeVideoDetails, YouTubeVideoDetailsResponse } from '@/types/FilterState';

const API_KEY = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
if (!API_KEY) {
  throw new Error("YouTube API key is not configured");
}
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

let cachedInitialVideos: Video[] | null = null;

// Helper functions
function getBestThumbnail(thumbnails: YouTubeThumbnails): string {
  return (
    thumbnails.maxres?.url ||
    thumbnails.standard?.url ||
    thumbnails.high?.url ||
    thumbnails.medium?.url ||
    thumbnails.default?.url ||
    ''
  );
}

function getQualityFromThumbnail(thumbnails: YouTubeThumbnails): string {
  if (thumbnails.maxres) return '8K';
  if (thumbnails.standard) return '4K';
  if (thumbnails.high) return 'Full HD';
  return 'HD';
}

export function formatViews(count: string): string {
  const num = parseInt(count);
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
  return count;
}

export function formatPublishedAt(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

function formatDuration(duration: string): string {
  const match = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return '0:00';
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  
  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function generateRandomId(): string {
  return Math.random().toString(36).substring(2, 9);
}

// Main API functions
export async function fetchInitialVideos(): Promise<Video[]> {
  if (cachedInitialVideos) return cachedInitialVideos;

  try {
    const response = await fetch(
      `${BASE_URL}/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=50&regionCode=US&key=${API_KEY}`
    );
    
    if (!response.ok) throw new Error(`YouTube API error: ${response.status}`);
    
    const data: YouTubeApiResponse = await response.json();
    
    cachedInitialVideos = data.items.map((item: YouTubeVideo) => ({
      id: typeof item.id === 'string' ? item.id : item.id.videoId || generateRandomId(),
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      views: formatViews(item.statistics?.viewCount || '0'),
      timestamp: formatPublishedAt(item.snippet.publishedAt),
      duration: formatDuration(item.contentDetails?.duration || 'PT0M0S'),
      thumbnail: getBestThumbnail(item.snippet.thumbnails),
      language: 'English',
      genre: 'Entertainment',
      quality: getQualityFromThumbnail(item.snippet.thumbnails),
      uploadDate: new Date(item.snippet.publishedAt),
      contentType: 'video' // Default content type
    }));

    return cachedInitialVideos;
  } catch (error) {
    console.error('Error fetching initial videos:', error);
    return [];
  }
}

export async function fetchVideos(filters: Record<string, string>): Promise<Video[]> {
  try {
    const queryParams: string[] = [];
    
    // Language filter
    if (filters.language) {
      queryParams.push(`relevanceLanguage=${filters.language}`);
    }
    
    // Category/Genre filter
    if (filters.category) {
      queryParams.push(`q=${encodeURIComponent(filters.category)}`);
    }
    
    // Content type filter (handled client-side)
    
    // Sort options
    let order = 'relevance';
    if (filters.sort) {
      switch(filters.sort) {
        case 'popular': order = 'viewCount'; break;
        case 'viewed': order = 'viewCount'; break;
        case 'newest': order = 'date'; break;
        case 'oldest': order = 'date'; break;
        case 'rated': order = 'rating'; break;
        case 'commented': break; // No direct API parameter for this
      }
    }
    queryParams.push(`order=${order}`);
    
    // Get initial search results
    const searchResponse = await fetch(
      `${BASE_URL}/search?part=snippet&type=video&maxResults=50&${queryParams.join('&')}&key=${API_KEY}`
    );
    
    if (!searchResponse.ok) throw new Error(`YouTube API search error: ${searchResponse.status}`);
    
    const searchData: YouTubeApiResponse = await searchResponse.json();
    if (!searchData?.items?.length) return [];
    
    // Get video IDs from search results
    const videoIds = searchData.items
      .map((item: YouTubeVideo) => typeof item.id === 'string' ? item.id : item.id.videoId)
      .filter((id): id is string => !!id)
      .join(',');
    
    // Fetch details for all videos at once
    const detailsResponse = await fetch(
      `${BASE_URL}/videos?part=contentDetails,statistics,snippet&id=${videoIds}&key=${API_KEY}`
    );
    
    if (!detailsResponse.ok) throw new Error(`YouTube API details error: ${detailsResponse.status}`);
    
    const detailsData: YouTubeVideoDetailsResponse = await detailsResponse.json();
    if (!detailsData?.items) return [];
    
    // Map to Video objects
    const videos: Video[] = detailsData.items.map((item: YouTubeVideoDetails) => {
      const searchItem = searchData.items.find(searchItem => {
        const searchId = typeof searchItem.id === 'string' ? searchItem.id : searchItem.id.videoId;
        return searchId === item.id;
      });
      
      // Determine content type based on duration
      const duration = item.contentDetails?.duration || 'PT0M0S';
      const [mins] = duration.split(':').map(Number);
      const isShort = mins < 4;
      
      return {
        id: item.id,
        title: searchItem?.snippet.title || 'Untitled',
        channel: searchItem?.snippet.channelTitle || 'Unknown channel',
        views: formatViews(item.statistics?.viewCount || '0'),
        timestamp: formatPublishedAt(searchItem?.snippet.publishedAt || new Date().toISOString()),
        duration: formatDuration(duration),
        thumbnail: getBestThumbnail(item.snippet.thumbnails),
        language: filters.language || 'English',
        genre: filters.category || 'General',
        quality: getQualityFromThumbnail(item.snippet.thumbnails),
        uploadDate: new Date(searchItem?.snippet.publishedAt || new Date()),
        contentType: isShort ? 'short' : 'video'
      };
    });
    
    return applyFilters(videos, filters).slice(0, 12);
  } catch (error) {
    console.error('Error fetching filtered videos:', error);
    return [];
  }
}

export function applyFilters(videos: Video[], filters: Record<string, string>): Video[] {
  let filteredVideos = [...videos];

  // Duration filter
  if (filters.duration) {
    filteredVideos = filteredVideos.filter(video => {
      const [mins, secs] = video.duration.split(':').map(Number);
      const totalSeconds = mins * 60 + (secs || 0);
      
      if (filters.duration === 'short') return totalSeconds < 240;
      if (filters.duration === 'medium') return totalSeconds >= 240 && totalSeconds <= 1200;
      if (filters.duration === 'long') return totalSeconds > 1200 && totalSeconds <= 3600;
      if (filters.duration === 'very-long') return totalSeconds > 3600;
      return true;
    });
  }

  // Upload date filter
  if (filters.uploadDate) {
    const now = new Date();
    filteredVideos = filteredVideos.filter(video => {
      const diffDays = Math.floor((now.getTime() - video.uploadDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (filters.uploadDate === 'today') return diffDays === 0;
      if (filters.uploadDate === 'week') return diffDays <= 7;
      if (filters.uploadDate === 'month') return diffDays <= 30;
      if (filters.uploadDate === 'year') return diffDays <= 365;
      return true;
    });
  }

  // Quality filter
  if (filters.quality && filters.quality !== 'all') {
    filteredVideos = filteredVideos.filter(video => {
      const videoQuality = video.quality.toLowerCase();
      const filterQuality = filters.quality.toLowerCase();
      
      if (filterQuality === 'sd') return videoQuality === 'hd';
      if (filterQuality === 'hd') return videoQuality === 'full hd';
      if (filterQuality === 'full-hd') return videoQuality === 'full hd';
      if (filterQuality === '4k') return videoQuality === '4k';
      if (filterQuality === '8k') return videoQuality === '8k';
      if (filterQuality === 'live') return video.contentType === 'live';
      return true;
    });
  }

  // Content type filter
  if (filters.type && filters.type !== 'all') {
    filteredVideos = filteredVideos.filter(video => {
      return video.contentType === filters.type;
    });
  }

  // Sort options (client-side)
  if (filters.sort) {
    filteredVideos.sort((a, b) => {
      switch(filters.sort) {
        case 'popular':
        case 'viewed':
          return parseInt(b.views) - parseInt(a.views);
        case 'newest':
          return b.uploadDate.getTime() - a.uploadDate.getTime();
        case 'oldest':
          return a.uploadDate.getTime() - b.uploadDate.getTime();
        case 'rated':
          // Note: Rating not available in basic API response
          return parseInt(b.views) - parseInt(a.views);
        case 'commented':
          // Note: Comment count not available in basic API response
          return parseInt(b.views) - parseInt(a.views);
        default:
          return 0;
      }
    });
  }

  return filteredVideos;
}