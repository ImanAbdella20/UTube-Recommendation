"use client";

import React from "react";
import Link from "next/link";


const VideosPage = () => {
  return (
    <div className="p-8 max-w-screen-lg mx-auto">
      <h1 className="text-2xl font-bold text-black-100 md:text-3xl">Video Details</h1>
      <p className="text-lg text-gray-600 mt-4 md:text-xl">
        To view a specific video, please select one from the home page.
      </p>
      <p className="text-lg text-gray-600 mt-4 md:text-xl">
        <Link
          href="/home"
          className="text-primary-blue hover:text-secondary-purple font-semibold transition-colors"
        >
          Go back to the Home page
        </Link>
      </p>
    </div>
  );
};

export default VideosPage;
