'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiBookmark, FiHeart, FiTrash2 } from 'react-icons/fi';
import { formatViews, formatPublishedAt, fetchInitialVideos } from '@/lib/api/videos';
import { Note, useVideoStore } from '@/store/videoStore';
import { useNoteStore } from '@/store/videoStore';
import VideoCard from '@/components/VideoCard';
import { Video } from '@/types/FilterState';
import { useAuth } from '@/context/AuthContext';

interface VideoDetails {
  id: string;
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  viewCount: string;
  likeCount: string;
  thumbnail: string;
}

export default function VideoPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const { userId } = useAuth();

  // State management
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [recommendedVideos, setRecommendedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newNote, setNewNote] = useState('');
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  // Store hooks
  const {
    getUserBookmarks,
    getUserFavorites,
    addBookmark,
    removeBookmark,
    addFavorite,
    removeFavorite,
  } = useVideoStore();

  const { getUserNotes, addNote, removeNote } = useNoteStore();

  // Memoized derived values
  const bookmarks = useMemo(() => getUserBookmarks(userId || ''), [userId, getUserBookmarks]);
  const favorites = useMemo(() => getUserFavorites(userId || ''), [userId, getUserFavorites]);
  const allUserNotes = useMemo(() => getUserNotes(userId || ''), [userId, getUserNotes]);
  const notes = useMemo(() => 
    allUserNotes.filter(note => note.videoId === id), 
    [allUserNotes, id]
  );

  // Fetch video data
  const fetchVideoData = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);

      // Check cache first
      const cached = localStorage.getItem(`video_${id}`);
      if (cached) {
        setVideoDetails(JSON.parse(cached));
      }

      // Fetch from API
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
      );

      if (!res.ok) throw new Error('Failed to fetch video details');
      const data = await res.json();
      
      if (!data.items?.length) throw new Error('Video not found');

      const item = data.items[0];
      const details: VideoDetails = {
        id: item.id,
        title: item.snippet.title,
        description: item.snippet.description,
        channelTitle: item.snippet.channelTitle,
        publishedAt: item.snippet.publishedAt,
        viewCount: item.statistics.viewCount,
        likeCount: item.statistics.likeCount,
        thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high.url,
      };

      setVideoDetails(details);
      localStorage.setItem(`video_${id}`, JSON.stringify(details));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unexpected error');
    } finally {
      setLoading(false);
    }
  }, [id]);

  // Fetch recommended videos
  const fetchRecommendations = useCallback(async () => {
    try {
      setRecommendedLoading(true);
      const allVideos = await fetchInitialVideos();
      const filteredVideos = allVideos.filter((v) => v.id !== id).slice(0, 6);
      setRecommendedVideos(filteredVideos);
      localStorage.setItem(`recommended_${id}`, JSON.stringify(filteredVideos));
    } catch (err) {
      const cached = localStorage.getItem(`recommended_${id}`);
      if (cached) {
        setRecommendedVideos(JSON.parse(cached));
      }
    } finally {
      setRecommendedLoading(false);
    }
  }, [id]);

  // Initial data load
  useEffect(() => {
    if (!id) return;

    // Load recommendations from cache or API
    const cachedRecs = localStorage.getItem(`recommended_${id}`);
    if (cachedRecs) {
      setRecommendedVideos(JSON.parse(cachedRecs));
    } else {
      fetchRecommendations();
    }

    // Load video details
    fetchVideoData();
  }, [id, fetchVideoData, fetchRecommendations]);

  // Helper functions
  const getFirstThreeLines = (text: string) => text.split('\n').slice(0, 3).join('\n');

  // Event handlers
  const handleFavorite = useCallback(() => {
    if (!videoDetails || !userId) return;
    favorites.includes(videoDetails.id)
      ? removeFavorite(userId, videoDetails.id)
      : addFavorite(userId, videoDetails.id);
  }, [videoDetails, userId, favorites, removeFavorite, addFavorite]);

  const handleBookmark = useCallback(() => {
    if (!videoDetails || !userId) return;
    bookmarks.includes(videoDetails.id)
      ? removeBookmark(userId, videoDetails.id)
      : addBookmark(userId, videoDetails.id);
  }, [videoDetails, userId, bookmarks, removeBookmark, addBookmark]);

  const addNewNote = useCallback(() => {
    if (newNote.trim() && videoDetails && userId) {
      addNote(userId, videoDetails.id, newNote.trim());
      setNewNote('');
    }
  }, [newNote, videoDetails, userId, addNote]);

  const handleRemoveNote = useCallback((noteId: string) => {
    if (userId) removeNote(userId, noteId);
  }, [userId, removeNote]);

  // Early returns for error states
  if (!id) return (
    <div className="p-8 text-center text-red-500">
      <h2 className="text-xl font-bold">Invalid Video</h2>
      <p>The video ID is missing or invalid</p>
    </div>
  );

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-blue"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-500 py-20">
        <h2 className="text-xl font-bold">Error</h2>
        <p>{error}</p>
        <button
          onClick={() => {
            setError(null);
            fetchVideoData();
          }}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!videoDetails) return (
    <div className="p-8 text-center">
      <h2 className="text-xl font-bold">Video Not Found</h2>
      <p>The requested video could not be found</p>
    </div>
  );

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Main Video Content */}
        <div className="lg:w-2/3">
          {/* Video Player */}
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoDetails.id}?autoplay=1`}
              title={videoDetails.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Video Info */}
          <div className="mt-4">
            <h1 className="text-2xl font-bold">{videoDetails.title}</h1>
            <div className="text-gray-600 mt-2 flex justify-between items-center">
              <span>
                {formatViews(videoDetails.viewCount)} • {formatPublishedAt(videoDetails.publishedAt)}
              </span>
              {userId && (
                <div className="flex gap-3">
                  <button 
                    onClick={handleFavorite}
                    aria-label={favorites.includes(videoDetails.id) ? 'Remove from favorites' : 'Add to favorites'}
                  >
                    <FiHeart className={`w-5 h-5 ${favorites.includes(videoDetails.id) ? 'text-red-600 fill-red-600' : ''}`} />
                  </button>
                  <button 
                    onClick={handleBookmark}
                    aria-label={bookmarks.includes(videoDetails.id) ? 'Remove bookmark' : 'Add bookmark'}
                  >
                    <FiBookmark className={`w-5 h-5 ${bookmarks.includes(videoDetails.id) ? 'text-primary-blue fill-primary-blue' : ''}`} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Channel Info */}
          <div className="mt-4 flex items-center gap-4 p-4 bg-gray-100 rounded-lg">
            <Image
              src={videoDetails.thumbnail}
              alt={videoDetails.channelTitle}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h2 className="font-semibold">{videoDetails.channelTitle}</h2>
              <p className="text-sm text-gray-500">1.2M subscribers</p>
            </div>
            <button className="ml-auto bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700 transition-colors">
              Subscribe
            </button>
          </div>

          {/* Video Description */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="whitespace-pre-line">
              {showFullDescription ? videoDetails.description : getFirstThreeLines(videoDetails.description)}
            </p>
            {videoDetails.description.split('\n').length > 3 && (
              <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="text-blue-600 mt-2 hover:underline"
              >
                {showFullDescription ? 'Show less' : 'Show more'}
              </button>
            )}
          </div>

          {/* Recommended Videos */}
          <div className="mt-10">
            <h2 className="text-xl font-semibold mb-4">Recommended Videos</h2>
            {recommendedLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div key={index} className="animate-pulse bg-gray-200 rounded-lg aspect-video"></div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendedVideos.map((video) => (
                  <VideoCard key={video.id} video={video} basePath="videos" />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notes Section */}
        <div className="lg:w-1/3">
          <div className="sticky top-4">
            <h2 className="text-xl font-bold mb-4">Video Notes</h2>
            
            {/* Note Input */}
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && addNewNote()}
              placeholder="Write a note about this video..."
              className="w-full border p-3 rounded-lg min-h-[100px] focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <button
              onClick={addNewNote}
              disabled={!newNote.trim()}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              Add Note
            </button>

            {/* Notes List */}
            <div className="mt-6">
              <h3 className="font-medium mb-2">Your Notes ({notes.length})</h3>
              {notes.length === 0 ? (
                <p className="text-gray-500 p-4 bg-gray-50 rounded-lg">No notes yet for this video</p>
              ) : (
                <div className="space-y-3">
                  {notes.slice(0, showAllNotes ? notes.length : 3).map((note) => (
                    <div
                      key={note.id}
                      className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-xs text-gray-500">
                          {new Date(note.createdAt).toLocaleString()}
                        </span>
                        <button
                          onClick={() => handleRemoveNote(note.id)}
                          className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                          aria-label="Delete note"
                        >
                          <FiTrash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="whitespace-pre-line">{note.content}</p>
                    </div>
                  ))}
                </div>
              )}
              {notes.length > 3 && (
                <button
                  onClick={() => setShowAllNotes(!showAllNotes)}
                  className="text-blue-600 mt-3 hover:underline text-sm"
                >
                  {showAllNotes ? 'Show less' : 'Show all'}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}