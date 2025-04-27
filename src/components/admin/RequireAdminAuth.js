// src/components/admin/RequireAdminAuth.js
'use client';
import React, { useEffect, useState } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { firebaseApp } from '../../lib/firebase';
import { useRouter } from 'next/navigation';

export default function RequireAdminAuth({ children }) {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth(firebaseApp);
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        router.replace('/admin/login');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Checking authentication...</div>;
  }
  if (!isAuthenticated) {
    return null; // Redirecting
  }
  return <>{children}</>;
}
