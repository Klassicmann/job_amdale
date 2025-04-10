'use client';

import React from 'react';
import Link from 'next/link';
import { FaMapMarkerAlt, FaBriefcase, FaClock } from 'react-icons/fa';

const JobCard = ({ job }) => {
    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-5 transition-all duration-300 hover:shadow-md hover:border-blue-200 w-full">
            <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-gray-100 flex-shrink-0 rounded flex items-center justify-center text-xl font-semibold text-gray-500">
                    {job.company.charAt(0)}
                </div>

                <div className="flex-grow">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-1">
                                <Link href={`/jobs/${job.id}`} className="hover:text-blue-600">
                                    {job.title}
                                </Link>
                            </h3>
                            <p className="text-gray-600 mb-2">{job.company}</p>
                        </div>

                        {job.salary && (
                            <div className="text-green-600 font-medium">
                                {job.salary}
                            </div>
                        )}
                    </div>

                    <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-3">
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
                        {job.createdAt && (
                            <div className="flex items-center">
                                <FaClock className="mr-1 text-gray-400" />
                                <span>Mar {new Date(job.createdAt).getDate()}</span>
                            </div>
                        )}
                    </div>

                    <p className="text-gray-600 mb-4 line-clamp-2">
                        {job.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                        {job.keywords && job.keywords.slice(0, 3).map((keyword, index) => (
                            <span
                                key={index}
                                className="px-3 py-1 bg-blue-50 text-blue-600 text-sm rounded-lg"
                            >
                                {keyword}
                            </span>
                        ))}
                    </div>

                    <div className="mt-4 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <Link
                            href={`/
                                /${job.id}`}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                        >
                            View Details
                        </Link>

                        <span className="text-xs text-gray-500">
                            {getTimeAgo(job.createdAt)}
                        </span>
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