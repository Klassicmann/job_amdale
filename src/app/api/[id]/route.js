import { NextResponse } from 'next/server';
import { getJobById, updateJob, deleteJob } from '@/lib/services/jobService';

// GET a specific job by ID
export async function GET(request, { params }) {
    try {
        const { id } = params;

        const job = await getJobById(id);

        if (!job) {
            return NextResponse.json(
                { message: 'Job not found' },
                { status: 404 }
            );
        }

        return NextResponse.json(job, { status: 200 });
    } catch (error) {
        console.error('Error fetching job:', error);

        return NextResponse.json(
            { message: 'Failed to fetch job', error: error.message },
            { status: 500 }
        );
    }
}

// UPDATE a job by ID
export async function PUT(request, { params }) {
    try {
        const { id } = params;
        const jobData = await request.json();

        // Check if job exists
        const existingJob = await getJobById(id);

        if (!existingJob) {
            return NextResponse.json(
                { message: 'Job not found' },
                { status: 404 }
            );
        }

        // Update job
        const updatedJob = await updateJob(id, jobData);

        return NextResponse.json(
            { message: 'Job updated successfully', job: updatedJob },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error updating job:', error);

        return NextResponse.json(
            { message: 'Failed to update job', error: error.message },
            { status: 500 }
        );
    }
}

// DELETE a job by ID
export async function DELETE(request, { params }) {
    try {
        const { id } = params;

        // Check if job exists
        const existingJob = await getJobById(id);

        if (!existingJob) {
            return NextResponse.json(
                { message: 'Job not found' },
                { status: 404 }
            );
        }

        // Delete job
        await deleteJob(id);

        return NextResponse.json(
            { message: 'Job deleted successfully' },
            { status: 200 }
        );
    } catch (error) {
        console.error('Error deleting job:', error);

        return NextResponse.json(
            { message: 'Failed to delete job', error: error.message },
            { status: 500 }
        );
    }
}