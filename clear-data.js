// Function to clear all data and reset the table
function clearAllData() {
    // Reset all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Clear search input
    const searchInput = document.querySelector('input[type="text"]');
    if (searchInput) {
        searchInput.value = '';
    }
    
    // Reset select to default
    const select = document.querySelector('select');
    if (select) {
        select.selectedIndex = 1; // 10 per page is default
    }
    
    // Clear any filters
    if (typeof clearFilters === 'function') {
        clearFilters();
    }
    
    // Force table refresh if available
    if (typeof refreshTable === 'function') {
        refreshTable();
    }
    
    // Dispatch change event to trigger any listeners
    document.dispatchEvent(new Event('dataCleared'));
}
