'use client';
// src/app/admin/filters/page.js
import React, { useState, useEffect } from 'react';
import { 
  getFilterCategories, 
  addFilterCategory, 
  deleteFilterCategory,
  getFilterValuesByCategory,
  addFilterValue,
  deleteFilterValue
} from '@/lib/jobFilterAnalytics';
import { 
  FaPlus, 
  FaTrash, 
  FaTimes,
  FaChevronDown,
  FaChevronUp
} from 'react-icons/fa';

export default function FiltersManagementPage() {
  const [categories, setCategories] = useState([]);
  const [filterValues, setFilterValues] = useState({});
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // New category form
  const [newCategoryId, setNewCategoryId] = useState('');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isMultiSelect, setIsMultiSelect] = useState(false);
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  
  // New value form
  const [newValueCategory, setNewValueCategory] = useState(null);
  const [newValueId, setNewValueId] = useState('');
  const [newValueLabel, setNewValueLabel] = useState('');
  const [isAddingValue, setIsAddingValue] = useState(false);

  // Load categories
  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        const data = await getFilterCategories();
        setCategories(data);
      } catch (err) {
        console.error("Error loading filter categories:", err);
        setError("Failed to load filter categories");
      } finally {
        setLoading(false);
      }
    }
    
    loadCategories();
  }, []);
  
  // Load filter values when category is expanded
  const handleExpandCategory = async (categoryId) => {
    if (expandedCategory === categoryId) {
      setExpandedCategory(null);
      return;
    }
    
    setExpandedCategory(categoryId);
    if (!filterValues[categoryId]) {
      try {
        const values = await getFilterValuesByCategory(categoryId);
        setFilterValues(prev => ({
          ...prev,
          [categoryId]: values
        }));
      } catch (err) {
        console.error(`Error loading values for ${categoryId}:`, err);
        setError(`Failed to load values for ${categoryId}`);
      }
    }
  };
  
  // Add new category
  const handleAddCategory = async (e) => {
    e.preventDefault();
    
    if (!newCategoryId || !newCategoryName) {
      setError("Category ID and name are required");
      return;
    }
    
    try {
      await addFilterCategory(
        newCategoryId.toLowerCase().replace(/\s+/g, '_'), 
        newCategoryName,
        isMultiSelect
      );
      
      // Refresh categories
      const updatedCategories = await getFilterCategories();
      setCategories(updatedCategories);
      
      // Reset form
      setNewCategoryId('');
      setNewCategoryName('');
      setIsMultiSelect(false);
      setIsAddingCategory(false);
    } catch (err) {
      console.error("Error adding category:", err);
      setError("Failed to add category");
    }
  };
  
  // Delete category
  const handleDeleteCategory = async (categoryId) => {
    if (!confirm(`Are you sure you want to delete the "${categoryId}" filter category? This will also delete all its values.`)) {
      return;
    }
    
    try {
      await deleteFilterCategory(categoryId);
      
      // Refresh categories
      const updatedCategories = await getFilterCategories();
      setCategories(updatedCategories);
      
      // Remove from expanded if needed
      if (expandedCategory === categoryId) {
        setExpandedCategory(null);
      }
      
      // Remove values from state
      const updatedValues = { ...filterValues };
      delete updatedValues[categoryId];
      setFilterValues(updatedValues);
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category");
    }
  };
  
  // Add new filter value
  const handleAddValue = async (e) => {
    e.preventDefault();
    
    if (!newValueCategory || !newValueId || !newValueLabel) {
      setError("All fields are required");
      return;
    }
    
    try {
      await addFilterValue(
        newValueCategory,
        newValueId.toLowerCase().replace(/\s+/g, '_'),
        newValueLabel
      );
      
      // Refresh values for this category
      const updatedValues = await getFilterValuesByCategory(newValueCategory);
      setFilterValues(prev => ({
        ...prev,
        [newValueCategory]: updatedValues
      }));
      
      // Reset form
      setNewValueId('');
      setNewValueLabel('');
      setIsAddingValue(false);
    } catch (err) {
      console.error("Error adding filter value:", err);
      setError("Failed to add filter value");
    }
  };
  
  // Delete filter value
  const handleDeleteValue = async (categoryId, valueId) => {
    if (!confirm(`Are you sure you want to delete this filter value?`)) {
      return;
    }
    
    try {
      await deleteFilterValue(categoryId, valueId);
      
      // Refresh values for this category
      const updatedValues = await getFilterValuesByCategory(categoryId);
      setFilterValues(prev => ({
        ...prev,
        [categoryId]: updatedValues
      }));
    } catch (err) {
      console.error("Error deleting filter value:", err);
      setError("Failed to delete filter value");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Page Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Manage Job Filters</h1>
          <p className="mt-1 text-sm text-gray-600">
            Add, edit or remove filters that appear on the job search page
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
            <button 
              className="absolute top-0 right-0 mr-2 mt-2" 
              onClick={() => setError(null)}
            >
              <FaTimes />
            </button>
          </div>
        )}

        {/* Add Category Button */}
        <div className="mb-6">
          {isAddingCategory ? (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Add New Filter Category</h2>
              <form onSubmit={handleAddCategory} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category ID
                    <input
                      type="text"
                      value={newCategoryId}
                      onChange={(e) => setNewCategoryId(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="e.g. job_type, experience_level"
                    />
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    Unique identifier, use snake_case without spaces
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Display Name
                    <input
                      type="text"
                      value={newCategoryName}
                      onChange={(e) => setNewCategoryName(e.target.value)}
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                      placeholder="e.g. Job Type, Experience Level"
                    />
                  </label>
                  <p className="mt-1 text-sm text-gray-500">
                    Name shown to users
                  </p>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isMultiSelect"
                    checked={isMultiSelect}
                    onChange={(e) => setIsMultiSelect(e.target.checked)}
                    className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                  />
                  <label htmlFor="isMultiSelect" className="ml-2 block text-sm text-gray-900">
                    Allow multiple selection
                  </label>
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setIsAddingCategory(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    Add Category
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <button
              onClick={() => setIsAddingCategory(true)}
              className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              <FaPlus className="mr-2" /> Add Filter Category
            </button>
          )}
        </div>

        {/* Filter Categories List */}
        <div className="bg-white shadow rounded-lg">
          <ul className="divide-y divide-gray-200">
            {categories.length > 0 ? (
              categories.map((category) => (
                <li key={category.id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div onClick={() => handleExpandCategory(category.id)} className="flex-grow cursor-pointer">
                      <div className="flex items-center">
                        {expandedCategory === category.id ? (
                          <FaChevronUp className="mr-2 text-gray-400" />
                        ) : (
                          <FaChevronDown className="mr-2 text-gray-400" />
                        )}
                        <div>
                          <h3 className="text-lg font-medium text-gray-900">{category.displayName}</h3>
                          <p className="text-sm text-gray-500">ID: {category.id}</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-2">
                        {category.isMultiSelect ? 'Multi-select' : 'Single select'}
                      </span>
                      <button
                        onClick={() => handleDeleteCategory(category.id)}
                        className="ml-2 text-red-600 hover:text-red-800"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  {/* Expanded content - Filter Values */}
                  {expandedCategory === category.id && (
                    <div className="mt-4">
                      <div className="border-t border-gray-200 pt-4">
                        <h4 className="text-md font-medium text-gray-700 mb-3">Filter Values</h4>
                        
                        {/* Add Value Button */}
                        {isAddingValue && newValueCategory === category.id ? (
                          <div className="mb-4 bg-gray-50 rounded-md p-4">
                            <h5 className="text-sm font-medium text-gray-700 mb-3">Add New Value</h5>
                            <form onSubmit={handleAddValue} className="space-y-3">
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Value ID
                                  <input
                                    type="text"
                                    value={newValueId}
                                    onChange={(e) => setNewValueId(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    placeholder="e.g. full_time, remote"
                                  />
                                </label>
                              </div>
                              <div>
                                <label className="block text-sm font-medium text-gray-700">
                                  Display Label
                                  <input
                                    type="text"
                                    value={newValueLabel}
                                    onChange={(e) => setNewValueLabel(e.target.value)}
                                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                    placeholder="e.g. Full Time, Remote"
                                  />
                                </label>
                              </div>
                              <div className="flex justify-end space-x-3">
                                <button
                                  type="button"
                                  onClick={() => {
                                    setIsAddingValue(false);
                                    setNewValueCategory(null);
                                  }}
                                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="submit"
                                  className="px-3 py-1 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                                >
                                  Add Value
                                </button>
                              </div>
                            </form>
                          </div>
                        ) : (
                          <button
                            onClick={() => {
                              setIsAddingValue(true);
                              setNewValueCategory(category.id);
                            }}
                            className="mb-4 flex items-center justify-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                          >
                            <FaPlus className="mr-1" /> Add Value
                          </button>
                        )}
                        
                        {/* Values list */}
                        {filterValues[category.id] && filterValues[category.id].length > 0 ? (
                          <div className="bg-white border border-gray-200 rounded-md">
                            <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                <tr>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Value ID
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Display Label
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usage Count
                                  </th>
                                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Actions
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                {filterValues[category.id].map((value) => (
                                  <tr key={value.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {value.value}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {value.displayLabel || value.value}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                      {value.count || 0}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                      <button
                                        onClick={() => handleDeleteValue(category.id, value.value)}
                                        className="text-red-600 hover:text-red-800"
                                      >
                                        <FaTrash />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">No values found for this filter category.</p>
                        )}
                      </div>
                    </div>
                  )}
                </li>
              ))
            ) : (
              <li className="p-6 text-center text-gray-500">
                No filter categories found. Create your first category to get started.
              </li>
            )}
          </ul>
        </div>
      </main>
    </div>
  );
} 