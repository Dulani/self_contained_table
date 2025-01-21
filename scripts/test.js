// Test cases for year fraction calculation
const { computeYearFraction } = require('./generateYearlyData');

function assertClose(actual, expected, message) {
    const diff = Math.abs(actual - expected);
    if (diff > 0.01) {  // Updated tolerance to 0.01 per user request
        console.error(`❌ ${message}: Expected ${expected}, got ${actual}`);
        process.exit(1);
    }
    console.log(`✓ ${message}: ${actual}`);
}

// Test Maryland example: gun trafficking law (2003-10-01 to 2017-10-01)
console.log('\nTesting Maryland gun trafficking law example:');
assertClose(
    computeYearFraction('2003-10-01', '2017-10-01', 2003),
    0.25,
    'Maryland 2003 should be ~0.25'
);
assertClose(
    computeYearFraction('2003-10-01', '2017-10-01', 2004),
    1.0,
    'Maryland 2004 should be 1.0'
);
assertClose(
    computeYearFraction('2003-10-01', '2017-10-01', 2016),
    1.0,
    'Maryland 2016 should be 1.0'
);
assertClose(
    computeYearFraction('2003-10-01', '2017-10-01', 2017),
    0.75,
    'Maryland 2017 should be ~0.75'
);

// Test Alaska example: castle doctrine law superseded on 2006-09-13
console.log('\nTesting Alaska castle doctrine example:');
assertClose(
    computeYearFraction('2006-01-01', '2006-09-13', 2006),
    0.70,
    'Alaska 2006 should be 0.70'
);

// Verify edge cases
console.log('\nTesting edge cases:');
assertClose(
    computeYearFraction('2007-01-01', '2007-12-31', 2006),
    0,
    'Outside year should be 0'
);
assertClose(
    computeYearFraction('2006-01-01', '2006-12-31', 2006),
    1,
    'Full year should be 1'
);
assertClose(
    computeYearFraction('2004-03-01', '2004-06-30', 2004),
    0.33,
    'Leap year Q2 should be 0.33'
);
