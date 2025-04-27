// scripts/populate-jobs-client.js
// Script to populate the Firebase database with sample job listings using client SDK

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
require('dotenv').config({ path: '../.env.local' });

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const jobsCollection = collection(db, 'jobs');

// Sample job data with varied filter values
const sampleJobs = [
  {
    title: "Senior Software Engineer",
    position: "software_engineer",
    company: "TechGiant Inc.",
    country: "united_states",
    city: "san_francisco_ca",
    location: "San Francisco, CA",
    description: "We are looking for a Senior Software Engineer to join our team. You will be responsible for designing, developing, and maintaining high-performance applications.",
    salary: "150000-180000",
    salaryCurrency: "USD",
    payRange: "more_than_120000",
    type: "Full-time",
    category: "Technology",
    experienceLevel: "Senior",
    teamManagement: "Yes",
    leadershipExperience: "Yes",
    sector: "Technology",
    workOption: "Remote",
    education: ["Bachelor's", "Master's"],
    functionalArea: "Engineering",
    travel: "No",
    jobLanguages: ["English"],
    applyUrl: "https://techgiant.com/careers/senior-software-engineer",
    keywords: ["JavaScript", "React", "Node.js", "AWS", "Senior", "Software Engineer"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Junior Frontend Developer",
    position: "software_developer",
    company: "StartupBoost",
    country: "germany",
    city: "berlin_be",
    location: "Berlin, Germany",
    description: "Join our fast-growing startup as a Junior Frontend Developer. You will work on building beautiful user interfaces for our products.",
    salary: "45000-60000",
    salaryCurrency: "USD",
    payRange: "40000_60000",
    type: "Full-time",
    category: "Technology",
    experienceLevel: "Junior",
    teamManagement: "No",
    leadershipExperience: "No",
    sector: "Technology",
    workOption: "Hybrid",
    education: ["Bachelor's"],
    functionalArea: "Engineering",
    travel: "No",
    jobLanguages: ["English", "German"],
    applyUrl: "https://startupboost.com/careers/junior-frontend-developer",
    keywords: ["HTML", "CSS", "JavaScript", "React", "Junior", "Frontend"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Data Scientist",
    position: "data_scientist",
    company: "DataCorp",
    country: "united_states",
    city: "new_york_ny",
    location: "New York, NY",
    description: "DataCorp is seeking a Data Scientist to join our analytics team. You will analyze large datasets and build predictive models.",
    salary: "120000-140000",
    salaryCurrency: "USD",
    payRange: "101000_120000",
    type: "Full-time",
    category: "Data Science",
    experienceLevel: "Mid-level",
    teamManagement: "No",
    leadershipExperience: "No",
    sector: "Technology",
    workOption: "On-site",
    education: ["Master's", "PhD"],
    functionalArea: "Data Science",
    travel: "Occasional",
    jobLanguages: ["English"],
    applyUrl: "https://datacorp.com/careers/data-scientist",
    keywords: ["Python", "R", "Machine Learning", "Statistics", "Data Science"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "DevOps Engineer",
    position: "software_engineer",
    company: "CloudSystems",
    country: "canada",
    city: "toronto",
    location: "Toronto, Canada",
    description: "CloudSystems is looking for a DevOps Engineer to help us build and maintain our cloud infrastructure.",
    salary: "90000-110000",
    salaryCurrency: "USD",
    payRange: "81000_100000",
    type: "Full-time",
    category: "Technology",
    experienceLevel: "Mid-level",
    teamManagement: "No",
    leadershipExperience: "No",
    sector: "Technology",
    workOption: "Remote",
    education: ["Bachelor's"],
    functionalArea: "Engineering",
    travel: "No",
    jobLanguages: ["English"],
    applyUrl: "https://cloudsystems.com/careers/devops-engineer",
    keywords: ["AWS", "Docker", "Kubernetes", "CI/CD", "DevOps"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "UI/UX Designer",
    position: "designer",
    company: "CreativeMinds",
    country: "france",
    city: "paris",
    location: "Paris, France",
    description: "Join our design team as a UI/UX Designer. You will create beautiful and intuitive user interfaces for our products.",
    salary: "70000-85000",
    salaryCurrency: "USD",
    payRange: "61000_80000",
    type: "Full-time",
    category: "Design",
    experienceLevel: "Mid-level",
    teamManagement: "No",
    leadershipExperience: "No",
    sector: "Creative",
    workOption: "Hybrid",
    education: ["Bachelor's"],
    functionalArea: "Design",
    travel: "No",
    jobLanguages: ["English", "French"],
    applyUrl: "https://creativeminds.com/careers/ui-ux-designer",
    keywords: ["UI", "UX", "Figma", "Adobe XD", "Design Systems"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Product Manager",
    position: "product_manager",
    company: "ProductFirst",
    country: "united_states",
    city: "austin_tx",
    location: "Austin, TX",
    description: "ProductFirst is seeking a Product Manager to lead our product development efforts. You will work closely with engineering, design, and marketing teams.",
    salary: "130000-150000",
    salaryCurrency: "USD",
    payRange: "101000_120000",
    type: "Full-time",
    category: "Product",
    experienceLevel: "Senior",
    teamManagement: "Yes",
    leadershipExperience: "Yes",
    sector: "Technology",
    workOption: "Hybrid",
    education: ["Bachelor's", "MBA"],
    functionalArea: "Product Management",
    travel: "Occasional",
    jobLanguages: ["English"],
    applyUrl: "https://productfirst.com/careers/product-manager",
    keywords: ["Product Management", "Agile", "Scrum", "Roadmap", "Strategy"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Marketing Specialist",
    position: "marketing_specialist",
    company: "GrowthHackers",
    country: "united_states",
    city: "miami_fl",
    location: "Miami, FL",
    description: "GrowthHackers is looking for a Marketing Specialist to help us grow our user base. You will be responsible for creating and executing marketing campaigns.",
    salary: "55000-70000",
    salaryCurrency: "USD",
    payRange: "61000_80000",
    type: "Full-time",
    category: "Marketing",
    experienceLevel: "Junior",
    teamManagement: "No",
    leadershipExperience: "No",
    sector: "Marketing",
    workOption: "On-site",
    education: ["Bachelor's"],
    functionalArea: "Marketing",
    travel: "No",
    jobLanguages: ["English", "Spanish"],
    applyUrl: "https://growthhackers.com/careers/marketing-specialist",
    keywords: ["Digital Marketing", "Social Media", "SEO", "Content Marketing"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Mechanical Engineer",
    position: "mechanical_engineer",
    company: "InnovateEngineering",
    country: "germany",
    city: "munich",
    location: "Munich, Germany",
    description: "InnovateEngineering is seeking a Mechanical Engineer to join our R&D team. You will design and develop mechanical components for our products.",
    salary: "75000-90000",
    salaryCurrency: "USD",
    payRange: "81000_100000",
    type: "Full-time",
    category: "Engineering",
    experienceLevel: "Mid-level",
    teamManagement: "No",
    leadershipExperience: "No",
    sector: "Manufacturing",
    workOption: "On-site",
    education: ["Bachelor's", "Master's"],
    functionalArea: "Engineering",
    travel: "Occasional",
    jobLanguages: ["English", "German"],
    applyUrl: "https://innovateengineering.com/careers/mechanical-engineer",
    keywords: ["CAD", "Mechanical Design", "Product Development", "Engineering"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Sales Representative",
    position: "sales_representative",
    company: "SalesForce",
    country: "united_states",
    city: "chicago_il",
    location: "Chicago, IL",
    description: "SalesForce is looking for a Sales Representative to join our team. You will be responsible for generating leads and closing deals.",
    salary: "50000-70000",
    salaryCurrency: "USD",
    payRange: "61000_80000",
    type: "Full-time",
    category: "Sales",
    experienceLevel: "Junior",
    teamManagement: "No",
    leadershipExperience: "No",
    sector: "Sales",
    workOption: "Hybrid",
    education: ["Bachelor's"],
    functionalArea: "Sales",
    travel: "Frequent",
    jobLanguages: ["English"],
    applyUrl: "https://salesforce.com/careers/sales-representative",
    keywords: ["Sales", "B2B", "Lead Generation", "CRM", "Negotiation"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Project Manager",
    position: "project_manager",
    company: "GlobalProjects",
    country: "canada",
    city: "vancouver",
    location: "Vancouver, Canada",
    description: "GlobalProjects is seeking a Project Manager to oversee our client projects. You will be responsible for planning, executing, and closing projects.",
    salary: "95000-115000",
    salaryCurrency: "USD",
    payRange: "81000_100000",
    type: "Full-time",
    category: "Project Management",
    experienceLevel: "Senior",
    teamManagement: "Yes",
    leadershipExperience: "Yes",
    sector: "Consulting",
    workOption: "Hybrid",
    education: ["Bachelor's", "PMP"],
    functionalArea: "Project Management",
    travel: "Occasional",
    jobLanguages: ["English"],
    applyUrl: "https://globalprojects.com/careers/project-manager",
    keywords: ["Project Management", "Agile", "Scrum", "PMP", "Leadership"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Function to add jobs to the database
async function addJobsToDatabase() {
  console.log('Starting to add jobs to the database...');
  
  try {
    // Add each job to the database
    for (const job of sampleJobs) {
      await addDoc(jobsCollection, job);
      console.log(`Added job: ${job.title}`);
    }
    
    console.log('Successfully added all jobs to the database!');
  } catch (error) {
    console.error('Error adding jobs to the database:', error);
  }
}

// Run the function
addJobsToDatabase()
  .then(() => {
    console.log('Database population complete');
    process.exit(0);
  })
  .catch(error => {
    console.error('Failed to populate database:', error);
    process.exit(1);
  });
