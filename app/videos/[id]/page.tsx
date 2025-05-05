"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { FiBookmark, FiHeart, FiTrash2 } from 'react-icons/fi';
import { formatViews, formatPublishedAt } from '@/lib/api/videos';
import { useVideoStore } from '@/store/videoStore';

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
  const [newNote, setNewNote] = useState("");
  const [showAllNotes, setShowAllNotes] = useState(false);
  const {
    bookmarks,
    favorites,
    addBookmark,
    removeBookmark,
    addFavorite,
    removeFavorite
  } = useVideoStore();




  useEffect(() => {
    if (!id) return;

    const fetchVideoDetails = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${id}&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch video details');
        }

        const data = await response.json();

        if (!data.items || data.items.length === 0) {
          throw new Error('Video not found');
        }

        const item = data.items[0];
        setVideoDetails({
          id: item.id,
          title: item.snippet.title,
          description: item.snippet.description,
          channelTitle: item.snippet.channelTitle,
          publishedAt: item.snippet.publishedAt,
          viewCount: item.statistics.viewCount,
          likeCount: item.statistics.likeCount,
          thumbnail: item.snippet.thumbnails.maxres?.url || item.snippet.thumbnails.high.url,
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchVideoDetails();
  }, [id]);


  const handleBookmark = () => {
    if (videoDetails) {
      if (bookmarks.includes(videoDetails.id)) {
        removeBookmark(videoDetails.id);
      } else {
        addBookmark(videoDetails.id);
      }
    }
  };

  const handleFavorite = () => {
    if (videoDetails) {
      if (favorites.includes(videoDetails.id)) {
        removeFavorite(videoDetails.id);
      } else {
        addFavorite(videoDetails.id);
      }
    }
  };

  if (!id) {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold">Welcome to the Video Page</h1>
        <p className="text-lg text-gray-600">
          Please select a video from the available list to view more details.
          Browse our collection of videos for educational content, tutorials, and more.
        </p>
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
      <div className="p-8 text-red-500">
        <h1 className="text-2xl font-bold">Error</h1>
        <p>{error}</p>
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
    <div className="container mx-auto pr-40 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Video Section */}
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

          {/* Video Info */}
          <div className="mt-6">
            <h1 className="text-2xl font-bold">{videoDetails.title}</h1>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center space-x-4 text-gray-600">
                <span>{formatViews(videoDetails.viewCount)} views</span>
                <span>{formatPublishedAt(videoDetails.publishedAt)}</span>
              </div>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-1 text-gray-600 hover:text-gray-900">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"></path>
                  </svg>
                  <span>{formatViews(videoDetails.likeCount)}</span>
                </button>
              </div>
            </div>

            {/* Channel Info */}
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
              <button className="ml-auto px-4 py-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors">
                Subscribe
              </button>
            </div>

            {/* Description */}
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <p className="whitespace-pre-line">{videoDetails.description}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4 mt-4">
          <button
            onClick={handleBookmark}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors relative"
            aria-label="Save to bookmarks"
            title="Save"
          >
            <FiBookmark className="w-6 h-6 text-gray-700 hover:text-blue-600" />
            {bookmarks.includes(videoDetails.id) && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>
          <button
            onClick={handleFavorite}
            className="p-2 rounded-full hover:bg-gray-200 transition-colors relative"
            aria-label="Add to favorites"
            title="Favorite"
          >
            <FiHeart className="w-6 h-6 text-gray-700 hover:text-red-500" />
            {favorites.includes(videoDetails.id) && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>
        </div>

        {/* Notes Section */}
        <div className="lg:w-67">
          <h2 className="text-xl font-bold mb-4">Take Notes From The Video</h2>

          <div className="mb-6 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-4 space-y-3">
                {notes.slice(0, 3).map((note, index) => (
                  <div
                    key={index}
                    className="flex items-start group hover:bg-gray-50 rounded transition-colors"
                  >
                    <span className="mr-2 text-gray-500">•</span>
                    <span className="text-gray-700 flex-grow">{note}</span>
                    <button
                      onClick={() => {
                        const updatedNotes = [...notes];
                        updatedNotes.splice(index, 1);
                        setNotes(updatedNotes);
                      }}
                      className="ml-2 opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-opacity"
                      aria-label={`Delete note ${index + 1}`}
                    >
                      <FiTrash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>


            {notes.length > 3 && (
              <div className={`px-4 ${showAllNotes ? 'pb-4' : ''}`}>
                {showAllNotes && (
                  <div className="pt-2 border-t border-gray-100 space-y-3">
                    {notes.slice(3).map((note, index) => (
                      <div key={index + 3} className="flex items-start">
                        <span className="mr-2 text-gray-500">•</span>
                        <span className="text-gray-700">{note}</span>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => setShowAllNotes(!showAllNotes)}
                  className="w-full py-2 text-sm text-blue-600 hover:text-blue-800 flex items-center justify-center"
                >
                  {showAllNotes ? (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                      </svg>
                      Show Less
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                      </svg>
                      Show {notes.length - 3} More Notes
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Input Field */}
          <div className="mt-4">
            <div className="relative">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newNote.trim()) {
                    setNotes([...notes, newNote.trim()]);
                    setNewNote('');
                  }
                }}
                placeholder="Type your note "
                className="w-full px-5 py-4 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <button
                onClick={() => {
                  if (newNote.trim()) {
                    setNotes([...notes, newNote.trim()]);
                    setNewNote('');
                  }
                }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-500 hover:text-blue-600"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">Press Enter or click the + icon to add note</p>
          </div>
        </div>
      </div>

      {/* Recommended Videos Placeholder */}
      <div className="mt-10 text-center">
        <h1 className="text-xl font-semibold">Recommended Videos</h1>
      </div>
    </div>
  );
}