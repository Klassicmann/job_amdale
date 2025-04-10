import { NextResponse } from 'next/server';
import { createJob, searchJobs } from '@/lib/services/jobService';

export async function POST(request) {
    try {
        const jobData = await request.json();

        // Basic validation
        if (!jobData.title || !jobData.company || !jobData.position || !jobData.description) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Create job in Firebase
        const job = await createJob(jobData);

        return NextResponse.json(
            { message: 'Job created successfully', job },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating job:', error);

        return NextResponse.json(
            { message: 'Failed to create job', error: error.message },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url);

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
            jobLanguages: searchParams.get('jobLanguages') ? searchParams.get('jobLanguages').split(',') : []
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
    } catch (error) {
        console.error('Error fetching jobs:', error);

        return NextResponse.json(
            { message: 'Failed to fetch jobs', error: error.message },
            { status: 500 }
        );
    }
}