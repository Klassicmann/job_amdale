'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import JobList from '@/components/job/JobList';
import PopularSearches from '@/components/job/PopularSearches';
import { useAnalytics } from '@/contexts/AnalyticsContext';

// Dummy data - would normally come from API
const dummyJobs = [
    {
        id: '1',
        title: 'Senior Frontend Developer',
        company: 'Tech Innovations',
        location: 'San Francisco, CA (Remote)',
        type: 'Full-time',
        salary: '$120,000 - $140,000',
        category: 'Technology',
        description: 'We are looking for a Senior Frontend Developer to join our team. You will be responsible for building and maintaining user interfaces for our web applications.',
        keywords: ['React', 'JavaScript', 'Frontend', 'Redux', 'GraphQL'],
        createdAt: '2025-03-01T12:00:00.000Z',
        updatedAt: '2025-03-01T12:00:00.000Z'
    },
    {
        id: '2',
        title: 'UX/UI Designer',
        company: 'Creative Agency',
        location: 'New York, NY',
        type: 'Full-time',
        salary: '$90,000 - $110,000',
        category: 'Design',
        description: 'We are seeking a talented UX/UI Designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design, possess superior UI skills, and be able to translate high-level requirements into interaction flows and artifacts.',
        keywords: ['UX', 'UI', 'Design', 'Figma', 'Adobe'],
        createdAt: '2025-03-05T14:30:00.000Z',
        updatedAt: '2025-03-05T14:30:00.000Z'
    },
    {
        id: '3',
        title: 'Data Scientist',
        company: 'Analytics Pro',
        location: 'Remote',
        type: 'Full-time',
        salary: '$130,000 - $160,000',
        category: 'Technology',
        description: 'We&apos;re looking for a Data Scientist to help us discover the information hidden in vast amounts of data, and help us make smarter decisions to deliver even better products.',
        keywords: ['Python', 'Machine Learning', 'AI', 'Data Mining', 'SQL'],
        createdAt: '2025-03-10T09:15:00.000Z',
        updatedAt: '2025-03-10T09:15:00.000Z'
    },
    {
        id: '4',
        title: 'Marketing Manager',
        company: 'Global Brands',
        location: 'Chicago, IL',
        type: 'Full-time',
        salary: '$85,000 - $105,000',
        category: 'Marketing',
        description: 'We are looking for a Marketing Manager to promote our company&apos;s products and services. The ideal candidate will have experience developing marketing campaigns across different channels.',
        keywords: ['Digital Marketing', 'Content Strategy', 'SEO', 'Social Media', 'Analytics'],
        createdAt: '2025-03-08T11:45:00.000Z',
        updatedAt: '2025-03-08T11:45:00.000Z'
    },
    {
        id: '5',
        title: 'Product Manager',
        company: 'SaaS Solutions',
        location: 'Boston, MA (Hybrid)',
        type: 'Full-time',
        salary: '$115,000 - $135,000',
        category: 'Product',
        description: 'We are seeking a Product Manager to join our growing team. You will be responsible for the product planning and execution throughout the Product Lifecycle, including gathering and prioritizing product requirements, defining the product vision, and working closely with engineering, sales, marketing, and support to ensure revenue and customer satisfaction goals are met.',
        keywords: ['Product Management', 'Agile', 'SaaS', 'User Stories', 'Roadmap'],
        createdAt: '2025-03-12T10:20:00.000Z',
        updatedAt: '2025-03-12T10:20:00.000Z'
    },
    {
        id: '6',
        title: 'DevOps Engineer',
        company: 'Cloud Services Inc.',
        location: 'Remote',
        type: 'Full-time',
        salary: '$125,000 - $145,000',
        category: 'Technology',
        description: 'We are looking for a DevOps Engineer to help us build and maintain our cloud infrastructure. The ideal candidate will have experience with AWS, Docker, and CI/CD pipelines.',
        keywords: ['AWS', 'Docker', 'Kubernetes', 'CI/CD', 'Terraform'],
        createdAt: '2025-03-15T13:30:00.000Z',
        updatedAt: '2025-03-15T13:30:00.000Z'
    },
    {
        id: '7',
        title: 'Content Writer',
        company: 'Digital Media',
        location: 'Remote',
        type: 'Contract',
        salary: '$60,000 - $75,000',
        category: 'Content',
        description: 'We are seeking a Content Writer to join our team. You will be responsible for creating engaging content for our website, blog, and social media channels.',
        keywords: ['Content Writing', 'SEO', 'Blogging', 'Copywriting', 'Editing'],
        createdAt: '2025-03-18T14:00:00.000Z',
        updatedAt: '2025-03-18T14:00:00.000Z'
    },
    {
        id: '8',
        title: 'Sales Representative',
        company: 'Enterprise Solutions',
        location: 'Dallas, TX',
        type: 'Full-time',
        salary: '$60,000 - $80,000 + Commission',
        category: 'Sales',
        description: 'We are looking for a motivated Sales Representative to join our team. You will be responsible for generating leads, meeting sales targets, and building relationships with clients.',
        keywords: ['B2B Sales', 'CRM', 'Lead Generation', 'Negotiation', 'Client Relations'],
        createdAt: '2025-03-20T09:45:00.000Z',
        updatedAt: '2025-03-20T09:45:00.000Z'
    },
    {
        id: '9',
        title: 'Full Stack Developer',
        company: 'Tech Startups Inc.',
        location: 'Austin, TX (Hybrid)',
        type: 'Full-time',
        salary: '$100,000 - $130,000',
        category: 'Technology',
        description: 'Join our dynamic team as a Full Stack Developer. You will be responsible for developing and maintaining both frontend and backend components of our web applications.',
        keywords: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'REST API'],
        createdAt: '2025-03-17T15:30:00.000Z',
        updatedAt: '2025-03-17T15:30:00.000Z'
    },
    {
        id: '10',
        title: 'Junior Graphic Designer',
        company: 'Creative Works',
        location: 'Los Angeles, CA',
        type: 'Part-time',
        salary: '$45,000 - $55,000',
        category: 'Design',
        description: 'We are looking for a talented Junior Graphic Designer to join our creative team. This is a great opportunity for someone starting their career in design.',
        keywords: ['Adobe Creative Suite', 'Graphic Design', 'Typography', 'Visual Design', 'Illustration'],
        createdAt: '2025-03-14T11:20:00.000Z',
        updatedAt: '2025-03-14T11:20:00.000Z'
    },
    {
        id: '11',
        title: 'HR Manager',
        company: 'Corporate Services',
        location: 'Chicago, IL',
        type: 'Full-time',
        salary: '$80,000 - $100,000',
        category: 'Human Resources',
        description: 'We are seeking an experienced HR Manager to oversee all aspects of human resources including recruitment, benefits administration, employee relations, and compliance.',
        keywords: ['Human Resources', 'Recruitment', 'Employee Relations', 'Benefits Administration', 'HR Policy'],
        createdAt: '2025-03-13T09:00:00.000Z',
        updatedAt: '2025-03-13T09:00:00.000Z'
    },
    {
        id: '12',
        title: 'Financial Analyst',
        company: 'Investment Partners',
        location: 'New York, NY',
        type: 'Full-time',
        salary: '$90,000 - $110,000',
        category: 'Finance',
        description: 'We are looking for a Financial Analyst to join our team. You will be responsible for analyzing financial data, creating financial models, and providing insights to support business decisions.',
        keywords: ['Financial Analysis', 'Excel', 'Financial Modeling', 'Forecasting', 'Budgeting'],
        createdAt: '2025-03-11T10:30:00.000Z',
        updatedAt: '2025-03-11T10:30:00.000Z'
    },
    {
        id: '13',
        title: 'Project Manager',
        company: 'Construction Co.',
        location: 'Denver, CO',
        type: 'Full-time',
        salary: '$85,000 - $105,000',
        category: 'Construction',
        description: 'We are seeking a Project Manager to oversee construction projects from initiation to completion. The ideal candidate will have experience managing budgets, schedules, and resources for construction projects.',
        keywords: ['Project Management', 'Construction', 'Budgeting', 'Scheduling', 'Resource Management'],
        createdAt: '2025-03-09T14:15:00.000Z',
        updatedAt: '2025-03-09T14:15:00.000Z'
    },
    {
        id: '14',
        title: 'Customer Support Specialist',
        company: 'Tech Support Inc.',
        location: 'Remote',
        type: 'Full-time',
        salary: '$50,000 - $65,000',
        category: 'Customer Service',
        description: 'We are looking for a Customer Support Specialist to provide excellent service to our clients by addressing their inquiries, resolving issues, and ensuring a positive experience with our products.',
        keywords: ['Customer Support', 'Technical Support', 'Problem Solving', 'Communication', 'CRM'],
        createdAt: '2025-03-07T11:00:00.000Z',
        updatedAt: '2025-03-07T11:00:00.000Z'
    },
    {
        id: '15',
        title: 'Social Media Manager',
        company: 'Digital Agency',
        location: 'Miami, FL (Hybrid)',
        type: 'Full-time',
        salary: '$65,000 - $85,000',
        category: 'Marketing',
        description: 'We are seeking a Social Media Manager to develop and implement our social media strategy. You will be responsible for creating engaging content, managing our social media accounts, and growing our online presence.',
        keywords: ['Social Media', 'Content Creation', 'Community Management', 'Marketing Strategy', 'Analytics'],
        createdAt: '2025-03-04T13:45:00.000Z',
        updatedAt: '2025-03-04T13:45:00.000Z'
    },
    {
        id: '16',
        title: 'Software Engineering Intern',
        company: 'Tech Innovations',
        location: 'San Francisco, CA',
        type: 'Internship',
        salary: '$25 - $35/hour',
        category: 'Technology',
        description: 'We are offering a Software Engineering Internship for students and recent graduates. This is a great opportunity to gain real-world experience working with our development team on exciting projects.',
        keywords: ['Internship', 'Software Engineering', 'Programming', 'Development', 'Entry Level'],
        createdAt: '2025-03-02T10:00:00.000Z',
        updatedAt: '2025-03-02T10:00:00.000Z'
    }
];

