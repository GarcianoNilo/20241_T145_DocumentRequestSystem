/**
 * PDF Data Processing Service
 * Handles data formatting, validation and mapping for PDF generation
 */

// Helper for formatting dates consistently
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString();
  } catch (e) {
    return dateStr;
  }
};

// Process document data for PDF generation
export const preparePdfData = (rawData) => {
  // Handle null/undefined data
  const data = rawData || {};
  
  // Format dates
  const formattedData = {
    ...data,
    date: formatDate(data.date),
    requestorDate: formatDate(data.requestorDate),
    adminDate: formatDate(data.adminDate),
    effectivityDate: formatDate(data.effectivityDate || new Date())
  };
  
  // Ensure there are values for required fields
  const documentCode = formattedData.docCode ? `QAU-SDRF-${formattedData.docCode}` : 'QAU-SDRF-___';
  
  return {
    ...formattedData,
    formattedDocCode: documentCode,
  };
};

// Process document rows for the PDF table
export const prepareDocumentRows = (data = {}, maxRows = 100) => {
  // Get actual document rows from data or create empty array
  const documentRows = data.documentRows || [];
  
  // Ensure we have at least the minimum number of rows (for template formatting)
  const minRows = 5;
  const numRows = Math.max(documentRows.length, minRows);
  
  // Use all rows, but don't exceed maxRows (default 100)
  const rows = Array.from({ length: Math.min(numRows, maxRows) }, (_, i) => {
    if (i < documentRows.length) {
      return documentRows[i];
    }
    
    // Empty row for placeholders
    return {
      area: '',
      docName: '',
      status: ''
    };
  });
  
  // Map rows to the format expected by the PDF component
  return rows.map((row, index) => ({
    num: index + 1,
    area: row.area || '',
    docName: row.docName || '',
    status: row.status || ''
  }));
};

// Convert checkbox boolean values to visual checkmarks
export const getCheckMarkValue = (isChecked) => {
  return isChecked ? '✓' : '';
};

// Validate the PDF form data
export const validatePdfForm = (formData) => {
  const errors = {};
  
  // Simple validation for required fields
  if (!formData.formNumber?.trim()) errors.formNumber = 'Form number is required';
  if (!formData.docCode?.trim()) errors.docCode = 'Document code is required';
  if (!formData.date) errors.date = 'Date is required';
  if (!formData.requestorName?.trim()) errors.requestorName = 'Requestor name is required';
  if (!formData.requestorOffice?.trim()) errors.requestorOffice = 'Office/Department is required';
  if (!formData.targetOffice?.trim()) errors.targetOffice = 'Target office is required';
  if (!formData.purpose?.trim()) errors.purpose = 'Purpose is required';
  
  // At least one checkbox must be selected
  if (!(formData.isaChecked || formData.monitoringChecked || formData.accreditationChecked || 
      formData.certificationChecked || formData.otherChecked)) {
    errors.checkboxes = 'At least one processing option must be selected';
  }
  
  // "Other" field must be filled if "Other" is checked
  if (formData.otherChecked && !formData.otherSpecify?.trim()) {
    errors.otherSpecify = 'Please specify other reason';
  }
  
  // Date validations
  if (!formData.effectivityDate) errors.effectivityDate = 'Effectivity date is required';
  if (!formData.requestorDate) errors.requestorDate = 'Requestor date is required';
  if (!formData.adminDate) errors.adminDate = 'Admin date is required';
  
  // Document rows validation
  const rowErrors = [];
  
  formData.documentRows.forEach((row, index) => {
    const rowError = {};
    let hasError = false;
    
    // Only validate the first 5 rows (minimum required)
    if (index < 5) {
      if (!row.area?.trim()) {
        rowError.area = true;
        hasError = true;
      }
      
      if (!row.docName?.trim()) {
        rowError.docName = true;
        hasError = true;
      }
      
      if (!row.status?.trim()) {
        rowError.status = true;
        hasError = true;
      }
      
      if (hasError) {
        rowError.rowIndex = index;
        rowErrors.push(rowError);
      }
    }
  });
  
  if (rowErrors.length > 0) {
    errors.rowErrors = rowErrors;
    errors.documentRows = 'Please fill in all required fields for the first 5 document rows';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

/**
 * Prepare data for status-based report PDF generation
 * @param {Object} reportData - Data containing filtered documents and settings
 * @returns {Object} - Formatted data for the PDF report
 */
export const prepareReportData = (reportData) => {
  if (!reportData) return {};
  
  const { documents, statuses, comment, reportDate, reportType } = reportData;
  
  // Status counts for summary
  const statusCounts = {};
  documents.forEach(doc => {
    statusCounts[doc.status] = (statusCounts[doc.status] || 0) + 1;
  });
  
  // Format statuses for display
  const formattedStatuses = statuses && statuses.length > 0 
    ? statuses.join(', ') 
    : 'All';
  
  return {
    reportTitle: `Document Status Report: ${formattedStatuses}`,
    reportDate: formatDate(reportDate || new Date()),
    documents: documents || [],
    statuses: statuses || [],
    statusCounts,
    totalDocuments: documents ? documents.length : 0,
    comment: comment || '',
    reportType: reportType || 'status-based'
  };
};

/**
 * Get appropriate status color for visual indicators
 * @param {String} status - The document status
 * @returns {String} - Color for the status
 */
export const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return '#155724'; // Dark green
    case 'rejected':
      return '#721c24'; // Dark red
    case 'pending':
      return '#856404'; // Dark yellow/amber
    case 'archived':
      return '#383d41'; // Dark gray
    default:
      return '#333333'; // Default dark gray
  }
};

/**
 * Get appropriate background color for status
 * @param {String} status - The document status
 * @returns {String} - Background color for the status
 */
export const getStatusBackgroundColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return '#d4edda'; // Light green
    case 'rejected':
      return '#f8d7da'; // Light red
    case 'pending':
      return '#fff3cd'; // Light yellow
    case 'archived':
      return '#e2e3e5'; // Light gray
    default:
      return '#f8f9fa'; // Default light gray
  }
};

/**
 * Get status icon for visual representation
 * @param {String} status - The document status
 * @returns {String} - Icon representing the status
 */
export const getStatusIcon = (status) => {
  switch (status?.toLowerCase()) {
    case 'approved':
      return '✓'; // Checkmark
    case 'rejected':
      return '✗'; // X mark
    case 'pending':
      return '⟳'; // Circular arrow
    case 'archived':
      return '◉'; // Filled circle
    default:
      return '•'; // Bullet point
  }
};
