'use client';
// src/app/admin/users/page.js
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaPlus, FaTrash, FaEdit, FaUserShield } from 'react-icons/fa';
import { useAuth } from '@/contexts/AuthContext';
import ClientProviders from '@/components/providers/ClientProviders';
import Header from '@/components/common/Header';

const ManageUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { currentUser, isSuperAdmin } = useAuth();
  const router = useRouter();

  // Redirect if not super admin
  useEffect(() => {
    if (currentUser && !isSuperAdmin) {
      router.push('/admin');
    }
  }, [currentUser, isSuperAdmin, router]);

  // Fetch all admin users
  useEffect(() => {
    const fetchUsers = async () => {
      if (!currentUser || !isSuperAdmin) return;

      try {
        setLoading(true);
        const token = await currentUser.getIdToken();

        const response = await fetch('/api/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch users');
        }

        const data = await response.json();
        setUsers(data.users || []);
      } catch (err) {
        console.error('Error fetching users:', err);
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    if (currentUser && isSuperAdmin) {
      fetchUsers();
    }
  }, [currentUser, isSuperAdmin]);

  // Handle delete click
  const handleDeleteClick = (userId) => {
    setDeleteUserId(userId);
  };

  // Cancel delete
  const cancelDelete = () => {
    setDeleteUserId(null);
  };

  // Confirm delete
  const confirmDelete = async () => {
    if (!deleteUserId || !isSuperAdmin) return;

    setIsDeleting(true);

    try {
      const token = await currentUser.getIdToken();

      const response = await fetch(`/api/users/${deleteUserId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete user');
      }

      // Remove the user from the state
      setUsers(users.filter(user => user.uid !== deleteUserId));
      setDeleteUserId(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      setError('Failed to delete user: ' + err.message);
    } finally {
      setIsDeleting(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';

      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (error) {
      return 'N/A';
    }
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
      {/* Header removed, handled by AdminLayout's Sidebar */}
      <div className="container mx-auto px-4 py-8"> {/* Adjusted padding */}
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Manage Admin Users</h1>
            <Link
              href="/admin/users/create"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center transition duration-200"
            >
              <FaPlus className="mr-2" /> Add New Admin
            </Link>
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
              {users.length > 0 ? (
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Created At
                        </th>
                        <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.uid} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name || 'No Name'}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="text-sm text-gray-500">
                                {user.email}
                                {user.email === currentUser.email && (
                                  <span className="ml-2 text-xs text-gray-500">(You)</span>
                                )}
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {user.isSuperAdmin || user.email === 'klassicmann0@gmail.com' ? (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                  <FaUserShield className="mr-1" /> Super Admin
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                  Admin
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(user.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex justify-end space-x-2">
                              <Link
                                href={`/admin/users/edit/${user.uid}`}
                                className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 hover:bg-indigo-200 p-2 rounded transition duration-200"
                                title="Edit User"
                              >
                                <FaEdit />
                              </Link>
                              {/* Don't allow deleting self or super admin */}
                              {user.email !== currentUser.email && user.email !== 'klassicmann0@gmail.com' && !user.isSuperAdmin && (
                                <button
                                  className="text-red-600 hover:text-red-900 bg-red-100 hover:bg-red-200 p-2 rounded transition duration-200"
                                  title="Delete User"
                                  onClick={() => handleDeleteClick(user.uid)}
                                >
                                  <FaTrash />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-10 text-center">
                  <h3 className="text-xl font-semibold mb-2 text-gray-800">No users found</h3>
                  <p className="text-gray-600 mb-6">
                    Start by adding your first admin user.
                  </p>
                  <Link
                    href="/admin/users/create"
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg flex items-center justify-center w-48 mx-auto transition duration-200"
                  >
                    <FaPlus className="mr-2" /> Add New Admin
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Confirm Deletion</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this admin user? This action cannot be undone and the user will lose all access to the admin dashboard.
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

export default ManageUsersPage;