export default function JobsPage() {

    const searchParams = useSearchParams();
    // Check for both 'q' (direct URL parameter) and 'search' (from PopularSearches component)
    const query = searchParams.get('q') || searchParams.get('search') || '';
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        // In a real app, you would fetch jobs from an API with the query parameter
        // For now, we'll use the dummy data and filter based on the query
        const fetchJobs = () => {
            // Simulate API call delay
            setTimeout(() => {
                let filteredJobs = [...dummyJobs];

                // Enhance the dummy data with additional fields for our new filters
                filteredJobs = filteredJobs.map(job => ({
                    ...job,
                    industry: job.category === 'Technology' ? 'Technology' :
                        job.category === 'Design' ? 'Media' :
                            job.category === 'Marketing' ? 'Media' :
                                job.category === 'Sales' ? 'Retail' : 'Other',
                    experienceLevel: job.title.includes('Senior') ? 'Senior Level' :
                        job.title.includes('Junior') ? 'Entry Level' : 'Mid Level',
                    education: job.title.includes('Developer') ? 'Bachelor\'s Degree' :
                        job.title.includes('Designer') ? 'Bachelor\'s Degree' :
                            job.title.includes('Manager') ? 'Master\'s Degree' : 'High School'
                }));

                if (query) {
                    const searchQuery = query.toLowerCase();
                    console.log('Filtering jobs by search query: ' + searchQuery);
                    
                    // Filter jobs by search query
                    filteredJobs = filteredJobs.filter(job =>
                        (job.title && job.title.toLowerCase().includes(searchQuery)) ||
                        (job.company && job.company.toLowerCase().includes(searchQuery)) ||
                        (job.description && job.description.toLowerCase().includes(searchQuery)) ||
                        (job.keywords && job.keywords.some(keyword => keyword.toLowerCase().includes(searchQuery)))
                    );
                    
                    console.log('Found ' + filteredJobs.length + ' jobs matching "' + searchQuery + '"');

                    // Track search event
                    trackEvent('search', {
                        query,
                        resultsCount: filteredJobs.length,
                        source: 'jobs_page'
                    });
                }

                setJobs(filteredJobs);
                setLoading(false);
            }, 600);
        };

        fetchJobs();

        // Track page view
        trackEvent('page_view', {
            page: 'jobs',
            query: query || undefined
        });
    }, [query, trackEvent]);

    return (
        <div className="container mx-auto px-4 pt-32 pb-20">

            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                    {query ? ('Search Results for "' + query + '"') : 'Browse Jobs'}
                </h1>
                <p className="text-gray-600">
                    {loading
                        ? 'Searching for the best job matches...'
                        : jobs.length > 0
                            ? ('Found ' + jobs.length + ' jobs' + (query ? (' matching "' + query + '"') : ''))
                            : 'No jobs found. Try adjusting your search criteria.'}
                </p>
            </div>

            {/* Popular Job Searches */}
            {!query && <PopularSearches />}

            {loading ? (
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex gap-4">
                                <div className="h-10 w-10 bg-gray-200 rounded"></div>
                                <div className="flex-1">
                                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                                </div>
                                <div className="h-6 w-24 bg-gray-200 rounded"></div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <JobList initialJobs={jobs} />
            )}
        </div>
    );
}