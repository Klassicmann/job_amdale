'use client';

import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import JobFilter from './JobFilter';
import { FaSearch } from 'react-icons/fa';
import { searchJobs, getJobsByFilters } from '@/lib/services/jobService';

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

    // Use initialJobs if provided, otherwise fetch from Firebase
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setIsLoading(true);
                setError(null);
                
                // If initialJobs are provided (e.g., from search results), use them
                if (initialJobs && initialJobs.length > 0) {
                    console.log('Using provided initialJobs:', initialJobs.length);
                    setJobs(initialJobs);
                    setFilteredJobs(initialJobs);
                } else {
                    // Otherwise fetch jobs from Firebase
                    console.log('Fetching jobs from Firebase');
                    const jobsData = await getJobsByFilters({}, 50); // Get up to 50 jobs initially
                    setJobs(jobsData);
                    setFilteredJobs(jobsData);
                }
            } catch (err) {
                console.error('Error fetching jobs:', err);
                setError('Failed to load jobs. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };
        
        fetchJobs();
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

    const handleSearch = (e) => {
        if (e) e.preventDefault();
        const trimmedInput = searchInput.trim();
        console.log('Searching for:', trimmedInput);
        
        // Only set search query if we have a non-empty search term
        setSearchQuery(trimmedInput);
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    const handleClearFilters = () => {
        setFilters({
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
        setSearchQuery('');
    };

    return (
        <div className="w-full">
            {title && (
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{title}</h2>
            )}

            {showSearchBar && (
                <div className="mb-6">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search jobs..."
                            className="w-full py-3 pl-10 pr-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            value={searchInput}
                            onChange={(e) => setSearchInput(e.target.value)}
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <button onClick={handleSearch} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">Search</button>
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-6">
                {showFilters && (
                    <div className="w-full md:w-1/4">
                        <JobFilter
                            filters={filters}
                            onChange={handleFilterChange}
                            onClear={handleClearFilters}
                        />
                    </div>
                )}

                <div className={`w-full ${showFilters ? 'md:w-3/4' : 'md:w-full'}`}>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                        </div>
                    ) : error ? (
                        <div className="p-6 bg-white rounded-lg shadow-md text-center">
                            <p className="text-red-500">{error}</p>
                        </div>
                    ) : (
                        <>
                            {/* Show count of jobs */}
                            {filteredJobs.length > 0 && (
                                <div className="mb-4 flex justify-between items-center">
                                    <p className="text-gray-600">
                                        Showing <span className="font-semibold">{filteredJobs.length}</span> {searchQuery ? `Jobs "${searchQuery}"` : 'Jobs'} {filters.jobTypes.length > 0 ? `in ${filters.jobTypes.join(', ')}` : ''} {filters.locations.length > 0 ? `in ${filters.locations.join(', ')}` : ''}
                                    </p>
                                    <div className="flex gap-2">
                                        <button className="p-2 border rounded bg-white text-gray-600 hover:bg-gray-50">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                            </svg>
                                        </button>
                                        <button className="p-2 border rounded bg-gray-100 text-blue-600">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            )}
                            
                            {filteredJobs.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {filteredJobs.map((job) => (
                                        <JobCard key={job.id} job={job} />
                                    ))}
                                </div>
                            ) : (
                                <div className="p-6 bg-white rounded-lg shadow-md text-center">
                                    <p className="text-gray-500">No jobs match your search criteria. Try adjusting your filters or search terms.</p>
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