'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ClientProviders from '@/components/providers/ClientProviders';

const EditJobPage = () => {
    const router = useRouter();
    const { id } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [job, setJob] = useState(null);

    // State for country and city selection
    const [selectedCountry, setSelectedCountry] = useState('');
    const [availableCities, setAvailableCities] = useState([]);

    // Data for dropdowns
    const positions = [
        "Software Developer with focus on automation & robotics",
        "AI/Machine Learning Engineer",
        "Data Scientist",
        "Software Engineer",
        "Renewable Energy Engineer",
        "Renewable Energy Researcher",
        "Renewable Energy Technician",
        "Completions Engineer",
        "Petroleum Engineer",
        "Drilling Engineer",
        "Structural Engineer",
        "Mechanical Engineer",
        "Nuclear Engineer",
        "Aerospace Engineer",
        "Chemical Engineer",
        "Civil Engineer",
        "Electrical Engineer",
        "Industrial Engineer",
        "Materials Engineer",
        "Structural Engineer",
        "Architectural Engineer",
        "Manufacturing Engineer",
        "Automotive Engineer",
        "R&D Manager",
        "Manager, Software Engineering",
        "Director of Engineering"
    ];

    // Countries and cities
    const countriesWithCities = {
        "United States": [
            "Albuquerque, NM", "Anaheim, CA", "Arlington, TX", "Austin, TX", "Bellevue, WA",
            "Boston, MA", "Boulder, CO", "Cambridge, MA", "Chicago, IL", "Columbus, IN",
            "Dallas, TX", "Detroit, MI", "Fort Lauderdale, FL", "Fort Worth, TX", "Fremont, CA",
            "Hayward, CA", "Houston, TX", "Huntsville, AL", "Long Beach, CA", "Los Angeles, CA",
            "Menlo Park, CA", "Miami, FL", "Midland, TX", "New York, NY", "Newark, NJ",
            "Oakland, CA", "Palm Bay, FL", "Pasadena, TX", "Philadelphia, PA", "Phoenix, AZ",
            "Raleigh, NC", "Round Rock, TX", "San Francisco, CA", "San Jose, CA", "Seattle, WA",
            "Spring, TX", "Sugarland, TX", "Sunnyvale, CA", "Tacoma, WA", "Walla Walla, WA",
            "Washington, DC"
        ],
        "Germany": [
            "Berlin, BE", "Düsseldorf, NW", "Essen, NW", "Frankfurt, HE", "Grasbrunn, BY",
            "Hamburg, HH", "Munich, BY", "Neckarsulm, BW", "Rostock, MV", "Stuttgart, BW"
        ],
        "Canada": [
            "Burlington, ON", "Burnaby, BC", "Calgary, AB", "Edmonton, AB", "Halifax, NS",
            "Markham, ON", "Missisauga, ON", "Montréal, QC", "Ottawa, ON", "Toronto, ON",
            "Vancouver, BC", "Winnipeg, MB"
        ],
        "France": [
            "Courbevoie", "Lille", "Lyon", "Nantes", "Paris", "Saint Ouen", "Toulouse"
        ]
    };

    // Experience levels
    const experienceLevels = [
        "Less than 1 year",
        "1 to 2 years",
        "3 to 5 years",
        "6 to 10 years",
        "More than 10 years"
    ];

    // Leadership experience levels
    const leadershipExperienceLevels = [
        "No",
        "Less than 1 year",
        "1 to 2 years",
        "3 to 5 years",
        "6 to 10 years",
        "More than 10 years"
    ];

    // Sectors
    const sectors = [
        "Technology (Artificial Intelligence)",
        "Technology (Data Analytics)",
        "Technology (Cybersecurity)",
        "Aerospace",
        "Energy (Oil)",
        "Energy (Nuclear)",
        "Energy (Renewable)",
        "Construction",
        "Electronics",
        "Automotive",
        "Industrial Manufacturing",
        "Chemistry"
    ];

    // Work options
    const workOptions = ["On site", "Remote", "Hybrid"];

    // Education options
    const educationOptions = [
        "Bachelor's degree in computer science or equivalent",
        "Master's degree in computer science or equivalent",
        "PhD in computer science or equivalent",
        "Bachelor's degree in engineering or equivalent",
        "Master's degree in engineering or equivalent",
        "PhD in engineering or equivalent",
        "MBA or equivalent"
    ];

    // Functional areas
    const functionalAreas = [
        "Product Development/ Engineering",
        "R&D/ Innovation",
        "Production",
        "Plant Design & Maintenance",
        "Quality Management",
        "Logistics",
        "Information Technology"
    ];

    // Travel options
    const travelOptions = [
        "No",
        "up to 25 % of the working time",
        "25 to 50 % of the working time",
        "more than 50 % of the working time"
    ];

    // Salary currencies
    const salaryCurrencies = ["USD", "Euro", "CAD", "Not specified"];

    // Pay ranges
    const payRanges = [
        "40,000 - 60,000",
        "61,000 - 80,000",
        "81,000 - 100,000",
        "101,000 - 120,000",
        "more than 120,000",
        "Not specified"
    ];

    // Job languages
    const jobLanguages = ["English", "German", "French"];

    // Form data state
    const [formData, setFormData] = useState({
        title: '',
        position: '',
        company: '',
        country: '',
        city: '',
        location: '',
        type: 'Full-time',
        salary: '',
        salaryCurrency: 'USD',
        payRange: '',
        category: 'Technology',
        experienceLevel: '',
        teamManagement: 'No',
        leadershipExperience: 'No',
        sector: '',
        workOption: '',
        education: [],
        functionalArea: '',
        travel: 'No',
        jobLanguages: [],
        description: '',
        applyUrl: '',
        keywords: ''
    });

    // Fetch job data
    useEffect(() => {
        const fetchJob = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`/api/jobs/${id}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch job');
                }

                const jobData = await response.json();
                setJob(jobData);

                // Parse location to extract country and city if possible
                let country = '';
                let city = '';

                if (jobData.country) {
                    country = jobData.country;
                } else if (jobData.location && jobData.location.includes(',')) {
                    const parts = jobData.location.split(',');
                    if (parts.length > 1) {
                        city = parts[0].trim();
                        country = parts[1].trim();
                    }
                }

                // Set selected country for the city dropdown
                if (country) {
                    setSelectedCountry(country);
                }

                // Format keywords back to comma-separated string
                setFormData({
                    ...jobData,
                    country: country || '',
                    city: city || '',
                    keywords: Array.isArray(jobData.keywords) ? jobData.keywords.join(', ') : jobData.keywords || '',
                    education: jobData.education || [],
                    jobLanguages: jobData.jobLanguages || []
                });
            } catch (err) {
                console.error('Error fetching job:', err);
                setError('Failed to fetch job. ' + err.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) {
            fetchJob();
        }
    }, [id]);

    // Update available cities when country changes
    useEffect(() => {
        if (selectedCountry && countriesWithCities[selectedCountry]) {
            setAvailableCities(countriesWithCities[selectedCountry]);
            // Reset city selection when country changes if city doesn't exist in the new country
            if (formData.city && !countriesWithCities[selectedCountry].includes(formData.city)) {
                setFormData(prev => ({
                    ...prev,
                    city: ''
                }));
            }
        } else {
            setAvailableCities([]);
        }
    }, [selectedCountry, formData.city]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'country') {
            setSelectedCountry(value);
        }

        // Handle checkbox arrays (multiple selections like education and languages)
        if (type === 'checkbox') {
            if (name === 'education') {
                setFormData(prev => {
                    const updatedEducation = [...prev.education];
                    if (checked) {
                        // Add to array if not already included
                        if (!updatedEducation.includes(value)) {
                            // Limit to 2 choices for education
                            if (updatedEducation.length < 2) {
                                updatedEducation.push(value);
                            }
                        }
                    } else {
                        // Remove from array
                        const index = updatedEducation.indexOf(value);
                        if (index > -1) {
                            updatedEducation.splice(index, 1);
                        }
                    }
                    return { ...prev, education: updatedEducation };
                });
            } else if (name === 'jobLanguages') {
                setFormData(prev => {
                    const updatedLanguages = [...prev.jobLanguages];
                    if (checked) {
                        // Add to array if not already included
                        if (!updatedLanguages.includes(value)) {
                            // Limit to 2 choices for job languages
                            if (updatedLanguages.length < 2) {
                                updatedLanguages.push(value);
                            }
                        }
                    } else {
                        // Remove from array
                        const index = updatedLanguages.indexOf(value);
                        if (index > -1) {
                            updatedLanguages.splice(index, 1);
                        }
                    }
                    return { ...prev, jobLanguages: updatedLanguages };
                });
            }
            return;
        }

        // Special handling for location
        if (name === 'country' || name === 'city') {
            const newCountry = name === 'country' ? value : formData.country;
            const newCity = name === 'city' ? value : formData.city;

            setFormData(prev => ({
                ...prev,
                [name]: value,
                location: newCity ? `${newCity}, ${newCountry}` : newCountry
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            // Validate required fields
            if (!formData.title || !formData.company || !formData.position) {
                throw new Error('Please fill in all required fields');
            }

            // Format keywords as an array
            const formattedData = {
                ...formData,
                keywords: formData.keywords ? formData.keywords.split(',').map(keyword => keyword.trim()) : [],
                // Ensure location is properly formatted
                location: formData.location || (formData.city ? `${formData.city}, ${formData.country}` : formData.country)
            };

            // Send the data to our API endpoint
            const response = await fetch(`/api/jobs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formattedData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            setSuccess(true);

            // Redirect after a short delay
            setTimeout(() => {
                router.push('/admin/jobs');
            }, 2000);

        } catch (err) {
            console.error('Error updating job:', err);
            setError(err.message || 'Failed to update job');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <ClientProviders>
                <div className="container mx-auto px-4 pt-32 pb-20">
                    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
                        <div className="animate-pulse">
                            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                            <div className="h-10 bg-gray-200 rounded w-1/4"></div>
                        </div>
                    </div>
                </div>
            </ClientProviders>
        );
    }

    if (error && !job) {
        return (
            <ClientProviders>
                <div className="container mx-auto px-4 pt-32 pb-20">
                    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8 text-center">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Error</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <Link
                            href="/admin/jobs"
                            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition duration-200"
                        >
                            Back to Jobs
                        </Link>
                    </div>
                </div>
            </ClientProviders>
        );
    }

    return (
        <ClientProviders>
            <div className="container mx-auto px-4 pt-32 pb-20">
                <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md p-8">
                    <div className="mb-6 flex justify-between items-center">
                        <h1 className="text-3xl font-bold text-gray-800">Edit Job</h1>
                        <Link
                            href="/admin/jobs"
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded transition duration-200"
                        >
                            Back to Jobs
                        </Link>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="mb-6 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
                            Job updated successfully! Redirecting...
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Basic Information</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="title" className="block text-gray-700 font-medium mb-2">
                                        Job Title*
                                    </label>
                                    <input
                                        type="text"
                                        id="title"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. Senior Frontend Developer"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="position" className="block text-gray-700 font-medium mb-2">
                                        Position*
                                    </label>
                                    <select
                                        id="position"
                                        name="position"
                                        value={formData.position}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Position</option>
                                        {positions.map((position) => (
                                            <option key={position} value={position}>
                                                {position}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="company" className="block text-gray-700 font-medium mb-2">
                                        Company Name*
                                    </label>
                                    <input
                                        type="text"
                                        id="company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. Tech Innovations"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="applyUrl" className="block text-gray-700 font-medium mb-2">
                                        Application URL*
                                    </label>
                                    <input
                                        type="url"
                                        id="applyUrl"
                                        name="applyUrl"
                                        value={formData.applyUrl}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. https://example.com/apply"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Location</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="country" className="block text-gray-700 font-medium mb-2">
                                        Country*
                                    </label>
                                    <select
                                        id="country"
                                        name="country"
                                        value={formData.country}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Country</option>
                                        {Object.keys(countriesWithCities).map((country) => (
                                            <option key={country} value={country}>
                                                {country}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="city" className="block text-gray-700 font-medium mb-2">
                                        City
                                    </label>
                                    <select
                                        id="city"
                                        name="city"
                                        value={formData.city}
                                        onChange={handleChange}
                                        disabled={!selectedCountry}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select City</option>
                                        {availableCities.map((city) => (
                                            <option key={city} value={city}>
                                                {city}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Experience & Requirements</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="experienceLevel" className="block text-gray-700 font-medium mb-2">
                                        Experience Level*
                                    </label>
                                    <select
                                        id="experienceLevel"
                                        name="experienceLevel"
                                        value={formData.experienceLevel}
                                        onChange={handleChange}
                                        required
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Experience Level</option>
                                        {experienceLevels.map((level) => (
                                            <option key={level} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="teamManagement" className="block text-gray-700 font-medium mb-2">
                                        Team Management Experience
                                    </label>
                                    <select
                                        id="teamManagement"
                                        name="teamManagement"
                                        value={formData.teamManagement}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="No">No</option>
                                        <option value="Yes">Yes</option>
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="leadershipExperience" className="block text-gray-700 font-medium mb-2">
                                        Leadership Experience
                                    </label>
                                    <select
                                        id="leadershipExperience"
                                        name="leadershipExperience"
                                        value={formData.leadershipExperience}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {leadershipExperienceLevels.map((level) => (
                                            <option key={level} value={level}>
                                                {level}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="sector" className="block text-gray-700 font-medium mb-2">
                                        Sector
                                    </label>
                                    <select
                                        id="sector"
                                        name="sector"
                                        value={formData.sector}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Sector</option>
                                        {sectors.map((sector) => (
                                            <option key={sector} value={sector}>
                                                {sector}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Work Arrangements</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="workOption" className="block text-gray-700 font-medium mb-2">
                                        Work Option
                                    </label>
                                    <select
                                        id="workOption"
                                        name="workOption"
                                        value={formData.workOption}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Work Option</option>
                                        {workOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="functionalArea" className="block text-gray-700 font-medium mb-2">
                                        Functional Area
                                    </label>
                                    <select
                                        id="functionalArea"
                                        name="functionalArea"
                                        value={formData.functionalArea}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Functional Area</option>
                                        {functionalAreas.map((area) => (
                                            <option key={area} value={area}>
                                                {area}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="travel" className="block text-gray-700 font-medium mb-2">
                                        Travel Requirements
                                    </label>
                                    <select
                                        id="travel"
                                        name="travel"
                                        value={formData.travel}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {travelOptions.map((option) => (
                                            <option key={option} value={option}>
                                                {option}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
                                        Job Type
                                    </label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="Full-time">Full-time</option>
                                        <option value="Part-time">Part-time</option>
                                        <option value="Contract">Contract</option>
                                        <option value="Internship">Internship</option>
                                        <option value="Temporary">Temporary</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Education Requirements</h2>
                            <p className="text-sm text-gray-600 mb-2">Select up to 2 education requirements:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {educationOptions.map((edu) => (
                                    <div key={edu} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`edu-${edu}`}
                                            name="education"
                                            value={edu}
                                            checked={formData.education.includes(edu)}
                                            onChange={handleChange}
                                            disabled={!formData.education.includes(edu) && formData.education.length >= 2}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor={`edu-${edu}`} className="ml-2 text-sm text-gray-700">
                                            {edu}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Compensation</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="salaryCurrency" className="block text-gray-700 font-medium mb-2">
                                        Salary Currency
                                    </label>
                                    <select
                                        id="salaryCurrency"
                                        name="salaryCurrency"
                                        value={formData.salaryCurrency}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {salaryCurrencies.map((currency) => (
                                            <option key={currency} value={currency}>
                                                {currency}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="payRange" className="block text-gray-700 font-medium mb-2">
                                        Pay Range
                                    </label>
                                    <select
                                        id="payRange"
                                        name="payRange"
                                        value={formData.payRange}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select Pay Range</option>
                                        {payRanges.map((range) => (
                                            <option key={range} value={range}>
                                                {range}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="salary" className="block text-gray-700 font-medium mb-2">
                                        Exact Salary (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        id="salary"
                                        name="salary"
                                        value={formData.salary}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="e.g. $120,000 - $140,000"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Languages</h2>
                            <p className="text-sm text-gray-600 mb-2">Select up to 2 job languages:</p>
                            <div className="flex flex-wrap gap-4">
                                {jobLanguages.map((lang) => (
                                    <div key={lang} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            id={`lang-${lang}`}
                                            name="jobLanguages"
                                            value={lang}
                                            checked={formData.jobLanguages.includes(lang)}
                                            onChange={handleChange}
                                            disabled={!formData.jobLanguages.includes(lang) && formData.jobLanguages.length >= 2}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor={`lang-${lang}`} className="ml-2 text-sm text-gray-700">
                                            {lang}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="mb-6">
                            <h2 className="text-xl font-semibold mb-4 text-gray-800">Keywords & Description</h2>
                            <div>
                                <label htmlFor="keywords" className="block text-gray-700 font-medium mb-2">
                                    Keywords (comma separated)
                                </label>
                                <input
                                    type="text"
                                    id="keywords"
                                    name="keywords"
                                    value={formData.keywords}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. React, JavaScript, Frontend"
                                />
                            </div>

                            <div className="mt-4">
                                <label htmlFor="description" className="block text-gray-700 font-medium mb-2">
                                    Job Description*
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    required
                                    rows="10"
                                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter detailed job description here..."
                                ></textarea>
                                <p className="text-sm text-gray-500 mt-1">
                                    Use line breaks to format the description. Basic Markdown is supported.
                                </p>
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                                    }`}
                            >
                                {isSubmitting ? 'Updating Job...' : 'Update Job'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </ClientProviders>
    );
};

export default EditJobPage;