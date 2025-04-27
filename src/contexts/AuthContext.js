'use client';
// src/contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth } from '@/lib/firebase';

// Define the super admin email
const SUPER_ADMIN_EMAIL = 'klassicmann0@gmail.com';

// Create context
const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  return useContext(AuthContext);
};

// Provider component
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // Login function
  const login = async (email, password) => {
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle specific error codes
      switch(err.code) {
        case 'auth/invalid-email':
          setError('Invalid email address format.');
          break;
        case 'auth/user-not-found':
          setError('No user found with this email address.');
          break;
        case 'auth/wrong-password':
          setError('Incorrect password.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Please check your internet connection.');
          break;
        default:
          setError(`Login failed: ${err.message}`);
      }
      return false;
    }
  };

  // Logout function
  const logout = async () => {
    setError('');
    try {
      await signOut(auth);
      return true;
    } catch (err) {
      setError(`Logout failed: ${err.message}`);
      return false;
    }
  };

  // Check if current user is super admin
  const checkSuperAdmin = (user) => {
    if (user && user.email === SUPER_ADMIN_EMAIL) {
      setIsSuperAdmin(true);
      setUserRole('superadmin');
    } else {
      setIsSuperAdmin(false);
      setUserRole(user ? 'admin' : null);
    }
  };

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      // Check if the user is a super admin
      checkSuperAdmin(user);
      
      // You could also check for additional roles in Firestore if needed
      if (user) {
        try {
          const db = getFirestore();
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.role) {
              setUserRole(userData.role);
            }
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
        }
      }
      
      setLoading(false);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  // Context value
  const value = {
    currentUser,
    login,
    logout,
    error,
    setError,
    isSuperAdmin,
    userRole,
    SUPER_ADMIN_EMAIL  // Export the constant for use in other components
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};