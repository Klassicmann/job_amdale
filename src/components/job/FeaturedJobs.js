'use client';

import React from 'react';
import Link from 'next/link';
import JobCard from './JobCard';
import { FaArrowRight } from 'react-icons/fa';
import { useAnalytics } from '@/contexts/AnalyticsContext';

// Dummy featured jobs data - would normally come from API
const featuredJobsData = [
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
    description: 'We\'re looking for a Data Scientist to help us discover the information hidden in vast amounts of data, and help us make smarter decisions to deliver even better products.',
    keywords: ['Python', 'Machine Learning', 'AI', 'Data Mining', 'SQL'],
    createdAt: '2025-03-10T09:15:00.000Z',
    updatedAt: '2025-03-10T09:15:00.000Z'
  },
  {
    id: '5',
    title: 'Product Manager',
    company: 'SaaS Solutions',
    location: 'Boston, MA (Hybrid)',
    type: 'Full-time',
    salary: '$115,000 - $135,000',
    category: 'Product',
    description: 'We are seeking a Product Manager to join our growing team. You will be responsible for the product planning and execution throughout the Product Lifecycle.',
    keywords: ['Product Management', 'Agile', 'SaaS', 'User Stories', 'Roadmap'],
    createdAt: '2025-03-12T10:20:00.000Z',
    updatedAt: '2025-03-12T10:20:00.000Z'
  }
];

const FeaturedJobs = ({ limit = 4, showTitle = true }) => {
  const { trackEvent } = useAnalytics();
  
  // Limit the number of jobs to display
  const jobs = featuredJobsData.slice(0, limit);
  
  const handleViewAllClick = () => {
    trackEvent('view_all_featured_jobs_click', {
      source: 'home_page'
    });
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        {showTitle && (
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Featured Jobs</h2>
            <Link 
              href="/jobs" 
              className="text-blue-600 hover:text-blue-800 flex items-center transition duration-200"
              onClick={handleViewAllClick}
            >
              View All Jobs <FaArrowRight className="ml-2" />
            </Link>
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {jobs.map(job => (
            <div key={job.id} className="flex">
              <JobCard job={job} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedJobs;