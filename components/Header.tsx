"use client";

import React, { useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { FiSearch, FiUser, FiBookmark, FiHeart } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';
import { useVideoStore } from '@/store/videoStore';

const Header = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const { bookmarks, favorites } = useVideoStore();

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
          >
            <FiHeart className="w-5 h-5" />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>

          <button
            onClick={handleBookmarkClick}
            className="p-2 rounded-full hover:bg-light-white-100 text-grey hover:text-primary-blue transition-colors relative"
          >
            <FiBookmark className="w-5 h-5" />
            {bookmarks.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full"></span>
            )}
          </button>

          <button className="p-2 rounded-full hover:bg-light-white-100 text-grey hover:text-primary-blue transition-colors">
            <FiUser className="w-5 h-5" />
          </button>

          {/* Bookmarks Dropdown */}
          {showBookmarks && (
            <div className="absolute right-0 top-12 w-64 bg-white shadow-lg rounded-lg z-20">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium">Saved Videos</h3>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {bookmarks.length > 0 ? (
                  bookmarks.map((id) => (
                    <div
                      key={id}
                      onClick={() => navigateToVideo(id)}
                      className="p-3 hover:bg-gray-50 cursor-pointer flex items-center"
                    >
                      <div className="w-16 h-12 bg-gray-200 rounded mr-3"></div>
                      <span className="text-sm truncate">Video {id}</span>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-gray-500">No saved videos</div>
                )}
              </div>
            </div>
          )}

          {/* Favorites Dropdown */}
          {showFavorites && (
            <div className="absolute right-0 top-12 w-64 bg-white shadow-lg rounded-lg z-20">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-medium">Favorite Videos</h3>
              </div>
              <div className="max-h-60 overflow-y-auto">
                {favorites.length > 0 ? (
                  favorites.map((id) => (
                    <div
                      key={id}
                      onClick={() => navigateToVideo(id)}
                      className="p-3 hover:bg-gray-50 cursor-pointer flex items-center"
                    >
                      <div className="w-16 h-12 bg-gray-200 rounded mr-3">
                        
                      </div>
                      <span className="text-sm truncate">Video {id}</span>
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