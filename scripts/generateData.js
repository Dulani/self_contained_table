const fs = require('fs');
const path = require('path');
const { transformData } = require('./generateYearlyData');

// Read the law database
const lawDbPath = path.join(__dirname, '..', 'law_db.json');
const lawsData = JSON.parse(fs.readFileSync(lawDbPath, 'utf8'));

// Transform the data
const transformedData = transformData(lawsData);

// Write the transformed data to a new file
const outputPath = path.join(__dirname, '..', 'transformed_data.json');
fs.writeFileSync(outputPath, JSON.stringify(transformedData, null, 2));

console.log(`Transformed ${lawsData.length} laws into ${transformedData.length} year-specific rows`);
