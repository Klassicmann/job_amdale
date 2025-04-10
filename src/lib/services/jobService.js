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
export const searchJobs = async (query, filters = {}, limit = 20) => {
    const conditions = [];

    // Add search query condition
    if (query) {
        // We'll use a simple array-contains-any for keywords
        // In a real app with advanced search, you might use a search index or multiple conditions
        const searchTerms = query.toLowerCase().split(' ');
        conditions.push({ field: 'keywords', operator: 'array-contains-any', value: searchTerms });
    }

    // Add filters for each field
    const filterFields = [
        'position', 'country', 'city', 'experienceLevel', 'teamManagement', 'leadershipExperience',
        'sector', 'workOption', 'functionalArea', 'travel', 'type', 'salaryCurrency', 'payRange'
    ];

    filterFields.forEach(field => {
        if (filters[field]) {
            conditions.push({
                field,
                operator: Array.isArray(filters[field]) ? 'in' : '==',
                value: filters[field]
            });
        }
    });

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

    // Get results
    let results = await queryDocuments(
        COLLECTION_NAME,
        conditions,
        { field: 'createdAt', direction: 'desc' },
        limit
    );

    // For jobs with no conditions (when both query and filters are empty)
    if (conditions.length === 0) {
        results = await queryDocuments(
            COLLECTION_NAME,
            [],
            { field: 'createdAt', direction: 'desc' },
            limit
        );
    }

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