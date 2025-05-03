'use client';

import React, { useState, useEffect } from 'react';
import { getPopularSearchTerms } from '@/lib/searchAnalytics';

export default function SearchAnalyticsPage() {
    const [searchTerms, setSearchTerms] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSearchTerms = async () => {
            try {
                const terms = await getPopularSearchTerms(50);
                setSearchTerms(terms);
            } catch (error) {
                console.error('Error fetching search terms:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchSearchTerms();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Popular Search Terms</h1>

            {loading ? (
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i} className="h-10 bg-gray-200 rounded w-full"></div>
                    ))}
                </div>
            ) : (
                <>
                    {searchTerms.length > 0 ? (
                        <div className="bg-white rounded-lg shadow overflow-hidden">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Search Term
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Count
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Last Searched
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {searchTerms.map((term, index) => (
                                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                {term.term}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {term.count}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {term.lastSearched ? new Date(term.lastSearched.seconds * 1000).toLocaleString() : 'N/A'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-8 bg-white rounded-lg shadow">
                            <p className="text-gray-500">No search terms have been tracked yet.</p>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}