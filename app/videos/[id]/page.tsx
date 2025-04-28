"use client";  

import { useParams } from 'next/navigation';

export default function VideoPage() {
  const params = useParams();
  const { id } = params;

  // Check if the id is undefined or empty
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

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Video ID: {id}</h1>
      {/* Fetch and display the video content using the `id` */}
    </div>
  );
}
