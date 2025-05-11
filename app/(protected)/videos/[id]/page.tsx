'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiBookmark, FiHeart, FiTrash2 } from 'react-icons/fi';
import { formatViews, formatPublishedAt, fetchInitialVideos } from '@/lib/api/videos';
import { useVideoStore } from '@/store/videoStore';
import VideoCard from '@/components/VideoCard';
import { Video } from '@/types/FilterState';

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

  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [recommendedVideos, setRecommendedVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const {
    bookmarks,
    favorites,
    addBookmark,
    removeBookmark,
    addFavorite,
    removeFavorite,
  } = useVideoStore();

  // Load notes from localStorage when component mounts
  useEffect(() => {
    if (!id) return;
    
    const savedNotes = localStorage.getItem(`video_notes_${id}`);
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, [id]);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (!id) return;
    localStorage.setItem(`video_notes_${id}`, JSON.stringify(notes));
  }, [notes, id]);

  // Load video details and recommendations
  useEffect(() => {
    if (!id) return;

    const fetchVideoData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check for cached video in localStorage first
        const cached = localStorage.getItem(`video_${id}`);
        if (cached) {
          setVideoDetails(JSON.parse(cached));
        }

        // Then fetch from API
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
    };

    const fetchRecommendations = async () => {
      try {
        setRecommendedLoading(true);
        const allVideos = await fetchInitialVideos();
        const filteredVideos = allVideos.filter((v) => v.id !== id).slice(0, 6);
        setRecommendedVideos(filteredVideos);
        localStorage.setItem(`recommended_${id}`, JSON.stringify(filteredVideos));
      } catch (err) {
        // Fallback to localStorage if API fails
        const cached = localStorage.getItem(`recommended_${id}`);
        if (cached) {
          setRecommendedVideos(JSON.parse(cached));
        }
      } finally {
        setRecommendedLoading(false);
      }
    };

    // Check for cached recommendations
    const cachedRecs = localStorage.getItem(`recommended_${id}`);
    if (cachedRecs) {
      setRecommendedVideos(JSON.parse(cachedRecs));
    } else {
      fetchRecommendations();
    }

    fetchVideoData();
  }, [id]);

  const getFirstThreeLines = (text: string) => text.split('\n').slice(0, 3).join('\n');

  const handleFavorite = () => {
    if (!videoDetails) return;
    favorites.includes(videoDetails.id)
      ? removeFavorite(videoDetails.id)
      : addFavorite(videoDetails.id);
  };

  const handleBookmark = () => {
    if (!videoDetails) return;
    bookmarks.includes(videoDetails.id)
      ? removeBookmark(videoDetails.id)
      : addBookmark(videoDetails.id);
  };

  const addNewNote = () => {
    if (newNote.trim()) {
      const updatedNotes = [...notes, newNote.trim()];
      setNotes(updatedNotes);
      setNewNote('');
    }
  };

  if (!id) return <div className="p-8">Invalid Video</div>;

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
          onClick={() => router.refresh()}
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!videoDetails) return <div className="p-8">Video not found</div>;

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="lg:w-2/3">
          <div className="aspect-video bg-black rounded-lg overflow-hidden">
            <iframe
              className="w-full h-full"
              src={`https://www.youtube.com/embed/${videoDetails.id}?autoplay=1`}
              title={videoDetails.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          <h1 className="text-2xl font-bold mt-4">{videoDetails.title}</h1>
          <div className="text-gray-600 mt-2 flex justify-between">
            <div>
              {formatViews(videoDetails.viewCount)} • {formatPublishedAt(videoDetails.publishedAt)}
            </div>
            <div className="flex gap-3">
              <button onClick={handleFavorite}>
                <FiHeart className={`w-5 h-5 ${favorites.includes(videoDetails.id) ? 'text-red-600' : ''}`} />
              </button>
              <button onClick={handleBookmark}>
                <FiBookmark className={`w-5 h-5 ${bookmarks.includes(videoDetails.id) ? 'text-blue-600' : ''}`} />
              </button>
            </div>
          </div>

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
            <button className="ml-auto bg-red-600 text-white px-4 py-2 rounded-full hover:bg-red-700">
              Subscribe
            </button>
          </div>

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

        <div className="lg:w-1/3">
          <div className="sticky top-4">
            <h2 className="text-xl font-bold mb-4">Video Notes</h2>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addNewNote()}
              placeholder="Write a note..."
              className="w-full border p-2 rounded-lg min-h-[100px]"
            />
            <button
              onClick={addNewNote}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Add Note
            </button>

            <div className="mt-6">
              <h3 className="font-medium mb-2">Your Notes ({notes.length})</h3>
              {notes.length === 0 ? (
                <p className="text-gray-500">No notes yet</p>
              ) : (
                notes.slice(0, showAllNotes ? notes.length : 3).map((note, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center bg-gray-100 p-3 rounded-lg mb-2"
                  >
                    <span>{note}</span>
                    <button
                      onClick={() => setNotes(notes.filter((_, i) => i !== index))}
                      className="hover:text-red-600"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
              {notes.length > 3 && (
                <button
                  onClick={() => setShowAllNotes(!showAllNotes)}
                  className="text-blue-600 mt-2 hover:underline text-sm"
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