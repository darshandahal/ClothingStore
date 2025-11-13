"use client";
import React, { useState } from 'react';

// The HomePage component is designed to be the main section content.
const HomePage = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    // Main container for the home page content, centered and full width
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      
      {/* Content Card with styling */}
      <div 
        className={`w-full max-w-2xl bg-white shadow-xl rounded-xl p-8 transition duration-300 ease-in-out 
          ${isHovered ? 'ring-4 ring-indigo-500/50 scale-[1.02]' : 'ring-1 ring-gray-100'}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="text-center">
          
          {/* Main Greeting */}
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 sm:text-5xl">
            Hello, I'm Darshan Dahal
          </h1>
          
          {/* Introduction */}
          <p className="mt-4 text-xl text-gray-600">
            Welcome to my brand new React/Next.js application UI!
          </p>

          {/* Feature Showcase */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h2 className="text-2xl font-semibold text-indigo-700 mb-4">
              Simple UI Interaction Feature
            </h2>
            
            <p className="text-gray-500 mb-6">
              Hover over this entire card to see a visual effect, confirming the component is active.
            </p>

            {/* Status Button (Example UI Feature) */}
            <button 
              className={`px-6 py-3 rounded-lg font-medium text-white transition-all duration-300 shadow-md 
                ${isHovered ? 'bg-indigo-700 shadow-lg' : 'bg-indigo-500'}`}
            >
              Status: {isHovered ? 'Engaged!' : 'Ready'}
            </button>

          </div>
        </div>
      </div>
      
    </div>
  );
};

export default HomePage;