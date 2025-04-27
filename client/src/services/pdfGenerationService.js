import React from 'react';
import { pdf } from '@react-pdf/renderer';
import DocumentRequestPDF from '../components/Admin/DocumentRequestPDF';
import MultiPageDocumentRequestPDF from '../components/Admin/MultiPageDocumentRequestPDF';
import StatusReportPDF from '../components/Admin/StatusReportPDF';
import { preparePdfData, prepareDocumentRows, prepareReportData } from './pdfDataService';

/**
 * Generate a PDF blob from form data
 * @param {Object} formData The form data to use for the PDF
 * @returns {Promise<Blob>} A promise that resolves to a PDF blob
 */
export const generatePdf = async (formData) => {
  try {
    // Check if this is a status report generation
    if (formData.reportType === 'status-based') {
      const reportData = prepareReportData(formData);
      
      // Create PDF document using React.createElement instead of JSX
      const pdfDocument = React.createElement(StatusReportPDF, {
        data: reportData
      });
      
      // Create blob
      const blob = await pdf(pdfDocument).toBlob();
      return blob;
    } else {
      // Standard document request PDF generation
      const pdfData = preparePdfData(formData);
      const documentRows = prepareDocumentRows(formData);
      
      // Use MultiPageDocumentRequestPDF when there are more than 15 rows
      const PdfComponent = documentRows.length > 15 
        ? MultiPageDocumentRequestPDF 
        : DocumentRequestPDF;
      
      // Create PDF document using React.createElement instead of JSX
      const pdfDocument = React.createElement(PdfComponent, {
        data: pdfData,
        documentRows: documentRows
      });
      
      // Create blob
      const blob = await pdf(pdfDocument).toBlob();
      return blob;
    }
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

/**
 * Download a PDF from form data
 * @param {Object} formData The form data to use for the PDF
 * @param {string} filename The filename for the PDF
 */
export const downloadPdf = async (formData, filename = 'document-request-form.pdf') => {
  try {
    const blob = await generatePdf(formData);
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary link element
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    
    // Trigger the download
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error downloading PDF:', error);
    throw error;
  }
};
