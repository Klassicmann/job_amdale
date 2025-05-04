'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { FaMapMarkerAlt, FaBriefcase, FaCalendarAlt, FaBuilding, FaDollarSign, FaShareAlt, FaBookmark, FaExternalLinkAlt, FaGraduationCap, FaLanguage, FaUserTie } from 'react-icons/fa';
import { useAnalytics } from '@/contexts/AnalyticsContext';
import ClientProviders from '@/components/providers/ClientProviders';
import { getJobById } from '@/lib/services/jobService';
import './jobDetails.css';

// Sample related jobs for when we don't have enough real related jobs
const sampleRelatedJobs = [
    {
        id: '1',
        title: 'Senior Frontend Developer',
        company: 'Tech Innovations',
        location: 'San Francisco, CA (Remote)',
        type: 'Full-time',
        salary: '$120,000 - $140,000',
        category: 'Technology',
        applyUrl: 'https://example.com/apply',
        description: (
            <div>
                We are looking for a Senior Frontend Developer to join our team. You will be responsible for building and maintaining user interfaces for our web applications.

                <h3>Responsibilities:</h3>
                <ul>
                    <li>Develop new user-facing features using React.js</li>
                    <li>Build reusable components and front-end libraries for future use</li>
                    <li>Translate designs and wireframes into high-quality code</li>
                    <li>Optimize components for maximum performance across a vast array of web-capable devices and browsers</li>
                </ul>

                <h3>Requirements:</h3>
                <ul>
                    <li>4+ years of experience with frontend development</li>
                    <li>Strong proficiency in JavaScript, including DOM manipulation and the JavaScript object model</li>
                    <li>Thorough understanding of React.js and its core principles</li>
                    <li>Experience with popular React.js workflows (such as Flux or Redux)</li>
                    <li>Familiarity with newer specifications of ECMAScript</li>
                    <li>Experience with data structure libraries (e.g., Immutable.js)</li>
                    <li>Knowledge of isomorphic React is a plus</li>
                    <li>Understanding of REST APIs and GraphQL</li>
                    <li>Familiarity with modern front-end build pipelines and tools</li>
                    <li>Experience with common front-end development tools such as Babel, Webpack, NPM, etc.</li>
                    <li>A knack for benchmarking and optimization</li>
                </ul>
            </div>
        ),
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
        description: (
            <div>
                We are seeking a talented UX/UI Designer to create amazing user experiences. The ideal candidate should have an eye for clean and artful design, possess superior UI skills, and be able to translate high-level requirements into interaction flows and artifacts.

                <h3>Responsibilities:</h3>
                <ul>
                    <li>Collaborate with product management and engineering to define and implement innovative solutions for product direction, visuals, and experience</li>
                    <li>Execute all visual design stages from concept to final hand-off to engineering</li>
                    <li>Conceptualize original ideas that bring simplicity and user friendliness to complex design challenges</li>
                    <li>Create wireframes, storyboards, user flows, process flows and site maps to effectively communicate interaction and design ideas</li>
                    <li>Present and defend designs and key deliverables to peers and executive level stakeholders</li>
                    <li>Conduct user research and evaluate user feedback</li>
                    <li>Establish and promote design guidelines, best practices, and standards</li>
                </ul>

                <h3>Requirements:</h3>
                <ul>
                    <li>Proven work experience as a UI/UX Designer or similar role</li>
                    <li>Portfolio of design projects</li>
                    <li>Knowledge of wireframe tools (e.g. Wireframe.cc, InVision, Figma)</li>
                    <li>Up-to-date knowledge of design software like Adobe Illustrator and Photoshop</li>
                    <li>Team spirit; strong communication skills to collaborate with various stakeholders</li>
                    <li>Good time-management skills</li>
                </ul>
            </div>
        ),
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
        description: (
            <div>
                We're looking for a Data Scientist to help us discover the information hidden in vast amounts of data, and help us make smarter decisions to deliver even better products.

                <h3>Responsibilities:</h3>
                <ul>
                    <li>Selecting features, building and optimizing classifiers using machine learning techniques</li>
                    <li>Data mining using state-of-the-art methods</li>
                    <li>Extending company's data with third party sources of information when needed</li>
                    <li>Enhancing data collection procedures to include information that is relevant for building analytic systems</li>
                    <li>Processing, cleansing, and verifying the integrity of data used for analysis</li>
                    <li>Doing ad-hoc analysis and presenting results in a clear manner</li>
                    <li>Creating automated anomaly detection systems and constant tracking of its performance</li>
                </ul>

                <h3>Requirements:</h3>
                <ul>
                    <li>3+ years of experience in data science or related field</li>
                    <li>Strong problem-solving skills with an emphasis on product development</li>
                    <li>Experience using statistical computer languages (R, Python, SQL, etc.) to manipulate data and draw insights from large data sets</li>
                    <li>Experience working with and creating data architectures</li>
                    <li>Knowledge of a variety of machine learning techniques (clustering, decision tree learning, artificial neural networks, etc.) and their real-world advantages/drawbacks</li>
                    <li>Knowledge of advanced statistical techniques and concepts (regression, properties of distributions, statistical tests and proper usage, etc.) and experience with applications</li>
                    <li>Excellent written and verbal communication skills for coordinating across teams</li>
                    <li>A drive to learn and master new technologies and techniques</li>
                </ul>
            </div>
        ),
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
        // Fetch the job from Firebase
        const fetchJob = async () => {
            try {
                setLoading(true);
                console.log('Fetching job with ID:', id);
                
                const jobData = await getJobById(id);
                console.log('Job data:', jobData);

                if (jobData) {
                    setJob(jobData);

                    // Track view event
                    trackEvent('view_job', {
                        jobId: jobData.id,
                        jobTitle: jobData.title,
                        company: jobData.company
                    });

                    // For now, use sample related jobs
                    // In a real app, you would fetch related jobs based on category or keywords
                    setRelatedJobs(sampleRelatedJobs.slice(0, 3));
                } else {
                    console.error('Job not found');
                    setError('Job not found');
                }
            } catch (err) {
                console.error('Failed to fetch job details:', err);
                setError('Failed to fetch job details');
            } finally {
                setLoading(false);
            }
        };

        fetchJob();
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
            <div className="container mx-auto px-4 pt-24 pb-20">
                <div className="mb-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-32"></div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="job-header bg-white rounded-lg shadow-md p-8 mb-8">
                            <div className="flex flex-col md:flex-row md:items-start justify-between mb-6">
                                <div className="flex items-start space-x-4 mb-4 md:mb-0">
                                    <div className="company-logo h-16 w-16 rounded-lg flex-shrink-0 bg-gray-200 animate-pulse"></div>
                                    <div className="w-full">
                                        <div className="h-8 bg-gray-200 rounded w-3/4 mb-3 animate-pulse"></div>
                                        <div className="h-5 bg-gray-200 rounded w-1/2 mb-3 animate-pulse"></div>
                                        <div className="flex flex-wrap gap-2">
                                            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                                            <div className="h-6 bg-gray-200 rounded w-24 animate-pulse"></div>
                                            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col items-start md:items-end">
                                    <div className="h-7 bg-gray-200 rounded w-32 mb-3 animate-pulse"></div>
                                    <div className="flex space-x-2">
                                        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                                        <div className="h-8 w-8 bg-gray-200 rounded-full animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mb-8">
                                <div className="h-7 bg-gray-200 rounded w-48 mb-4 animate-pulse"></div>
                                <div className="space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                    <div className="h-4 bg-gray-200 rounded w-5/6 animate-pulse"></div>
                                </div>
                            </div>
                            
                            <div className="mb-8">
                                <div className="h-7 bg-gray-200 rounded w-40 mb-4 animate-pulse"></div>
                                <div className="flex flex-wrap gap-2">
                                    <div className="h-8 bg-gray-200 rounded-full w-20 animate-pulse"></div>
                                    <div className="h-8 bg-gray-200 rounded-full w-24 animate-pulse"></div>
                                    <div className="h-8 bg-gray-200 rounded-full w-16 animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <div className="h-12 bg-gray-200 rounded w-full mb-4 animate-pulse"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto animate-pulse"></div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4 animate-pulse"></div>
                            <div className="space-y-4">
                                <div className="h-20 bg-gray-200 rounded w-full animate-pulse"></div>
                                <div className="h-20 bg-gray-200 rounded w-full animate-pulse"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !job) {
        return (
            <div className="container mx-auto px-4 pt-24 pb-20">
                <div className="bg-white rounded-lg shadow-md p-12 text-center max-w-2xl mx-auto">
                    <div className="mb-6">
                        <svg className="w-20 h-20 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-800 mb-4">Job Not Found</h2>
                    <p className="text-gray-600 mb-8 text-lg">The job you're looking for doesn't exist or has been removed.</p>
                    <Link
                        href="/jobs"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-200 inline-flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Browse All Jobs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <ClientProviders>
            <div className="container mx-auto px-4 pt-24 pb-20">
                <div className="mb-8">
                    <Link href="/jobs" className="text-blue-600 hover:text-blue-800 flex items-center transition-all duration-200 hover:-translate-x-1">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                        </svg>
                        Back to Jobs
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <div className="job-header bg-white rounded-lg shadow-md p-8 mb-8">
                            <div className="flex flex-col md:flex-row md:items-start justify-between mb-8">
                                <div className="flex items-start space-x-5 mb-6 md:mb-0">
                                    <div className="company-logo h-20 w-20 rounded-lg flex-shrink-0 flex items-center justify-center text-2xl font-bold text-blue-700 shadow-sm">
                                        {job.company.charAt(0)}
                                    </div>
                                    <div>
                                        <h1 className="job-title text-3xl font-bold mb-3">{job.title}</h1>
                                        <div className="flex items-center text-gray-700 mb-4 text-lg">
                                            <FaBuilding className="mr-2 text-blue-600" />
                                            <span className="font-medium">{job.company}</span>
                                        </div>
                                        <div className="flex flex-wrap gap-3">
                                            {job.location && (
                                                <div className="job-meta-item">
                                                    <FaMapMarkerAlt className="job-meta-icon" />
                                                    <span>{job.location}</span>
                                                </div>
                                            )}
                                            {job.type && (
                                                <div className="job-meta-item">
                                                    <FaBriefcase className="job-meta-icon" />
                                                    <span>{job.type}</span>
                                                </div>
                                            )}
                                            {job.createdAt && (
                                                <div className="job-meta-item">
                                                    <FaCalendarAlt className="job-meta-icon" />
                                                    <span>Posted {formatDate(job.createdAt)}</span>
                                                </div>
                                            )}
                                            {job.experienceLevel && (
                                                <div className="job-meta-item">
                                                    <FaUserTie className="job-meta-icon" />
                                                    <span>{job.experienceLevel}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-col items-start md:items-end">
                                    {job.salary && (
                                        <div className="job-salary mb-4">
                                            <FaDollarSign className="mr-1" />
                                            <span>{job.salary.startsWith('$') ? job.salary : '$' + job.salary}</span>
                                        </div>
                                    )}
                                    <div className="flex space-x-3">
                                        <button
                                            className="action-button text-blue-600 hover:text-blue-700 p-3 rounded-full bg-blue-50 hover:bg-blue-100 transition duration-200"
                                            title="Share this job"
                                        >
                                            <FaShareAlt />
                                        </button>
                                        <button
                                            className="action-button text-yellow-600 hover:text-yellow-700 p-3 rounded-full bg-yellow-50 hover:bg-yellow-100 transition duration-200"
                                            title="Save this job"
                                        >
                                            <FaBookmark />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h2 className="section-title text-xl font-semibold mb-6 text-gray-800">Job Description</h2>
                                <div className="job-description prose max-w-none text-gray-700">
                                    {job.description}
                                </div>
                            </div>

                            {job.keywords && job.keywords.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="section-title text-xl font-semibold mb-6 text-gray-800">Skills & Expertise</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {job.keywords.map((keyword, index) => (
                                            <span
                                                key={index}
                                                className="skill-tag px-4 py-2 rounded-lg text-blue-700 font-medium"
                                            >
                                                {keyword}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {job.education && job.education.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="section-title text-xl font-semibold mb-6 text-gray-800">Education</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {job.education.map((edu, index) => (
                                            <div key={index} className="job-meta-item">
                                                <FaGraduationCap className="job-meta-icon" />
                                                <span>{edu}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {job.jobLanguages && job.jobLanguages.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="section-title text-xl font-semibold mb-6 text-gray-800">Languages</h2>
                                    <div className="flex flex-wrap gap-3">
                                        {job.jobLanguages.map((lang, index) => (
                                            <div key={index} className="job-meta-item">
                                                <FaLanguage className="job-meta-icon" />
                                                <span>{lang}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {job.benefits && job.benefits.length > 0 && (
                                <div className="mb-8">
                                    <h2 className="section-title text-xl font-semibold mb-6 text-gray-800">Benefits</h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {job.benefits.map((benefit, index) => (
                                            <div key={index} className="flex items-center p-3 bg-green-50 rounded-lg">
                                                <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                                </svg>
                                                <span className="text-gray-700">{benefit}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {job.aboutCompany && (
                            <div className="bg-white rounded-lg shadow-md p-8">
                                <h2 className="section-title text-xl font-semibold mb-6 text-gray-800">About {job.company}</h2>
                                <div className="bg-blue-50 p-5 rounded-lg border-l-4 border-blue-500">
                                    <p className="text-gray-700 italic">{job.aboutCompany}</p>
                                </div>
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
                                className="apply-button w-full text-white font-bold py-4 px-6 rounded-lg flex items-center justify-center transition duration-200 mb-4 text-lg"
                            >
                                Apply Now <FaExternalLinkAlt className="ml-2" />
                            </a>
                            <p className="text-sm text-gray-500 text-center">
                                This will take you to the company's website
                            </p>
                            
                            {job.salary && (
                                <div className="mt-6 pt-6 border-t border-gray-100">
                                    <h3 className="text-md font-semibold mb-3 text-gray-700">Compensation</h3>
                                    <div className="bg-green-50 p-4 rounded-lg flex items-center justify-center">
                                        <FaDollarSign className="text-green-600 mr-2 text-xl" />
                                        <span className="text-green-700 font-bold text-lg">{job.salary.startsWith('$') ? job.salary : '$' + job.salary}</span>
                                    </div>
                                </div>
                            )}
                            
                            {job.type && (
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <h3 className="text-md font-semibold mb-3 text-gray-700">Job Type</h3>
                                    <div className="bg-blue-50 p-3 rounded-lg flex items-center justify-center">
                                        <FaBriefcase className="text-blue-600 mr-2" />
                                        <span className="text-blue-700 font-medium">{job.type}</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {relatedJobs.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="section-title text-lg font-semibold mb-6 text-gray-800">Similar Jobs</h3>
                                <div className="space-y-5">
                                    {relatedJobs.map(relatedJob => (
                                        <div key={relatedJob.id} className="related-job-card border-b border-gray-100 pb-5 last:border-0 last:pb-0 pl-3">
                                            <Link
                                                href={'/jobs/' + relatedJob.id}
                                                className="text-lg font-medium text-gray-800 hover:text-blue-600 block mb-2"
                                            >
                                                {relatedJob.title}
                                            </Link>
                                            <div className="flex items-center text-gray-600 mb-2">
                                                <FaBuilding className="mr-2 text-blue-500" />
                                                <span>{relatedJob.company}</span>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {relatedJob.location && (
                                                    <div className="flex items-center text-sm bg-gray-100 px-2 py-1 rounded">
                                                        <FaMapMarkerAlt className="mr-1 text-gray-500" />
                                                        <span className="text-gray-700">{relatedJob.location}</span>
                                                    </div>
                                                )}
                                                {relatedJob.salary && (
                                                    <div className="flex items-center text-sm bg-green-50 px-2 py-1 rounded">
                                                        <FaDollarSign className="mr-1 text-green-500" />
                                                        <span className="text-green-700">{relatedJob.salary.startsWith('$') ? relatedJob.salary : '$' + relatedJob.salary}</span>
                                                    </div>
                                                )}
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