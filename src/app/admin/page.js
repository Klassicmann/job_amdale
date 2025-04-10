'use client';

import React from 'react';
import Link from 'next/link';
import { FaBriefcase, FaChartLine, FaUsers, FaCog } from 'react-icons/fa';
import ClientProviders from '@/components/providers/ClientProviders';

const AdminDashboardPage = () => {
  // Example stats - in a real app these would come from your database
  const stats = [
    { id: 1, title: 'Total Jobs', value: '24', icon: FaBriefcase, color: 'bg-blue-500' },
    { id: 2, title: 'Total Views', value: '1,284', icon: FaChartLine, color: 'bg-green-500' },
    { id: 3, title: 'Applications', value: '342', icon: FaUsers, color: 'bg-purple-500' },
    { id: 4, title: 'Conversion Rate', value: '26.6%', icon: FaCog, color: 'bg-orange-500' }
  ];

  // Menu items for quick access
  const menuItems = [
    { id: 1, title: 'Manage Jobs', icon: FaBriefcase, link: '/admin/jobs', description: 'Add, edit, or remove job listings' },
    { id: 2, title: 'View Analytics', icon: FaChartLine, link: '/admin/analytics', description: 'Monitor website traffic and user engagement' },
    { id: 3, title: 'Website Settings', icon: FaCog, link: '/admin/settings', description: 'Configure website options and appearance' }
  ];

  return (
    <ClientProviders>
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {stats.map((stat) => (
              <div key={stat.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${stat.color} text-white mr-4`}>
                    <stat.icon size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Access Menu */}
          <h2 className="text-xl font-bold text-gray-800 mb-6">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {menuItems.map((item) => (
              <Link key={item.id} href={item.link} className="block">
                <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition duration-200 h-full">
                  <div className="flex items-center mb-4">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                      <item.icon size={20} />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                  </div>
                  <p className="text-gray-600">{item.description}</p>
                </div>
              </Link>
            ))}
          </div>

          {/* Recent Activity */}
          <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Activity</h2>
          <div className="bg-white rounded-lg shadow-md p-6 mb-10">
            <div className="space-y-4">
              {/* This would be populated from your analytics data */}
              <div className="pb-4 border-b border-gray-100">
                <p className="text-gray-600">New job posted: <span className="font-medium text-gray-800">Senior Frontend Developer</span></p>
                <p className="text-sm text-gray-500">2 hours ago</p>
              </div>
              <div className="pb-4 border-b border-gray-100">
                <p className="text-gray-600">Job application spike: <span className="font-medium text-gray-800">Data Scientist</span></p>
                <p className="text-sm text-gray-500">Yesterday</p>
              </div>
              <div className="pb-4 border-b border-gray-100">
                <p className="text-gray-600">New search trend: <span className="font-medium text-gray-800">Remote React Developer</span></p>
                <p className="text-sm text-gray-500">3 days ago</p>
              </div>
              <div>
                <p className="text-gray-600">Traffic increase: <span className="font-medium text-gray-800">24% from last week</span></p>
                <p className="text-sm text-gray-500">This week</p>
              </div>
            </div>
          </div>

          {/* Help Resources */}
          <h2 className="text-xl font-bold text-gray-800 mb-6">Help & Resources</h2>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="space-y-4">
              <div className="pb-4 border-b border-gray-100">
                <h3 className="font-medium text-gray-800 mb-1">Documentation</h3>
                <p className="text-gray-600 mb-2">Check out our comprehensive documentation for administrators.</p>
                <a href="#" className="text-blue-600 hover:text-blue-800">View Documentation</a>
              </div>
              <div className="pb-4 border-b border-gray-100">
                <h3 className="font-medium text-gray-800 mb-1">Need Help?</h3>
                <p className="text-gray-600 mb-2">Contact our support team for assistance with any issues.</p>
                <a href="mailto:support@backtoworkangels.com" className="text-blue-600 hover:text-blue-800">Contact Support</a>
              </div>
              <div>
                <h3 className="font-medium text-gray-800 mb-1">Feature Requests</h3>
                <p className="text-gray-600 mb-2">Have suggestions for improving the platform? Let us know!</p>
                <a href="#" className="text-blue-600 hover:text-blue-800">Submit Feedback</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ClientProviders>
  );
};

export default AdminDashboardPage;