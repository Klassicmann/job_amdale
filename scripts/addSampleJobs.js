// scripts/addSampleJobs.js
// Script to add sample jobs to the Firebase database

// Import Firebase modules
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc } = require('firebase/firestore');
require('dotenv').config({ path: '../.env.local' });


// Firebase configuration - copy from your firebase.js or similar file
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

// Sample jobs with all filters and unique values
const jobs = [
  {
    title: "Frontend Developer",
    position: "frontend_developer",
    company: "Tech Innovations",
    region: "america",
    country: "USA",
    city: "San Francisco",
    location: "San Francisco, USA",
    description: "Build and maintain web UIs.",
    salary: "120000-140000",
    salaryCurrency: "USD",
    payRange: "120000_140000",
    type: "Full-time",
    category: "Technology",
    experienceLevel: "Mid",
    teamManagement: "No",
    leadershipExperience: "No",
    sector: "Software",
    workOption: "Onsite",
    education: ["Bachelor's Degree"],
    functionalArea: "Development",
    travel: "No",
    jobLanguages: ["English"],
    applyUrl: "https://company.com/jobs/frontend",
    keywords: ["React", "JavaScript", "UI"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Backend Engineer",
    position: "backend_engineer",
    company: "Data Systems",
    region: "america",
    country: "Canada",
    city: "Toronto",
    location: "Toronto, Canada",
    description: "Design and scale backend systems.",
    salary: "110000-130000",
    salaryCurrency: "CAD",
    payRange: "110000_130000",
    type: "Part-time",
    category: "Technology",
    experienceLevel: "Senior",
    teamManagement: "Yes",
    leadershipExperience: "Yes",
    sector: "Data",
    workOption: "Remote",
    education: ["Master's Degree"],
    functionalArea: "Engineering",
    travel: "Yes",
    jobLanguages: ["English", "French"],
    applyUrl: "https://company.com/jobs/backend",
    keywords: ["Node.js", "API", "Cloud"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Product Manager",
    position: "product_manager",
    company: "Market Leaders",
    region: "europe",
    country: "UK",
    city: "London",
    location: "London, UK",
    description: "Lead product strategy and execution.",
    salary: "90000-110000",
    salaryCurrency: "GBP",
    payRange: "90000_110000",
    type: "Contract",
    category: "Business",
    experienceLevel: "Lead",
    teamManagement: "Yes",
    leadershipExperience: "Yes",
    sector: "Marketing",
    workOption: "Hybrid",
    education: ["MBA"],
    functionalArea: "Management",
    travel: "Occasional",
    jobLanguages: ["English"],
    applyUrl: "https://company.com/jobs/pm",
    keywords: ["Leadership", "Strategy", "Agile"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "QA Tester",
    position: "qa_tester",
    company: "QualitySoft",
    region: "europe",
    country: "Germany",
    city: "Berlin",
    location: "Berlin, Germany",
    description: "Test and ensure software quality.",
    salary: "60000-80000",
    salaryCurrency: "EUR",
    payRange: "60000_80000",
    type: "Internship",
    category: "Technology",
    experienceLevel: "Entry",
    teamManagement: "No",
    leadershipExperience: "No",
    sector: "QA",
    workOption: "Onsite",
    education: ["Associate Degree"],
    functionalArea: "Quality Assurance",
    travel: "No",
    jobLanguages: ["German", "English"],
    applyUrl: "https://company.com/jobs/qa",
    keywords: ["Testing", "Automation", "Manual"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "UI/UX Designer",
    position: "uiux_designer",
    company: "DesignHub",
    region: "asia_pacific",
    country: "Australia",
    city: "Sydney",
    location: "Sydney, Australia",
    description: "Create user-centered designs.",
    salary: "85000-95000",
    salaryCurrency: "AUD",
    payRange: "85000_95000",
    type: "Full-time",
    category: "Design",
    experienceLevel: "Mid",
    teamManagement: "No",
    leadershipExperience: "No",
    sector: "Design",
    workOption: "Remote",
    education: ["Bachelor's Degree"],
    functionalArea: "Design",
    travel: "Occasional",
    jobLanguages: ["English"],
    applyUrl: "https://company.com/jobs/uiux",
    keywords: ["Figma", "Sketch", "Wireframes"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "DevOps Engineer",
    position: "devops_engineer",
    company: "CloudOps",
    region: "asia_pacific",
    country: "India",
    city: "Bangalore",
    location: "Bangalore, India",
    description: "Automate and manage cloud infrastructure.",
    salary: "1400000-1800000",
    salaryCurrency: "INR",
    payRange: "1400000_1800000",
    type: "Full-time",
    category: "Technology",
    experienceLevel: "Senior",
    teamManagement: "Yes",
    leadershipExperience: "No",
    sector: "Cloud",
    workOption: "Hybrid",
    education: ["Bachelor's Degree"],
    functionalArea: "Infrastructure",
    travel: "Yes",
    jobLanguages: ["English", "Hindi"],
    applyUrl: "https://company.com/jobs/devops",
    keywords: ["AWS", "Docker", "CI/CD"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Mobile Developer",
    position: "mobile_developer",
    company: "AppMakers",
    region: "america",
    country: "Brazil",
    city: "Sao Paulo",
    location: "Sao Paulo, Brazil",
    description: "Develop mobile applications.",
    salary: "70000-100000",
    salaryCurrency: "BRL",
    payRange: "70000_100000",
    type: "Full-time",
    category: "Technology",
    experienceLevel: "Mid",
    teamManagement: "No",
    leadershipExperience: "No",
    sector: "Mobile",
    workOption: "Onsite",
    education: ["Bachelor's Degree"],
    functionalArea: "Development",
    travel: "No",
    jobLanguages: ["Portuguese", "English"],
    applyUrl: "https://company.com/jobs/mobile",
    keywords: ["Flutter", "Android", "iOS"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Data Scientist",
    position: "data_scientist",
    company: "Insight Analytics",
    region: "america",
    country: "USA",
    city: "New York",
    location: "New York, USA",
    description: "Analyze and interpret complex data.",
    salary: "130000-160000",
    salaryCurrency: "USD",
    payRange: "130000_160000",
    type: "Full-time",
    category: "Analytics",
    experienceLevel: "Senior",
    teamManagement: "Yes",
    leadershipExperience: "Yes",
    sector: "Analytics",
    workOption: "Remote",
    education: ["PhD"],
    functionalArea: "Data Science",
    travel: "Occasional",
    jobLanguages: ["English"],
    applyUrl: "https://company.com/jobs/datascience",
    keywords: ["Python", "ML", "AI"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "HR Specialist",
    position: "hr_specialist",
    company: "PeopleFirst",
    region: "europe",
    country: "Netherlands",
    city: "Amsterdam",
    location: "Amsterdam, Netherlands",
    description: "Manage HR operations and recruitment.",
    salary: "55000-70000",
    salaryCurrency: "EUR",
    payRange: "55000_70000",
    type: "Part-time",
    category: "Human Resources",
    experienceLevel: "Mid",
    teamManagement: "No",
    leadershipExperience: "No",
    sector: "HR",
    workOption: "Onsite",
    education: ["Bachelor's Degree"],
    functionalArea: "HR",
    travel: "No",
    jobLanguages: ["Dutch", "English"],
    applyUrl: "https://company.com/jobs/hr",
    keywords: ["Recruitment", "Payroll", "Training"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    title: "Sales Executive",
    position: "sales_executive",
    company: "Global Sales",
    region: "asia_pacific",
    country: "Singapore",
    city: "Singapore",
    location: "Singapore, Singapore",
    description: "Drive sales and manage client relationships.",
    salary: "80000-120000",
    salaryCurrency: "SGD",
    payRange: "80000_120000",
    type: "Full-time",
    category: "Sales",
    experienceLevel: "Lead",
    teamManagement: "Yes",
    leadershipExperience: "Yes",
    sector: "Sales",
    workOption: "Hybrid",
    education: ["Bachelor's Degree"],
    functionalArea: "Sales",
    travel: "Frequent",
    jobLanguages: ["English", "Mandarin"],
    applyUrl: "https://company.com/jobs/sales",
    keywords: ["CRM", "Negotiation", "Leads"],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// Function to add jobs to the database
async function addJobs() {
  try {
    for (const job of jobs) {
      // Process the job data
      const jobWithTimestamps = {
        ...job,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      
      // Add to Firestore
      await addDoc(jobsCollection, jobWithTimestamps);
      console.log(`Added job: ${job.title}`);
    }
    console.log('All jobs added successfully!');
  } catch (error) {
    console.error('Error adding jobs:', error);
  }
}

// Run the function
addJobs().then(() => {
  console.log("Process completed!");
  process.exit(0);
}).catch(err => {
  console.error("Error in process:", err);
  process.exit(1);
});