// src/lib/models/job.js
export const jobModel = {
  // Fields that will be stored in Firestore
  fields: [
    'title',
    'position',
    'company',
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
    'updatedAt'
  ],
  
  // Create a new job object
  create: (data) => {
    return {
      title: data.title || '',
      position: data.position || '',
      company: data.company || '',
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
      updatedAt: data.updatedAt || new Date().toISOString()
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
  }
};