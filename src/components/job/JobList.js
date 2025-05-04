'use client';

import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import JobFilter from './JobFilter';
import { FaSearch, FaChevronLeft, FaChevronRight, FaFilter, FaTimes } from 'react-icons/fa';
import { searchJobs, getJobsByFilters } from '@/lib/services/jobService';
import { incrementFilterCounts } from '@/lib/jobFilterAnalytics';
import { trackSearchTerm } from '@/lib/searchAnalytics';

const JobList = ({ initialJobs = [], showFilters = true, showSearchBar = true, title = "Latest Jobs" }) => {
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchInput, setSearchInput] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [jobsPerPage, setJobsPerPage] = useState(5);
    const [totalPages, setTotalPages] = useState(1);
    
    // Mobile filter visibility state
    const [showMobileFilters, setShowMobileFilters] = useState(false);
    
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
            setFilteredJobs(initialJobs);
            calculateTotalPages(initialJobs.length);
        }
        setIsLoading(false);
    }, [initialJobs]); // Add initialJobs as a dependency
    
    // Calculate total pages whenever filtered jobs or jobs per page changes
    const calculateTotalPages = (jobCount) => {
        setTotalPages(Math.ceil(jobCount / jobsPerPage));
    };
    
    // Reset to first page when filters or search change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, filters]);

    // Close mobile filters when window is resized to desktop size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) { // lg breakpoint in Tailwind
                setShowMobileFilters(false);
            }
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

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
                if (filters.leadershipExperiences && filters.leadershipExperiences.length > 0) {
                    cleanFilters.leadershipExperience = filters.leadershipExperiences[0];
                }

                // English level filter
                if (filters.englishLevels && filters.englishLevels.length > 0) {
                    cleanFilters.englishLevel = filters.englishLevels;
                }

                // Education level filter
                if (filters.educationLevels && filters.educationLevels.length > 0) {
                    cleanFilters.educationLevel = filters.educationLevels;
                }

                // Budget range filter
                if (filters.minBudget > 0 || filters.maxBudget < 20000) {
                    cleanFilters.budgetRange = {
                        min: filters.minBudget,
                        max: filters.maxBudget
                    };
                }

                // Track filter usage for analytics
                if (Object.keys(cleanFilters).length > 0) {
                    try {
                        console.log('Cleaned filters for API:', cleanFilters);
                        console.log('Original filters from UI:', filters);
                        
                        // Track each filter separately
                        Object.entries(cleanFilters).forEach(([filterType, filterValue]) => {
                            // Don't track budget range as individual filters
                            if (filterType !== 'budgetRange') {
                                // For array values, track each value
                                if (Array.isArray(filterValue)) {
                                    filterValue.forEach(value => {
                                        incrementFilterCounts(`${filterType}_${value}`);
                                    });
                                } else {
                                    incrementFilterCounts(`${filterType}_${filterValue}`);
                                }
                            }
                        });
                    } catch (err) {
                        console.error('Error tracking filter usage:', err);
                        // Don't fail the main operation if tracking fails
                    }
                }

                let jobsData = [];

                // If we have a search query, use that
                if (searchQuery) {
                    jobsData = await searchJobs(searchQuery, cleanFilters);
                    
                    // Track search term for analytics
                    trackSearchTerm(searchQuery);
                } 
                // Otherwise just use filters
                else if (Object.keys(cleanFilters).length > 0) {
                    jobsData = await getJobsByFilters(cleanFilters);
                }
                // If no search or filters, use initial jobs
                else {
                    jobsData = initialJobs;
                }

                console.log('Filtered jobs returned:', jobsData.length);
                setFilteredJobs(jobsData);
                calculateTotalPages(jobsData.length);
            } catch (err) {
                console.error('Error fetching filtered jobs:', err);
                setError('Failed to filter jobs. Please try again later.');
                setFilteredJobs([]);
                setTotalPages(1);
            } finally {
                setIsLoading(false);
            }
        };

        // Only fetch if we have a search query or filters
        if (searchQuery || Object.keys(filters).some(key => {
            if (Array.isArray(filters[key])) {
                return filters[key].length > 0;
            } else if (key === 'minBudget') {
                return filters[key] > 0;
            } else if (key === 'maxBudget') {
                return filters[key] < 20000;
            }
            return false;
        })) {
            fetchFilteredJobs();
        }
    }, [searchQuery, filters, initialJobs]);

    const handleSearch = (e) => {
        e.preventDefault();
        const trimmedInput = searchInput.trim();
        
        if (trimmedInput) {
            console.log('Searching for:', trimmedInput);
            setSearchQuery(trimmedInput);
        } else {
            setSearchQuery('');
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
        // On mobile, close the filter panel after applying filters
        if (window.innerWidth < 1024) {
            setShowMobileFilters(false);
        }
    };
    
    // Toggle mobile filters
    const toggleMobileFilters = () => {
        setShowMobileFilters(!showMobileFilters);
    };
    
    // Handle page change
    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setCurrentPage(newPage);
            // Scroll to top of job list
            window.scrollTo({
                top: document.getElementById('job-list-top')?.offsetTop - 100 || 0,
                behavior: 'smooth'
            });
        }
    };
    
    // Get current jobs for pagination
    const getCurrentJobs = () => {
        const indexOfLastJob = currentPage * jobsPerPage;
        const indexOfFirstJob = indexOfLastJob - jobsPerPage;
        return filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
    };
    
    // Generate page numbers
    const getPageNumbers = () => {
        const pageNumbers = [];
        const maxPagesToShow = 5; // Show at most 5 page numbers
        
        if (totalPages <= maxPagesToShow) {
            // If we have 5 or fewer pages, show all
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            // Always show first page
            pageNumbers.push(1);
            
            // Calculate start and end of page range around current page
            let startPage = Math.max(2, currentPage - 1);
            let endPage = Math.min(totalPages - 1, currentPage + 1);
            
            // Adjust if we're near the beginning
            if (currentPage <= 3) {
                endPage = Math.min(totalPages - 1, 4);
            }
            
            // Adjust if we're near the end
            if (currentPage >= totalPages - 2) {
                startPage = Math.max(2, totalPages - 3);
            }
            
            // Add ellipsis if needed before middle pages
            if (startPage > 2) {
                pageNumbers.push('...');
            }
            
            // Add middle pages
            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }
            
            // Add ellipsis if needed after middle pages
            if (endPage < totalPages - 1) {
                pageNumbers.push('...');
            }
            
            // Always show last page
            pageNumbers.push(totalPages);
        }
        
        return pageNumbers;
    };

    // Count active filters for badge
    const getActiveFilterCount = () => {
        let count = 0;
        
        Object.entries(filters).forEach(([key, value]) => {
            if (Array.isArray(value) && value.length > 0) {
                count += value.length;
            } else if (key === 'minBudget' && value > 0) {
                count += 1;
            } else if (key === 'maxBudget' && value < 20000) {
                count += 1;
            }
        });
        
        return count;
    };
    
    const activeFilterCount = getActiveFilterCount();

    return (
        <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
            <div className="flex flex-col lg:flex-row gap-6 relative">
                {/* Mobile Filter Overlay */}
                {showMobileFilters && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden" onClick={toggleMobileFilters}></div>
                )}
                
                {/* Filter Section - Desktop (always visible) and Mobile (toggleable) */}
                {showFilters && (
                    <div className={`lg:w-1/4 ${showMobileFilters ? 'fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white z-50 overflow-y-auto p-4 shadow-xl transition-transform duration-300 transform translate-x-0' : 'hidden lg:block'}`}>
                        <div className="flex justify-between items-center mb-4 lg:hidden">
                            <h2 className="text-xl font-semibold">Filters</h2>
                            <button 
                                onClick={toggleMobileFilters}
                                className="p-2 text-gray-500 hover:text-gray-700 focus:outline-none"
                                aria-label="Close filters"
                            >
                                <FaTimes size={20} />
                            </button>
                        </div>
                        <JobFilter 
                            filters={filters} 
                            onFilterChange={handleFilterChange}
                            onFilter={() => {
                                console.log('Filters applied');
                                if (window.innerWidth < 1024) {
                                    setShowMobileFilters(false);
                                }
                            }}
                        />
                    </div>
                )}

                {/* Jobs List Section */}
                <div id="job-list-top" className={`${showFilters ? 'lg:w-3/4' : 'w-full'}`}>
                    {/* Search Bar and Filter Toggle */}
                    {showSearchBar && (
                        <div className="mb-6 flex">
                            <form onSubmit={handleSearch} className="flex flex-1">
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
                                    aria-label="Search jobs"
                                >
                                    <FaSearch />
                                </button>
                            </form>
                            
                            {/* Mobile Filter Toggle Button */}
                            {showFilters && (
                                <button
                                    onClick={toggleMobileFilters}
                                    className="ml-2 p-3 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 lg:hidden relative"
                                    aria-label="Toggle filters"
                                >
                                    <FaFilter />
                                    {activeFilterCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {activeFilterCount}
                                        </span>
                                    )}
                                </button>
                            )}
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
                                <>
                                    <div className="space-y-4">
                                        {getCurrentJobs().map(job => (
                                            <JobCard key={job.id} job={job} />
                                        ))}
                                    </div>
                                    
                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center mt-8">
                                            <nav className="flex items-center flex-wrap justify-center">
                                                <button 
                                                    onClick={() => handlePageChange(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                    className={`px-3 py-2 rounded-l-md border ${
                                                        currentPage === 1 
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                            : 'bg-white text-blue-600 hover:bg-blue-50'
                                                    }`}
                                                    aria-label="Previous page"
                                                >
                                                    <FaChevronLeft />
                                                </button>
                                                
                                                {getPageNumbers().map((page, index) => (
                                                    <button
                                                        key={index}
                                                        onClick={() => typeof page === 'number' ? handlePageChange(page) : null}
                                                        className={`px-4 py-2 border-t border-b ${
                                                            page === currentPage 
                                                                ? 'bg-blue-600 text-white font-medium border-blue-600' 
                                                                : page === '...' 
                                                                    ? 'bg-white text-gray-500 cursor-default'
                                                                    : 'bg-white text-blue-600 hover:bg-blue-50'
                                                        }`}
                                                        disabled={page === '...'}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                                
                                                <button 
                                                    onClick={() => handlePageChange(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                    className={`px-3 py-2 rounded-r-md border ${
                                                        currentPage === totalPages 
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                            : 'bg-white text-blue-600 hover:bg-blue-50'
                                                    }`}
                                                    aria-label="Next page"
                                                >
                                                    <FaChevronRight />
                                                </button>
                                            </nav>
                                        </div>
                                    )}
                                    
                                    {/* Jobs per page selector */}
                                    <div className="flex justify-center mt-4">
                                        <div className="flex items-center text-sm text-gray-600">
                                            <span className="mr-2">Jobs per page:</span>
                                            <select 
                                                value={jobsPerPage}
                                                onChange={(e) => {
                                                    setJobsPerPage(Number(e.target.value));
                                                    setCurrentPage(1);
                                                    calculateTotalPages(filteredJobs.length);
                                                }}
                                                className="border rounded p-1 bg-white"
                                            >
                                                <option value={5}>5</option>
                                                <option value={10}>10</option>
                                                <option value={20}>20</option>
                                                <option value={50}>50</option>
                                            </select>
                                        </div>
                                    </div>
                                </>
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