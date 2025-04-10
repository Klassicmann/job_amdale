'use client';

import React from 'react';
import Link from 'next/link';
import { FaArrowRight, FaBriefcase, FaLightbulb, FaGraduationCap } from 'react-icons/fa';
import { useAnalytics } from '@/contexts/AnalyticsContext';

// Dummy content data
const recommendedContent = [
  {
    id: '1',
    title: 'How to Write a Winning Resume in 2025',
    category: 'Career Tips',
    image: '/images/content/resume-tips.jpg',
    excerpt: 'Learn the latest resume trends and techniques to make your application stand out from the crowd.',
    date: '2025-03-15',
    readTime: '7 min read',
    slug: 'how-to-write-winning-resume-2025'
  },
  {
    id: '2',
    title: 'Top 10 Skills Employers Are Looking For',
    category: 'Industry Insights',
    image: '/images/content/skills-employers.jpg',
    excerpt: 'Discover the most in-demand skills that can help you land your dream job in today\'s competitive market.',
    date: '2025-03-08',
    readTime: '5 min read',
    slug: 'top-10-skills-employers-looking-for'
  },
  {
    id: '3',
    title: 'Remote Work: How to Stay Productive',
    category: 'Work Life',
    image: '/images/content/remote-work.jpg',
    excerpt: 'Practical tips and strategies to maintain productivity and work-life balance when working remotely.',
    date: '2025-03-01',
    readTime: '6 min read',
    slug: 'remote-work-how-to-stay-productive'
  }
];

const RecommendedContent = () => {
  const { trackEvent } = useAnalytics();

  const handleContentClick = (contentId, title, category) => {
    trackEvent('content_click', {
      contentId,
      title,
      category,
      source: 'recommended_content'
    });
  };

  const handleViewAllClick = () => {
    trackEvent('view_all_blog_click', {
      source: 'home_page'
    });
  };

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800">Career Resources</h2>
          <Link 
            href="/blog" 
            className="text-blue-600 hover:text-blue-800 flex items-center transition duration-200"
            onClick={handleViewAllClick}
          >
            View All Articles <FaArrowRight className="ml-2" />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {recommendedContent.map(content => (
            <div key={content.id} className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 hover:shadow-lg">
              <div className="relative h-48 bg-gray-200">
                {/* Use a placeholder since we don't have actual images */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-500 bg-gray-100">
                  {content.category === 'Career Tips' && <FaLightbulb size={30} />}
                  {content.category === 'Industry Insights' && <FaBriefcase size={30} />}
                  {content.category === 'Work Life' && <FaGraduationCap size={30} />}
                </div>
              </div>
              
              <div className="p-6">
                <div className="flex items-center mb-3">
                  <span className="text-sm text-blue-600 font-medium">{content.category}</span>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm text-gray-500">{content.readTime}</span>
                </div>
                
                <h3 className="text-xl font-bold mb-3 text-gray-800 line-clamp-2">
                  <Link 
                    href={`/blog/${content.slug}`}
                    onClick={() => handleContentClick(content.id, content.title, content.category)}
                    className="hover:text-blue-600 transition duration-200"
                  >
                    {content.title}
                  </Link>
                </h3>
                
                <p className="text-gray-600 mb-4 line-clamp-3">{content.excerpt}</p>
                
                <Link 
                  href={`/blog/${content.slug}`}
                  onClick={() => handleContentClick(content.id, content.title, content.category)}
                  className="text-blue-600 hover:text-blue-800 font-medium inline-flex items-center transition duration-200"
                >
                  Read More <FaArrowRight className="ml-2" size={12} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RecommendedContent;