"use client";

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FiSearch, FiUser, FiBookmark, FiHeart, FiTrash2 } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { useVideoStore } from '@/store/videoStore';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const { bookmarks, favorites, removeBookmark, removeFavorite } = useVideoStore();

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

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-8">
          <Image
            src="/images/logo-primary-removebg-preview.png"
            alt="Logo"
            width={130}
            height={40}
            className="object-contain"
          />

          <nav className="hidden md:flex space-x-6">
            <Link
              href="/"
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
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search videos..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent font-inter"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-grey" />
          </div>

          <button
            onClick={handleFavoriteClick}
            className="p-2 rounded-full hover:bg-light-white-100 text-grey hover:text-primary-blue transition-colors relative"
            aria-label={showFavorites ? "Hide favorites" : "Show favorites"}
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
          >
            <FiBookmark className={`w-5 h-5 ${bookmarks.length > 0 ? 'text-blue-500' : ''}`} />
            {bookmarks.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>

          <button
            className="p-2 rounded-full hover:bg-light-white-100 text-grey hover:text-primary-blue transition-colors"
            aria-label="User profile"
          >
            <FiUser className="w-5 h-5" />
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
                {bookmarks.length > 0 ? (
                  bookmarks.map((id) => (
                    <div
                      key={id}
                      onClick={() => navigateToVideo(id)}
                      className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center min-w-0">
                        <div className="w-10 h-8 bg-gray-200 rounded mr-3 flex-shrink-0"></div>
                        <span className="text-sm truncate">Video {id}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeBookmark(id);
                        }}
                        className="text-gray-400 hover:text-red-500 p-1 ml-2"
                        aria-label={`Remove video ${id} from bookmarks`}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No saved videos</div>
                )}
              </div>
            </div>
          )}
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
                {favorites.length > 0 ? (
                  favorites.map((id) => (
                    <div
                      key={id}
                      onClick={() => navigateToVideo(id)}
                      className="p-3 hover:bg-gray-50 cursor-pointer flex items-center justify-between"
                    >
                      <div className="flex items-center min-w-0">
                        <div className="w-10 h-8 bg-gray-200 rounded mr-3 flex-shrink-0"></div>
                        <span className="text-sm truncate">Video {id}</span>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFavorite(id);
                        }}
                        className="text-gray-400 hover:text-red-500 p-1 ml-2"
                        aria-label={`Remove video ${id} from favorites`}
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No favorite videos</div>
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