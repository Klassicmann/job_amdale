// src/app/api/users/create/route.js
import { NextResponse } from 'next/server';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';
import { initAdmin } from '@/lib/firebase-admin';

const SUPER_ADMIN_EMAIL = 'klassicmann0@gmail.com';

export async function POST(request) {
  try {
    // Initialize Firebase Admin
    initAdmin();
    const auth = getAuth();
    const db = getFirestore();
    
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
        { error: 'Only super admins can create users' },
        { status: 403 }
      );
    }

    // Parse request body
    const { email, password, name, role } = await request.json();

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Create the user with Firebase Auth
    const userRecord = await auth.createUser({
      email,
      password,
      displayName: name,
      emailVerified: false,
      disabled: false,
    });

    // Set custom claims for role
    await auth.setCustomUserClaims(userRecord.uid, {
      role: role || 'admin',
      createdBy: decodedToken.uid,
      createdAt: new Date().toISOString()
    });

    // Store user data in Firestore
    const userData = {
      uid: userRecord.uid,
      email: userRecord.email,
      name: name,
      role: role || 'admin',
      createdBy: decodedToken.uid,
      creatorEmail: decodedToken.email,
      createdAt: new Date(),
      updatedAt: new Date(),
      isSuperAdmin: email === SUPER_ADMIN_EMAIL
    };

    await db.collection('users').doc(userRecord.uid).set(userData);

    return NextResponse.json({
      message: 'User created successfully',
      user: {
        uid: userRecord.uid,
        email: userRecord.email,
        name: name,
        role: role || 'admin'
      }
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    
    // Handle specific Firebase errors
    if (error.code === 'auth/email-already-exists') {
      return NextResponse.json(
        { error: 'The email address is already in use by another account' },
        { status: 400 }
      );
    }
    
    if (error.code === 'auth/invalid-email') {
      return NextResponse.json(
        { error: 'The email address is not valid' },
        { status: 400 }
      );
    }
    
    if (error.code === 'auth/weak-password') {
      return NextResponse.json(
        { error: 'The password is too weak' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create user: ' + error.message },
      { status: 500 }
    );
  }
}