'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import SideBar from '@/components/SideBar';
import VideoGrid from '@/components/VideoGrid';

export default function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const router = useRouter();

  useEffect(() => {
    // Add any auth checks here if needed
  }, [router]);

  return (
    <div className="flex flex-col h-screen ">
      
      {/* Main content area with sidebar and video grid */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - fixed width, scrollable */}
        <div className="hidden lg:block lg:w-95  bg-white border-r border-gray-200 overflow-y-auto pl-20">
          <SideBar />
        </div>
        
        {/* Main content - scrollable */}
        <main className="flex-1 overflow-y-auto p-4  pr-30 pl-10">
          <h1 className="text-2xl font-bold mb-6">Recommended Videos</h1>
          <VideoGrid searchParams={searchParams} />
        </main>
      </div>
    </div>
  );
}