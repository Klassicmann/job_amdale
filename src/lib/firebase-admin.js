// src/lib/firebase-admin.js
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import path from 'path';
import fs from 'fs';
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
      // Load the service account file
      let serviceAccount;
      
      try {
        // Path to the service account file
        const serviceAccountPath = path.join(process.cwd(), 'job-search-platform-service.json');
        
        // Read and parse the service account file
        const serviceAccountFile = fs.readFileSync(serviceAccountPath, 'utf8');
        serviceAccount = JSON.parse(serviceAccountFile);
        
        console.log('Service account loaded successfully from file');
      } catch (err) {
        console.error('Error loading service account file:', err);
        
        // Fallback to environment variable if file reading fails
        if (typeof process.env.FIREBASE_SERVICE_ACCOUNT_KEY === 'string') {
          console.log('Falling back to FIREBASE_SERVICE_ACCOUNT_KEY environment variable');
          serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
        } else {
          throw new Error('Failed to load service account credentials');
        }
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