// src/lib/sync-users.js
import { auth, db } from './firebase-admin';

const SUPER_ADMIN_EMAIL = 'klassicmann0@gmail.com';

/**
 * Sync users from Firebase Auth to Firestore
 * This ensures users in Auth are also in Firestore
 */
export async function syncUsersToFirestore() {
  try {
    console.log('Starting user sync from Auth to Firestore...');
    
    // List all users from Firebase Auth
    const listUsersResult = await auth.listUsers();
    const authUsers = listUsersResult.users;
    
    console.log(`Found ${authUsers.length} users in Firebase Auth`);
    
    // Get all user documents from Firestore
    const usersSnapshot = await db.collection('users').get();
    const firestoreUserIds = new Set();
    
    usersSnapshot.forEach(doc => {
      firestoreUserIds.add(doc.id);
    });
    
    console.log(`Found ${firestoreUserIds.size} users in Firestore`);
    
    // Process each user from Auth
    for (const user of authUsers) {
      // Skip if user already exists in Firestore
      if (firestoreUserIds.has(user.uid)) {
        continue;
      }
      
      // Create new user document in Firestore
      const userData = {
        uid: user.uid,
        email: user.email,
        name: user.displayName || user.email.split('@')[0], // Use email prefix if no name
        isSuperAdmin: user.email === SUPER_ADMIN_EMAIL,
        role: user.email === SUPER_ADMIN_EMAIL ? 'superadmin' : 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          creationTime: user.metadata.creationTime,
          lastSignInTime: user.metadata.lastSignInTime
        }
      };
      
      // Save to Firestore
      await db.collection('users').doc(user.uid).set(userData);
      console.log(`Synced user: ${user.email}`);
    }
    
    console.log('User sync completed successfully');
    return true;
  } catch (error) {
    console.error('Error syncing users:', error);
    return false;
  }
}

// Export a function that returns a promise that resolves when sync is complete
export default function ensureUserSync() {
  return syncUsersToFirestore();
}