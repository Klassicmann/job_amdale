import { NextResponse } from 'next/server';
import { createJob, searchJobs } from '@/lib/services/jobService';
import { auth } from '@/lib/firebase-admin';
import { db } from '@/lib/firebase-admin';

const SUPER_ADMIN_EMAIL = 'klassicmann0@gmail.com';

export async function POST(request) {
    try {
        // Verify authentication
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
        } catch (err) {
            console.error('Token verification error:', err);
            return NextResponse.json(
                { error: 'Invalid authentication token' },
                { status: 401 }
            );
        }
        
        // Parse request body
        const jobData = await request.json();
        
        // Basic validation
        if (!jobData.title || !jobData.company || !jobData.position || !jobData.description) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }
        
        // Check if user is super admin
        const isSuperAdmin = decodedToken.email === SUPER_ADMIN_EMAIL;
        
        // Add creator information and approval status
        jobData.createdBy = decodedToken.uid;
        jobData.creatorEmail = decodedToken.email;
        jobData.isSuperAdmin = isSuperAdmin;
        jobData.isApproved = isSuperAdmin; // Auto-approve if super admin
        jobData.status = isSuperAdmin ? 'published' : 'pending';
        
        if (isSuperAdmin) {
            jobData.approvedBy = decodedToken.uid;
            jobData.approvedAt = new Date().toISOString();
        }

        // Create job in Firebase using existing service
        const job = await createJob(jobData);

        return NextResponse.json(
            { 
                message: isSuperAdmin ? 'Job created and published successfully' : 'Job created and pending approval',
                job
            },
            { status: 201 }
        );
    } catch (err) {
        console.error('Error creating job:', err);

        return NextResponse.json(
            { message: 'Failed to create job', error: err.message },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);
        
        // Check for status or createdBy filter from admin users
        const status = searchParams.get('status');
        const createdBy = searchParams.get('createdBy');
        
        // Handle case where we need to filter by status or creator (for admin usage)
        if (status || createdBy) {
            // We'd need authentication for these filters
            const authHeader = request.headers.get('authorization');
            if (authHeader && authHeader.startsWith('Bearer ')) {
                const token = authHeader.split('Bearer ')[1];
                try {
                    const decodedToken = await auth.verifyIdToken(token);
                    
                    // Create base query
                    let jobsQuery = db.collection('jobs');
                    
                    // Apply filters
                    if (status) {
                        jobsQuery = jobsQuery.where('status', '==', status);
                    } else {
                        // Default to showing published jobs for regular admins
                        // and all jobs for super admin
                        if (decodedToken.email !== SUPER_ADMIN_EMAIL) {
                            jobsQuery = jobsQuery.where('status', '==', 'published');
                        }
                    }
                    
                    // Filter by creator if requested
                    if (createdBy) {
                        jobsQuery = jobsQuery.where('createdBy', '==', createdBy);
                    }
                    
                    // Order by creation date
                    jobsQuery = jobsQuery.orderBy('createdAt', 'desc');
                    
                    // Execute query
                    const jobsSnapshot = await jobsQuery.get();
                    
                    // Format response
                    const jobs = [];
                    jobsSnapshot.forEach(doc => {
                        jobs.push({
                            id: doc.id,
                            ...doc.data()
                        });
                    });
                    
                    return NextResponse.json({ jobs, total: jobs.length });
                } catch (err) {
                    console.error('Error verifying token:', err);
                }
            }
        }

        // Extract search query
        const query = searchParams.get('q') || '';

        // Extract filters from search params
        const filters = {
            // Basic filters
            position: searchParams.get('position') || '',
            country: searchParams.get('country') || '',
            city: searchParams.get('city') || '',
            category: searchParams.get('category') || '',
            type: searchParams.get('type') || '',

            // Experience filters
            experienceLevel: searchParams.get('experienceLevel') || '',
            teamManagement: searchParams.get('teamManagement') || '',
            leadershipExperience: searchParams.get('leadershipExperience') || '',

            // Work arrangement filters
            sector: searchParams.get('sector') || '',
            workOption: searchParams.get('workOption') || '',
            functionalArea: searchParams.get('functionalArea') || '',
            travel: searchParams.get('travel') || '',

            // Compensation filters
            salaryCurrency: searchParams.get('salaryCurrency') || '',
            payRange: searchParams.get('payRange') || '',

            // Other filters
            education: searchParams.get('education') ? searchParams.get('education').split(',') : [],
            jobLanguages: searchParams.get('jobLanguages') ? searchParams.get('jobLanguages').split(',') : [],
            
            // Always filter by published status for public searches
            status: 'published'
        };

        // Remove empty filters
        Object.keys(filters).forEach(key => {
            if (!filters[key] || (Array.isArray(filters[key]) && filters[key].length === 0)) {
                delete filters[key];
            }
        });

        // Get limit parameter
        const limit = parseInt(searchParams.get('limit') || '20', 10);

        // Search jobs with query and filters
        const jobs = await searchJobs(query, filters, limit);

        return NextResponse.json(
            { jobs, total: jobs.length },
            { status: 200 }
        );
    } catch (err) {
        console.error('Error fetching jobs:', err);

        return NextResponse.json(
            { message: 'Failed to fetch jobs', error: err.message },
            { status: 500 }
        );
    }
}