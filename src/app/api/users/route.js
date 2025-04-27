// src/app/api/users/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';
import { authenticateAdmin } from '@/lib/admin-middleware';
import { syncUsersToFirestore } from '@/lib/sync-users';

export async function GET(request) {
  try {
    // Authenticate admin with super admin requirement
    const { authorized, user, response } = await authenticateAdmin(request, { requireSuperAdmin: true });
    if (!authorized) {
      return response;
    }

    console.log('Authorized super admin access:', user.email);

    // First, ensure users are synced from Auth to Firestore
    try {
      console.log('Starting user sync before fetching users...');
      await syncUsersToFirestore();
      console.log('User sync completed');
    } catch (syncError) {
      console.error('Error syncing users:', syncError);
      // Continue anyway - we'll still return what's in Firestore
    }

    // Fetch users from Firestore
    console.log('Fetching users from Firestore...');
    const usersSnapshot = await db.collection('users').get();
    const users = [];
    
    usersSnapshot.forEach(doc => {
      const userData = doc.data();
      
      // Format dates for JSON if they exist
      if (userData.createdAt && typeof userData.createdAt.toDate === 'function') {
        userData.createdAt = userData.createdAt.toDate().toISOString();
      }
      if (userData.updatedAt && typeof userData.updatedAt.toDate === 'function') {
        userData.updatedAt = userData.updatedAt.toDate().toISOString();
      }
      
      users.push(userData);
    });

    console.log(`Returning ${users.length} users from Firestore`);
    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users: ' + error.message },
      { status: 500 }
    );
  }
}