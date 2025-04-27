const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Path to the Excel file
const excelFilePath = path.join(__dirname, '..', 'public', 'Fichier AMDALE Africa1.xlsx');

try {
  // Read the Excel file
  const workbook = XLSX.readFile(excelFilePath);
  
  // Get the first sheet
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert sheet to JSON
  const data = XLSX.utils.sheet_to_json(worksheet);
  
  // Extract unique values for each filter category
  const filterCategories = {
    positionSought: new Set(),
    location: new Set(),
    experience: new Set(),
    sector: new Set(),
    workOptions: new Set(),
    education: new Set(),
    functionalArea: new Set(),
    travel: new Set(),
    salaryCurrency: new Set(),
    payRange: new Set(),
    jobLanguage: new Set(),
    keyTechnicalSkills: new Set(),
  };
  
  // Map Excel column names to filter categories
  const columnMapping = {
    'Position sought': 'positionSought',
    'Location': 'location',
    'Experience': 'experience',
    'Sector': 'sector',
    'Work options': 'workOptions',
    'Education': 'education',
    'Functional area': 'functionalArea',
    'Travel': 'travel',
    'Salary currency': 'salaryCurrency',
    'Pay range': 'payRange',
    'Job language': 'jobLanguage',
    'Key technical skills': 'keyTechnicalSkills',
  };
  
  // Extract unique values for each category
  data.forEach(row => {
    Object.keys(columnMapping).forEach(columnName => {
      if (row[columnName]) {
        // Split values if they contain commas (for multiple values in one cell)
        const values = row[columnName].toString().split(',').map(v => v.trim());
        values.forEach(value => {
          if (value) {
            filterCategories[columnMapping[columnName]].add(value);
          }
        });
      }
    });
  });
  
  // Convert Sets to arrays and format for the filter component
  const formattedFilters = {};
  Object.keys(filterCategories).forEach(category => {
    formattedFilters[category] = Array.from(filterCategories[category])
      .map(value => ({
        id: value.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, ''),
        label: value,
        count: Math.floor(Math.random() * 10) + 1 // Random count for demonstration
      }));
  });
  
  // Write the result to a JSON file
  fs.writeFileSync(
    path.join(__dirname, '..', 'src', 'lib', 'data', 'filters.json'),
    JSON.stringify(formattedFilters, null, 2)
  );
  
  console.log('Filter values extracted and saved to src/lib/data/filters.json');
} catch (error) {
  console.error('Error processing Excel file:', error);
}
