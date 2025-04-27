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

// Register fonts with all required variants
Font.register({
  family: 'Roboto',
  fonts: [
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-regular-webfont.ttf', fontWeight: 'normal' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bold-webfont.ttf', fontWeight: 'bold' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-italic-webfont.ttf', fontStyle: 'italic' },
    { src: 'https://cdnjs.cloudflare.com/ajax/libs/ink/3.1.10/fonts/Roboto/roboto-bolditalic-webfont.ttf', fontWeight: 'bold', fontStyle: 'italic' }
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
  section: {
    margin: 10,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    height: 24,
    fontSize: 12,
    paddingLeft: 8,
  },
  formRow: {
    flexDirection: 'row',
    marginBottom: 10,
    alignItems: 'center',
  },
  label: {
    width: '30%',
    fontSize: 12,
  },
  value: {
    width: '70%',
    fontSize: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#112131',
    borderBottomStyle: 'solid',
    paddingBottom: 2,
  },
  checkboxRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  checkbox: {
    width: 12,
    height: 12,
    borderWidth: 1,
    borderColor: '#000000',
    marginRight: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxLabel: {
    fontSize: 10,
  },
  checkMark: {
    fontSize: 10,
    color: '#000000',
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
    backgroundColor: '#f0f0f0',
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
  footerText: {
    fontSize: 8,
    textAlign: 'center',
    marginTop: 20,
    color: 'grey',
  },
  signature: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  signatureBox: {
    width: '45%',
  },
  signatureLine: {
    borderTopWidth: 1,
    borderTopColor: '#000000',
    borderTopStyle: 'solid',
    marginTop: 40,
    marginBottom: 5,
  },
  signatureLabel: {
    fontSize: 10,
    textAlign: 'center',
  },
  disclaimer: {
    marginTop: 20,
    fontSize: 8,
    fontStyle: 'italic',
  },
  statusFilterInfo: {
    marginBottom: 10,
    padding: 5,
    backgroundColor: '#f8f9fa',
    borderRadius: 4,
  },
  statusFilterText: {
    fontSize: 10,
    color: '#495057',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

// Function to safely render text with a placeholder fallback
const SafeText = ({ value, placeholder, style }) => (
  <Text style={style}>{value || placeholder}</Text>
);

// Helper for text that would normally be italic
const DisclaimerText = ({ children, style }) => (
  <Text style={{...style, fontWeight: 'normal'}}>{children}</Text>
);

const DocumentRequestPDF = ({ data = {}, documentRows = [] }) => (
  <Document>
    <Page size="A4" style={styles.page} wrap>
      {/* Header Section */}
      <View style={styles.header}>
        <Image 
          style={styles.logo} 
          src="/src/assets/logo.png" 
        />
        <View style={styles.headerText}>
          <Text style={styles.title}>BUKIDNON STATE UNIVERSITY</Text>
          <Text style={styles.subtitle}>Quality Assurance Unit</Text>
          <Text style={styles.subtitle}>Supporting Documents Request Form</Text>
        </View>
      </View>
      
      {/* Document Metadata */}
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
      
      {/* Add status filter information if present */}
      {data.statusFilterInfo && (
        <View style={styles.statusFilterInfo}>
          <Text style={styles.statusFilterText}>{data.statusFilterInfo}</Text>
        </View>
      )}
      
      {/* Requestor Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Requestor Information</Text>
        
        <View style={styles.formRow}>
          <Text style={styles.label}>Name:</Text>
          <SafeText 
            value={data.requestorName}
            placeholder="{{REQUESTOR_NAME}}"
            style={styles.value}
          />
        </View>
        
        <View style={styles.formRow}>
          <Text style={styles.label}>Office/Department:</Text>
          <SafeText 
            value={data.requestorOffice}
            placeholder="{{REQUESTOR_OFFICE}}"
            style={styles.value}
          />
        </View>
        
        <View style={styles.formRow}>
          <Text style={styles.label}>Target Office:</Text>
          <SafeText 
            value={data.targetOffice}
            placeholder="{{TARGET_OFFICE}}"
            style={styles.value}
          />
        </View>
        
        <View style={styles.formRow}>
          <Text style={styles.label}>Purpose:</Text>
          <SafeText 
            value={data.purpose}
            placeholder="{{REQUEST_PURPOSE}}"
            style={styles.value}
          />
        </View>
      </View>
      
      {/* QAU Process Checkboxes */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Document Processing</Text>
        
        <View style={styles.checkboxRow}>
          <View style={styles.checkbox}>
            <Text style={styles.checkMark}>{getCheckMarkValue(data.isaChecked)}</Text>
          </View>
          <Text style={styles.checkboxLabel}>Internal Self-Assessment</Text>
        </View>
        
        <View style={styles.checkboxRow}>
          <View style={styles.checkbox}>
            <Text style={styles.checkMark}>{getCheckMarkValue(data.monitoringChecked)}</Text>
          </View>
          <Text style={styles.checkboxLabel}>Monitoring & Evaluation</Text>
        </View>
        
        <View style={styles.checkboxRow}>
          <View style={styles.checkbox}>
            <Text style={styles.checkMark}>{getCheckMarkValue(data.accreditationChecked)}</Text>
          </View>
          <Text style={styles.checkboxLabel}>Accreditation</Text>
        </View>
        
        <View style={styles.checkboxRow}>
          <View style={styles.checkbox}>
            <Text style={styles.checkMark}>{getCheckMarkValue(data.certificationChecked)}</Text>
          </View>
          <Text style={styles.checkboxLabel}>ISO Certification</Text>
        </View>
        
        <View style={styles.checkboxRow}>
          <View style={styles.checkbox}>
            <Text style={styles.checkMark}>{getCheckMarkValue(data.otherChecked)}</Text>
          </View>
          <Text style={styles.checkboxLabel}>
            Other: {data.otherChecked ? data.otherSpecify || '' : '{{OTHER_SPECIFY}}'}
          </Text>
        </View>
      </View>
      
      {/* Document Table - Modified for better pagination */}
      <View style={styles.table}>
        {/* Table Header */}
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
        
        {/* Table Rows - Split into chunks of 10 for better pagination */}
        {documentRows.map((row, index) => (
          <View style={styles.tableRow} key={index} wrap={false}>
            <View style={[styles.tableCell, { width: '10%' }]}>
              <Text>{row.num}</Text>
            </View>
            <View style={[styles.tableCell, { width: '20%' }]}>
              <SafeText 
                value={row.area}
                placeholder={`{{AREA_${row.num}}}`}
                style={{fontSize: 10}}
              />
            </View>
            <View style={[styles.tableCell, { width: '50%' }]}>
              <SafeText 
                value={row.docName}
                placeholder={`{{DOCNAME_${row.num}}}`}
                style={{fontSize: 10}}
              />
            </View>
            <View style={[styles.tableCell, { width: '20%' }]}>
              <SafeText 
                value={row.status}
                placeholder={`{{STATUS_${row.num}}}`}
                style={{fontSize: 10}}
              />
            </View>
          </View>
        ))}
      </View>
      
      {/* Legal Text and Disclaimers - Modified to avoid italics */}
      <View style={styles.disclaimer}>
        <DisclaimerText>
          I hereby certify that these documents are needed for the purpose stated above.
          I understand that all documents must be returned to the Quality Assurance Unit
          within 7 working days from receipt.
        </DisclaimerText>
      </View>
      
      {/* Signature Section */}
      <View style={styles.signature}>
        <View style={styles.signatureBox}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureLabel}>
            Requestor's Signature
          </Text>
          <Text style={styles.signatureLabel}>
            Date: {data.requestorDate || "{{REQUESTOR_DATE}}"}
          </Text>
        </View>
        
        <View style={styles.signatureBox}>
          <View style={styles.signatureLine} />
          <Text style={styles.signatureLabel}>
            Approved by: QA Director/Staff
          </Text>
          <Text style={styles.signatureLabel}>
            Date: {data.adminDate || "{{ADMIN_DATE}}"}
          </Text>
        </View>
      </View>
      
      {/* Footer */}
      <Text style={styles.footerText}>
        QAU-SDRF-001 • Rev 0 • {data.effectivityDate || "{{EFFECTIVITY_DATE}}"}
      </Text>
    </Page>
  </Document>
);

export default DocumentRequestPDF;
