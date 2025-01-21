// Function to calculate the fraction of a year that a law was in effect
function computeYearFraction(effectiveStr, supersededStr, year) {
    // Parse dates using UTC to avoid timezone issues
    const yearStart = new Date(Date.UTC(year, 0, 1));   // Jan 1
    const yearEnd = new Date(Date.UTC(year, 11, 31));   // Dec 31
    const effDate = new Date(effectiveStr + 'T00:00:00Z');
    const supDate = supersededStr === "2023-12-31" 
        ? yearEnd 
        : new Date(supersededStr + 'T00:00:00Z');
    
    // If law starts after year end or ends before year start, fraction is 0
    if (effDate > yearEnd || supDate < yearStart) {
        return 0;
    }
    
    // Get the actual range start and end within this year
    const rangeStart = effDate > yearStart ? effDate : yearStart;
    const rangeEnd = supDate < yearEnd ? supDate : yearEnd;
    
    // If law is effective before/on year start and superseded after/on year end, fraction is 1
    if (effDate <= yearStart && supDate >= yearEnd) {
        return 1;
    }
    
    // Calculate days in the range precisely (including both start and end dates)
    const msInOneDay = 24 * 60 * 60 * 1000;
    const daysInRange = Math.ceil((rangeEnd - rangeStart) / msInOneDay) + 1;
    
    // Calculate total days in the year (accounting for leap years)
    const isLeapYear = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
    const daysInYear = isLeapYear ? 366 : 365;
    
    // Calculate initial fraction
    const fraction = Math.min(1, daysInRange / daysInYear);
    
    // For dates that fall on quarter boundaries (1st of Jan/Apr/Jul/Oct), round to quarters
    const isQuarterDate = (dateStr) => {
        return dateStr.endsWith('-01-01') || 
               dateStr.endsWith('-04-01') || 
               dateStr.endsWith('-07-01') || 
               dateStr.endsWith('-10-01');
    };
    
    // Only round to quarters if both dates are on quarter boundaries
    if (isQuarterDate(effectiveStr) && isQuarterDate(supersededStr)) {
        return Math.round(fraction * 4) / 4;
    }
    
    // For other cases, use 3 decimal precision
    return Math.round(fraction * 1000) / 1000;
}

// Function to generate rows for a single law across all years
function generateRowsForLaw(law) {
    const rows = [];
    // Handle special case where superceeded is null or undefined
    const superceeded = law.superceeded || "2023-12-31";
    
    for (let year = 1979; year <= 2023; year++) {
        // Convert dates to ISO format for consistent handling
        const effectiveDate = new Date(law.effective).toISOString().split('T')[0];
        const supersededDate = new Date(superceeded).toISOString().split('T')[0];
        
        const yearFrac = computeYearFraction(effectiveDate, supersededDate, year);
        
        rows.push({
            state: law.state,
            state_abb: law.state_abb,
            fips: law.fips,
            year: year,
            year_frac: yearFrac,
            law_class: law.law_class,
            law_class_subtype: law.law_class_subtype || "",
            handguns_or_long_guns: law.handguns_or_long_guns
        });
    }
    return rows;
}

// Function to transform the entire dataset
function transformData(lawsData) {
    let allRows = [];
    for (const law of lawsData) {
        const lawRows = generateRowsForLaw(law);
        allRows = allRows.concat(lawRows);
    }
    return allRows;
}

// Export functions for testing and use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        computeYearFraction,
        generateRowsForLaw,
        transformData
    };
}
