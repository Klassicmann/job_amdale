// src/app/api/users/[id]/route.js
import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initAdmin } from '@/lib/firebase-admin';

const SUPER_ADMIN_EMAIL = 'klassicmann0@gmail.com';

export async function DELETE(request, { params }) {
  try {
    // Initialize Firebase Admin
    initAdmin();
    const auth = getAuth();
    const db = getFirestore();
    
    const { id } = params;
    if (!id) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Verify authentication and super admin status
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json(
        { error: 'Invalid authentication token' },
        { status: 401 }
      );
    }

    // Ensure the user is a super admin
    if (decodedToken.email !== SUPER_ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Only super admins can delete users' },
        { status: 403 }
      );
    }

    // Get the Firestore user document
    const userDoc = await db.collection('users').doc(id).get();
    
    if (!userDoc.exists) {
      return NextResponse.json(
        { error: 'User not found in database' },
        { status: 404 }
      );
    }
    
    const userData = userDoc.data();
    
    // Prevent deleting the super admin
    if (userData.email === SUPER_ADMIN_EMAIL) {
      return NextResponse.json(
        { error: 'Cannot delete the super admin account' },
        { status: 403 }
      );
    }

    // Prevent deleting yourself
    if (id === decodedToken.uid) {
      return NextResponse.json(
        { error: 'Cannot delete your own account' },
        { status: 403 }
      );
    }

    // Delete the user from Firebase Auth
    try {
      await auth.deleteUser(id);
    } catch (error) {
      // If user not found in Auth but exists in Firestore, just continue to delete from Firestore
      if (error.code !== 'auth/user-not-found') {
        throw error;
      }
    }

    // Delete from Firestore
    await db.collection('users').doc(id).delete();

    return NextResponse.json({
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting user:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/user-not-found') {
      return NextResponse.json(
        { error: 'User not found in authentication system' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to delete user: ' + error.message },
      { status: 500 }
    );
  }
}