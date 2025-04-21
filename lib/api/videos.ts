import { FilterState, Video } from '@/types/FilterState';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const fetchVideos = async (filters: Partial<FilterState> = {}): Promise<Video[]> => {

  try {
    // Convert filters to query parameters
    const queryParams = new URLSearchParams();
    
    for (const [key, value] of Object.entries(filters)) {
      if (value && value !== 'all') {
        queryParams.append(key, value);
      }
    }

    const response = await fetch(`${API_BASE_URL}/videos?${queryParams.toString()}`, {
      next: { tags: ['videos'] }, // For Next.js caching
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch videos:', error);
    throw error;
  }
};

export const fetchVideoById = async (id: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/videos/${id}`);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch video ${id}:`, error);
    throw error;
  }
};