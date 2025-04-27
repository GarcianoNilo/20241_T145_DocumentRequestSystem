import React from "react";
import { 
  Document, 
  Page, 
  Text, 
  View, 
  StyleSheet
} from '@react-pdf/renderer';
import { 
  getStatusColor, 
  getStatusBackgroundColor,
  getStatusIcon
} from '../../services/pdfDataService';

// Register fonts with all required variants
const styles = StyleSheet.create({
  page: {
    padding: 30,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#112131',
    borderBottomStyle: 'solid',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingBottom: 10,
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerDate: {
    fontSize: 12,
    color: '#555',
  },
  reportTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  statusBanner: {
    padding: 8,
    borderRadius: 5,
    marginBottom: 15,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    paddingBottom: 5,
  },
  commentSection: {
    marginVertical: 10,
    padding: 8,
    backgroundColor: '#f5f5f5',
    borderRadius: 5,
  },
  commentText: {
    fontSize: 12,
    fontStyle: 'normal',
  },
  table: {
    display: 'flex',
    width: 'auto',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#EEEEEE',
    marginVertical: 15,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
  },
  tableRowEven: {
    backgroundColor: '#F8F8F8',
  },
  tableHeader: {
    backgroundColor: '#343a40',
  },
  tableHeaderCell: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    padding: 6,
    fontSize: 11,
  },
  tableCell: {
    fontSize: 10,
    padding: 6,
    textOverflow: 'ellipsis',
  },
  statusCell: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  statusIcon: {
    marginRight: 4,
    fontSize: 10,
    fontWeight: 'bold',
  },
  statusText: {
    fontSize: 10,
  },
  colDocId: { width: '10%' },
  colTitle: { width: '25%' },
  colDepartment: { width: '15%' },
  colRequester: { width: '25%' },
  colStatus: { width: '15%' },
  colDate: { width: '10%' },
  summarySection: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#F8F9FA',
    borderRadius: 5,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
    fontSize: 11,
  },
  summaryLabel: {
    width: '60%',
  },
  summaryValue: {
    width: '40%',
    textAlign: 'right',
  },
  summaryTotal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
    marginTop: 5,
    paddingTop: 5,
    fontWeight: 'bold',
    fontSize: 11,
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    fontSize: 10,
    color: '#666',
    textAlign: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#EEEEEE',
  },
});

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (e) {
    return dateString;
  }
};

// Status Badge component
const StatusBadge = ({ status }) => (
  <View style={[
    styles.statusCell, 
    { backgroundColor: getStatusBackgroundColor(status) }
  ]}>
    <Text style={[styles.statusIcon, { color: getStatusColor(status) }]}>
      {getStatusIcon(status)}
    </Text>
    <Text style={[styles.statusText, { color: getStatusColor(status) }]}>
      {status}
    </Text>
  </View>
);

// Status Report PDF Component
const StatusReportPDF = ({ data = {} }) => {
  const {
    reportTitle,
    reportDate,
    documents,
    statuses,
    statusCounts,
    totalDocuments,
    comment
  } = data;

  const hasMultipleStatuses = statuses?.length > 1 || statuses?.includes('All');
  
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Quality Assurance Office</Text>
          <Text style={styles.headerDate}>Generated on: {reportDate}</Text>
        </View>
        
        {/* Report Title */}
        <Text style={styles.reportTitle}>{reportTitle}</Text>
        
        {/* Status Banner - Show only if single status selected */}
        {statuses?.length === 1 && statuses[0] !== 'All' && (
          <View style={[
            styles.statusBanner,
            { backgroundColor: getStatusBackgroundColor(statuses[0]) }
          ]}>
            <Text style={{ color: getStatusColor(statuses[0]) }}>
              {getStatusIcon(statuses[0])} Status: {statuses[0]}
            </Text>
          </View>
        )}
        
        {/* Optional Comment Section */}
        {comment && (
          <View style={styles.commentSection}>
            <Text style={styles.commentText}>{comment}</Text>
          </View>
        )}
        
        {/* Documents Table */}
        <Text style={styles.sectionTitle}>Document List</Text>
        <View style={styles.table}>
          {/* Table Header */}
          <View style={[styles.tableRow, styles.tableHeader]}>
            <Text style={[styles.tableHeaderCell, styles.colDocId]}>Doc ID</Text>
            <Text style={[styles.tableHeaderCell, styles.colTitle]}>Title</Text>
            <Text style={[styles.tableHeaderCell, styles.colDepartment]}>Department</Text>
            <Text style={[styles.tableHeaderCell, styles.colRequester]}>Requested By</Text>
            <Text style={[styles.tableHeaderCell, styles.colStatus]}>Status</Text>
            <Text style={[styles.tableHeaderCell, styles.colDate]}>Date</Text>
          </View>
          
          {/* Table Rows */}
          {documents?.map((doc, index) => (
            <View key={`doc-${doc.docID || index}`} style={[
              styles.tableRow,
              index % 2 === 1 && styles.tableRowEven
            ]}>
              <Text style={[styles.tableCell, styles.colDocId]}>{doc.docID}</Text>
              <Text style={[styles.tableCell, styles.colTitle]}>{doc.title}</Text>
              <Text style={[styles.tableCell, styles.colDepartment]}>{doc.department}</Text>
              <Text style={[styles.tableCell, styles.colRequester]}>{doc.email}</Text>
              <View style={[styles.colStatus]}>
                <StatusBadge status={doc.status} />
              </View>
              <Text style={[styles.tableCell, styles.colDate]}>
                {formatDate(doc.createdAt)}
              </Text>
            </View>
          ))}
        </View>
        
        {/* Summary Section - Show if multiple statuses or "All" selected */}
        {hasMultipleStatuses && statusCounts && (
          <View style={styles.summarySection}>
            <Text style={styles.summaryTitle}>Summary</Text>
            {Object.entries(statusCounts).map(([status, count]) => (
              <View key={`status-${status}`} style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>
                  {getStatusIcon(status)} {status}
                </Text>
                <Text style={styles.summaryValue}>{count}</Text>
              </View>
            ))}
            <View style={styles.summaryTotal}>
              <Text style={styles.summaryLabel}>Total Documents</Text>
              <Text style={styles.summaryValue}>{totalDocuments}</Text>
            </View>
          </View>
        )}
        
        {/* Footer */}
        <View style={styles.footer} fixed>
          <Text>
            Document Status Report • Generated by Document Request System • 
            Page 1 of 1
          </Text>
        </View>
      </Page>
    </Document>
  );
};

export default StatusReportPDF;
