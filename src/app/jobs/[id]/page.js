'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaBuilding, FaDollarSign, FaShareAlt, FaBookmark, FaExternalLinkAlt } from 'react-icons/fa';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import ClientProviders from '@/components/providers/ClientProviders';


// Dummy data - would normally come from API/backend
const dummyJobs = [
    {
        id: '1',
        title: 'Senior Frontend Developer',
        company: 'Tech Innovations',
        location: 'San Francisco, CA (Remote)',
        type: 'Full-time',
        salary: '$120,000 - $140,000',
        category: 'Technology',
        applyUrl: 'https://example.com/apply',
        description: `We are looking for a Senior Frontend Developer to join our team. You will be responsible for building and maintaining user interfaces for our web applications.

    **Responsibilities:**
    - Develop new user-facing features using React.js
    - Build reusable components and front-end libraries for future use
    - Translate designs and wireframes into high-quality code
    - Optimize components for maximum performance across a vast array of web-capable devices and browsers
    
    **Requirements:**
    - 4+ years of experience with frontend development
    - Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model
    - Thorough understanding of React.js and its core principles
    - Experience with popular React.js workflows (such as Flux or Redux)
    - Familiarity with newer specifications of ECMAScript
    - Experience with data structure libraries (e.g., Immutable.js)
    - Knowledge of isomorphic React is a plus
    - Understanding of REST APIs and GraphQL
    - Familiarity with modern front-end build pipelines and tools
    - Experience with common front-end development tools such as Babel, Webpack, NPM, etc.
    - A knack for benchmarking and optimization`,
        keywords: ['React', 'JavaScript', 'Frontend', 'Redux', 'GraphQL'],
        createdAt: '2025-03-01T12:00:00.000Z',
        updatedAt: '2025-03-01T12:00:00.000Z',
        companyLogo: '/company-logos/tech-innovations.png',
        benefits: [
            'Health, dental, and vision insurance',
            'Flexible work hours',
            'Remote work options',
            '401(k) matching',
            'Professional development budget'
        ],
        aboutCompany: 'Tech Innovations is a leading technology company that provides innovative solutions to businesses worldwide. We are dedicated to creating cutting-edge software that transforms how businesses operate.'
    },
    {
        id: '2',
        title: 'UX/UI Designer',
        company: 'Creative Agency',
        location: 'New York, NY',
        type: 'Full-time',
        salary: '$90,000 - $110,000',
        category: 'Design',
        applyUrl: 'https://example.com/apply',
        description: `We are seeking a talented UX/UI Designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design, possess superior UI skills, and be able to translate high-level requirements into interaction flows and artifacts.

    **Responsibilities:**
    - Collaborate with product management and engineering to define and implement innovative solutions for product direction, visuals, and experience
    - Execute all visual design stages from concept to final hand-off to engineering
    - Conceptualize original ideas that bring simplicity and user friendliness to complex design challenges
    - Create wireframes, storyboards, user flows, process flows and site maps to effectively communicate interaction and design ideas
    - Present and defend designs and key deliverables to peers and executive level stakeholders
    - Conduct user research and evaluate user feedback
    - Establish and promote design guidelines, best practices, and standards

    **Requirements:**
    - Proven work experience as a UI/UX Designer or similar role
    - Portfolio of design projects
    - Knowledge of wireframe tools (e.g. Wireframe.cc, InVision, Figma)
    - Up-to-date knowledge of design software like Adobe Illustrator and Photoshop
    - Team spirit; strong communication skills to collaborate with various stakeholders
    - Good time-management skills`,
        keywords: ['UX', 'UI', 'Design', 'Figma', 'Adobe'],
        createdAt: '2025-03-05T14:30:00.000Z',
        updatedAt: '2025-03-05T14:30:00.000Z',
        companyLogo: '/company-logos/creative-agency.png',
        benefits: [
            'Health and dental insurance',
            'Flexible scheduling',
            'Gym membership',
            'Casual dress code',
            'Dog-friendly office'
        ],
        aboutCompany: 'Creative Agency is a full-service design studio specializing in branding, digital products, and user experience. We work with clients ranging from startups to Fortune 500 companies.'
    },
    {
        id: '3',
        title: 'Data Scientist',
        company: 'Analytics Pro',
        location: 'Remote',
        type: 'Full-time',
        salary: '$130,000 - $160,000',
        category: 'Technology',
        applyUrl: 'https://example.com/apply',
        description: `We're looking for a Data Scientist to help us discover the information hidden in vast amounts of data, and help us make smarter decisions to deliver even better products.

    **Responsibilities:**
    - Selecting features, building and optimizing classifiers using machine learning techniques
    - Data mining using state-of-the-art methods
    - Extending company's data with third party sources of information when needed
    - Enhancing data collection procedures to include information that is relevant for building analytic systems
    - Processing, cleansing, and verifying the integrity of data used for analysis
    - Doing ad-hoc analysis and presenting results in a clear manner
    - Creating automated anomaly detection systems and constant tracking of its performance

    **Requirements:**
    - 3+ years of experience in data science or related field
    - Strong problem-solving skills with an emphasis on product development
    - Experience using statistical computer languages (R, Python, SQL, etc.) to manipulate data and draw insights from large data sets
    - Experience working with and creating data architectures
    - Knowledge of a variety of machine learning techniques (clustering, decision tree learning, artificial neural networks, etc.) and their real-world advantages/drawbacks
    - Knowledge of advanced statistical techniques and concepts (regression, properties of distributions, statistical tests and proper usage, etc.) and experience with applications
    - Excellent written and verbal communication skills for coordinating across teams
    - A drive to learn and master new technologies and techniques`,
        keywords: ['Python', 'Machine Learning', 'AI', 'Data Mining', 'SQL'],
        createdAt: '2025-03-10T09:15:00.000Z',
        updatedAt: '2025-03-10T09:15:00.000Z',
        companyLogo: '/company-logos/analytics-pro.png',
        benefits: [
            'Competitive salary',
            'Health, dental, and vision insurance',
            'Flexible work arrangements',
            'Professional development opportunities',
            'Company equity'
        ],
        aboutCompany: 'Analytics Pro is a data-driven company that helps businesses leverage their data to make informed decisions. We specialize in data analytics, machine learning, and artificial intelligence solutions.'
    }
];

