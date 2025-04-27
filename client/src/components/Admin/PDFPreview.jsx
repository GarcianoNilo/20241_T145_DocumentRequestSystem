import React from 'react';
import { PDFViewer } from '@react-pdf/renderer';
import DocumentRequestPDF from './DocumentRequestPDF';
import MultiPageDocumentRequestPDF from './MultiPageDocumentRequestPDF';

const PDFPreview = ({ data, documentRows }) => {
  // Use MultiPageDocumentRequestPDF when there are more than 15 rows
  const PdfComponent = documentRows.length > 15 
    ? MultiPageDocumentRequestPDF 
    : DocumentRequestPDF;
    
  return (
    <PDFViewer width="100%" height="600px" style={{border: '1px solid #ddd', borderRadius: '4px'}}>
      <PdfComponent data={data} documentRows={documentRows} />
    </PDFViewer>
  );
};

export default PDFPreview;
