'use client';

import React, { useState, useEffect } from 'react';
import { getAllFilterAnalytics } from '@/lib/jobFilterAnalytics';

export default function FilterAnalyticsPage() {
  const [filterAnalytics, setFilterAnalytics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilterAnalytics = async () => {
      try {
        const analytics = await getAllFilterAnalytics();
        setFilterAnalytics(analytics);
      } catch (error) {
        console.error('Error fetching filter analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFilterAnalytics();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Filter Usage Analytics</h1>
      
      {loading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-10 bg-gray-200 rounded w-full"></div>
          ))}
        </div>
      ) : (
        <>
          {filterAnalytics.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Filter
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Value
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usage Count
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filterAnalytics.map((item, index) => {
                    // Parse the filter name and value from the ID (format: "filterName_filterValue")
                    const [filterName, filterValue] = item.id.split('_');
                    
                    return (
                      <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {filterName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {filterValue}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {item.count}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-lg shadow">
              <p className="text-gray-500">No filter usage data available yet.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
