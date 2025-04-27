/**
 * CSV Export Service
 * Handles data formatting and export for CSV report generation
 */

/**
 * Generate CSV content from document data
 * @param {Array} documents - The filtered documents to include in the report
 * @param {Array} statuses - The selected statuses for the report
 * @param {String} comment - An optional comment to include in the report
 * @returns {String} - CSV data URI for download
 */
export const generateCsvReport = async (documents, statuses, comment) => {
  try {
    // Create header row with metadata
    const reportDate = new Date().toLocaleDateString();
    const statusText = statuses.includes('All') 
      ? 'All Statuses' 
      : `Filtered by: ${statuses.join(', ')}`;
    
    let csvContent = 'data:text/csv;charset=utf-8,';
    
    // Add report metadata
    csvContent += `Report Date,${reportDate}\r\n`;
    csvContent += `Status Filter,${statusText}\r\n`;
    if (comment && comment.trim()) {
      // Escape any commas in the comment
      csvContent += `Comment,"${comment.replace(/"/g, '""')}"\r\n`;
    }
    csvContent += '\r\n';
    
    // Create header row for data
    const headers = [
      'Document ID',
      'Title',
      'Content',
      'Department',
      'Requested By',
      'Status',
      'Rejection Reason',
      'Created Date',
      'Last Updated'
    ];
    
    csvContent += headers.join(',') + '\r\n';
    
    // Add data rows
    documents.forEach(doc => {
      const row = [
        doc.docID,
        `"${(doc.title || '').replace(/"/g, '""')}"`, // Escape quotes in CSV
        `"${(doc.content || '').replace(/"/g, '""')}"`,
        `"${(doc.department || '').replace(/"/g, '""')}"`,
        doc.email,
        doc.status,
        `"${(doc.rejectionReason || '').replace(/"/g, '""')}"`,
        new Date(doc.createdAt).toLocaleString(),
        new Date(doc.updatedAt).toLocaleString()
      ];
      
      csvContent += row.join(',') + '\r\n';
    });
    
    // Add summary section if multiple statuses
    if (statuses.includes('All') || statuses.length > 1) {
      csvContent += '\r\n';
      csvContent += 'Status Summary\r\n';
      
      const statusCounts = {};
      documents.forEach(doc => {
        statusCounts[doc.status] = (statusCounts[doc.status] || 0) + 1;
      });
      
      for (const [status, count] of Object.entries(statusCounts)) {
        csvContent += `${status},${count}\r\n`;
      }
      csvContent += `Total,${documents.length}\r\n`;
    }
    
    return csvContent;
  } catch (error) {
    console.error('Error generating CSV:', error);
    throw error;
  }
};
