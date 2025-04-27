'use client';
// src/app/admin/users/create/page.js
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import ClientProviders from '@/components/providers/ClientProviders';

const CreateUserPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const { currentUser, isSuperAdmin } = useAuth();
  const router = useRouter();

  // Redirect if not super admin
  useEffect(() => {
    if (currentUser && !isSuperAdmin) {
      router.push('/admin');
    }
  }, [currentUser, isSuperAdmin, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    
    // Validate password match
    if (password !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }
    
    // Validate password strength
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const token = await currentUser.getIdToken();
      
      const response = await fetch('/api/users/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email,
          password,
          role: 'admin'
        })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create user');
      }
      
      setSuccess(true);
      setEmail('');
      setPassword('');
      setConfirmPassword('');
      
      // Redirect after a delay
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
    } catch (err) {
      console.error('Error creating user:', err);
      setError(err.message || 'Failed to create user');
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
            <p className="mt-2">Only super admins can create users.</p>
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
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-800">Create Admin User</h1>
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
              Admin user created successfully! Redirecting...
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email Address*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="admin@example.com"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-700 font-medium mb-2">
                Password*
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a strong password"
              />
              <p className="text-sm text-gray-500 mt-1">
                Password must be at least 6 characters long
              </p>
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">
                Confirm Password*
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Confirm password"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? 'Creating User...' : 'Create Admin User'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </ClientProviders>
  );
};

export default CreateUserPage;