export interface YouTubeThumbnails {
  default?: { url: string };
  medium?: { url: string };
  high?: { url: string };
  standard?: { url: string };
  maxres?: { url: string };
}

export interface YouTubeVideoSnippet {
  title: string;
  channelTitle: string;
  publishedAt: string;
  thumbnails: YouTubeThumbnails;
}

export interface YouTubeVideo {
  id: string | { videoId?: string };
  snippet: YouTubeVideoSnippet;
  contentDetails?: {
    duration: string;
  };
  statistics?: {
    viewCount: string;
  };
}

export interface YouTubeVideoDetails {
  id: string;
  contentDetails: {
    duration: string;
  };
  statistics: {
    viewCount: string;
  };
  snippet: {
    thumbnails: YouTubeThumbnails;
  };
}

export interface YouTubeApiResponse {
  items: YouTubeVideo[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface YouTubeVideoDetailsResponse {
  items: YouTubeVideoDetails[];
}

export interface Video {
  id: string;
  title: string;
  channel: string;
  views: string;
  timestamp: string;
  duration: string;
  thumbnail: string;
  language: string;
  genre: string;
  quality: string;
  uploadDate: Date;
  contentType: 'video' | 'short' | 'live' | 'premiere';
}