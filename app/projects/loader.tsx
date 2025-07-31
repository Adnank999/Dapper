import React from 'react';

const Loader = () => {
  return (
    <div className="w-full max-w-7xl mx-auto p-6 space-y-16">
      {/* Skeleton for projects */}
      {[...Array(3)].map((_, index) => (
        <div
          key={index}
          className="grid lg:grid-cols-2 gap-8 items-start animate-pulse"
        >
          {/* Image Skeleton */}
          <div className="relative overflow-hidden p-8 min-h-[350px] flex justify-center items-center bg-gray-700 rounded-lg">
            <div className="w-72 h-72 bg-gray-600 rounded-lg"></div>
          </div>

          {/* Project Details Skeleton */}
          <div className="space-y-8 text-gray-400">
            {/* Title Skeleton */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-0.5 bg-gray-500"></div>
                <div className="w-40 h-8 bg-gray-600 rounded"></div>
              </div>
              <div className="w-full h-4 bg-gray-600 rounded"></div>
              <div className="w-3/4 h-4 bg-gray-600 rounded"></div>
            </div>

            {/* Features Skeleton */}
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 bg-gray-500 rounded-full flex-shrink-0"></div>
                  <div className="w-3/4 h-4 bg-gray-600 rounded"></div>
                </div>
              ))}
            </div>

            {/* Tech Stack Badges Skeleton */}
            <div className="flex flex-wrap gap-3">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="px-3 py-2 text-xs bg-gray-600 rounded-full w-20 h-6"
                ></div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Loader;