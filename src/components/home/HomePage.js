'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import SearchBar from '@/components/common/SearchBar';
import FeaturedJobs from '@/components/job/FeaturedJobs';
import { FaBriefcase, FaUsers, FaBullhorn } from 'react-icons/fa';

// Statistics to display
const siteStats = [
    { id: 1, icon: FaBriefcase, label: 'Jobs Available', value: '10,000+' },
    { id: 2, icon: FaUsers, label: 'Active Users', value: '250,000+' },
    { id: 3, icon: FaBullhorn, label: 'Companies', value: '5,000+' }
];

export default function HomePage() {
    const [animateBackground, setAnimateBackground] = useState(false);
    const router = useRouter();
    const { trackEvent } = useAnalytics();

    // Start background zoom animation after component mounts
    useEffect(() => {
        setAnimateBackground(true);

        // Track page view
        trackEvent('page_view', {
            page: 'home'
        });
    }, [trackEvent]);

    const handleSearch = (query, location) => {
        // Track search event
        trackEvent('search', {
            query,
            location: location || undefined,
            source: 'home_search'
        });

        // Navigate to search results
        let searchUrl = `/jobs?q=${encodeURIComponent(query)}`;
        if (location) {
            searchUrl += `&location=${encodeURIComponent(location)}`;
        }
        router.push(searchUrl);
    };

    return (
        <>
            {/* Hero Section */}
            <div className="relative min-h-screen">
                {/* Background with animation */}
                <div
                    className={`overflow-x-hidden min-h-screen absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-10000 ease-out ${animateBackground ? 'scale-110' : 'scale-100'
                        }`}
                    style={{
                        backgroundImage: "url('/images/3948.jpg')",
                        zIndex: -1
                    }}
                >
                    {/* Overlay for better text readability */}
                    <div className="absolute inset-0 bg-black opacity-50"></div>
                </div>

                <div className="container mx-auto px-4 pt-32 pb-20 h-full flex flex-col items-start justify-center">
                    <div className="max-w-3xl text-white mt-40 ml-30">
                        <h1 className="text-5xl md:text-6xl font-bold mb-4 leading-tight">
                            <span className="text-blue-400">  BACK-TO-WORK</span>ANGELS<br />
                            People, Companies and Opportunities combined as ONE
                        </h1>
                      
                        <p className="text-xl mb-12">
                            Thousands of Small businesses & Entrepreneurs use<br />
                            BTW Angels to get their Job done
                        </p>

                        {/* Search Form */}
                        <div className="max-w-2xl mb-8">
                            <SearchBar
                                mode="hero"
                                onSearch={handleSearch}
                            />
                        </div>

                        {/* Popular Searches */}
                        <div className="mb-8">
                            <p className="text-gray-300 mb-2">Popular Job Searches:</p>
                            <div className="flex flex-wrap gap-2">
                                {['AI/Machine Learning Specialist', 'Renewable Energy Technician/Engineer', 'Software Developer'].map((term, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleSearch(term)}
                                        className="bg-white bg-opacity-10 hover:bg-opacity-20 rounded-full px-4 py-1 text-white transition duration-200"
                                    >
                                        {term}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div>
                            <Link
                                href="/jobs"
                                className="text-blue-400 hover:text-yellow-300 underline transition duration-200"
                            >
                                Advanced Search
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Featured Jobs Section */}
            <FeaturedJobs />

            {/* Stats Section */}
            <section className="py-16 bg-blue-600 text-white">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Your Career Journey Starts Here</h2>
                        <p className="text-xl text-blue-100">Join thousands of job seekers who found their dream job with BTW Angels</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {siteStats.map(stat => (
                            <div key={stat.id} className="text-center p-6 bg-blue-700 bg-opacity-30 rounded-lg">
                                <div className="inline-flex items-center justify-center w-16 h-16 bg-white bg-opacity-20 rounded-full mb-4">
                                    <stat.icon className="text-white text-2xl" />
                                </div>
                                <h3 className="text-4xl font-bold mb-2">{stat.value}</h3>
                                <p className="text-blue-100">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

         
           

            {/* CTA Section */}
            <section className="py-16 bg-gray-900 text-white">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Dream Job?</h2>
                    <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                        Join thousands of job seekers who found their perfect position through BTW Angels
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/jobs"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-200"
                        >
                            Browse Jobs
                        </Link>
                        <Link
                            href="/about"
                            className="bg-transparent hover:bg-white hover:text-gray-900 text-white font-bold py-3 px-8 border-2 border-white rounded-lg transition duration-200"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>
        </>
    );
}

// Add Expiration date