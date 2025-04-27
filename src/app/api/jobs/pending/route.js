// src/app/api/jobs/pending/route.js
import { NextResponse } from 'next/server';
import { auth } from '@/lib/firebase-admin';
import { db } from '@/lib/firebase-admin';

const SUPER_ADMIN_EMAIL = 'klassicmann0@gmail.com';

export async function GET(request) {
  try {
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
        { error: 'Only super admins can view pending jobs' },
        { status: 403 }
      );
    }

    // Query for pending jobs
    const jobsSnapshot = await db.collection('jobs')
      .where('status', '==', 'pending')
      .orderBy('createdAt', 'desc')
      .get();

    const jobs = [];
    
    jobsSnapshot.forEach(doc => {
      jobs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    console.error('Error fetching pending jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pending jobs' },
      { status: 500 }
    );
  }
}