import { useEffect, useState } from 'react';
import { getFilterCategories, getFilterValuesByCategory } from '@/lib/jobFilterAnalytics';

const JobFilterSection = ({ formData, setFormData }) => {
  const [filterCategories, setFilterCategories] = useState([]);
  const [filterValues, setFilterValues] = useState({});
  const [loadingFilters, setLoadingFilters] = useState(true);

  useEffect(() => {
    async function loadFilters() {
      try {
        setLoadingFilters(true);
        // Get all filter categories
        const categories = await getFilterCategories();
        setFilterCategories(categories);
        
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
        setLoadingFilters(false);
      }
    }
    
    loadFilters();
  }, []);

  return (
    <div className="col-span-6 sm:col-span-3">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Filters</h3>
      
      {loadingFilters ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-10 bg-gray-200 rounded"></div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filterCategories.map(category => {
            const values = filterValues[category.id] || [];
            const filterKey = category.id;
            
            return (
              <div key={category.id} className="mb-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {category.displayName}
                </label>
                
                {category.isMultiSelect ? (
                  // Multi-select (checkboxes)
                  <div className="grid grid-cols-2 gap-2 border border-gray-300 rounded-md p-2">
                    {values.map(item => (
                      <div key={item.value} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`filter-${category.id}-${item.value}`}
                          name={filterKey}
                          value={item.value}
                          checked={formData[filterKey]?.includes(item.value) || false}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            const value = e.target.value;
                            const currentValues = formData[filterKey] || [];
                            
                            setFormData({
                              ...formData,
                              [filterKey]: checked
                                ? [...currentValues, value]
                                : currentValues.filter(v => v !== value)
                            });
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`filter-${category.id}-${item.value}`} className="ml-2 text-sm text-gray-700">
                          {item.displayLabel || item.value}
                        </label>
                      </div>
                    ))}
                  </div>
                ) : (
                  // Single select (dropdown)
                  <select
                    name={filterKey}
                    value={formData[filterKey] || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      [filterKey]: e.target.value
                    })}
                    className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">Select {category.displayName}</option>
                    {values.map(item => (
                      <option key={item.value} value={item.value}>
                        {item.displayLabel || item.value}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default JobFilterSection;
