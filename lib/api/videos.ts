// lib/api/videos.ts
import { Video, YouTubeApiResponse, YouTubeVideo, YouTubeVideoDetails, YouTubeVideoDetailsResponse } from '@/types/FilterState';

const API_KEY = process.env.YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

export async function fetchInitialVideos(): Promise<Video[]> {
  try {
    const response = await fetch(
      `${BASE_URL}/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=9&regionCode=US&key=${API_KEY}`
    );
    
    const data: YouTubeApiResponse = await response.json();
    
    return data.items.map((item: YouTubeVideo) => ({
      id: item.id?.videoId || Math.random().toString(36).substring(2, 9),
      title: item.snippet.title,
      channel: item.snippet.channelTitle,
      views: formatViews(item.statistics?.viewCount || '0'),
      timestamp: formatPublishedAt(item.snippet.publishedAt),
      duration: formatDuration(item.contentDetails?.duration || 'PT0M0S'),
      thumbnail: item.snippet.thumbnails.high.url,
      language: 'English',
      genre: 'Entertainment',
      quality: 'HD',
      uploadDate: new Date(item.snippet.publishedAt),
    }));
  } catch (error) {
    console.error('Error fetching initial videos:', error);
    return [];
  }
}

export async function fetchVideos(filters: Record<string, string>): Promise<Video[]> {
  if (Object.keys(filters).length === 0) {
    return fetchInitialVideos();
  }

  try {
    const queryParams: string[] = [];
    
    if (filters.language) {
      queryParams.push(`relevanceLanguage=${filters.language.toLowerCase()}`);
    }
    
    if (filters.genre) {
      queryParams.push(`q=${encodeURIComponent(filters.genre)}`);
    }
    
    const maxResults = 50;
    const response = await fetch(
      `${BASE_URL}/search?part=snippet&type=video&maxResults=${maxResults}&${
        queryParams.join('&')
      }&key=${API_KEY}`
    );
    
    const data: YouTubeApiResponse = await response.json();
    
    const videoIds = data.items
      .map((item: YouTubeVideo) => item.id?.videoId)
      .filter((id): id is string => !!id)
      .join(',');
    
    const detailsResponse = await fetch(
      `${BASE_URL}/videos?part=contentDetails,statistics&id=${videoIds}&key=${API_KEY}`
    );
    
    const detailsData: YouTubeVideoDetailsResponse = await detailsResponse.json();
    
    const videos: Video[] = data.items.map((item: YouTubeVideo, index: number) => {
      const details = detailsData.items[index];
      return {
        id: item.id?.videoId || Math.random().toString(36).substring(2, 9),
        title: item.snippet.title,
        channel: item.snippet.channelTitle,
        views: formatViews(details?.statistics?.viewCount || '0'),
        timestamp: formatPublishedAt(item.snippet.publishedAt),
        duration: formatDuration(details?.contentDetails?.duration || 'PT0M0S'),
        thumbnail: item.snippet.thumbnails.high.url,
        language: filters.language || 'English',
        genre: filters.genre || 'General',
        quality: 'HD',
        uploadDate: new Date(item.snippet.publishedAt),
      };
    });
    
    // Apply filters
    return applyFilters(videos, filters).slice(0, 9);
  } catch (error) {
    console.error('Error fetching filtered videos:', error);
    return [];
  }
}

function applyFilters(videos: Video[], filters: Record<string, string>): Video[] {
  let filteredVideos = [...videos];

  if (filters.duration) {
    filteredVideos = filteredVideos.filter((video: Video) => {
      const [mins, secs] = video.duration.split(':').map(Number);
      const totalSeconds = mins * 60 + (secs || 0);
      
      if (filters.duration === 'Short (<4 min)') return totalSeconds < 240;
      if (filters.duration === 'Medium (4-20 min)') return totalSeconds >= 240 && totalSeconds <= 1200;
      if (filters.duration === 'Long (>20 min)') return totalSeconds > 1200;
      return true;
    });
  }

  if (filters.uploadDate) {
    const now = new Date();
    filteredVideos = filteredVideos.filter((video: Video) => {
      const uploadDate = video.uploadDate;
      const diffDays = Math.floor((now.getTime() - uploadDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (filters.uploadDate === 'Today') return diffDays === 0;
      if (filters.uploadDate === 'This week') return diffDays <= 7;
      if (filters.uploadDate === 'This month') return diffDays <= 30;
      if (filters.uploadDate === 'This year') return diffDays <= 365;
      return true;
    });
  }

  if (filters.quality) {
    filteredVideos = filteredVideos.filter((video: Video) => {
      if (filters.quality === 'All') return true;
      return video.quality === filters.quality;
    });
  }

  return filteredVideos;
}

// Helper functions remain the same with proper typing
function formatViews(count: string): string {
  const num = parseInt(count);
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  }
  if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  }
  return count;
}

function formatPublishedAt(dateString: string): string {
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