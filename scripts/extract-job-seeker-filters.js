const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Path to the Excel file
const excelFilePath = path.join(__dirname, '..', 'public', 'Fichier AMDALE Africa1.xlsx');

try {
  // Read the Excel file
  const workbook = XLSX.readFile(excelFilePath);
  
  // Get the first sheet which contains job seeker filters
  const sheetName = 'Feuil1';
  const worksheet = workbook.Sheets[sheetName];
  
  // Convert sheet to raw data to inspect structure
  const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1, defval: null });
  
  // Find the row that contains "JOB SEEKERS FILTERS"
  let filterStartRow = -1;
  for (let i = 0; i < rawData.length; i++) {
    if (rawData[i].some(cell => cell === 'JOB SEEKERS FILTERS')) {
      filterStartRow = i;
      break;
    }
  }
  
  if (filterStartRow === -1) {
    console.error('Could not find JOB SEEKERS FILTERS section');
    process.exit(1);
  }
  
  // Extract filter categories and their values
  const filterCategories = {};
  let currentCategory = null;
  
  for (let i = filterStartRow + 1; i < rawData.length; i++) {
    const row = rawData[i];
    
    // Skip empty rows
    if (!row.some(cell => cell !== null)) continue;
    
    // Check if this row is a new category
    const firstCell = row[0];
    if (firstCell && typeof firstCell === 'string' && firstCell.trim() !== '') {
      // This is a category header
      currentCategory = firstCell.trim();
      filterCategories[currentCategory] = [];
    } else if (currentCategory && row[1] && typeof row[1] === 'string' && row[1].trim() !== '') {
      // This is a value for the current category
      filterCategories[currentCategory].push(row[1].trim());
    }
    
    // Stop when we reach COMPANY DATABASE section
    if (row.some(cell => cell === 'COMPANY DATABASE')) {
      break;
    }
  }
  
  // Format the filter categories for our component
  const formattedFilters = {};
  Object.keys(filterCategories).forEach(category => {
    const normalizedCategory = category
      .toLowerCase()
      .replace(/\s+/g, '')
      .replace(/[^a-z0-9]/g, '');
    
    formattedFilters[normalizedCategory] = filterCategories[category].map(value => ({
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
  
  // Also output the raw filter categories for inspection
  console.log('Extracted filter categories:');
  Object.keys(filterCategories).forEach(category => {
    console.log(`\n${category}:`);
    filterCategories[category].forEach(value => {
      console.log(`- ${value}`);
    });
  });
  
  console.log('\nFilter values extracted and saved to src/lib/data/filters.json');
} catch (error) {
  console.error('Error processing Excel file:', error);
}
