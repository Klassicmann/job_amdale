'use client';

import React, { useState, useEffect } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { getFilterCategories, getFilterValuesByCategory } from '@/lib/jobFilterAnalytics';

const JobFilter = ({ filters, onChange, onClear, onFilter = () => {} }) => {
    const [expandedSections, setExpandedSections] = useState({});
    const [filterCategories, setFilterCategories] = useState([]);
    const [filterValues, setFilterValues] = useState({});
    const [loading, setLoading] = useState(true);
    
    // Load filter categories and values from Firebase
    useEffect(() => {
        async function loadFilters() {
            try {
                setLoading(true);
                // Get all filter categories
                const categories = await getFilterCategories();
                setFilterCategories(categories);
                
                // Initialize expanded sections
                const sections = {};
                categories.forEach(cat => {
                    sections[cat.id] = false;
                });
                setExpandedSections(sections);
                
                // Get values for each category
                const allValues = {};
                for (const category of categories) {
                    const values = await getFilterValuesByCategory(category.id);
                    allValues[category.id] = values;
                }
                setFilterValues(allValues);
            } catch (err) {
                console.error('Error loading filters:', err);
            } finally {
                setLoading(false);
            }
        }
        
        loadFilters();
    }, []);
    
    // If changing price range
    const [priceRange, setPriceRange] = useState({
        min: filters.minBudget || 0,
        max: filters.maxBudget || 20000
    });

    const toggleSection = (section) => {
        setExpandedSections({
            ...expandedSections,
            [section]: !expandedSections[section]
        });
    };

    const handleSelectChange = (e) => {
        const { name, value } = e.target;
        
        // If 'all' is selected, clear the filter
        if (value === 'all') {
            onChange({
                ...filters,
                [name]: []
            });
            return;
        }
        
        // Set the selected value
        onChange({
            ...filters,
            [name]: [value]
        });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked, value } = e.target;
        
        // Get current values
        const currentValues = filters[name] || [];
        
        // Update values based on checkbox state
        let updatedValues;
        if (checked) {
            updatedValues = [...currentValues, value];
        } else {
            updatedValues = currentValues.filter(v => v !== value);
        }
        
        // Update filters
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

    const clearAllFilters = () => {
        if (onClear) {
            onClear();
        } else {
            // Reset all filters to defaults
            onChange({
                jobTypes: [],
                locations: [],
                categories: [],
                industries: [],
                experiences: [],
                companies: [],
                skills: [],
                languages: [],
                englishLevels: [],
                minBudget: 0,
                maxBudget: 20000
            });
        }
        
        // Reset price range UI
        setPriceRange({
            min: 0,
            max: 20000
        });
    };

    // Render dynamic filter group
    const renderDynamicFilterGroup = (category) => {
        const isExpanded = expandedSections[category.id];
        const values = filterValues[category.id] || [];
        const filterKey = `${category.id}s`; // Append 's' to match the filters state pattern
        
        // For single select filters
        if (!category.isMultiSelect) {
        const selectedValue = filters[filterKey]?.length > 0 ? filters[filterKey][0] : 'all';

        return (
                <div className="mb-6" key={category.id}>
                <div
                    className="flex items-center justify-between cursor-pointer pb-2 border-b border-gray-200 mb-3"
                        onClick={() => toggleSection(category.id)}
                >
                        <h3 className="font-semibold text-gray-800">{category.displayName}</h3>
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
                                <option value="all">All {category.displayName}</option>
                                {values.map(item => (
                                    <option key={item.value} value={item.value}>
                                        {item.displayLabel || item.value} ({item.count || 0})
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>
        );
        }
        
        // For multi-select filters
        const selectedValues = filters[filterKey] || [];

    return (
            <div className="mb-6" key={category.id}>
                <div
                    className="flex items-center justify-between cursor-pointer pb-2 border-b border-gray-200 mb-3"
                    onClick={() => toggleSection(category.id)}
                >
                    <h3 className="font-semibold text-gray-800">{category.displayName}</h3>
                    {isExpanded ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>

                {isExpanded && (
                    <div className="space-y-2 pr-1 max-h-48 overflow-y-auto">
                        {values.map(item => (
                            <div key={item.value} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`${category.id}-${item.value}`}
                                    name={filterKey}
                                    value={item.value}
                                    checked={selectedValues.includes(item.value)}
                                    onChange={handleCheckboxChange}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label htmlFor={`${category.id}-${item.value}`} className="ml-2 text-sm text-gray-700 flex-grow">
                                    {item.displayLabel || item.value}
                                </label>
                                <span className="text-xs text-gray-500">({item.count || 0})</span>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    // Handle loading state
    if (loading) {
        return (
            <div className="bg-white rounded-lg shadow-lg p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                        <div key={i}>
                            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                            <div className="h-8 bg-gray-100 rounded w-full"></div>
                </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Filters</h2>
            
            {/* Dynamic Filters */}
            {filterCategories.map(category => renderDynamicFilterGroup(category))}
            
            {/* Budget Range Slider - Keep this if needed */}
            <div className="mb-6">
                <div
                    className="flex items-center justify-between cursor-pointer pb-2 border-b border-gray-200 mb-3"
                    onClick={() => toggleSection('budget')}
                >
                    <h3 className="font-semibold text-gray-800">Budget Range</h3>
                    {expandedSections.budget ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
                </div>

                {expandedSections.budget && (
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm text-gray-600">
                            <span>${priceRange.min}</span>
                            <span>${priceRange.max}</span>
                    </div>
                        <input
                            type="range"
                            name="minBudget"
                            min="0"
                            max="20000"
                            value={priceRange.min}
                            onChange={handleRangeChange}
                            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                        />
                                <input
                            type="range"
                            name="maxBudget"
                            min="0"
                            max="20000"
                            value={priceRange.max}
                            onChange={handleRangeChange}
                            className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
                        />
                    </div>
                )}
            </div>

            {/* Clear Filters Button */}
            <button
                onClick={clearAllFilters}
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