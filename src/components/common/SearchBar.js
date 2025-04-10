'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { FaSearch, FaMapMarkerAlt, FaTimes } from 'react-icons/fa';
import { useAnalytics } from '@/contexts/AnalyticsContext';

const SearchBar = ({
    initialQuery = '',
    initialLocation = '',
    mode = 'standard', // 'standard', 'compact', 'hero'
    className = '',
    onSearch = null
}) => {
    const [query, setQuery] = useState(initialQuery);
    const [location, setLocation] = useState(initialLocation);
    const [recentSearches, setRecentSearches] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const router = useRouter();
    const { trackEvent } = useAnalytics();
    const searchRef = useRef(null);

    // Popular search suggestions
    const popularSearches = [
        'Frontend Developer',
        'UI Designer',
        'Data Scientist',
        'Product Manager',
        'DevOps Engineer'
    ];

    // Popular locations
    const popularLocations = [
        'Remote',
        'New York, NY',
        'San Francisco, CA',
        'London, UK',
        'Berlin, Germany'
    ];

    // Load recent searches from localStorage on component mount
    useEffect(() => {
        const storedSearches = localStorage.getItem('recentSearches');
        if (storedSearches) {
            try {
                setRecentSearches(JSON.parse(storedSearches).slice(0, 5));
            } catch (e) {
                console.error('Error loading recent searches', e);
            }
        }
    }, []);

    // Add click outside listener to close suggestions
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const saveRecentSearch = (query, location) => {
        if (!query.trim()) return;

        const newSearch = {
            query,
            location: location || '',
            timestamp: new Date().toISOString()
        };

        const updatedSearches = [
            newSearch,
            ...recentSearches.filter(
                item => !(item.query === query && item.location === location)
            )
        ].slice(0, 5);

        setRecentSearches(updatedSearches);

        try {
            localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
        } catch (e) {
            console.error('Error saving recent searches', e);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmedQuery = query.trim();

        // Save to recent searches
        saveRecentSearch(trimmedQuery, location);

        // Track search event
        trackEvent('search', {
            query: trimmedQuery,
            location: location || undefined,
            source: 'search_bar'
        });

        // If onSearch prop is provided, use that instead of navigation
        if (onSearch) {
            onSearch(trimmedQuery, location);
            setShowSuggestions(false);
            return;
        }

        // Construct search URL
        let searchUrl = `/jobs?q=${encodeURIComponent(trimmedQuery)}`;
        if (location) {
            searchUrl += `&location=${encodeURIComponent(location)}`;
        }

        router.push(searchUrl);
        setShowSuggestions(false);
    };

    const handleSuggestionClick = (suggestion) => {
        setQuery(suggestion);
        setShowSuggestions(false);

        // Track suggestion click
        trackEvent('search_suggestion_click', {
            suggestion,
            source: 'search_bar'
        });

        // If onSearch prop is provided, use that
        if (onSearch) {
            onSearch(suggestion, location);
        } else {
            router.push(`/jobs?q=${encodeURIComponent(suggestion)}`);
        }
    };

    const handleLocationClick = (locationName) => {
        setLocation(locationName);

        // Track location click
        trackEvent('search_location_click', {
            location: locationName,
            source: 'search_bar'
        });
    };

    const handleRecentSearchClick = (item) => {
        setQuery(item.query);
        if (item.location) setLocation(item.location);

        // Track recent search click
        trackEvent('recent_search_click', {
            query: item.query,
            location: item.location || undefined,
            source: 'search_bar'
        });

        // If onSearch prop is provided, use that
        if (onSearch) {
            onSearch(item.query, item.location);
            setShowSuggestions(false);
        } else {
            let searchUrl = `/jobs?q=${encodeURIComponent(item.query)}`;
            if (item.location) {
                searchUrl += `&location=${encodeURIComponent(item.location)}`;
            }
            router.push(searchUrl);
            setShowSuggestions(false);
        }
    };

    const clearRecentSearches = () => {
        setRecentSearches([]);
        localStorage.removeItem('recentSearches');

        // Track clear recent searches
        trackEvent('clear_recent_searches', {
            source: 'search_bar'
        });
    };

    // Different styles based on mode
    let containerClass = '';
    let inputClass = '';
    let buttonClass = '';

    if (mode === 'compact') {
        containerClass = 'flex bg-white rounded-lg shadow';
        inputClass = 'text-sm py-2';
        buttonClass = 'px-3 py-2 text-sm';
    } else if (mode === 'hero') {
        containerClass = 'flex bg-white rounded-lg shadow-lg';
        inputClass = 'text-base py-3';
        buttonClass = 'px-6 py-3 text-base';
    } else { // standard
        containerClass = 'flex bg-white rounded-lg shadow-md';
        inputClass = 'text-base py-3';
        buttonClass = 'px-5 py-3';
    }

    return (
        <div className={`relative ${className}`} ref={searchRef}>
            <form onSubmit={handleSubmit} className={containerClass}>
                {/* Job search field */}
                <div className="relative flex-1">
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                        <FaSearch />
                    </div>
                    <input
                        type="text"
                        placeholder="Job title, keywords, or company"
                        className={`w-full ${inputClass} pl-10 pr-4 border-none rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setShowSuggestions(true)}
                    />
                </div>

                {/* Location field (if not compact) */}
                {mode !== 'compact' && (
                    <div className="relative border-l border-gray-200">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            <FaMapMarkerAlt />
                        </div>
                        <input
                            type="text"
                            placeholder="Location"
                            className={`w-full sm:w-48 ${inputClass} pl-10 pr-4 border-none focus:outline-none focus:ring-2 focus:ring-blue-500`}
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                )}

                {/* Search button */}
                <button
                    type="submit"
                    className={`${buttonClass} bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-r-lg transition duration-200`}
                >
                    {mode === 'compact' ? <FaSearch /> : 'Search'}
                </button>
            </form>

            {/* Search suggestions dropdown */}
            {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                    {/* Recent searches */}
                    {recentSearches.length > 0 && (
                        <div className="p-3 border-b border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-sm font-medium text-gray-700">Recent Searches</h3>
                                <button
                                    onClick={clearRecentSearches}
                                    className="text-xs text-blue-600 hover:text-blue-800"
                                >
                                    Clear
                                </button>
                            </div>
                            <ul>
                                {recentSearches.map((item, index) => (
                                    <li key={index}>
                                        <button
                                            type="button"
                                            onClick={() => handleRecentSearchClick(item)}
                                            className="w-full text-left px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-100 rounded"
                                        >
                                            <span className="font-medium">{item.query}</span>
                                            {item.location && (
                                                <span className="text-gray-500 ml-2">in {item.location}</span>
                                            )}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Popular searches */}
                    <div className="p-3 border-b border-gray-100">
                        <h3 className="text-sm font-medium text-gray-700 mb-2">Popular Searches</h3>
                        <div className="flex flex-wrap gap-2">
                            {popularSearches.map((term, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => handleSuggestionClick(term)}
                                    className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition duration-200"
                                >
                                    {term}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Popular locations - only show if not in compact mode */}
                    {mode !== 'compact' && (
                        <div className="p-3">
                            <h3 className="text-sm font-medium text-gray-700 mb-2">Popular Locations</h3>
                            <div className="flex flex-wrap gap-2">
                                {popularLocations.map((loc, index) => (
                                    <button
                                        key={index}
                                        type="button"
                                        onClick={() => handleLocationClick(loc)}
                                        className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition duration-200 flex items-center"
                                    >
                                        <FaMapMarkerAlt className="mr-1 text-gray-500" size={12} />
                                        {loc}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;