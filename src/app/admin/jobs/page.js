'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FaPlus, FaEdit, FaTrash, FaSearch, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import ClientProviders from '@/components/providers/ClientProviders';
import { useAuth } from '@/contexts/AuthContext';

const AdminJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteJobId, setDeleteJobId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { currentUser, isSuperAdmin } = useAuth();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);

        // Different query for super admin vs regular admin
        const url = isSuperAdmin 
          ? '/api/jobs' // Super admins can see all jobs
          : '/api/jobs?createdBy=' + currentUser.uid; // Regular admins only see their own jobs
        
        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${await currentUser.getIdToken()}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch jobs');
        }

        const data = await response.json();
        setJobs(data.jobs || []);

      } catch (err) {
        console.error('Error fetching jobs:', err);
        setError(err.message || 'Failed to fetch jobs');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchJobs();
    }
  }, [currentUser, isSuperAdmin]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  const handleDeleteClick = (jobId) => {
    setDeleteJobId(jobId);
  };

  const cancelDelete = () => {
    setDeleteJobId(null);
  };

  const confirmDelete = async () => {
    if (!deleteJobId) return;

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/jobs/${deleteJobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${await currentUser.getIdToken()}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete job');
      }

      // Remove the job from the state
      setJobs(jobs.filter(job => job.id !== deleteJobId));
      setDeleteJobId(null);
    } catch (err) {
      console.error('Error deleting job:', err);
      setError('Failed to delete job: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            <FaCheckCircle className="mr-1 self-center" /> Published
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
            <FaExclamationCircle className="mr-1 self-center" /> Pending Approval
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
            <FaExclamationCircle className="mr-1 self-center" /> Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  return (
    <ClientProviders>
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Manage Jobs</h1>
            <Link
              href="/admin/jobs/add"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-200"
            >
              <FaPlus className="mr-2" /> Add New Job
            </Link>
          </div>

          {/* Search Bar */}
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

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-lg shadow-md p-6">
                  <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/5"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {filteredJobs.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Job Title
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Company
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Location
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Added
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{job.company}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{job.location}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(job.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(job.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Link
                                href={`/admin/jobs/edit/${job.id}`}
                                className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 p-2 rounded transition duration-200"
                                title="Edit Job"
                              >
                                <FaEdit />
                              </Link>
                              <button
                                className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 p-2 rounded transition duration-200"
                                title="Delete Job"
                                onClick={() => handleDeleteClick(job.id)}
                              >
                                <FaTrash />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-10 text-center">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">No jobs found</h3>
                  <p className="text-gray-600 mb-6">
                    {searchQuery ? 'Try adjusting your search query.' : 'Start by adding your first job posting.'}
                  </p>
                  <Link
                    href="/admin/jobs/add"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center w-48 mx-auto transition duration-200"
                  >
                    <FaPlus className="mr-2" /> Add New Job
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteJobId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this job? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition duration-200"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition duration-200"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ClientProviders>
  );
};

export default AdminJobsPage;