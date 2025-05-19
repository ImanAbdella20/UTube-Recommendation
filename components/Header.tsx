"use client";

import React, { useState, useEffect, useRef } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { FiSearch, FiBookmark, FiHeart, FiTrash2, FiUser, FiMenu, FiX } from 'react-icons/fi';
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
  const searchParams = useSearchParams();
  const { user, userId, signOut } = useAuth();

  const {
    getUserBookmarks,
    getUserFavorites,
    removeBookmark,
    removeFavorite,
  } = useVideoStore();

  const bookmarks = userId ? getUserBookmarks(userId) : [];
  const favorites = userId ? getUserFavorites(userId) : [];

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [showBookmarks, setShowBookmarks] = useState(false);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [bookmarkVideos, setBookmarkVideos] = useState<VideoInfo[]>([]);
  const [favoriteVideos, setFavoriteVideos] = useState<VideoInfo[]>([]);

  const bookmarksRef = useRef<HTMLDivElement>(null);
  const favoritesRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (!bookmarksRef.current?.contains(event.target as Node)) setShowBookmarks(false);
      if (!favoritesRef.current?.contains(event.target as Node)) setShowFavorites(false);
      if (!userMenuRef.current?.contains(event.target as Node)) setShowUserMenu(false);
      if (!mobileMenuRef.current?.contains(event.target as Node) &&
        !(event.target as HTMLElement).closest('.mobile-menu-button')) {
        setShowMobileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch video thumbnails for bookmarks/favorites
  useEffect(() => {
    const fetchVideoDetails = async (ids: string[]) => {
      return ids.map(id => ({
        id,
        title: `Video ${id}`,
        thumbnail: `https://i.ytimg.com/vi/${id}/default.jpg`
      }));
    };

    if (showBookmarks && bookmarks.length) fetchVideoDetails(bookmarks).then(setBookmarkVideos);
    if (showFavorites && favorites.length) fetchVideoDetails(favorites).then(setFavoriteVideos);
  }, [showBookmarks, showFavorites, bookmarks, favorites]);

  useEffect(() => {
    setShowBookmarks(false);
    setShowFavorites(false);
    setShowUserMenu(false);
    setShowMobileMenu(false);
  }, [pathname]);

  const isActive = (path: string) =>
    path === '/videos' ? pathname.startsWith('/videos') : pathname === path;

  const handleSearchChange = (filterKey: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    value ? params.set(filterKey, value) : params.delete(filterKey);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  const handleTextSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearchChange('q', searchQuery);
  };

  const renderVideoItem = (video: VideoInfo, isBookmark: boolean) => (
    <div
      key={video.id}
      onClick={() => router.push(`/videos/${video.id}`)}
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
          if (userId) {
            isBookmark
              ? removeBookmark(userId, video.id)
              : removeFavorite(userId, video.id);
          }
        }}
        className="text-gray-400 hover:text-red-500 p-1 ml-2"
      >
        <FiTrash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <header className="bg-gradient-to-br from-indigo-50 to-blue-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          {/* Mobile menu and logo */}
          <div className="flex items-center space-x-4">
            <button
              className="mobile-menu-button md:hidden p-2 rounded-md hover:bg-gray-200"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              {showMobileMenu ? <FiX className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
            </button>
            <Link href="/" className="hidden md:flex">
              <Image
                src="/images/logo-primary-removebg-preview.png"
                alt="Logo"
                width={130}
                height={40}
                priority
              />
            </Link>
          </div>

          {/* Desktop nav links */}
          <nav className="hidden md:flex space-x-6">
            <Link href="/home" className={`font-medium ${isActive('/home') ? 'text-primary-blue' : 'text-black-100 hover:text-primary-blue'}`}>
              Home
            </Link>
            <Link href="/videos" className={`font-medium ${isActive('/videos') ? 'text-primary-blue' : 'text-black-100 hover:text-primary-blue'}`}>
              Videos
            </Link>
          </nav>

          {/* Right side buttons */}
          <div className="flex items-center space-x-4">
            {/* Search */}
            <form onSubmit={handleTextSearch} className="hidden sm:block">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search videos..."
                  className="w-full md:w-64 rounded-md border py-2 pl-4 pr-10"
                />
                <button type="submit" className="absolute right-2 top-2 text-gray-500">
                  <FiSearch className="h-5 w-5" />
                </button>
              </div>
            </form>

            {/* Favorites */}
            {userId && (
              <div className="relative" ref={favoritesRef}>
                <button
                  onClick={() => {
                    setShowFavorites(!showFavorites);
                    setShowBookmarks(false);
                  }}
                  className="p-2 rounded-full hover:bg-gray-200 relative"
                >
                  <FiHeart className={`w-5 h-5 ${favorites.length > 0 ? 'text-red-500' : 'text-gray-600'}`} />
                  {favorites.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />}
                </button>
                {showFavorites && (
                  <div className="absolute right-0 top-12 w-64 bg-white shadow-lg rounded-lg z-20">
                    <div className="p-4 border-b flex justify-between">
                      <h3 className="font-medium">Favorites ({favorites.length})</h3>
                      <button onClick={() => setShowFavorites(false)} className="text-gray-500">×</button>
                    </div>
                    <div className="max-h-[180px] overflow-y-auto">
                      {favoriteVideos.length > 0 ? favoriteVideos.map(v => renderVideoItem(v, false)) : (
                        <div className="p-4 text-center text-gray-500">
                          {favorites.length > 0 ? 'Loading...' : 'No favorites'}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bookmarks */}
            {userId && (
              <div className="relative" ref={bookmarksRef}>
                <button
                  onClick={() => {
                    setShowBookmarks(!showBookmarks);
                    setShowFavorites(false);
                  }}
                  className="p-2 rounded-full hover:bg-gray-200 relative"
                >
                  <FiBookmark className={`w-5 h-5 ${bookmarks.length > 0 ? 'text-blue-500' : 'text-gray-600'}`} />
                  {bookmarks.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full" />}
                </button>
                {showBookmarks && (
                  <div className="absolute right-0 top-12 w-64 bg-white shadow-lg rounded-lg z-20">
                    <div className="p-4 border-b flex justify-between">
                      <h3 className="font-medium">Saved Videos ({bookmarks.length})</h3>
                      <button onClick={() => setShowBookmarks(false)} className="text-gray-500">×</button>
                    </div>
                    <div className="max-h-[180px] overflow-y-auto">
                      {bookmarkVideos.length > 0 ? bookmarkVideos.map(v => renderVideoItem(v, true)) : (
                        <div className="p-4 text-center text-gray-500">
                          {bookmarks.length > 0 ? 'Loading...' : 'No saved videos'}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User menu */}
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 rounded-full hover:bg-gray-200"
              >
                {user?.photoURL ? (
                  <img src={user.photoURL} className="w-6 h-6 rounded-full" alt="User" />
                ) : (
                  <FiUser className="w-5 h-5 text-gray-600" />
                )}
              </button>
              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-md z-30 py-1">
                  {user?.displayName && (
                    <div className="px-4 py-2 text-sm font-medium text-gray-700 border-b">
                      {user.displayName}
                    </div>
                  )}
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      router.push('/profile');
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <div className='flex'>
                    <FiUser className="mr-2" /> Profile
                    </div>
                    
                  </button>
                  <button
                    onClick={() => {
                      setShowUserMenu(false);
                      signOut();
                    }}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                  >
                    <div className='flex'>
                    <LogOut className="mr-2 w-4 h-4" /> Sign Out
                    </div>
                   
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
