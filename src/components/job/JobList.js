'use client';

import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import JobFilter from './JobFilter';
import { FaSearch } from 'react-icons/fa';
import { searchJobs, getJobsByFilters } from '@/lib/services/jobService';
import { incrementFilterCounts } from '@/lib/jobFilterAnalytics';
import { trackSearchTerm } from '@/lib/searchAnalytics';

const JobList = ({ initialJobs = [], showFilters = true, showSearchBar = true, title = "Latest Jobs" }) => {
    const [jobs, setJobs] = useState([]);
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        jobTypes: [],
        locations: [],
        categories: [],
        industries: [],
        experiences: [],
        companies: [],
        skills: [],
        languages: [],
        englishLevels: [],
        minBudget: 0,
        maxBudget: 20000
    });

    // Initialize with the jobs passed as props
    useEffect(() => {
        if (initialJobs && initialJobs.length > 0) {
            setJobs(initialJobs);
            setFilteredJobs(initialJobs);
        }
        setIsLoading(false);
    }, [initialJobs]); // Add initialJobs as a dependency

    // Fetch jobs when search query or filters change
    useEffect(() => {
        const fetchFilteredJobs = async () => {
            try {
                setIsLoading(true);
                setError(null);

                console.log('Current filters:', filters);

                // Create a clean object with only the filters that have values
                const cleanFilters = {};

                // Job type filter
                if (filters.jobTypes && filters.jobTypes.length > 0) {
                    cleanFilters.type = filters.jobTypes;
                }

                // Position/category filter
                if (filters.categories && filters.categories.length > 0) {
                    cleanFilters.position = filters.categories;
                }

                // Position sought filter (alternative name)
                if (filters.positionSought && filters.positionSought.length > 0) {
                    cleanFilters.position = filters.positionSought;
                }

                // Location filters - country
                if (filters.countrys && filters.countrys.length > 0) {
                    cleanFilters.country = filters.countrys;
                }

                // Region filter
                if (filters.region && filters.region.length > 0) {
                    cleanFilters.region = filters.region;
                }

                // Location filters - city
                if (filters.citys && filters.citys.length > 0) {
                    cleanFilters.city = filters.citys;
                }

                // Experience level filter
                if (filters.experiences && filters.experiences.length > 0) {
                    cleanFilters.experienceLevel = filters.experiences;
                }

                // Company filter
                if (filters.companies && filters.companies.length > 0) {
                    cleanFilters.company = filters.companies;
                }

                // Work option filter
                if (filters.workOptions && filters.workOptions.length > 0) {
                    cleanFilters.workOption = filters.workOptions;
                }

                // Sector/industry filter
                if (filters.industries && filters.industries.length > 0) {
                    cleanFilters.sector = filters.industries;
                }

                // Team management filter
                if (filters.teamManagements && filters.teamManagements.length > 0) {
                    cleanFilters.teamManagement = filters.teamManagements[0];
                }

                // Leadership filter
                if (filters.leaderships && filters.leaderships.length > 0) {
                    cleanFilters.leadershipExperience = filters.leaderships[0];
                }

                // Education filter
                if (filters.educations && filters.educations.length > 0) {
                    cleanFilters.education = filters.educations;
                }

                // Functional area filter
                if (filters.functionalAreas && filters.functionalAreas.length > 0) {
                    cleanFilters.functionalArea = filters.functionalAreas;
                }

                // Travel requirement filter
                if (filters.travels && filters.travels.length > 0) {
                    cleanFilters.travel = filters.travels[0];
                }

                // Language filter
                if (filters.languages && filters.languages.length > 0) {
                    cleanFilters.jobLanguages = filters.languages;
                }

                // Salary range filter
                if (filters.payRanges && filters.payRanges.length > 0) {
                    cleanFilters.payRange = filters.payRanges[0];
                }

                // Skills filter (will search in keywords array)
                if (filters.skills && filters.skills.length > 0) {
                    cleanFilters.skills = filters.skills;
                }

                console.log('Cleaned filters for API:', cleanFilters);
                console.log('Original filters from UI:', filters);

                // Track filter usage
                if (Object.keys(cleanFilters).length > 0) {
                    // Only track non-empty filters
                    try {
                        await incrementFilterCounts(cleanFilters);
                    } catch (err) {
                        console.error('Error tracking filter usage:', err);
                        // Don't fail the main operation if tracking fails
                    }
                }

                // If we have a search query, use searchJobs
                // Otherwise use getJobsByFilters
                let jobsData;
                if (searchQuery) {
                    jobsData = await searchJobs(searchQuery, cleanFilters, 50);
                } else {
                    jobsData = await getJobsByFilters(cleanFilters, 50);
                }

                console.log('Filtered jobs returned:', jobsData.length);
                setFilteredJobs(jobsData);
            } catch (err) {
                console.error('Error fetching filtered jobs:', err);
                setError('Failed to filter jobs. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        // Debounce the API call to avoid too many requests
        const timeoutId = setTimeout(() => {
            fetchFilteredJobs();
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [searchQuery, filters]);

    const handleSearch = async (e) => {
        if (e) e.preventDefault();
        const trimmedInput = searchInput.trim();
        console.log('Searching for:', trimmedInput);

        if (trimmedInput) {
            // Track the search term
            await trackSearchTerm(trimmedInput);

            // Set search query
            setSearchQuery(trimmedInput);
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex flex-col lg:flex-row gap-6">
                {/* Filters Section */}
                {showFilters && (
                    <div className="lg:w-1/4">
                        <h2 className="text-xl font-semibold mb-4">Filter Jobs</h2>
                        <JobFilter
                            filters={filters}
                            onChange={handleFilterChange}
                            onClear={() => setFilters({
                                jobTypes: [],
                                locations: [],
                                categories: [],
                                industries: [],
                                experiences: [],
                                companies: [],
                                skills: [],
                                languages: [],
                                englishLevels: [],
                                minBudget: 0,
                                maxBudget: 20000
                            })}
                            onFilter={() => console.log('Filters applied')}
                        />
                    </div>
                )}

                {/* Jobs List Section */}
                <div className={`${showFilters ? 'lg:w-3/4' : 'w-full'}`}>
                    {/* Search Bar */}
                    {showSearchBar && (
                        <div className="mb-6">
                            <form onSubmit={handleSearch} className="flex">
                                <input
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    placeholder="Search jobs by title, company, or keyword..."
                                    className="flex-grow p-3 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="bg-blue-600 text-white p-3 rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <FaSearch />
                                </button>
                            </form>
                        </div>
                    )}

                    {/* Title and Count */}
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold">{title}</h2>
                        <span className="text-gray-500">
                            {isLoading ? 'Loading...' : `${filteredJobs.length} jobs found`}
                        </span>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                            {error}
                        </div>
                    )}

                    {/* Loading State */}
                    {isLoading ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="border rounded-lg p-4 animate-pulse">
                                    <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="flex gap-2 mt-3">
                                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                                        <div className="h-8 bg-gray-200 rounded w-24"></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <>
                            {/* Job Cards */}
                            {filteredJobs.length > 0 ? (
                                <div className="space-y-4">
                                    {filteredJobs.map(job => (
                                        <JobCard key={job.id} job={job} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">No jobs found matching your criteria.</p>
                                    <p className="text-gray-500 mt-2">Try adjusting your filters or search terms.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobList;