'use client';

import React from 'react';
import Link from 'next/link';
import { FaSearch, FaFilter, FaChartBar } from 'react-icons/fa';

export default function AnalyticsPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Analytics Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Search Analytics Card */}
        <Link href="/admin/analytics/search" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Search Analytics</h2>
              <FaSearch className="text-blue-500 text-2xl" />
            </div>
            <p className="text-gray-600">
              View the most popular search terms used by job seekers
            </p>
            <div className="mt-4 text-blue-600 font-medium">
              View Details →
            </div>
          </div>
        </Link>
        
        {/* Filter Analytics Card */}
        <Link href="/admin/analytics/filters" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Filter Analytics</h2>
              <FaFilter className="text-green-500 text-2xl" />
            </div>
            <p className="text-gray-600">
              See which job filters are most frequently used
            </p>
            <div className="mt-4 text-blue-600 font-medium">
              View Details →
            </div>
          </div>
        </Link>
        
        {/* User Activity Card */}
        <Link href="/admin/analytics/activity" className="block">
          <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">User Activity</h2>
              <FaChartBar className="text-purple-500 text-2xl" />
            </div>
            <p className="text-gray-600">
              Monitor user engagement and platform activity
            </p>
            <div className="mt-4 text-blue-600 font-medium">
              View Details →
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
