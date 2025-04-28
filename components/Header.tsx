"use client";

import React from 'react';
import { usePathname } from 'next/navigation';
import { FiSearch, FiFilter, FiUser, FiBookmark, FiHeart } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';

const Header = () => {
  const pathname = usePathname();

  const isActive = (path: string) => {
    // Mark "Videos" active if path starts with /videos (even /videos/123)
    if (path === '/videos') {
      return pathname.startsWith('/videos');
    }
    return pathname === path;
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
              className={`font-inter font-medium ${
                isActive('/') 
                  ? 'text-primary-blue' 
                  : 'text-black-100 hover:text-primary-blue'
              }`}
            >
              Home
            </Link>

            <Link 
              href="/videos"
              className={`font-inter font-medium ${
                isActive('/videos') 
                  ? 'text-primary-blue' 
                  : 'text-black-100 hover:text-primary-blue'
              }`}
            >
              Videos
            </Link>
          </nav>
        </div>

        <div className="flex items-center space-x-4">
          <div className="relative hidden sm:block">
            <input
              type="text"
              placeholder="Search videos..."
              className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-blue focus:border-transparent font-inter"
            />
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-grey" />
          </div>

          <button className="p-2 rounded-full hover:bg-light-white-100 text-grey hover:text-primary-blue transition-colors">
            <FiHeart className="w-5 h-5" />
          </button>

          <button className="p-2 rounded-full hover:bg-light-white-100 text-grey hover:text-primary-blue transition-colors">
            <FiBookmark className="w-5 h-5" />
          </button>

          <button className="p-2 rounded-full hover:bg-light-white-100 text-grey hover:text-primary-blue transition-colors">
            <FiUser className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
