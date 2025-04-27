const XLSX = require('xlsx');
const path = require('path');

// Path to the Excel file
const excelFilePath = path.join(__dirname, '..', 'public', 'Fichier AMDALE Africa1.xlsx');

try {
  // Read the Excel file
  const workbook = XLSX.readFile(excelFilePath);
  
  // Get all sheet names
  console.log('Sheet Names:');
  workbook.SheetNames.forEach((sheetName, index) => {
    console.log(`${index + 1}. ${sheetName}`);
  });
  
  // For each sheet, get the headers (first row)
  workbook.SheetNames.forEach(sheetName => {
    console.log(`\nHeaders in sheet "${sheetName}":`);
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert sheet to JSON to get headers
    const data = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
    
    if (data.length > 0) {
      const headers = data[0];
      headers.forEach((header, index) => {
        console.log(`${index + 1}. ${header}`);
      });
      
      // Print a sample row (if available)
      if (data.length > 1) {
        console.log('\nSample data (first row):');
        const sampleRow = data[1];
        headers.forEach((header, index) => {
          if (index < sampleRow.length) {
            console.log(`${header}: ${sampleRow[index]}`);
          }
        });
      }
    } else {
      console.log('No data found in this sheet.');
    }
  });
} catch (error) {
  console.error('Error inspecting Excel file:', error);
}
