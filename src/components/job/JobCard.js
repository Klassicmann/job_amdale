'use client';

import React from 'react';
import Link from 'next/link';
import { FaMapMarkerAlt, FaBriefcase, FaClock, FaBookmark, FaRegBookmark } from 'react-icons/fa';

const JobCard = ({ job }) => {
    const [saved, setSaved] = React.useState(false);
    
    const handleSave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setSaved(!saved);
    };
    
    return (
        <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 transition-all duration-300 hover:shadow-lg hover:border-blue-300 w-full relative overflow-hidden">
            {/* Subtle left border accent */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-400 opacity-70"></div>
            {/* Bookmark button */}
            <button 
                onClick={handleSave}
                className="absolute top-4 right-4 text-gray-400 hover:text-blue-500 transition-colors"
                aria-label={saved ? "Remove from saved jobs" : "Save job"}
            >
                {saved ? <FaBookmark className="text-blue-500" /> : <FaRegBookmark />}
            </button>
            
            <div className="flex items-start gap-4">
                {/* Company logo */}
                <div className="w-12 h-12 bg-gray-100 flex-shrink-0 rounded-md flex items-center justify-center text-xl font-semibold text-gray-500 border border-gray-200 shadow-sm">
                    {job.company?.charAt(0) || 'C'}
                </div>

                <div className="flex-grow">
                    {/* Job title and company */}
                    <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-1">
                            <Link href={`/jobs/${job.id}`} className="hover:text-blue-600">
                                {job.title}
                            </Link>
                        </h3>
                        <p className="text-gray-600 text-sm mb-2">{job.company}</p>
                    </div>

                    {/* Job details - location, type, etc */}
                    <div className="flex flex-wrap gap-2 text-xs text-gray-500 mb-3">
                        {job.location && (
                            <div className="flex items-center">
                                <FaMapMarkerAlt className="mr-1 text-gray-400" />
                                <span>{job.location}</span>
                            </div>
                        )}
                        {job.type && (
                            <div className="flex items-center">
                                <FaBriefcase className="mr-1 text-gray-400" />
                                <span>{job.type}</span>
                            </div>
                        )}
                        
                        {/* Years of experience */}
                        <div className="flex items-center">
                            <span>{job.experienceLevel || '2-4 Years'}</span>
                        </div>
                    </div>
                    
                    {/* Job tags/skills */}
                    <div className="flex flex-wrap gap-1 my-2">
                        {job.keywords && job.keywords.slice(0, 3).map((keyword, index) => (
                            <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-md border border-gray-200 shadow-sm"
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>
                    
                    {/* Match with profile */}
                    <div className="text-xs text-gray-500 mt-2 mb-3">
                        Match with your profile
                    </div>
                    
                    {/* Job info footer */}
                    <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center">
                            <FaClock className="mr-1 text-gray-400 text-xs" />
                            <span className="text-xs text-gray-500">
                                {job.createdAt ? getTimeAgo(job.createdAt) : '2 days ago'} • {job.applicants || '140'} Applicants
                            </span>
                        </div>
                        
                        {/* Salary */}
                        {job.salary && (
                            <div className="text-blue-600 font-medium text-sm">
                                ${job.salary.toString().replace(/[^0-9]/g, '').slice(0, 4)}/m
                            </div>
                        )}
                    </div>
                    
                    {/* Apply button */}
                    <div className="mt-3 text-right">
                        <Link
                            href={job.applyUrl || `/jobs/${job.id}/apply`}
                            className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium py-1.5 px-5 rounded-md text-sm transition-colors shadow-sm border border-blue-200 hover:shadow"
                        >
                            Apply Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Helper functions
const getTimeAgo = (dateString) => {
    const now = new Date();
    const date = new Date(dateString);
    const seconds = Math.floor((now - date) / 1000);

    let interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return `${interval} days ago`;
    }
    if (interval === 1) {
        return 'Yesterday';
    }

    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return `${interval} hours ago`;
    }
    if (interval === 1) {
        return '1 hour ago';
    }

    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return `${interval} minutes ago`;
    }

    return 'Just now';
};

export default JobCard;