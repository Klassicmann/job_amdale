'use client';
// src/components/ProtectedRoute.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // If not loading and no user is logged in, redirect to login
    if (!loading && !currentUser) {
      router.push('/dashboard/login');
    }
  }, [currentUser, loading, router]);

  // Show loading state or nothing while checking auth
  if (loading || !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // If user is authenticated, render the children
  return children;
}