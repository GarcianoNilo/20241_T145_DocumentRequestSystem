import React, { useState, useEffect } from "react";
import AdminSidebar from "../Sidebar/AdminSidebar";
<<<<<<< HEAD
import { List, Check2Square, XSquare } from "react-bootstrap-icons";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../components-css/RequestDocument.css";

=======
import {
  List,
  Check2Circle,
  XCircle,
  FileEarmarkText,
} from "react-bootstrap-icons";
import DataTable from "react-data-table-component";
import axios from "axios";
import "../components-css/RequestDocument.css";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Swal from 'sweetalert2';
>>>>>>> main

function RequestsDocument() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
<<<<<<< HEAD
=======
  const [showModal, setShowModal] = useState(false);
  const [selectedDocID, setSelectedDocID] = useState(null);
  const [file, setFile] = useState(null);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [filterText, setFilterText] = useState("");
>>>>>>> main

  // Define columns for DataTable
  const columns = [
    {
      name: "Document ID",
<<<<<<< HEAD
      selector: row => row.docID,
=======
      selector: (row) => row.docID,
>>>>>>> main
      sortable: true,
    },
    {
      name: "Title",
<<<<<<< HEAD
      selector: row => row.title,
=======
      selector: (row) => row.title,
>>>>>>> main
      sortable: true,
    },
    {
      name: "Department",
<<<<<<< HEAD
      selector: row => row.department,
=======
      selector: (row) => row.department,
>>>>>>> main
      sortable: true,
    },
    {
      name: "Requested By",
<<<<<<< HEAD
      selector: row => row.email,
=======
      selector: (row) => row.email,
>>>>>>> main
      sortable: true,
    },
    {
      name: "Status",
<<<<<<< HEAD
      selector: row => row.status,
      sortable: true,
=======
      selector: (row) => row.status,
      sortable: true,
      className: "status-badge",
      cell: (row) => (
        <span className={`status-badge ${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      ),
>>>>>>> main
    },
    {
      name: "Actions",
      cell: (row) => (
<<<<<<< HEAD
        <div className="action-buttons">
          <button
            className="btn btn-success btn-sm mx-1"
            onClick={() => handleApprove(row.docID)}
            disabled={row.status !== 'Pending'}
            title="Approve"
          >
            <Check2Square size={16} />
          </button>
          <button
            className="btn btn-danger btn-sm mx-1"
            onClick={() => handleReject(row.docID)}
            disabled={row.status !== 'Pending'}
            title="Reject"
          >
            <XSquare size={16} />
          </button>
        </div>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    }
=======
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
>>>>>>> main
  ];

  // Fetch documents from the server
  const fetchDocuments = async () => {
    try {
      setLoading(true);
<<<<<<< HEAD
      const response = await axios.get('http://localhost:3000/documents/');
      setDocuments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching documents:', error);
=======
      const response = await axios.get("http://localhost:3000/documents/");
      // Prioritize pending documents
      const sortedDocs = response.data.sort((a, b) => (a.status === "Pending" ? -1 : 1));
      setDocuments(sortedDocs);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching documents:", error);
>>>>>>> main
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

<<<<<<< HEAD
  const handleApprove = async (docID) => {
    try {
      await axios.put(`http://localhost:3000/documents/${docID}/approve`);
      // Refresh the documents list
      fetchDocuments();
    } catch (error) {
      console.error('Error approving document:', error);
    }
  };

  const handleReject = async (docID) => {
    try {
      await axios.put(`http://localhost:3000/documents/${docID}/reject`);
      // Refresh the documents list
      fetchDocuments();
    } catch (error) {
      console.error('Error rejecting document:', error);
    }
  };

=======
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

  const openGoogleDocs = () => {
    window.open("https://docs.google.com/document/u/0/", "_blank");
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

>>>>>>> main
  return (
    <div className="admin-dashboard-container">
      <AdminSidebar isOpen={isSidebarOpen} />
      <div
<<<<<<< HEAD
        className={`admin-dashboard-content ${!isSidebarOpen ? 'sidebar-closed' : ''}`}
=======
        className={`admin-dashboard-content ${
          !isSidebarOpen ? "sidebar-closed" : ""
        }`}
        style={{ marginLeft: isSidebarOpen ? "250px" : "0" }}
>>>>>>> main
      >
        <button className="hamburger-icon" onClick={toggleSidebar}>
          <List size={24} />
        </button>
<<<<<<< HEAD
        <div>
          <h1>Requests Document</h1>
          <div className="requests-document-section">
            <DataTable
              columns={columns}
              data={documents}
=======
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
                  onClick={openGoogleDocs}
                >
                  Edit Document
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={handleDownloadLogs}
                >
                  <FileEarmarkText size={16} className="me-2" />
                  Download Logs
                </button>
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
         
          </div>
          <div className="requests-document-section">
            <DataTable
              title=""
              columns={columns}
              data={filteredItems}
>>>>>>> main
              pagination
              progressPending={loading}
              responsive
              striped
              highlightOnHover
<<<<<<< HEAD
              fixedHeader
              fixedHeaderScrollHeight="calc(100vh - 315px)"
=======
>>>>>>> main
            />
          </div>
        </div>
      </div>
<<<<<<< HEAD
=======
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
>>>>>>> main
    </div>
  );
}

export default RequestsDocument;
