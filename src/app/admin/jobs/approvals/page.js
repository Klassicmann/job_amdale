'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { FaCheck, FaTimes, FaEye } from 'react-icons/fa';
import ClientProviders from '@/components/providers/ClientProviders';

const JobApprovalsPage = () => {
  const [pendingJobs, setPendingJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const router = useRouter();
  const { currentUser, isSuperAdmin } = useAuth();

  // Redirect if not super admin
  useEffect(() => {
    if (currentUser && !isSuperAdmin) {
      router.push('/admin');
    }
  }, [currentUser, isSuperAdmin, router]);

  // Fetch pending jobs
  useEffect(() => {
    const fetchPendingJobs = async () => {
      if (!currentUser) return;
      
      try {
        setLoading(true);
        const token = await currentUser.getIdToken();
        
        const response = await fetch('/api/jobs/pending', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch pending jobs');
        }

        const data = await response.json();
        setPendingJobs(data.jobs || []);
      } catch (err) {
        console.error('Error fetching pending jobs:', err);
        setError(err.message || 'Failed to fetch pending jobs');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && isSuperAdmin) {
      fetchPendingJobs();
    }
  }, [currentUser, isSuperAdmin]);

  const handleViewJob = (job) => {
    // Open job preview
    setSelectedJob(job);
  };

  const handleApproveJob = async (jobId) => {
    if (!currentUser || !isSuperAdmin) return;
    
    try {
      setActionLoading(true);
      const token = await currentUser.getIdToken();
      
      const response = await fetch(`/api/jobs/approve/${jobId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'approve'
        })
      });

      if (!response.ok) {
        throw new Error('Failed to approve job');
      }

      // Update the list of pending jobs
      setPendingJobs(pendingJobs.filter(job => job.id !== jobId));
      setSuccessMessage('Job approved and published successfully!');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error approving job:', err);
      setError(err.message || 'Failed to approve job');
    } finally {
      setActionLoading(false);
    }
  };

  const handleRejectClick = (job) => {
    setSelectedJob(job);
    setShowRejectionModal(true);
  };

  const handleRejectJob = async () => {
    if (!currentUser || !isSuperAdmin || !selectedJob) return;
    
    try {
      setActionLoading(true);
      const token = await currentUser.getIdToken();
      
      const response = await fetch(`/api/jobs/approve/${selectedJob.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          action: 'reject',
          reason: rejectionReason
        })
      });

      if (!response.ok) {
        throw new Error('Failed to reject job');
      }

      // Update the list of pending jobs
      setPendingJobs(pendingJobs.filter(job => job.id !== selectedJob.id));
      setSuccessMessage('Job rejected successfully.');
      
      // Close the modal and reset state
      setShowRejectionModal(false);
      setSelectedJob(null);
      setRejectionReason('');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (err) {
      console.error('Error rejecting job:', err);
      setError(err.message || 'Failed to reject job');
    } finally {
      setActionLoading(false);
    }
  };

  const cancelRejection = () => {
    setShowRejectionModal(false);
    setSelectedJob(null);
    setRejectionReason('');
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  };

  if (!isSuperAdmin) {
    return (
      <ClientProviders>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="mt-2">Only super admins can access this page.</p>
            <Link 
              href="/admin" 
              className="mt-4 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </ClientProviders>
    );
  }

  return (
    <ClientProviders>
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Job Approvals</h1>
            <Link
              href="/admin"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-200"
            >
              Back to Dashboard
            </Link>
          </div>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
              {successMessage}
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
              {pendingJobs.length > 0 ? (
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
                          Submitted By
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date Submitted
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingJobs.map((job) => (
                        <tr key={job.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">{job.title}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{job.company}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">{job.creatorEmail}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(job.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <button
                                onClick={() => handleViewJob(job)}
                                className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 p-2 rounded transition duration-200"
                                title="View Job Details"
                              >
                                <FaEye />
                              </button>
                              <button
                                onClick={() => handleApproveJob(job.id)}
                                disabled={actionLoading}
                                className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 p-2 rounded transition duration-200 disabled:opacity-50"
                                title="Approve Job"
                              >
                                <FaCheck />
                              </button>
                              <button
                                onClick={() => handleRejectClick(job)}
                                disabled={actionLoading}
                                className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 p-2 rounded transition duration-200 disabled:opacity-50"
                                title="Reject Job"
                              >
                                <FaTimes />
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
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">No pending jobs</h3>
                  <p className="text-gray-600">
                    All submitted jobs have been processed. Check back later.
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Job Preview Modal */}
      {selectedJob && !showRejectionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-gray-800">{selectedJob.title}</h3>
              <button 
                onClick={() => setSelectedJob(null)}
                className="text-gray-500 hover:text-gray-700"
              >
                &times;
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <p className="text-gray-600 font-medium">Company:</p>
                <p className="text-gray-900">{selectedJob.company}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Location:</p>
                <p className="text-gray-900">{selectedJob.location}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Type:</p>
                <p className="text-gray-900">{selectedJob.type}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Salary:</p>
                <p className="text-gray-900">
                  {selectedJob.salary || (selectedJob.payRange ? `${selectedJob.salaryCurrency} ${selectedJob.payRange}` : 'Not specified')}
                </p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Experience Level:</p>
                <p className="text-gray-900">{selectedJob.experienceLevel}</p>
              </div>
              <div>
                <p className="text-gray-600 font-medium">Work Option:</p>
                <p className="text-gray-900">{selectedJob.workOption || 'Not specified'}</p>
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-gray-600 font-medium">Description:</p>
              <div className="mt-2 text-gray-900 whitespace-pre-wrap bg-gray-50 p-4 rounded">
                {selectedJob.description}
              </div>
            </div>
            
            <div className="mt-4">
              <p className="text-gray-600 font-medium">Apply URL:</p>
              <a href={selectedJob.applyUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                {selectedJob.applyUrl}
              </a>
            </div>
            
            <div className="mt-4">
              <p className="text-gray-600 font-medium">Created By:</p>
              <p className="text-gray-900">{selectedJob.creatorEmail}</p>
              <p className="text-gray-500 text-sm">at {formatDate(selectedJob.createdAt)}</p>
            </div>
            
            <div className="flex justify-end space-x-4 mt-6">
              <button
                onClick={() => setSelectedJob(null)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition duration-200"
              >
                Close
              </button>
              <button
                onClick={() => handleApproveJob(selectedJob.id)}
                disabled={actionLoading}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition duration-200 disabled:opacity-50"
              >
                Approve
              </button>
              <button
                onClick={() => handleRejectClick(selectedJob)}
                disabled={actionLoading}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition duration-200 disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectionModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Reject Job: {selectedJob.title}</h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this job posting. This will be communicated to the admin who created it.
            </p>
            <textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
              rows="4"
              placeholder="Enter rejection reason..."
            ></textarea>
            <div className="flex justify-end space-x-4">
              <button
                onClick={cancelRejection}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded transition duration-200"
                disabled={actionLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleRejectJob}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded transition duration-200 disabled:opacity-50"
                disabled={actionLoading || !rejectionReason.trim()}
              >
                {actionLoading ? 'Rejecting...' : 'Reject Job'}
              </button>
            </div>
          </div>
        </div>
      )}
    </ClientProviders>
  );
};

export default JobApprovalsPage;