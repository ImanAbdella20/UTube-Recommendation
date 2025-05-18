"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FiSearch, FiBookmark, FiHeart, FiTrash2 } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { useVideoStore } from '@/store/videoStore';
import { LogOut } from "lucide-react";
import { useAuth } from '@/context/AuthContext';

interface VideoInfo {
  id: string;
  title: string;
  thumbnail: string;
}

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { bookmarks, favorites, removeBookmark, removeFavorite } = useVideoStore();
  const { signOut } = useAuth();
  const [bookmarkVideos, setBookmarkVideos] = useState<VideoInfo[]>([]);
  const [favoriteVideos, setFavoriteVideos] = useState<VideoInfo[]>([]);

  // Fetch video details for bookmarks and favorites
  useEffect(() => {
    const fetchVideoDetails = async (ids: string[]) => {
      // In a real app, you would fetch these from your API
      // This is a mock implementation
      return ids.map(id => ({
        id,
        title: `Video ${id}`,
        thumbnail: `https://i.ytimg.com/vi/${id}/default.jpg`
      }));
    };

    if (showBookmarks && bookmarks.length > 0) {
      fetchVideoDetails(bookmarks).then(setBookmarkVideos);
    }
    if (showFavorites && favorites.length > 0) {
      fetchVideoDetails(favorites).then(setFavoriteVideos);
    }
  }, [showBookmarks, showFavorites, bookmarks, favorites]);

  const isActive = (path: string) => {
    if (path === '/videos') {
      return pathname.startsWith('/videos');
    }
    return pathname === path;
  };

  const handleBookmarkClick = () => {
    setShowBookmarks(!showBookmarks);
    setShowFavorites(false);
  };

  const handleFavoriteClick = () => {
    setShowFavorites(!showFavorites);
    setShowBookmarks(false);
  };

  const navigateToVideo = (id: string) => {
    router.push(`/videos/${id}`);
    setShowBookmarks(false);
    setShowFavorites(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery('');
    }
  };

  const renderVideoItem = (video: VideoInfo, isBookmark: boolean) => (
    <div
      key={video.id}
      onClick={() => navigateToVideo(video.id)}
      className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
    >
      <div className="flex items-center min-w-0">
        <div className="w-10 h-8 rounded mr-3 flex-shrink-0 overflow-hidden">
          <img 
            src={video.thumbnail} 
            alt={video.title}
            className="w-full h-full object-cover"
          />
        </div>
        <span className="text-sm truncate">{video.title}</span>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation();
          isBookmark ? removeBookmark(video.id) : removeFavorite(video.id);
        }}
        className="text-gray-400 hover:text-red-500 p-1 ml-2"
        aria-label={`Remove ${video.title} from ${isBookmark ? 'bookmarks' : 'favorites'}`}
      >
        <FiTrash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <header className="bg-gradient-to-br from-indigo-50 to-blue-100 shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Link href="/">
            <Image
              src="/images/logo-primary-removebg-preview.png"
              alt="Logo"
              width={130}
              height={40}
              className="object-contain"
              style={{ width: 'auto', height: 'auto' }}
              priority={true}  
            />
          </Link>

          <nav className="hidden md:flex space-x-6">
            <Link
              href="/home"
              className={`font-inter font-medium ${isActive('/')
                  ? 'text-primary-blue'
                  : 'text-black-100 hover:text-primary-blue'
                }`}
            >
              Home
            </Link>
            <Link
              href="/videos"
              className={`font-inter font-medium ${isActive('/videos')
                  ? 'text-primary-blue'
                  : 'text-black-100 hover:text-primary-blue'
                }`}
            >
              Videos
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4 relative">
          <form onSubmit={handleSearch} className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search videos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent font-inter w-64"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-grey" />
          </form>

          <button
            onClick={handleFavoriteClick}
            className="p-2 rounded-full hover:bg-light-white-100 text-grey hover:text-primary-blue transition-colors relative"
            aria-label={showFavorites ? "Hide favorites" : "Show favorites"}
            title='Favorites'
          >
            <FiHeart className={`w-5 h-5 ${favorites.length > 0 ? 'text-red-500' : ''}`} />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>

          <button
            onClick={handleBookmarkClick}
            className="p-2 rounded-full hover:bg-light-white-100 text-grey hover:text-primary-blue transition-colors relative"
            aria-label={showBookmarks ? "Hide bookmarks" : "Show bookmarks"}
            title='Saved'
          >
            <FiBookmark className={`w-5 h-5 ${bookmarks.length > 0 ? 'text-blue-500' : ''}`} />
            {bookmarks.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>

          <button
            className="p-2 rounded-full hover:bg-light-white-100 text-grey hover:text-primary-blue transition-colors"
            aria-label="User profile"
            title='Log Out'
            onClick={signOut}
          >
            <LogOut className="w-5 h-5" />
          </button>

          {/* Bookmarks Dropdown */}
          {showBookmarks && (
            <div className="absolute right-0 top-12 w-64 bg-white shadow-lg rounded-lg z-20 flex flex-col max-h-[300px] overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium">Saved Videos ({bookmarks.length})</h3>
                <button
                  onClick={() => setShowBookmarks(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close bookmarks"
                >
                  ×
                </button>
              </div>
              <div className="max-h-[180px] overflow-y-auto flex-1">
                {bookmarkVideos.length > 0 ? (
                  bookmarkVideos.map((video) => renderVideoItem(video, true))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {bookmarks.length > 0 ? 'Loading...' : 'No saved videos'}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Favorites Dropdown */}
          {showFavorites && (
            <div className="absolute right-0 top-12 w-64 bg-white shadow-lg rounded-lg z-20 flex flex-col max-h-[300px] overflow-hidden">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="font-medium">Favorite Videos ({favorites.length})</h3>
                <button
                  onClick={() => setShowFavorites(false)}
                  className="text-gray-500 hover:text-gray-700"
                  aria-label="Close favorites"
                >
                  ×
                </button>
              </div>
              <div className="max-h-[180px] overflow-y-auto flex-1">
                {favoriteVideos.length > 0 ? (
                  favoriteVideos.map((video) => renderVideoItem(video, false))
                ) : (
                  <div className="p-4 text-center text-gray-500">
                    {favorites.length > 0 ? 'Loading...' : 'No favorite videos'}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;