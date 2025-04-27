'use client';
// src/app/admin/users/edit/[id]/page.js
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ClientProviders from '@/components/providers/ClientProviders';

const EditUserPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [user, setUser] = useState(null);
  
  const { currentUser, isSuperAdmin } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  // Redirect if not super admin
  useEffect(() => {
    if (currentUser && !isSuperAdmin) {
      router.push('/admin');
    }
  }, [currentUser, isSuperAdmin, router]);

  // Fetch user data
  useEffect(() => {
    const fetchUser = async () => {
      if (!currentUser || !isSuperAdmin || !id) return;

      try {
        setIsLoading(true);
        const token = await currentUser.getIdToken();
        
        const response = await fetch(`/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user');
        }

        const data = await response.json();
        setUser(data.user);
        setName(data.user.name || '');
        setEmail(data.user.email || '');
      } catch (err) {
        console.error('Error fetching user:', err);
        setError(err.message || 'Failed to fetch user');
      } finally {
        setIsLoading(false);
      }
    };

    if (currentUser && isSuperAdmin && id) {
      fetchUser();
    }
  }, [currentUser, isSuperAdmin, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validate name
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = await currentUser.getIdToken();
      
      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name,
          email
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to update user');
      }
      
      setSuccess(true);
      
      // Redirect after a delay
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err.message || 'Failed to update user');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isSuperAdmin) {
    return (
      <ClientProviders>
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
            <p className="mt-2">Only super admins can edit users.</p>
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

  if (isLoading) {
    return (
      <ClientProviders>
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 rounded w-2/3 mb-6"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-4"></div>
              <div className="h-10 bg-gray-200 rounded w-1/3 mt-6"></div>
            </div>
          </div>
        </div>
      </ClientProviders>
    );
  }

  if (error && !user) {
    return (
      <ClientProviders>
        <div className="container mx-auto px-4 pt-32 pb-20">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link 
              href="/admin/users" 
              className="inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Back to Users
            </Link>
          </div>
        </div>
      </ClientProviders>
    );
  }

  return (
    <ClientProviders>
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Edit User</h1>
            <Link
              href="/admin/users"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-200"
            >
              Back to Users
            </Link>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              User updated successfully! Redirecting...
            </div>
          )}

          {user && user.isSuperAdmin && (
            <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
              Note: This is a Super Admin account. Some fields cannot be modified.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Full Name*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="John Doe"
              />
            </div>

            <div className="mb-6">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                disabled={user && (user.isSuperAdmin || user.email === 'klassicmann0@gmail.com')}
                className={`w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${user && (user.isSuperAdmin || user.email === 'klassicmann0@gmail.com') ? 'bg-gray-100' : ''}`}
                readOnly={user && (user.isSuperAdmin || user.email === 'klassicmann0@gmail.com')}
              />
              {user && (user.isSuperAdmin || user.email === 'klassicmann0@gmail.com') && (
                <p className="text-sm text-gray-500 mt-1">
                  Super Admin email cannot be changed
                </p>
              )}
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting || (user && user.email === 'klassicmann0@gmail.com' && user.name === name)}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ${
                  (isSubmitting || (user && user.email === 'klassicmann0@gmail.com' && user.name === name)) ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Updating...' : 'Update User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ClientProviders>
  );
};

export default EditUserPage;