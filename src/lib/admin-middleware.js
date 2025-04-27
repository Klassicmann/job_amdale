// src/lib/admin-middleware.js
import { NextResponse } from 'next/server';
import { auth, db } from './firebase-admin';

export const SUPER_ADMIN_EMAIL = 'klassicmann0@gmail.com';

/**
 * Admin middleware to authenticate and authorize admin API requests
 * 
 * @param {Request} request - The incoming request
 * @param {Object} options - Configuration options
 * @param {boolean} options.requireSuperAdmin - Whether to require super admin privileges
 * @returns {Promise<{authorized: boolean, user: Object|null, response: NextResponse|null}>}
 */
export async function authenticateAdmin(request, { requireSuperAdmin = false } = {}) {
  try {
    // Verify authentication header
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return {
        authorized: false,
        user: null,
        response: NextResponse.json(
          { error: 'Unauthorized - Missing or invalid token' },
          { status: 401 }
        )
      };
    }

    // Verify the token
    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      console.error('Token verification error:', error);
      return {
        authorized: false,
        user: null,
        response: NextResponse.json(
          { error: 'Unauthorized - Invalid authentication token' },
          { status: 401 }
        )
      };
    }

    // Get user from Firestore
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    let userData = null;
    
    if (userDoc.exists) {
      userData = userDoc.data();
    } else {
      // If user not in Firestore but exists in Auth, try to fetch from Auth
      try {
        const userRecord = await auth.getUser(decodedToken.uid);
        
        // Create basic user data
        userData = {
          uid: userRecord.uid,
          email: userRecord.email,
          name: userRecord.displayName || userRecord.email.split('@')[0],
          isSuperAdmin: userRecord.email === SUPER_ADMIN_EMAIL,
          role: userRecord.email === SUPER_ADMIN_EMAIL ? 'superadmin' : 'admin'
        };
        
        // Store in Firestore for future use
        await db.collection('users').doc(userRecord.uid).set({
          ...userData,
          createdAt: new Date(),
          updatedAt: new Date()
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
        return {
          authorized: false,
          user: null,
          response: NextResponse.json(
            { error: 'Unauthorized - User not found' },
            { status: 401 }
          )
        };
      }
    }

    // Check if super admin is required
    if (requireSuperAdmin && !userData.isSuperAdmin && userData.email !== SUPER_ADMIN_EMAIL) {
      return {
        authorized: false,
        user: userData,
        response: NextResponse.json(
          { error: 'Forbidden - Super admin privileges required' },
          { status: 403 }
        )
      };
    }

    // User is authenticated and authorized
    return {
      authorized: true,
      user: userData,
      response: null
    };
  } catch (error) {
    console.error('Authentication error:', error);
    return {
      authorized: false,
      user: null,
      response: NextResponse.json(
        { error: 'Internal server error during authentication' },
        { status: 500 }
      )
    };
  }
}