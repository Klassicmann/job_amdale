'use client';

import React, { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

const JobFilter = ({ filters, onChange, onClear }) => {
    const [expandedSections, setExpandedSections] = useState({
        category: true,
        jobType: true,
        budget: true,
        englishLevel: true,
        language: true,
        experience: false,
        skills: false,
        location: false
    });

    const [priceRange, setPriceRange] = useState({
        min: filters.minBudget || 0,
        max: filters.maxBudget || 20000
    });

    const handleCheckboxChange = (e) => {
        const { name, checked, value } = e.target;

        // If this is the first checkbox selected for this filter, create an array
        if (!filters[name] || !Array.isArray(filters[name])) {
            onChange({
                ...filters,
                [name]: checked ? [value] : []
            });
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

    // Filter categories
    const categories = [
        { id: 'admin', label: 'Admin & Customer Support', count: 1 },
        { id: 'design', label: 'Design & Creative', count: 4 },
        { id: 'development', label: 'Development & IT', count: 2 },
        { id: 'engineering', label: 'Engineering & Architecture', count: 1 },
        { id: 'finance', label: 'Finance & Accounting', count: 1 },
        { id: 'marketing', label: 'Marketing & Communications', count: 3 },
        { id: 'sales', label: 'Sales & Business Development', count: 2 }
    ];

    // Job types
    const jobTypes = [
        { id: 'hourly', label: 'Hourly', count: 2 },
        { id: 'fixed', label: 'Fixed', count: 6 },
        { id: 'fulltime', label: 'Full-time', count: 4 },
        { id: 'parttime', label: 'Part-time', count: 3 }
    ];

    // English levels
    const englishLevels = [
        { id: 'conversational', label: 'Conversational', count: 2 },
        { id: 'fluent', label: 'Fluent', count: 3 },
        { id: 'native', label: 'Native', count: 1 }
    ];

    // Languages
    const languages = [
        { id: 'chinese', label: 'Chinese', count: 2 },
        { id: 'english', label: 'English', count: 7 },
        { id: 'spanish', label: 'Spanish', count: 4 },
        { id: 'french', label: 'French', count: 1 },
        { id: 'german', label: 'German', count: 2 }
    ];

    const renderFilterGroup = (title, items, filterName) => {
        const isExpanded = expandedSections[filterName];

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
                    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                        {items.map(item => (
                            <div key={item.id} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`${filterName}-${item.id}`}
                                    name={`${filterName}s`}
                                    value={item.id}
                                    checked={filters[`${filterName}s`]?.includes(item.id) || false}
                                    onChange={handleCheckboxChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`${filterName}-${item.id}`} className="ml-2 text-sm text-gray-700 flex-grow">
                                    {item.label}
                                </label>
                                <span className="text-xs text-gray-500">({item.count})</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-5">
            {/* Categories Filter */}
            {renderFilterGroup('Category', categories, 'category')}

            {/* Job Type Filter */}
            {renderFilterGroup('Job type', jobTypes, 'jobType')}

            {/* Budget Filter */}
            <div className="mb-6">
                <div
                    className="flex items-center justify-between cursor-pointer pb-2 border-b border-gray-200 mb-3"
                    onClick={() => toggleSection('budget')}
                >
                    <h3 className="font-semibold text-gray-800">Budget</h3>
                    {expandedSections.budget ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>

                {expandedSections.budget && (
                    <div className="mt-3">
                        <div className="flex space-x-3 mb-3">
                            <div className="w-1/2">
                                <input
                                    type="number"
                                    name="minBudget"
                                    placeholder="0"
                                    value={priceRange.min}
                                    onChange={handleRangeChange}
                                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                            <div className="w-1/2">
                                <input
                                    type="number"
                                    name="maxBudget"
                                    placeholder="20000"
                                    value={priceRange.max}
                                    onChange={handleRangeChange}
                                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="relative pt-1">
                            <div className="flex justify-between mb-1">
                                <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full bg-gray-800 text-white">
                                    {priceRange.min}
                                </span>
                                <span className="text-xs font-semibold inline-block py-1 px-2 rounded-full bg-gray-800 text-white">
                                    {priceRange.max}
                                </span>
                            </div>
                            <input
                                type="range"
                                min="0"
                                max="20000"
                                step="100"
                                value={priceRange.max}
                                onChange={handleSliderChange}
                                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* English Level Filter */}
            {renderFilterGroup('English level', englishLevels, 'englishLevel')}

            {/* Language Filter */}
            {renderFilterGroup('Language', languages, 'language')}

            {/* Clear Filters Button */}
            <button
                onClick={onClear}
                className="w-full py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
            >
                Clear All Filters
            </button>
        </div>
    );
};

export default JobFilter;