// src/lib/models/job.js
export const jobModel = {
  // Fields that will be stored in Firestore
  fields: [
    'title',
    'titleLower', // Lowercase version of title for case-insensitive search
    'position',
    'company',
    'region', // Region (e.g., America, Europe, Asia)
    'country',
    'city',
    'location',
    'description',
    'salary',
    'salaryCurrency',
    'payRange',
    'type',
    'category',
    'experienceLevel',
    'teamManagement',
    'leadershipExperience',
    'sector',
    'workOption',
    'education',
    'functionalArea',
    'travel',
    'jobLanguages',
    'applyUrl',
    'keywords',
    'createdAt',
    'updatedAt',
    // New fields for tracking creator and approval status
    'createdBy', // UID of the user who created the job
    'creatorEmail', // Email of the user who created the job (for easier reference)
    'isApproved', // Whether the job is approved by super admin
    'approvedBy', // UID of the super admin who approved the job
    'approvedAt', // When the job was approved
    'status'  // 'pending', 'approved', 'rejected', 'published'
  ],
  
  // Create a new job object
  create: (data) => {
    const title = data.title || '';
    return {
      title: title,
      titleLower: title.toLowerCase(), // Store lowercase version for searching
      position: data.position || '',
      company: data.company || '',
      region: data.region || '', // Region field
      country: data.country || '',
      city: data.city || '',
      location: data.location || '',
      description: data.description || '',
      salary: data.salary || '',
      salaryCurrency: data.salaryCurrency || 'USD',
      payRange: data.payRange || '',
      type: data.type || 'Full-time',
      category: data.category || 'Technology',
      experienceLevel: data.experienceLevel || '',
      teamManagement: data.teamManagement || 'No',
      leadershipExperience: data.leadershipExperience || 'No',
      sector: data.sector || '',
      workOption: data.workOption || '',
      education: data.education || [],
      functionalArea: data.functionalArea || '',
      travel: data.travel || 'No',
      jobLanguages: data.jobLanguages || [],
      applyUrl: data.applyUrl || '',
      keywords: data.keywords || [],
      createdAt: data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt || new Date().toISOString(),
      
      // New fields for tracking and approval
      createdBy: data.createdBy || null,
      creatorEmail: data.creatorEmail || null,
      isApproved: data.isSuperAdmin ? true : false, // Auto-approve for super admin
      approvedBy: data.isSuperAdmin ? data.createdBy : null,
      approvedAt: data.isSuperAdmin ? new Date().toISOString() : null,
      status: data.isSuperAdmin ? 'published' : 'pending' // Default to pending unless created by super admin
    };
  },
  
  // Validate job data
  validate: (data) => {
    const errors = {};
    
    if (!data.title) errors.title = 'Title is required';
    if (!data.position) errors.position = 'Position is required';
    if (!data.company) errors.company = 'Company is required';
    if (!data.country) errors.country = 'Country is required';
    if (!data.description) errors.description = 'Description is required';
    if (!data.experienceLevel) errors.experienceLevel = 'Experience level is required';
    if (!data.applyUrl) errors.applyUrl = 'Application URL is required';
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors
    };
  },
  
  // Approve a job (only for super admin)
  approve: (job, superAdminUid) => {
    if (!job || !superAdminUid) return job;

    return {
      ...job,
      isApproved: true,
      approvedBy: superAdminUid,
      approvedAt: new Date().toISOString(),
      status: 'published',
      updatedAt: new Date().toISOString()
    };
  },
  
  // Reject a job (only for super admin)
  reject: (job, superAdminUid, reason) => {
    if (!job || !superAdminUid) return job;

    return {
      ...job,
      isApproved: false,
      rejectedBy: superAdminUid,
      rejectedAt: new Date().toISOString(),
      rejectionReason: reason || '',
      status: 'rejected',
      updatedAt: new Date().toISOString()
    };
  }
};