// src/lib/services/jobService.js
import {
    addDocument,
    getDocument,
    updateDocument,
    deleteDocument,
    queryDocuments
} from './firestore';
import { jobModel } from '@/lib/models/job';

const COLLECTION_NAME = 'jobs';

// Create a job
export const createJob = async (jobData) => {
    const { isValid, errors } = jobModel.validate(jobData);

    if (!isValid) {
        throw new Error(JSON.stringify(errors));
    }

    const job = jobModel.create(jobData);
    return addDocument(COLLECTION_NAME, job);
};

// Get a job by ID
export const getJobById = async (id) => {
    return getDocument(COLLECTION_NAME, id);
};

// Update a job
export const updateJob = async (id, jobData) => {
    const job = await getJobById(id);

    if (!job) {
        throw new Error('Job not found');
    }

    const updatedJob = {
        ...job,
        ...jobData,
        updatedAt: new Date().toISOString()
    };

    return updateDocument(COLLECTION_NAME, id, updatedJob);
};

// Delete a job
export const deleteJob = async (id) => {
    return deleteDocument(COLLECTION_NAME, id);
};

// Enhanced search jobs with multiple filters
export const searchJobs = async (query, filters = {}, limit = 50) => {
    console.log('searchJobs called with query:', query);
    const conditions = [];

    // Add filters for each field (but not search query - we'll handle that in JS)
const filterFields = [
        'position', 'country', 'city', 'experienceLevel', 'teamManagement', 'leadershipExperience',
        'sector', 'workOption', 'functionalArea', 'travel', 'type', 'salaryCurrency', 'payRange', 'company'
    ];

    filterFields.forEach(field => {
        if (filters[field]) {
            // Handle array vs single value
            if (Array.isArray(filters[field])) {
                if (filters[field].length > 0) {
                    // If it's a single-item array, use equality for better performance
                    if (filters[field].length === 1) {
                        conditions.push({
                            field,
                            operator: '==',
                            value: filters[field][0]
                        });
                    } else {
                        conditions.push({
                            field,
                            operator: 'in',
                            value: filters[field]
                        });
                    }
                }
            } else {
                // Handle non-array values
                conditions.push({
                    field,
                    operator: '==',
                    value: filters[field]
                });
            }
        }
    });
    
    // Special handling for skills (search in keywords array)
    if (filters.skills && filters.skills.length > 0) {
        // For skills, we'll search in the keywords array
        conditions.push({
            field: 'keywords',
            operator: 'array-contains-any',
            value: filters.skills
        });
    }
    
    console.log('Query conditions:', conditions);

    // Special handling for array fields
    if (filters.education && filters.education.length > 0) {
        conditions.push({
            field: 'education',
            operator: 'array-contains-any',
            value: filters.education
        });
    }

    if (filters.jobLanguages && filters.jobLanguages.length > 0) {
        conditions.push({
            field: 'jobLanguages',
            operator: 'array-contains-any',
            value: filters.jobLanguages
        });
    }

    // Salary range filters (if implemented)
    if (filters.minSalary) {
        // This would need additional handling in a real app
        // Simple example, assuming numeric salary values
        conditions.push({
            field: 'numericSalary',
            operator: '>=',
            value: parseInt(filters.minSalary, 10)
        });
    }

    if (filters.maxSalary) {
        conditions.push({
            field: 'numericSalary',
            operator: '<=',
            value: parseInt(filters.maxSalary, 10)
        });
    }

    // Get all matching jobs with filters (but not search)
    let results = await queryDocuments(
        COLLECTION_NAME,
        conditions,
        { field: 'createdAt', direction: 'desc' },
        limit * 2 // Fetch more results since we'll filter them
    );

    // Apply case-insensitive title search in JavaScript
    if (query && query.trim()) {
        const searchTerm = query.trim().toLowerCase();
        console.log('Filtering by search term:', searchTerm);
        results = results.filter(job => 
            job.title && job.title.toLowerCase().includes(searchTerm)
        );
        console.log('Found jobs after title filter:', results.length);
    }

    // Limit results after filtering
    results = results.slice(0, limit);

    // Post-processing for search matching (similarity score)
    if (query) {
        const searchTerms = query.toLowerCase().split(' ');

        results = results.map(job => {
            // Calculate relevance score based on various fields
            let score = 0;

            // Check title matches (highest weight)
            if (job.title) {
                const titleLower = job.title.toLowerCase();
                searchTerms.forEach(term => {
                    if (titleLower.includes(term)) score += 10;
                });
            }

            // Check position matches
            if (job.position) {
                const positionLower = job.position.toLowerCase();
                searchTerms.forEach(term => {
                    if (positionLower.includes(term)) score += 8;
                });
            }

            // Check description matches
            if (job.description) {
                const descLower = job.description.toLowerCase();
                searchTerms.forEach(term => {
                    if (descLower.includes(term)) score += 5;
                });
            }

            // Check company matches
            if (job.company) {
                const companyLower = job.company.toLowerCase();
                searchTerms.forEach(term => {
                    if (companyLower.includes(term)) score += 3;
                });
            }

            // Return job with score
            return {
                ...job,
                searchScore: score
            };
        });

        // Sort by score if we have a query
        results.sort((a, b) => b.searchScore - a.searchScore);

        // Remove jobs with zero score
        results = results.filter(job => job.searchScore > 0);
    }

    return results;
};

// Get jobs by multiple criteria for advanced filtering
export const getJobsByFilters = async (filterCriteria = {}, limit = 20) => {
    return searchJobs('', filterCriteria, limit);
};