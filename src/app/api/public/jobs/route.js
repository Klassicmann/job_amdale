// src/app/api/public/jobs/route.js
import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase-admin';

export async function GET(request) {
  try {
    // Parse query parameters for filtering
    const { searchParams } = new URL(request.url);
    const keyword = searchParams.get('keyword');
    const location = searchParams.get('location');
    const sector = searchParams.get('sector');
    const workOption = searchParams.get('workOption');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Create base query - only get published jobs
    let jobsQuery = db.collection('jobs').where('status', '==', 'published');
    
    // Apply filters if provided
    if (keyword) {
      // Apply keyword filter to title, description, or keywords array
      jobsQuery = jobsQuery.where('keywords', 'array-contains', keyword.toLowerCase());
    }
    
    if (location) {
      jobsQuery = jobsQuery.where('location', '==', location);
    }
    
    if (sector) {
      jobsQuery = jobsQuery.where('sector', '==', sector);
    }
    
    if (workOption) {
      jobsQuery = jobsQuery.where('workOption', '==', workOption);
    }
    
    // Order by creation date (newest first)
    jobsQuery = jobsQuery.orderBy('createdAt', 'desc');
    
    // Calculate pagination
    const startAt = (page - 1) * limit;
    
    // Execute count query for pagination
    const countSnapshot = await jobsQuery.count().get();
    const totalCount = countSnapshot.data().count;
    
    // Apply pagination limits
    const paginatedQuery = jobsQuery.limit(limit).offset(startAt);
    
    // Execute main query
    const jobsSnapshot = await paginatedQuery.get();
    
    // Format response
    const jobs = [];
    jobsSnapshot.forEach(doc => {
      // Only include necessary fields for public view
      const { 
        title, 
        company, 
        location, 
        description, 
        type, 
        salary, 
        experienceLevel,
        workOption,
        sector,
        applyUrl,
        createdAt,
        updatedAt,
        keywords
      } = doc.data();
      
      jobs.push({
        id: doc.id,
        title,
        company,
        location,
        description,
        type,
        salary,
        experienceLevel,
        workOption,
        sector,
        applyUrl,
        createdAt,
        updatedAt,
        keywords
      });
    });
    
    // Calculate pagination data
    const totalPages = Math.ceil(totalCount / limit);
    
    return NextResponse.json({
      jobs,
      pagination: {
        total: totalCount,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Error fetching jobs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch jobs' },
      { status: 500 }
    );
  }
}
