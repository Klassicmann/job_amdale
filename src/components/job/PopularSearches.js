'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

const PopularSearches = () => {
  const router = useRouter();
  
  // List of popular job searches
  const popularSearches = [
    { title: 'AI/Machine Learning Specialist', query: 'ai machine learning' },
    { title: 'Renewable Energy Technician/Engineer', query: 'renewable energy' },
    { title: 'Software Developer', query: 'software developer' }
  ];

  // Handle click on a popular search
  const handleSearchClick = (query) => {
    // Navigate to jobs page with search query
    router.push(`/jobs?search=${encodeURIComponent(query)}`);
  };

  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold mb-3 text-gray-800">Popular Job Searches</h3>
      <div className="flex flex-wrap gap-2">
        {popularSearches.map((search, index) => (
          <button
            key={index}
            onClick={() => handleSearchClick(search.query)}
            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-full text-sm transition-colors duration-200 border border-blue-200"
          >
            {search.title}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PopularSearches;
