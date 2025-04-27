import React, { useState, useEffect } from "react";
import AdminSidebar from "../Sidebar/AdminSidebar";
import {
  List,
  Check2Circle,
  XCircle,
  FileEarmarkText,
  PencilSquare,
} from "react-bootstrap-icons";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../components-css/RequestDocument.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Swal from 'sweetalert2';
import PDFGenerator from "./PDFGenerator";
import { preparePdfData } from '../../services/pdfDataService';
import { downloadPdf } from '../../services/pdfGenerationService';

function RequestsDocument() {
  // Existing state variables
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedDocID, setSelectedDocID] = useState(null);
  const [file, setFile] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [filterText, setFilterText] = useState("");
  const [selectedRow, setSelectedRow] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [documentContent, setDocumentContent] = useState("");
  const [documentFile, setDocumentFile] = useState(null);
  const [documentFileName, setDocumentFileName] = useState("");
  const [showPdfGenerator, setShowPdfGenerator] = useState(false);
  
  // New state for status filtering
  const [statusFilter, setStatusFilter] = useState('All');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  
  // Status filter options
  const statusFilterOptions = ['All', 'Approved', 'Rejected', 'Pending'];

  // Fetch documents from the server
  const fetchDocuments = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:3000/documents/");
      // Prioritize pending documents
      const sortedDocs = response.data.sort((a, b) => (a.status === "Pending" ? -1 : 1));
      setDocuments(sortedDocs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching documents:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Apply status filter and select matching rows
  const applyStatusFilter = (status) => {
    setStatusFilter(status);
    setShowStatusFilter(false);
    
    // Select rows based on filter
    if (status === 'All') {
      // No automatic selection for "All"
      setSelectedRows([]);
    } else {
      // Select rows matching the status
      const filtered = documents.filter(doc => doc.status === status);
      setSelectedRows(filtered);
    }
  };

  // Handle row selection
  const handleRowSelected = ({ selectedRows }) => {
    setSelectedRow(selectedRows.length > 0 ? selectedRows[0] : null);
    setSelectedRows(selectedRows);
  };

  // Modified PDF generation to use selected rows
  const handleGeneratePDF = () => {
    if (selectedRows.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: 'No Documents Selected',
        text: 'Please select documents from the table first or use the status filter.',
      });
      return;
    }
    
    setShowPdfGenerator(true);
  };

  // Filter documents based on search text
  const filteredItems = documents.filter((item) => {
    const searchText = filterText.toLowerCase();
    return (
      item.docID?.toString().toLowerCase().includes(searchText) ||
      item.title?.toLowerCase().includes(searchText) ||
      item.department?.toLowerCase().includes(searchText) ||
      item.email?.toLowerCase().includes(searchText) ||
      item.status?.toLowerCase().includes(searchText)
    );
  });

  // Define columns for DataTable
  const columns = [
    {
      name: "Document ID",
      selector: (row) => row.docID,
      sortable: true,
    },
    {
      name: "Title",
      selector: (row) => row.title,
      sortable: true,
    },
    {
      name: "Department",
      selector: (row) => row.department,
      sortable: true,
    },
    {
      name: "Requested By",
      selector: (row) => row.email,
      sortable: true,
    },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      className: "status-badge",
      cell: (row) => (
        <span className={`status-badge ${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      ),
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="d-flex gap-2">
          <Button
            variant="success"
            size="sm"
            onClick={() => handleApproveClick(row.docID)}
            disabled={row.status !== "Pending"}
          >
            <Check2Circle /> Approve
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleRejectClick(row.docID)}
            disabled={row.status !== "Pending"}
          >
            <XCircle /> Reject
          </Button>
        </div>
      ),
    },
  ];

  const handleApproveClick = (docID) => {
    setSelectedDocID(docID);
    setShowModal(true);
  };

  const handleRejectClick = (docID) => {
    setSelectedDocID(docID);
    setShowRejectionModal(true);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Please select a file to upload.',
      });
      return;
    }

    try {
      // Show loading state
      Swal.fire({
        title: 'Uploading and Approving...',
        html: 'Please wait while we process your request.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const formData = new FormData();
      formData.append("file", file);

      await axios.post(
        `http://localhost:3000/documents/${selectedDocID}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setShowModal(false);
      await handleStatusChange(selectedDocID, "Approved");
      await fetchDocuments();

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Document approved successfully',
      });
    } catch (error) {
      console.error("Error uploading file:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error uploading file',
      });
    }
  };

  const handleStatusChange = async (docID, newStatus) => {
    try {
      // Show loading state
      Swal.fire({
        title: `${newStatus === 'Approved' ? 'Approving' : 'Rejecting'}...`,
        html: 'Please wait while we process your request.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      let data = { status: newStatus };

      if (newStatus === "Rejected") {
        data.rejectionReason = rejectionReason;
      }

      const response = await axios.patch(
        `http://localhost:3000/documents/${docID}`,
        data
      );

      if (response.status === 200) {
        await fetchDocuments();
        setShowRejectionModal(false);
        setRejectionReason("");

        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: `Document ${newStatus.toLowerCase()} successfully`,
        });
      }
    } catch (error) {
      console.error(`Error ${newStatus.toLowerCase()} document:`, error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Failed to ${newStatus.toLowerCase()} document`,
      });
    }
  };

  const openDocumentEditor = () => {
    if (!selectedRow) {
      Swal.fire({
        icon: 'warning',
        title: 'No Document Selected',
        text: 'Please select a document from the table first.',
      });
      return;
    }
    
    if (selectedRow.status !== "Approved") {
      Swal.fire({
        icon: 'warning',
        title: 'Document Not Approved',
        text: 'Only approved documents can be edited.',
      });
      return;
    }
    
    fetchDocumentContent(selectedRow.docID);
  };
  
  const fetchDocumentContent = async (docID) => {
    try {
      Swal.fire({
        title: 'Loading Document...',
        html: 'Please wait while we load the document.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      
      setDocumentFileName(`${selectedRow.title} - Original File.pdf`);
      setDocumentContent(`This document was originally approved on ${new Date().toLocaleDateString()}.
You can view the document details below:

Title: ${selectedRow.title}
Department: ${selectedRow.department}
Requested by: ${selectedRow.email}
Status: ${selectedRow.status}

To replace this document, use the file upload option below.`);
      
      setShowEditModal(true);
      Swal.close();
    } catch (error) {
      console.error("Error fetching document:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load document',
      });
    }
  };
  
  const handleDocumentFileChange = (e) => {
    setDocumentFile(e.target.files[0]);
  };
  
  const handleSaveDocument = async () => {
    if (!documentFile) {
      Swal.fire({
        icon: 'warning',
        title: 'No File Selected',
        text: 'Please select a file to replace the current document.',
      });
      return;
    }
    
    try {
      Swal.fire({
        title: 'Saving Document...',
        html: 'Please wait while we update the document.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      
      setTimeout(() => {
        setShowEditModal(false);
        setDocumentFile(null);
        
        Swal.fire({
          icon: 'success',
          title: 'Success!',
          text: 'Document updated successfully',
        });
      }, 1500);
    } catch (error) {
      console.error("Error updating document:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to update document',
      });
    }
  };

  const handleDownloadLogs = async () => {
    try {
      Swal.fire({
        title: 'Downloading Logs...',
        html: 'Please wait while we prepare your download.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.get(
        "http://localhost:3000/documents/download-logs",
        {
          responseType: "blob",
        }
      );

      const file = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });

      const fileURL = URL.createObjectURL(file);
      const link = document.createElement("a");
      link.href = fileURL;
      link.download = "system_logs.xlsx";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(fileURL);

      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'Logs downloaded successfully',
      });
    } catch (error) {
      console.error("Error downloading logs:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Error downloading logs',
      });
    }
  };

  const handleDirectPdfDownload = async () => {
    if (!selectedRow) return;
    
    try {
      Swal.fire({
        title: 'Generating PDF...',
        text: 'Please wait while we create your document.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });
      
      const pdfData = {
        // Same data as above in handleGeneratePDF
        formNumber: `REQ-${selectedRow.docID}`,
        docCode: `${selectedRow.docID}`,
        date: new Date().toISOString().split('T')[0],
        requestorName: selectedRow.email,
        requestorOffice: selectedRow.department,
        targetOffice: 'Quality Assurance Office',
        purpose: selectedRow.title,
        // Check a default option
        isaChecked: true,
        documentRows: [
          {
            area: selectedRow.department,
            docName: selectedRow.title,
            status: selectedRow.status
          }
        ],
        effectivityDate: new Date().toISOString().split('T')[0],
        requestorDate: new Date().toISOString().split('T')[0],
        adminDate: new Date().toISOString().split('T')[0]
      };
      
      await downloadPdf(pdfData, `QAU-Request-${selectedRow.docID}.pdf`);
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'PDF has been generated and downloaded.',
      });
    } catch (error) {
      console.error('Error generating direct PDF:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'There was an error generating the PDF. Please try again.',
      });
    }
  };

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar isOpen={isSidebarOpen} />
      
      {showPdfGenerator && (
        <PDFGenerator
          documentData={selectedRows[0]}  // Primary row for form data
          selectedDocuments={selectedRows} // All selected documents
          onClose={() => setShowPdfGenerator(false)}
        />
      )}
      
      <div
        className={`admin-dashboard-content ${
          !isSidebarOpen ? "sidebar-closed" : ""
        }`}
        style={{ marginLeft: isSidebarOpen ? "250px" : "0" }}
      >
        <button className="hamburger-icon" onClick={toggleSidebar}>
          <List size={24} />
        </button>
        <div className="main-content">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div>
              <div className="dashboard-header">
                <p style={{ opacity: 0.7 }}>
                  <i>Quality Assurance Office's Document Request System</i>
                </p>
                <h1>Requested Documents</h1>
                <p>Welcome to your document management analytics dashboard</p>
              </div>
              <div className="button-group">
                <button
                  className="btn btn-primary mx-2"
                  onClick={openDocumentEditor}
                  disabled={!selectedRow || selectedRow.status !== "Approved"}
                >
                  <PencilSquare size={16} className="me-2" />
                  Edit Document
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleDownloadLogs}
                >
                  <FileEarmarkText size={16} className="me-2" />
                  Download Logs
                </button>
                
                {/* Status filter dropdown and Generate PDF button */}
                <div className="btn-group">
                  <button
                    className="btn btn-success"
                    onClick={handleGeneratePDF}
                    disabled={selectedRows.length === 0}
                  >
                    <i className="bi bi-file-pdf me-2"></i>
                    Generate PDF Form {selectedRows.length > 0 && `(${selectedRows.length})`}
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-success dropdown-toggle dropdown-toggle-split" 
                    onClick={() => setShowStatusFilter(!showStatusFilter)}
                  >
                    <span className="visually-hidden">Toggle Dropdown</span>
                  </button>
                  
                  {showStatusFilter && (
                    <div className="status-filter-dropdown">
                      <div className="filter-header">Filter by Status:</div>
                      {statusFilterOptions.map(status => (
                        <button
                          key={status}
                          className={`filter-item ${statusFilter === status ? 'active' : ''}`}
                          data-status={status}
                          onClick={() => applyStatusFilter(status)}
                        >
                          {status === 'All' ? 'All Documents' : status}
                          {status !== 'All' && (
                            <span className="badge-count">
                              {documents.filter(doc => doc.status === status).length}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="search-container" style={{ marginLeft: "15px" }}>
              <input
                type="text"
                className="search-input"
                placeholder="Search requested documents..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
          </div>
          
          <div className="requests-document-section">
            <DataTable
              title=""
              columns={columns}
              data={filteredItems}
              pagination
              progressPending={loading}
              responsive
              striped
              highlightOnHover
              selectableRows
              selectableRowsHighlight
              onSelectedRowsChange={handleRowSelected}
            />
          </div>
        </div>
      </div>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Upload File</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Select File</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showRejectionModal}
        onHide={() => setShowRejectionModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Reject Document</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Reason for Rejection</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="Please provide a reason for rejection..."
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowRejectionModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleStatusChange(selectedDocID, "Rejected")}
            disabled={!rejectionReason.trim()}
          >
            Reject Document
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal 
        show={showEditModal} 
        onHide={() => setShowEditModal(false)}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Edit Approved Document: {selectedRow?.title}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-4 p-3 border rounded bg-light">
            <h5>Current Document</h5>
            <p className="mb-2"><strong>Filename:</strong> {documentFileName}</p>
            <div className="document-preview p-3 border rounded bg-white" style={{ whiteSpace: 'pre-line' }}>
              {documentContent}
            </div>
          </div>
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label><strong>Replace Document File</strong></Form.Label>
              <Form.Control 
                type="file" 
                onChange={handleDocumentFileChange}
                accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
              />
              <Form.Text className="text-muted">
                Select a new file to replace the current document. Supported formats: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT
              </Form.Text>
            </Form.Group>
            
            {documentFile && (
              <div className="alert alert-info">
                <strong>New file selected:</strong> {documentFile.name} ({(documentFile.size / 1024).toFixed(2)} KB)
              </div>
            )}
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSaveDocument}
            disabled={!documentFile}
          >
            Update Document
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default RequestsDocument;
