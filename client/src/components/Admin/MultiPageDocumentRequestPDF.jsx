import React from "react";
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet, 
  Image,
  Font 
} from '@react-pdf/renderer';
import { getCheckMarkValue } from '../../services/pdfDataService';

// Register fonts
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
  ]
});

// Create styles
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    padding: 30,
    fontFamily: 'Roboto',
  },
  header: {
    flexDirection: 'row',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#112131',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    paddingBottom: 10,
  },
  logo: {
    width: 80,
    height: 80,
    marginRight: 10,
  },
  headerText: {
    flex: 1,
    flexDirection: 'column',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 12,
    fontWeight: 'normal',
    textAlign: 'center',
    color: 'grey',
  },
  docMetadata: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    fontSize: 10,
  },
  table: {
    display: 'table',
    width: 'auto',
    margin: 10,
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#000',
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
  },
  tableHeaderCell: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#000',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontSize: 10,
    fontWeight: 'bold',
  },
  tableRow: {
    flexDirection: 'row',
  },
  tableCell: {
    padding: 5,
    borderWidth: 1,
    borderColor: '#000',
    borderLeftWidth: 0,
    borderTopWidth: 0,
    fontSize: 10,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    textAlign: 'center',
    color: 'grey',
  },
  pageNumber: {
    position: 'absolute',
    bottom: 10,
    right: 30,
    fontSize: 8,
    color: 'grey',
  },
});

// Function to safely render text with a placeholder fallback
const SafeText = ({ value, placeholder, style }) => (
  <Text style={style}>{value || placeholder}</Text>
);

// Header component that appears on each page
const Header = ({ data }) => (
  <View style={styles.header} fixed>
    <View style={styles.headerText}>
      <Text style={styles.title}>BUKIDNON STATE UNIVERSITY</Text>
      <Text style={styles.subtitle}>Quality Assurance Unit</Text>
      <Text style={styles.subtitle}>Supporting Documents Request Form</Text>
    </View>
  </View>
);

// Footer component that appears on each page
const Footer = ({ data, pageNumber }) => (
  <>
    <Text style={styles.footer} fixed>
      QAU-SDRF-001 • Rev 0 • {data.effectivityDate || "{{EFFECTIVITY_DATE}}"}
    </Text>
    <Text style={styles.pageNumber} fixed render={({ pageNumber, totalPages }) => (
      `Page ${pageNumber} of ${totalPages}`
    )} />
  </>
);

// Main PDF component with pagination support
const MultiPageDocumentRequestPDF = ({ data = {}, documentRows = [] }) => {
  // Calculate how many rows will fit per page (approximately)
  const rowsPerPage = 20;
  const totalRows = documentRows.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage) + 1; // Add 1 for first page with metadata
  
  // Split rows into chunks for each page
  const chunks = [];
  for (let i = 0; i < totalRows; i += rowsPerPage) {
    chunks.push(documentRows.slice(i, i + rowsPerPage));
  }
  
  return (
    <Document>
      {/* First page with form details */}
      <Page size="A4" style={styles.page}>
        <Header data={data} />
        <View style={styles.docMetadata}>
          <SafeText 
            value={`Form Number: ${data.formNumber || ''}`}
            placeholder="Form Number: {{FORM_NUMBER}}"
            style={{fontSize: 10}}
          />
          <SafeText 
            value={`Document Code: ${data.formattedDocCode || ''}`}
            placeholder="Document Code: QAU-SDRF-{{DOC_CODE}}"
            style={{fontSize: 10}}
          />
          <SafeText 
            value={`Date: ${data.date || ''}`}
            placeholder="Date: {{REQUEST_DATE}}"
            style={{fontSize: 10}}
          />
        </View>
        
        {/* Document Table - First part */}
        <View style={styles.table}>
          <View style={styles.tableHeader} fixed>
            <View style={[styles.tableHeaderCell, { width: '10%' }]}>
              <Text>No.</Text>
            </View>
            <View style={[styles.tableHeaderCell, { width: '20%' }]}>
              <Text>Area/Category</Text>
            </View>
            <View style={[styles.tableHeaderCell, { width: '50%' }]}>
              <Text>Document Name/Description</Text>
            </View>
            <View style={[styles.tableHeaderCell, { width: '20%' }]}>
              <Text>Status</Text>
            </View>
          </View>
          
          {/* First page rows */}
          {chunks.length > 0 && chunks[0].slice(0, 10).map((row, index) => (
            <View style={styles.tableRow} key={index} wrap={false}>
              <View style={[styles.tableCell, { width: '10%' }]}>
                <Text>{row.num}</Text>
              </View>
              <View style={[styles.tableCell, { width: '20%' }]}>
                <SafeText value={row.area} placeholder="" style={{fontSize: 10}} />
              </View>
              <View style={[styles.tableCell, { width: '50%' }]}>
                <SafeText value={row.docName} placeholder="" style={{fontSize: 10}} />
              </View>
              <View style={[styles.tableCell, { width: '20%' }]}>
                <SafeText value={row.status} placeholder="" style={{fontSize: 10}} />
              </View>
            </View>
          ))}
        </View>
        <Footer data={data} />
      </Page>
      
      {/* Additional pages for remaining rows */}
      {totalRows > 10 && chunks.map((chunk, pageIndex) => (
        <Page key={`page-${pageIndex + 1}`} size="A4" style={styles.page}>
          <Header data={data} />
          
          <View style={[styles.table, { marginTop: 30 }]}>
            <View style={styles.tableHeader} fixed>
              <View style={[styles.tableHeaderCell, { width: '10%' }]}>
                <Text>No.</Text>
              </View>
              <View style={[styles.tableHeaderCell, { width: '20%' }]}>
                <Text>Area/Category</Text>
              </View>
              <View style={[styles.tableHeaderCell, { width: '50%' }]}>
                <Text>Document Name/Description</Text>
              </View>
              <View style={[styles.tableHeaderCell, { width: '20%' }]}>
                <Text>Status</Text>
              </View>
            </View>
            
            {/* Page rows */}
            {(pageIndex === 0 ? chunk.slice(10) : chunk).map((row, index) => (
              <View style={styles.tableRow} key={index} wrap={false}>
                <View style={[styles.tableCell, { width: '10%' }]}>
                  <Text>{row.num}</Text>
                </View>
                <View style={[styles.tableCell, { width: '20%' }]}>
                  <SafeText value={row.area} placeholder="" style={{fontSize: 10}} />
                </View>
                <View style={[styles.tableCell, { width: '50%' }]}>
                  <SafeText value={row.docName} placeholder="" style={{fontSize: 10}} />
                </View>
                <View style={[styles.tableCell, { width: '20%' }]}>
                  <SafeText value={row.status} placeholder="" style={{fontSize: 10}} />
                </View>
              </View>
            ))}
          </View>
          <Footer data={data} />
        </Page>
      ))}
    </Document>
  );
};

export default MultiPageDocumentRequestPDF;
