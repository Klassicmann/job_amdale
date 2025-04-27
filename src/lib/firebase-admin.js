// src/lib/firebase-admin.js
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
// Note: Firebase Analytics is not available in the Firebase Admin SDK (server-side)
// If you need analytics on the server, you must use BigQuery exports or client-side analytics.
// We export a no-op analytics object for compatibility with client code.

let appInstance;
let dbInstance;
let authInstance;
// No-op analytics export for compatibility
const analytics = null;

/**
 * Initialize Firebase Admin SDK
 */
export function initAdmin() {
  try {
    // Only initialize if it hasn't been initialized
    if (getApps().length === 0) {
      // Handle service account
      let serviceAccount;
      
      try {
        // First try to parse the service account if it's a JSON string
        if (typeof process.env.FIREBASE_SERVICE_ACCOUNT_KEY === 'string') {
          serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        } else {
          console.error('FIREBASE_SERVICE_ACCOUNT_KEY is not a string');
          throw new Error('Invalid service account format');
        }
      } catch (err) {
        console.error('Error parsing service account JSON:', err);
        throw new Error('Failed to parse service account JSON');
      }
      
      // Initialize the app
      appInstance = initializeApp({
        credential: cert(serviceAccount)
      });
      
      // Initialize Firestore
      dbInstance = getFirestore(appInstance);
      
      // Initialize Auth
      authInstance = getAuth(appInstance);
      
      console.log('Firebase admin initialized successfully');
    } else {
      // If already initialized, get the instances
      dbInstance = getFirestore();
      authInstance = getAuth();
    }
  } catch (error) {
    console.error('Firebase admin initialization error:', error);
    throw error;
  }
  
  return { db: dbInstance, auth: authInstance, analytics };
}

// Export analytics (no-op)
export { analytics };

// Get Firebase Auth
export function getAdminAuth() {
  if (!authInstance) {
    initAdmin();
  }
  return authInstance;
}

// Get Firestore
export function getAdminFirestore() {
  if (!dbInstance) {
    initAdmin();
  }
  return dbInstance;
}

// Initialize right away
initAdmin();

// Export instances
export { dbInstance as db, authInstance as auth };