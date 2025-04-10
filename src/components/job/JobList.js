'use client';

import React, { useState, useEffect } from 'react';
import JobCard from './JobCard';
import JobFilter from './JobFilter';
import { FaSearch } from 'react-icons/fa';

const JobList = ({ initialJobs = [], showFilters = true, showSearchBar = true, title = "Latest Jobs" }) => {
    const [jobs, setJobs] = useState(initialJobs);
    const [filteredJobs, setFilteredJobs] = useState(initialJobs);
    const [searchQuery, setSearchQuery] = useState('');
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

    // Filter jobs when search query or filters change
    useEffect(() => {
        let result = [...jobs];

        // Apply search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(job =>
                job.title.toLowerCase().includes(query) ||
                job.description.toLowerCase().includes(query) ||
                job.company.toLowerCase().includes(query) ||
                (job.keywords && job.keywords.some(keyword =>
                    keyword.toLowerCase().includes(query)
                ))
            );
        }

        // Apply job type filters
        if (filters.jobTypes && filters.jobTypes.length > 0) {
            result = result.filter(job => filters.jobTypes.includes(job.type));
        }

        // Apply location filters
        if (filters.locations && filters.locations.length > 0) {
            result = result.filter(job => {
                return filters.locations.some(loc =>
                    job.location.toLowerCase().includes(loc.toLowerCase())
                );
            });
        }

        // Apply category filters
        if (filters.categories && filters.categories.length > 0) {
            result = result.filter(job =>
                filters.categories.includes(job.category) ||
                (job.keywords && job.keywords.some(keyword =>
                    filters.categories.some(category =>
                        keyword.toLowerCase().includes(category.toLowerCase())
                    )
                ))
            );
        }

        // Apply industry filters
        if (filters.industries && filters.industries.length > 0) {
            result = result.filter(job =>
                filters.industries.includes(job.industry) ||
                (job.keywords && job.keywords.some(keyword =>
                    filters.industries.some(industry =>
                        keyword.toLowerCase().includes(industry.toLowerCase())
                    )
                ))
            );
        }

        // Apply experience filters
        if (filters.experiences && filters.experiences.length > 0) {
            result = result.filter(job => {
                if (job.experienceLevel) {
                    return filters.experiences.includes(job.experienceLevel);
                }
                return job.keywords && job.keywords.some(keyword =>
                    filters.experiences.some(exp =>
                        keyword.toLowerCase().includes(exp.toLowerCase())
                    )
                );
            });
        }

        // Apply budget/salary range filters
        if (filters.minBudget || filters.maxBudget) {
            result = result.filter(job => {
                if (!job.salary) return false;

                // Extract numbers from salary string (using string methods to avoid regex issues)
                const cleanSalary = job.salary.replace(/[^0-9,]/g, '');
                const salaryParts = cleanSalary.split(',');
                const salaryNumbers = [];

                for (let part of salaryParts) {
                    const num = parseInt(part.trim(), 10);
                    if (!isNaN(num)) {
                        salaryNumbers.push(num);
                    }
                }

                if (salaryNumbers.length === 0) return false;

                const jobMinSalary = salaryNumbers[0];
                const jobMaxSalary = salaryNumbers.length > 1 ? salaryNumbers[1] : jobMinSalary;

                const minBudget = filters.minBudget || 0;
                const maxBudget = filters.maxBudget || Infinity;

                // Check if job salary range overlaps with filter range
                return (jobMaxSalary >= minBudget && jobMinSalary <= maxBudget);
            });
        }

        // Apply company filters
        if (filters.companies && filters.companies.length > 0) {
            result = result.filter(job => filters.companies.includes(job.company));
        }

        // Apply skills filters
        if (filters.skills && filters.skills.length > 0) {
            result = result.filter(job =>
                job.keywords && job.keywords.some(keyword =>
                    filters.skills.some(skill =>
                        keyword.toLowerCase().includes(skill.toLowerCase())
                    )
                )
            );
        }

        // Apply language filters
        if (filters.languages && filters.languages.length > 0) {
            result = result.filter(job => {
                // If job specifies languages directly
                if (job.languages) {
                    return job.languages.some(lang =>
                        filters.languages.includes(lang)
                    );
                }
                // Check keywords for language mentions
                return job.keywords && job.keywords.some(keyword =>
                    filters.languages.some(language =>
                        keyword.toLowerCase() === language.toLowerCase()
                    )
                );
            });
        }

        // Apply English level filters
        if (filters.englishLevels && filters.englishLevels.length > 0) {
            result = result.filter(job => {
                // If job specifies English level directly
                if (job.englishLevel) {
                    return filters.englishLevels.includes(job.englishLevel);
                }
                // Fallback to description checking
                return filters.englishLevels.some(level =>
                    job.description.toLowerCase().includes(level.toLowerCase())
                );
            });
        }

        // Add similarity score for search results if there's a query
        if (searchQuery) {
            result = result.map(job => {
                // Calculate a simple similarity score
                const titleMatch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ? 0.4 : 0;
                const descriptionMatch = job.description.toLowerCase().includes(searchQuery.toLowerCase()) ? 0.2 : 0;
                const companyMatch = job.company.toLowerCase().includes(searchQuery.toLowerCase()) ? 0.2 : 0;

                let keywordMatch = 0;
                if (job.keywords) {
                    keywordMatch = job.keywords.some(keyword =>
                        keyword.toLowerCase().includes(searchQuery.toLowerCase())
                    ) ? 0.2 : 0;
                }

                const similarityScore = titleMatch + descriptionMatch + companyMatch + keywordMatch;

                return {
                    ...job,
                    similarityScore
                };
            });

            // Sort by similarity score with 80% threshold
            result = result.filter(job => job.similarityScore >= 0.8 * 0.4)
                .sort((a, b) => b.similarityScore - a.similarityScore);
        }

        setFilteredJobs(result);
    }, [searchQuery, filters, jobs]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const clearFilters = () => {
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
                            value={searchQuery}
                            onChange={handleSearchChange}
                        />
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    </div>
                </div>
            )}

            <div className="flex flex-col md:flex-row gap-6">
                {showFilters && (
                    <div className="w-full md:w-1/4">
                        <JobFilter
                            filters={filters}
                            onChange={setFilters}
                            onClear={clearFilters}
                        />
                    </div>
                )}

                <div className={`w-full ${showFilters ? 'md:w-3/4' : 'md:w-full'}`}>
                    {filteredJobs.length > 0 ? (
                        <div className="space-y-4">
                            {filteredJobs.map((job) => (
                                <JobCard key={job.id} job={job} />
                            ))}
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-md p-10 text-center">
                            <h3 className="text-xl font-semibold mb-2 text-gray-800">No jobs found</h3>
                            <p className="text-gray-600">
                                Try adjusting your search or filters to find what you're looking for.
                            </p>
                            <button
                                onClick={clearFilters}
                                className="mt-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobList;