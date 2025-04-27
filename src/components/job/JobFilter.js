'use client';

import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const JobFilter = ({ filters, onChange, onClear, onFilter = () => {} }) => {
    const [expandedSections, setExpandedSections] = useState({
        positionSought: false,
        region: false,
        country: false,
        city: false,
        experienceLevel: false,
        teamManagement: false,
        leadership: false,
        sector: false,
        workOptions: false,
        education: false,
        functionalArea: false,
        travel: false,
        salaryCurrency: false,
        payRange: false,
        jobLanguage: false,
        keyTechnicalSkills: false
    });
    
    // State to track the selected country for city filtering
    const [selectedCountry, setSelectedCountry] = useState(null);

    const [priceRange, setPriceRange] = useState({
        min: filters.minBudget || 0,
        max: filters.maxBudget || 20000
    });

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        
        // If 'all' is selected, clear the filter
        if (value === 'all') {
            onChange({
                ...filters,
                [name]: []
            });
            
            // If this is the country filter being cleared, also clear the city filter
            if (name === 'countrys') {
                setSelectedCountry(null);
                onChange({
                    ...filters,
                    [name]: [],
                    citys: []
                });
            }
            return;
        }
        
        // Set the selected value
        onChange({
            ...filters,
            [name]: [value]
        });
        
        // If this is the country filter, update the selected country for city filtering
        if (name === 'countrys') {
            setSelectedCountry(value);
            // Also clear any selected cities when changing country
            onChange({
                ...filters,
                [name]: [value],
                citys: []
            });
        }
    };

    const handleRangeChange = (e) => {
        const { name, value } = e.target;
        const numValue = parseInt(value, 10) || 0;

        // Update local state for UI
        setPriceRange({
            ...priceRange,
            [name === 'minBudget' ? 'min' : 'max']: numValue
        });

        // Debounce the actual filter change
        clearTimeout(window.budgetTimer);
        window.budgetTimer = setTimeout(() => {
            onChange({
                ...filters,
                [name]: numValue
            });
        }, 500);
    };

    const handleSliderChange = (e) => {
        const value = parseInt(e.target.value, 10);
        setPriceRange({
            ...priceRange,
            max: value
        });

        // Debounce the actual filter change
        clearTimeout(window.budgetSliderTimer);
        window.budgetSliderTimer = setTimeout(() => {
            onChange({
                ...filters,
                maxBudget: value
            });
        }, 300);
    };

    const toggleSection = (section) => {
        setExpandedSections({
            ...expandedSections,
            [section]: !expandedSections[section]
        });
    };

    // Position sought options
    const positionSoughtOptions = [
        { id: 'ai_machine_learning_engineer', label: 'AI/Machine Learning Engineer', count: 12 },
        { id: 'automation_engineer', label: 'Automation Engineer', count: 8 },
        { id: 'chemical_engineer', label: 'Chemical Engineer', count: 5 },
        { id: 'civil_engineer', label: 'Civil Engineer', count: 7 },
        { id: 'completions_engineer', label: 'Completions Engineer', count: 4 },
        { id: 'data_scientist', label: 'Data Scientist', count: 15 },
        { id: 'director_engineering', label: 'Director, Engineering', count: 6 },
        { id: 'drilling_engineer', label: 'Drilling Engineer', count: 9 },
        { id: 'electrical_engineer', label: 'Electrical Engineer', count: 11 },
        { id: 'manager_software_engineering', label: 'Manager, Software Engineering', count: 8 },
        { id: 'mechanical_engineer', label: 'Mechanical Engineer', count: 14 },
        { id: 'nuclear_engineer', label: 'Nuclear Engineer', count: 3 },
        { id: 'petroleum_engineer', label: 'Petroleum Engineer', count: 7 },
        { id: 'production_engineer', label: 'Production Engineer', count: 10 },
        { id: 'rd_manager', label: 'R&D Manager', count: 5 },
        { id: 'renewable_energy_engineer', label: 'Renewable Energy Engineer', count: 9 },
        { id: 'renewable_energy_researcher', label: 'Renewable Energy Researcher', count: 6 },
        { id: 'sales_engineer', label: 'Sales Engineer', count: 8 },
        { id: 'software_developer', label: 'Software Developer', count: 18 },
        { id: 'software_developer_automation_robotics', label: 'Software Developer with focus on automation & robotics', count: 7 },
        { id: 'software_engineer', label: 'Software Engineer', count: 20 },
        { id: 'structural_engineer', label: 'Structural Engineer', count: 6 }
    ];

    // Region options
    const regionOptions = [
        { id: 'america', label: 'America', count: 35 },
        { id: 'europe', label: 'Europe', count: 28 },
        { id: 'africa', label: 'Africa', count: 15 }
    ];

    // Country options
    const countryOptions = [
        { id: 'united_states', label: 'United States', count: 30 },
        { id: 'germany', label: 'Germany', count: 15 },
        { id: 'canada', label: 'Canada', count: 12 },
        { id: 'france', label: 'France', count: 8 }
    ];
    
    // City options by country
    const cityOptions = {
        united_states: [
            { id: 'anaheim_ca', label: 'Anaheim, CA', count: 2 },
            { id: 'austin_tx', label: 'Austin, TX', count: 8 },
            { id: 'baltimore_md', label: 'Baltimore, MD', count: 3 },
            { id: 'boston_ma', label: 'Boston, MA', count: 7 },
            { id: 'boulder_co', label: 'Boulder, CO', count: 4 },
            { id: 'chicago_il', label: 'Chicago, IL', count: 9 },
            { id: 'cincinnati_oh', label: 'Cincinnati, OH', count: 2 },
            { id: 'colorado_springs_co', label: 'Colorado Springs, CO', count: 3 },
            { id: 'columbus_oh', label: 'Columbus, OH', count: 4 },
            { id: 'dallas_tx', label: 'Dallas, TX', count: 6 },
            { id: 'denver_co', label: 'Denver, CO', count: 8 },
            { id: 'fort_worth_tx', label: 'Fort Worth, TX', count: 3 },
            { id: 'fremont_ca', label: 'Fremont, CA', count: 2 },
            { id: 'harrisburg_pa', label: 'Harrisburg, PA', count: 1 },
            { id: 'houston_tx', label: 'Houston, TX', count: 7 },
            { id: 'indianapolis_in', label: 'Indianapolis, IN', count: 3 },
            { id: 'irving_tx', label: 'Irving, TX', count: 2 },
            { id: 'long_beach_ca', label: 'Long Beach, CA', count: 3 },
            { id: 'madison_wi', label: 'Madison, WI', count: 2 },
            { id: 'menlo_park_ca', label: 'Menlo Park, CA', count: 4 },
            { id: 'miami_fl', label: 'Miami, FL', count: 5 },
            { id: 'midland_tx', label: 'Midland, TX', count: 3 },
            { id: 'minneapolis_mn', label: 'Minneapolis, MN', count: 4 },
            { id: 'new_york_ny', label: 'New York, NY', count: 12 },
            { id: 'oakland_ca', label: 'Oakland, CA', count: 3 },
            { id: 'philadelphia_pa', label: 'Philadelphia, PA', count: 5 },
            { id: 'phoenix_az', label: 'Phoenix, AZ', count: 4 },
            { id: 'pittsburgh_pa', label: 'Pittsburgh, PA', count: 3 },
            { id: 'round_rock_tx', label: 'Round Rock, TX', count: 1 },
            { id: 'san_francisco_ca', label: 'San Francisco, CA', count: 10 },
            { id: 'san_jose_ca', label: 'San Jose, CA', count: 7 },
            { id: 'seattle_wa', label: 'Seattle, WA', count: 9 },
            { id: 'sugarland_tx', label: 'Sugarland, TX', count: 1 },
            { id: 'sunnyvale_ca', label: 'Sunnyvale, CA', count: 5 },
            { id: 'tampa_fl', label: 'Tampa, FL', count: 3 },
            { id: 'washington_dc', label: 'Washington, DC', count: 8 }
        ],
        germany: [
            { id: 'berlin_be', label: 'Berlin, BE', count: 8 },
            { id: 'dusseldorf_nw', label: 'Düsseldorf, NW', count: 5 },
            { id: 'essen_nw', label: 'Essen, NW', count: 3 },
            { id: 'frankfurt_he', label: 'Frankfurt, HE', count: 7 },
            { id: 'grasbrunn_by', label: 'Grasbrunn, BY', count: 1 },
            { id: 'hamburg_hh', label: 'Hamburg, HH', count: 6 },
            { id: 'munich_by', label: 'Munich, BY', count: 9 },
            { id: 'neckarsulm_bw', label: 'Neckarsulm, BW', count: 2 },
            { id: 'rostock_mv', label: 'Rostock, MV', count: 1 },
            { id: 'stuttgart_bw', label: 'Stuttgart, BW', count: 5 }
        ],
        canada: [
            { id: 'burlington_on', label: 'Burlington, ON', count: 2 },
            { id: 'burnaby_bc', label: 'Burnaby, BC', count: 3 },
            { id: 'calgary_ab', label: 'Calgary, AB', count: 5 },
            { id: 'edmonton_ab', label: 'Edmonton, AB', count: 4 },
            { id: 'halifax_ns', label: 'Halifax, NS', count: 2 },
            { id: 'markham_on', label: 'Markham, ON', count: 3 },
            { id: 'mississauga_on', label: 'Mississauga, ON', count: 4 },
            { id: 'montreal_qc', label: 'Montréal, QC', count: 6 },
            { id: 'ottawa_on', label: 'Ottawa, ON', count: 5 },
            { id: 'toronto_on', label: 'Toronto, ON', count: 8 },
            { id: 'vancouver_bc', label: 'Vancouver, BC', count: 7 },
            { id: 'winnipeg_mb', label: 'Winnipeg, MB', count: 3 }
        ],
        france: [
            { id: 'courbevoie', label: 'Courbevoie', count: 2 },
            { id: 'lille', label: 'Lille', count: 3 },
            { id: 'lyon', label: 'Lyon', count: 5 },
            { id: 'nantes', label: 'Nantes', count: 3 },
            { id: 'paris', label: 'Paris', count: 8 },
            { id: 'saint_ouen', label: 'Saint Ouen', count: 2 },
            { id: 'toulouse', label: 'Toulouse', count: 4 }
        ]
    };

    // Experience level options
    const experienceLevelOptions = [
        { id: 'less_than_1_year', label: 'Less than 1 year', count: 5 },
        { id: '1_to_2_years', label: '1 to 2 years', count: 8 },
        { id: '3_to_5_years', label: '3 to 5 years', count: 12 },
        { id: '6_to_10_years', label: '6 to 10 years', count: 9 },
        { id: 'more_than_10_years', label: 'More than 10 years', count: 7 }
    ];

    // Team management experience options
    const teamManagementOptions = [
        { id: 'yes', label: 'Yes', count: 15 },
        { id: 'no', label: 'No', count: 25 }
    ];
    
    // Leadership experience options
    const leadershipOptions = [
        { id: 'no', label: 'No', count: 20 },
        { id: 'less_than_1_year', label: 'Less than 1 year', count: 5 },
        { id: '1_to_2_years', label: '1 to 2 years', count: 7 },
        { id: '3_to_5_years', label: '3 to 5 years', count: 8 },
        { id: '6_to_10_years', label: '6 to 10 years', count: 6 },
        { id: 'more_than_10_years', label: 'More than 10 years', count: 4 }
    ];

    // Sector options
    const sectorOptions = [
        { id: 'technology_ai', label: 'Technology (Artificial Intelligence)', count: 12 },
        { id: 'technology_data_analytics', label: 'Technology (Data Analytics)', count: 10 },
        { id: 'technology_cybersecurity', label: 'Technology (Cybersecurity)', count: 8 },
        { id: 'aerospace', label: 'Aerospace', count: 6 },
        { id: 'energy_oil_gas', label: 'Energy (Oil & Gas)', count: 9 },
        { id: 'energy_nuclear', label: 'Energy (Nuclear)', count: 5 },
        { id: 'energy_renewable', label: 'Energy (Renewable)', count: 7 },
        { id: 'telecommunications', label: 'Telecommunications', count: 8 },
        { id: 'construction', label: 'Construction', count: 6 },
        { id: 'electronics', label: 'Electronics', count: 7 },
        { id: 'mining', label: 'Mining', count: 5 },
        { id: 'automotive', label: 'Automotive', count: 8 },
        { id: 'industrial_manufacturing', label: 'Industrial Manufacturing', count: 9 },
        { id: 'chemistry', label: 'Chemistry', count: 6 }
    ];

    // Work options
    const workOptionsOptions = [
        { id: 'on_site', label: 'On Site', count: 15 },
        { id: 'remote', label: 'Remote', count: 20 },
        { id: 'hybrid', label: 'Hybrid', count: 18 }
    ];

    // Education options
    const educationOptions = [
        { id: 'bachelors_cs', label: 'Bachelor\'s degree in computer science or equivalent', count: 15 },
        { id: 'masters_cs', label: 'Master\'s degree in computer science or equivalent', count: 12 },
        { id: 'phd_cs', label: 'PhD in computer science or equivalent', count: 5 },
        { id: 'bachelors_eng', label: 'Bachelor\'s degree in engineering or equivalent', count: 14 },
        { id: 'masters_eng', label: 'Master\'s degree in engineering or equivalent', count: 11 },
        { id: 'phd_eng', label: 'PhD in engineering or equivalent', count: 4 },
        { id: 'mba', label: 'MBA or equivalent', count: 8 }
    ];

    // Functional area options
    const functionalAreaOptions = [
        { id: 'product_development_engineering', label: 'Product Development/ Engineering', count: 15 },
        { id: 'rd_innovation', label: 'R&D/ Innovation', count: 12 },
        { id: 'production', label: 'Production', count: 8 },
        { id: 'plant_design_maintenance', label: 'Plant Design & Maintenance', count: 7 },
        { id: 'logistics', label: 'Logistics', count: 6 },
        { id: 'information_technology', label: 'Information Technology', count: 14 }
    ];

    // Travel options
    const travelOptions = [
        { id: 'no', label: 'No', count: 20 },
        { id: 'up_to_25', label: 'up to 25 % of the working time', count: 12 },
        { id: '25_to_50', label: '25 to 50 % of the working time', count: 8 },
        { id: 'more_than_50', label: 'more than 50 % of the working time', count: 5 }
    ];

    // Salary currency options
    const salaryCurrencyOptions = [
        { id: 'usd', label: 'USD', count: 15 },
        { id: 'euro', label: 'Euro', count: 12 },
        { id: 'cad', label: 'CAD', count: 8 },
        { id: 'not_specified', label: 'Not specified (match with any jobseeker\'s salary currency)', count: 5 }
    ];

    // Pay range is handled by the slider

    // Job language options
    const jobLanguageOptions = [
        { id: 'english', label: 'English', count: 20 },
        { id: 'german', label: 'German', count: 10 },
        { id: 'french', label: 'French', count: 8 }
    ];

    // Key technical skills options
    const keyTechnicalSkillsOptions = [
        { id: 'javascript', label: 'JavaScript', count: 12 },
        { id: 'python', label: 'Python', count: 10 },
        { id: 'java', label: 'Java', count: 8 },
        { id: 'react', label: 'React', count: 9 },
        { id: 'angular', label: 'Angular', count: 6 },
        { id: 'vue', label: 'Vue.js', count: 5 },
        { id: 'node', label: 'Node.js', count: 7 },
        { id: 'aws', label: 'AWS', count: 8 },
        { id: 'azure', label: 'Azure', count: 6 },
        { id: 'gcp', label: 'Google Cloud', count: 5 },
        { id: 'sql', label: 'SQL', count: 9 },
        { id: 'nosql', label: 'NoSQL', count: 6 },
        { id: 'machine_learning', label: 'Machine Learning', count: 7 },
        { id: 'data_analysis', label: 'Data Analysis', count: 8 }
    ];




    const renderFilterGroup = (title, items, filterName) => {
        const isExpanded = expandedSections[filterName];
        const filterKey = `${filterName}s`;
        const selectedValue = filters[filterKey]?.length > 0 ? filters[filterKey][0] : 'all';

        return (
            <div className="mb-6">
                <div
                    className="flex items-center justify-between cursor-pointer pb-2 border-b border-gray-200 mb-3"
                    onClick={() => toggleSection(filterName)}
                >
                    <h3 className="font-semibold text-gray-800">{title}</h3>
                    {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>

                {isExpanded && (
                    <div className="space-y-2 pr-1">
                        <select
                            name={filterKey}
                            value={selectedValue}
                            onChange={handleSelectChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">All {title}</option>
                            {items.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.label} ({item.count})
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-5">
            {/* Position sought Filter with note */}
            <div className="mb-6">
                <div
                    className="flex items-center justify-between cursor-pointer pb-2 border-b border-gray-200 mb-3"
                    onClick={() => toggleSection('positionSought')}
                >
                    <h3 className="font-semibold text-gray-800">Position sought</h3>
                    {expandedSections.positionSought ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>

                {expandedSections.positionSought && (
                    <div className="space-y-2 pr-1">
                        <select
                            name="positionSought"
                            value={filters.positionSought?.length > 0 ? filters.positionSought[0] : 'all'}
                            onChange={handleSelectChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">All Positions</option>
                            {positionSoughtOptions.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Region Filter */}
            <div className="mb-6">
                <div
                    className="flex items-center justify-between cursor-pointer pb-2 border-b border-gray-200 mb-3"
                    onClick={() => toggleSection('region')}
                >
                    <h3 className="font-semibold text-gray-800">Region</h3>
                    {expandedSections.region ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>

                {expandedSections.region && (
                    <div className="space-y-2 pr-1">
                        <select
                            name="region"
                            value={filters.region?.length > 0 ? filters.region[0] : 'all'}
                            onChange={handleSelectChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">All Regions</option>
                            {regionOptions.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Country Filter */}
            <div className="mb-6">
                <div
                    className="flex items-center justify-between cursor-pointer pb-2 border-b border-gray-200 mb-3"
                    onClick={() => toggleSection('country')}
                >
                    <h3 className="font-semibold text-gray-800">Country of residence</h3>
                    {expandedSections.country ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>

                {expandedSections.country && (
                    <div className="space-y-2 pr-1">
                        <select
                            name="countrys"
                            value={filters.countrys?.length > 0 ? filters.countrys[0] : 'all'}
                            onChange={handleSelectChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">All Countries</option>
                            {countryOptions.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* City Filter - Dynamic based on selected country */}
            <div className="mb-6">
                <div
                    className="flex items-center justify-between cursor-pointer pb-2 border-b border-gray-200 mb-3"
                    onClick={() => toggleSection('city')}
                >
                    <h3 className="font-semibold text-gray-800">
                        {selectedCountry ? `City ${selectedCountry === 'united_states' ? 'US' : 
                                           selectedCountry === 'germany' ? 'Germany' : 
                                           selectedCountry === 'canada' ? 'Canada' : 
                                           selectedCountry === 'france' ? 'France' : ''}` : 'City'}

                    </h3>
                    {expandedSections.city ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>

                {expandedSections.city && (
                    <div className="space-y-2 pr-1">
                        <select
                            name="citys"
                            value={filters.citys?.length > 0 ? filters.citys[0] : 'all'}
                            onChange={handleSelectChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={!selectedCountry}
                        >
                            <option value="all">All Cities</option>
                            {selectedCountry && cityOptions[selectedCountry] && cityOptions[selectedCountry].map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                        {!selectedCountry && (
                            <p className="text-sm text-gray-500 mt-1">Please select a country first</p>
                        )}
                    </div>
                )}
            </div>

            {/* Experience Level Filter */}
            <div className="mb-6">
                <div
                    className="flex items-center justify-between cursor-pointer pb-2 border-b border-gray-200 mb-3"
                    onClick={() => toggleSection('experienceLevel')}
                >
                    <h3 className="font-semibold text-gray-800">Level</h3>
                    {expandedSections.experienceLevel ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>

                {expandedSections.experienceLevel && (
                    <div className="space-y-2 pr-1">
                        <select
                            name="experienceLevels"
                            value={filters.experienceLevels?.length > 0 ? filters.experienceLevels[0] : 'all'}
                            onChange={handleSelectChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">All Experience Levels</option>
                            {experienceLevelOptions.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Team Management Experience Filter */}
            <div className="mb-6">
                <div
                    className="flex items-center justify-between cursor-pointer pb-2 border-b border-gray-200 mb-3"
                    onClick={() => toggleSection('teamManagement')}
                >
                    <h3 className="font-semibold text-gray-800">Team management experience</h3>
                    {expandedSections.teamManagement ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>

                {expandedSections.teamManagement && (
                    <div className="space-y-2 pr-1">
                        <select
                            name="teamManagements"
                            value={filters.teamManagements?.length > 0 ? filters.teamManagements[0] : 'all'}
                            onChange={handleSelectChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">All Options</option>
                            {teamManagementOptions.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Leadership Experience Filter */}
            <div className="mb-6">
                <div
                    className="flex items-center justify-between cursor-pointer pb-2 border-b border-gray-200 mb-3"
                    onClick={() => toggleSection('leadership')}
                >
                    <h3 className="font-semibold text-gray-800">Leadership experience</h3>
                    {expandedSections.leadership ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>

                {expandedSections.leadership && (
                    <div className="space-y-2 pr-1">
                        <select
                            name="leaderships"
                            value={filters.leaderships?.length > 0 ? filters.leaderships[0] : 'all'}
                            onChange={handleSelectChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">All Leadership Experience</option>
                            {leadershipOptions.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Sector Filter */}
            {renderFilterGroup('Sector', sectorOptions, 'sector')}

            {/* Work options Filter */}
            {renderFilterGroup('Work options', workOptionsOptions, 'workOptions')}

            {/* Education Filter */}
            <div className="mb-6">
                <div
                    className="flex items-center justify-between cursor-pointer pb-2 border-b border-gray-200 mb-3"
                    onClick={() => toggleSection('education')}
                >
                    <h3 className="font-semibold text-gray-800">Education</h3>
                    {expandedSections.education ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>

                {expandedSections.education && (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        <p className="text-xs text-gray-500 mb-2">You can select up to 2 options</p>
                        {educationOptions.map(item => (
                            <div key={item.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`education-${item.id}`}
                                    name="educations"
                                    value={item.id}
                                    checked={filters.educations?.includes(item.id) || false}
                                    onChange={(e) => {
                                        const { name, checked, value } = e.target;
                                        
                                        // If this is the first checkbox selected for this filter, create an array
                                        if (!filters[name] || !Array.isArray(filters[name])) {
                                            onChange({
                                                ...filters,
                                                [name]: checked ? [value] : []
                                            });
                                            return;
                                        }
                                        
                                        // If trying to select more than 2 options, prevent it
                                        if (checked && filters[name].length >= 2) {
                                            alert('You can only select up to 2 education options');
                                            return;
                                        }
                                        
                                        // Update the array of selected values
                                        const updatedValues = checked
                                            ? [...filters[name], value]
                                            : filters[name].filter(item => item !== value);
                                        
                                        onChange({
                                            ...filters,
                                            [name]: updatedValues
                                        });
                                    }}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`education-${item.id}`} className="ml-2 text-sm text-gray-700 flex-grow">
                                    {item.label}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Functional area Filter */}
            <div className="mb-6">
                <div
                    className="flex items-center justify-between cursor-pointer pb-2 border-b border-gray-200 mb-3"
                    onClick={() => toggleSection('functionalArea')}
                >
                    <h3 className="font-semibold text-gray-800">Functional area</h3>
                    {expandedSections.functionalArea ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>

                {expandedSections.functionalArea && (
                    <div className="space-y-2 pr-1">
                        <select
                            name="functionalAreas"
                            value={filters.functionalAreas?.length > 0 ? filters.functionalAreas[0] : 'all'}
                            onChange={handleSelectChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">All Functional Areas</option>
                            {functionalAreaOptions.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Travel Filter */}
            <div className="mb-6">
                <div
                    className="flex items-center justify-between cursor-pointer pb-2 border-b border-gray-200 mb-3"
                    onClick={() => toggleSection('travel')}
                >
                    <h3 className="font-semibold text-gray-800">Travel</h3>
                    {expandedSections.travel ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>

                {expandedSections.travel && (
                    <div className="space-y-2 pr-1">
                        <select
                            name="travels"
                            value={filters.travels?.length > 0 ? filters.travels[0] : 'all'}
                            onChange={handleSelectChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">All Travel Options</option>
                            {travelOptions.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Salary currency Filter */}
            <div className="mb-6">
                <div
                    className="flex items-center justify-between cursor-pointer pb-2 border-b border-gray-200 mb-3"
                    onClick={() => toggleSection('salaryCurrency')}
                >
                    <h3 className="font-semibold text-gray-800">Salary currency</h3>
                    {expandedSections.salaryCurrency ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>

                {expandedSections.salaryCurrency && (
                    <div className="space-y-2 pr-1">
                        <select
                            name="salaryCurrencys"
                            value={filters.salaryCurrencys?.length > 0 ? filters.salaryCurrencys[0] : 'all'}
                            onChange={handleSelectChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">All Currencies</option>
                            {salaryCurrencyOptions.map(item => (
                                <option key={item.id} value={item.id}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Pay range Filter */}
            <div className="mb-6">
                <div
                    className="flex items-center justify-between cursor-pointer pb-2 border-b border-gray-200 mb-3"
                    onClick={() => toggleSection('payRange')}
                >
                    <h3 className="font-semibold text-gray-800">Pay range</h3>
                    {expandedSections.payRange ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>

                {expandedSections.payRange && (
                    <div className="space-y-2 pr-1">
                        <select
                            name="payRanges"
                            value={filters.payRanges?.length > 0 ? filters.payRanges[0] : 'all'}
                            onChange={handleSelectChange}
                            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                            <option value="all">All Pay Ranges</option>
                            <option value="40000_60000">$40,000 - $60,000</option>
                            <option value="61000_80000">$61,000 - $80,000</option>
                            <option value="81000_100000">$81,000 - $100,000</option>
                            <option value="101000_120000">$101,000 - $120,000</option>
                            <option value="more_than_120000">more than $120,000</option>
                            <option value="not_specified">Not specified (match with any jobseeker's salary range)</option>
                        </select>
                    </div>
                )}
            </div>

            {/* Job language Filter */}
            <div className="mb-6">
                <div
                    className="flex items-center justify-between cursor-pointer pb-2 border-b border-gray-200 mb-3"
                    onClick={() => toggleSection('jobLanguage')}
                >
                    <h3 className="font-semibold text-gray-800">Job language</h3>
                    {expandedSections.jobLanguage ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>

                {expandedSections.jobLanguage && (
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        <p className="text-xs text-gray-500 mb-2">You can select up to 2 options</p>
                        {jobLanguageOptions.map(item => (
                            <div key={item.id} className="flex items-center">
                                <input
                                     type="checkbox"
                                    id={`jobLanguage-${item.id}`}
                                    name="jobLanguages"
                                    value={item.id}
                                    checked={filters.jobLanguages?.includes(item.id) || false}
                                    onChange={(e) => {
                                        const { name, checked, value } = e.target;
                                        
                                        // If this is the first checkbox selected for this filter, create an array
                                        if (!filters[name] || !Array.isArray(filters[name])) {
                                            onChange({
                                                ...filters,
                                                [name]: checked ? [value] : []
                                            });
                                            return;
                                        }
                                        
                                        // If trying to select more than 2 options, prevent it
                                        if (checked && filters[name].length >= 2) {
                                            alert('You can only select up to 2 language options');
                                            return;
                                        }
                                        
                                        // Update the array of selected values
                                        const updatedValues = checked
                                            ? [...filters[name], value]
                                            : filters[name].filter(item => item !== value);
                                        
                                        onChange({
                                            ...filters,
                                            [name]: updatedValues
                                        });
                                    }}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`jobLanguage-${item.id}`} className="ml-2 text-sm text-gray-700 flex-grow">
                                    {item.label}
                                </label>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Key technical skills Filter */}
            {renderFilterGroup('Key technical skills', keyTechnicalSkillsOptions, 'keyTechnicalSkills')}

            {/* Clear Filters Button */}
            <button
                onClick={() => {
                    // Close all expanded sections
                    const allClosed = Object.keys(expandedSections).reduce((acc, key) => {
                        acc[key] = false;
                        return acc;
                    }, {});
                    setExpandedSections(allClosed);
                    
                    // Call the original onClear function
                    onClear();
                }}
                className="w-full py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
                Clear All Filters
            </button>
            <button
                onClick={() => onFilter && onFilter()}
                className="w-full py-2 mt-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
            >
                Filter
            </button>
        </div>
    );
};

export default JobFilter;