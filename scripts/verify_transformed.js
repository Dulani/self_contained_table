const fs = require('fs');
const path = require('path');

// Read the transformed data
const transformedDataPath = path.join(__dirname, '..', 'transformed_data.json');
const transformedData = JSON.parse(fs.readFileSync(transformedDataPath, 'utf8'));

// Helper function to round to 2 decimal places
const round2 = (num) => Math.round(num * 100) / 100;

// Function to find and print law details for a specific state, year, and law class
function findLaw(state, year, lawClass) {
    const matches = transformedData.filter(row => 
        row.state === state && 
        row.year === year && 
        row.law_class === lawClass
    );
    
    if (matches.length > 0) {
        console.log(`\nFound ${matches.length} matches for ${state} ${year} ${lawClass}:`);
        matches.forEach(match => {
            console.log(`- year_frac: ${round2(match.year_frac)}`);
            if (match.law_class_subtype) {
                console.log(`  subtype: ${match.law_class_subtype}`);
            }
        });
    } else {
        console.log(`\nNo matches found for ${state} ${year} ${lawClass}`);
    }
}

console.log('Verifying Alaska castle doctrine test cases:');
findLaw('Alaska', 2005, 'castle doctrine');  // Should be 1.0
findLaw('Alaska', 2006, 'castle doctrine');  // Should be ~0.70
findLaw('Alaska', 2007, 'castle doctrine');  // Should be 0

console.log('\nVerifying Maryland gun trafficking test cases:');
findLaw('Maryland', 2003, 'gun trafficking');  // Should be 0.25
findLaw('Maryland', 2004, 'gun trafficking');  // Should be 1.0
findLaw('Maryland', 2016, 'gun trafficking');  // Should be 1.0
findLaw('Maryland', 2017, 'gun trafficking');  // Should be 0.75