// Helper functions
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
};

export default function JobDetailPage() {
    const { id } = useParams();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [relatedJobs, setRelatedJobs] = useState([]);
    const { trackEvent } = useAnalytics();

    useEffect(() => {
        // In a real app, you would fetch the job from an API
        // For now, we'll use the dummy data
        try {
            // Simulate API call delay
            setTimeout(() => {
                const foundJob = dummyJobs.find(job => job.id === id);

                if (foundJob) {
                    setJob(foundJob);

                    // Track view event
                    trackEvent('view_job', {
                        jobId: foundJob.id,
                        jobTitle: foundJob.title,
                        company: foundJob.company
                    });

                    // Find related jobs (same category or keywords overlap)
                    const related = dummyJobs
                        .filter(j => j.id !== id &&
                            (j.category === foundJob.category ||
                                j.keywords.some(keyword =>
                                    foundJob.keywords.includes(keyword)
                                )
                            )
                        )
                        .slice(0, 3);

                    setRelatedJobs(related);
                } else {
                    setError('Job not found');
                }

                setLoading(false);
            }, 500);
        } catch (err) {
            setError('Failed to fetch job details');
            setLoading(false);
        }
    }, [id, trackEvent]);

    const handleApplyClick = () => {
        trackEvent('apply_click', {
            jobId: job.id,
            jobTitle: job.title,
            company: job.company,
            applyUrl: job.applyUrl
        });
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 pt-32 pb-20">
                <div className="animate-pulse bg-white rounded-lg shadow-md p-8">
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                    <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="container mx-auto px-4 pt-32 pb-20">
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Job Not Found</h2>
                    <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
                    <Link
                        href="/jobs"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition duration-200"
                    >
                        Browse All Jobs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <ClientProviders>
            <div className="container mx-auto px-4 pt-32 pb-20">
                <div className="mb-6">
                    <Link href="/jobs" className="text-blue-600 hover:text-blue-800 flex items-center">
                        &larr; Back to Jobs
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                            <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                                <div className="flex items-start space-x-4 mb-4 md:mb-0">
                                    <div className="h-16 w-16 rounded bg-gray-100 flex items-center justify-center text-xl font-bold text-gray-500">
                                        {job.company.charAt(0)}
                                    </div>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-800 mb-2">{job.title}</h1>
                                        <div className="flex items-center text-gray-600 mb-1">
                                            <FaBuilding className="mr-2" />
                                            <span>{job.company}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-y-2 text-sm text-gray-500">
                                            <div className="flex items-center mr-4">
                                                <FaMapMarkerAlt className="mr-1 text-gray-400" />
                                                <span>{job.location}</span>
                                            </div>
                                            <div className="flex items-center mr-4">
                                                <FaBriefcase className="mr-1 text-gray-400" />
                                                <span>{job.type}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <FaCalendarAlt className="mr-1 text-gray-400" />
                                                <span>Posted {formatDate(job.createdAt)}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-start md:items-end">
                                    {job.salary && (
                                        <div className="flex items-center text-green-600 font-medium mb-2">
                                            <FaDollarSign className="mr-1" />
                                            <span>{job.salary}</span>
                                        </div>
                                    )}
                                    <div className="flex space-x-2">
                                        <button
                                            className="text-gray-500 hover:text-blue-600 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-200"
                                            title="Share this job"
                                        >
                                            <FaShareAlt />
                                        </button>
                                        <button
                                            className="text-gray-500 hover:text-yellow-600 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition duration-200"
                                            title="Save this job"
                                        >
                                            <FaBookmark />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">Job Description</h2>
                                <div className="prose max-w-none text-gray-700">
                                    {job.description.split('\n\n').map((paragraph, index) => (
                                        <p key={index} className="mb-4">
                                            {paragraph}
                                        </p>
                                    ))}
                                </div>
                            </div>

                            {job.keywords && job.keywords.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Skills & Expertise</h2>
                                    <div className="flex flex-wrap gap-2">
                                        {job.keywords.map((keyword, index) => (
                                            <span
                                                key={index}
                                                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full"
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {job.benefits && job.benefits.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-4 text-gray-800">Benefits</h2>
                                    <ul className="list-disc pl-5 text-gray-700 space-y-2">
                                        {job.benefits.map((benefit, index) => (
                                            <li key={index}>{benefit}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {job.aboutCompany && (
                            <div className="bg-white rounded-lg shadow-md p-8">
                                <h2 className="text-xl font-semibold mb-4 text-gray-800">About {job.company}</h2>
                                <p className="text-gray-700">{job.aboutCompany}</p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6 sticky top-24">
                            <a
                                href={job.applyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={handleApplyClick}
                                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition duration-200 mb-4"
                            >
                                Apply Now <FaExternalLinkAlt className="ml-2" />
                            </a>
                            <p className="text-sm text-gray-500 text-center">
                                This will take you to the company's website
                            </p>
                        </div>

                        {relatedJobs.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold mb-4 text-gray-800">Similar Jobs</h3>
                                <div className="space-y-4">
                                    {relatedJobs.map(relatedJob => (
                                        <div key={relatedJob.id} className="border-b border-gray-100 pb-4 last:border-0 last:pb-0">
                                            <Link
                                                href={`/job/${relatedJob.id}`}
                                                className="text-lg font-medium text-gray-800 hover:text-blue-600 block mb-1"
                                            >
                                                {relatedJob.title}
                                            </Link>
                                            <p className="text-gray-600 mb-1">{relatedJob.company}</p>
                                            <div className="flex items-center text-sm text-gray-500">
                                                <FaMapMarkerAlt className="mr-1 text-gray-400" />
                                                <span>{relatedJob.location}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ClientProviders>

    );
}