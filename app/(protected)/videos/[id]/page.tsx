'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiBookmark, FiHeart, FiTrash2 } from 'react-icons/fi';
import { formatViews, formatPublishedAt } from '@/lib/api/videos';
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
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notes, setNotes] = useState<string[]>([]);
  const [newNote, setNewNote] = useState('');
  const [showAllNotes, setShowAllNotes] = useState(false);
  const [recommended, setRecommended] = useState<Video[]>([]);

  const {
    bookmarks,
    favorites,
    addBookmark,
    removeBookmark,
    addFavorite,
    removeFavorite,
  } = useVideoStore();

  useEffect(() => {
    if (!id) return;

    const fetchVideoDetails = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
        );

        if (!response.ok) throw new Error('Failed to fetch video details');

        const data = await response.json();
        if (!data.items || data.items.length === 0) throw new Error('Video not found');

        const item = data.items[0];
        const details = {
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
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [id]);

  const handleBookmark = () => {
    if (!videoDetails) return;
    bookmarks.includes(videoDetails.id)
      ? removeBookmark(videoDetails.id)
      : addBookmark(videoDetails.id);
  };

  const handleFavorite = () => {
    if (!videoDetails) return;
    favorites.includes(videoDetails.id)
      ? removeFavorite(videoDetails.id)
      : addFavorite(videoDetails.id);
  };

  if (!id) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Welcome to the Video Page</h1>
        <p className="text-lg text-gray-600">Select a video to view its details.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-red-500 text-center">
        <h1 className="text-2xl font-bold">Error</h1>
        <p>please connect to the internet!</p>
          <button
            onClick={() => window.location.reload()}
            className=" bg-gray-200 text-black px-4 py-2 rounded transition"
          >
            Retry
          </button>
      </div>
    );
  }

  if (!videoDetails) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Video not found</h1>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <div className="relative bg-black rounded-lg overflow-hidden min-h-[280px]">
            <iframe
              className="absolute top-0 left-0 w-full h-full"
              src={`https://www.youtube.com/embed/${id}?autoplay=1`}
              title={videoDetails.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>

          <div className="mt-6">
            <h1 className="text-2xl font-bold">{videoDetails.title}</h1>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4 text-gray-600">
                <span>{formatViews(videoDetails.viewCount)} views</span>
                <span>{formatPublishedAt(videoDetails.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-4">
                <button onClick={handleFavorite} className="hover:text-red-600">
                  <FiHeart className="w-5 h-5" />
                </button>
                <button onClick={handleBookmark} className="hover:text-blue-600">
                  <FiBookmark className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-center mt-4 p-4 bg-gray-50 rounded-lg">
              <Image
                src={videoDetails.thumbnail}
                alt={videoDetails.channelTitle}
                width={48}
                height={48}
                className="rounded-full"
              />
              <div className="ml-3">
                <h2 className="font-medium">{videoDetails.channelTitle}</h2>
                <p className="text-sm text-gray-500">1.2M subscribers</p>
              </div>
              <button className="ml-auto px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700">
                Subscribe
              </button>
            </div>

            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="whitespace-pre-line">{videoDetails.description}</p>
            </div>
          </div>

          {recommended.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-semibold mb-4">Recommended Videos</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {recommended.map((video) => (
                  <VideoCard key={video.id} video={video} basePath="videos" />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notes Panel */}
        <div className="lg:w-1/3">
          <h2 className="text-xl font-bold mb-4">Take Notes From The Video</h2>
          <div className="space-y-4">
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write a note..."
              className="w-full border p-2 rounded-lg"
            />
            <button
              onClick={() => {
                if (newNote.trim()) {
                  setNotes([...notes, newNote.trim()]);
                  setNewNote('');
                }
              }}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
            >
              Add Note
            </button>
          </div>

          <div className="mt-6 space-y-2">
            {notes.map((note, index) => (
              <div key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded">
                <span>{note}</span>
                <button onClick={() => setNotes(notes.filter((_, i) => i !== index))}>
                  <FiTrash2 className="text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
