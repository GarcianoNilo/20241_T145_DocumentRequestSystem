import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserSidebar from "../Sidebar/UserSidebar";
import { List } from "react-bootstrap-icons";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import "../components-css/UserDocuments.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPenToSquare,
  faBan,
  faBoxArchive,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import Footer from "../Footer";

Modal.setAppElement("#root"); // For accessibility

// Add these custom styles for the modal
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    zIndex: 1000,
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    backgroundColor: "white",
    padding: "20px",
    borderRadius: "8px",
    maxWidth: "500px",
    width: "90%",
  },
};

function UserDocuments() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [formData, setFormData] = useState({
    email: "",
    title: "",
    content: "",
    department: "",
    status: "Pending",
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingDocument, setEditingDocument] = useState(null);
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [filterText, setFilterText] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    const token = sessionStorage.getItem("sessionToken");
    const userInfo = sessionStorage.getItem("userInfo");

    if (!token) {
      navigate("/login");
      return;
    }

    if (userInfo) {
      const user = JSON.parse(userInfo);
      setUserName(user.name);
      setUserEmail(user.email);

      setFormData((prevState) => ({
        ...prevState,
        email: user.email,
      }));

      fetchUserDocuments(user.email);
    }
  }, [navigate]);

  const fetchUserDocuments = async (email) => {
    try {
      if (!email) {
        console.error("No email provided");
        return;
      }

      const response = await fetch(
        `http://localhost:3000/documents/user/${email}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log(`Fetched ${result.count} documents for ${email}`);
        setDocuments(result.data);
      } else {
        throw new Error(result.message || "Failed to fetch documents");
      }
    } catch (error) {
      console.error("Error fetching user documents:", error);
      toast.error("Failed to load documents: " + error.message);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("sessionToken");
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  // Function to show the modal
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // Function to hide the modal
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3000/documents/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          email: userEmail,
        }),
      });

      if (response.ok) {
        setIsModalOpen(false);
        fetchUserDocuments(userEmail);
        toast.success("Document submitted successfully!");
      } else {
        toast.error("Failed to submit document");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error submitting document");
    }
  };

  const handleEdit = (docID, document) => {
    if (document.status === "Approved" || document.status === "Rejected") {
      toast.warning("Cannot edit approved or rejected documents");
      return;
    }
    Swal.fire({
      title: "Edit Document",
      text: "Are you sure you want to edit this document?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, edit it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setEditingDocument(document);
        setIsEditModalOpen(true);
      }
    });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Create the update data object
      const updateData = {
        title: editingDocument.title,
        content: editingDocument.content,
        department: editingDocument.department,
      };

      const response = await fetch(
        `http://localhost:3000/documents/${editingDocument.docID}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updateData),
        }
      );

      if (response.ok) {
        setIsEditModalOpen(false);
        fetchUserDocuments(userEmail); // Refresh the documents list
        toast.success("Document updated successfully!");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to update document");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating document");
    }
  };

  const handleDelete = async (docID) => {
    const document = documents.find(doc => doc.docID === docID);
    if (document.status === "Approved" || document.status === "Rejected") {
      toast.warning("Cannot cancel approved or rejected documents");
      return;
    }
    try {
      const result = await Swal.fire({
        title: "Cancel Document",
        text: "Are you sure you want to cancel this document request?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, cancel it!",
        cancelButtonText: "No, keep it",
      });

      if (result.isConfirmed) {
        const response = await fetch(
          `http://localhost:3000/documents/${docID}`,
          {
            method: "DELETE",
          }
        );

        if (response.ok) {
          fetchUserDocuments(userEmail);
          toast.success("Document deleted successfully!");
        } else {
          toast.error("Failed to delete document");
        }
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error deleting document");
    }
  };

  const handleArchive = async (docID) => {
    const document = documents.find(doc => doc.docID === docID);
    if (document.status === "Pending") {
      toast.warning("Cannot archive pending documents");
      return;
    }
    try {
      const response = await fetch(
        `http://localhost:3000/documents/archive/${docID}`,
        {
          method: "PATCH",
        }
      );

      if (response.ok) {
        fetchUserDocuments(userEmail);
        toast.success("Document archived successfully!");
      } else {
        toast.error("Failed to archive document");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error archiving document");
    }
  };

  const columns = [
    { name: "Doc ID", selector: (row) => row.docID, sortable: true },
    { name: "Title", selector: (row) => row.title, sortable: true },
    { name: "Content", selector: (row) => row.content, sortable: true },
    { name: "Department", selector: (row) => row.department, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    {
      name: "Status",
      selector: (row) => row.status,
      sortable: true,
      cell: (row) => (
        <span className={`status-badge ${row.status.toLowerCase()}`}>
          {row.status}
        </span>
      ),
    },
    {
      name: "Comment",
      selector: (row) => row.rejectionReason,
      cell: (row) => (
        <div>{row.status === "Rejected" ? row.rejectionReason : "-"}</div>
      ),
    },
    {
      name: "File",
      cell: (row) =>
        row.filePath ? (
          <a
            href={`http://localhost:3000/${row.filePath}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            Download
          </a>
        ) : (
          "No file"
        ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="action-buttons">
          <button
            onClick={() => handleEdit(row.docID, row)}
            className="icon-button edit-btn"
            disabled={row.status === "Approved" || row.status === "Rejected"}
            title={
              row.status === "Approved" || row.status === "Rejected"
                ? "Cannot edit approved or rejected documents"
                : "Edit"
            }
          >
            <FontAwesomeIcon 
              icon={faEdit} 
              style={{
                opacity: row.status === "Approved" || row.status === "Rejected" ? 0.5 : 1
              }}
            />
          </button>
          <button
            onClick={() => handleDelete(row.docID)}
            className="icon-button delete-btn"
            disabled={row.status === "Approved" || row.status === "Rejected"}
            title={
              row.status === "Approved" || row.status === "Rejected"
                ? "Cannot cancel approved or rejected documents"
                : "Cancel"
            }
          >
            <FontAwesomeIcon 
              icon={faBan}
              style={{
                opacity: row.status === "Approved" || row.status === "Rejected" ? 0.5 : 1
              }}
            />
          </button>
          <button
            onClick={() => handleArchive(row.docID)}
            className="icon-button archive-btn"
            disabled={row.status === "Pending"}
            title={
              row.status === "Pending"
                ? "Cannot archive pending documents"
                : "Archive"
            }
          >
            <FontAwesomeIcon 
              icon={faBoxArchive}
              style={{
                opacity: row.status === "Pending" ? 0.5 : 1
              }}
            />
          </button>
        </div>
      ),
    },
  ];

  // Add departments array
  const departments = [
    "Biology Department",
    "Environmental Science Department",
    "Physical Education Department",
    "Mathematics Department",
    "Information Technology Department",
    "Economics Department",
    "Sociology Department",
    "Social Science Department",
    "English Department",
    "Community Development Department",
    "Philosophy Department",
    "Development Communication Department",
    "Public Administration Department",
    "Nursing Department",
    "Accountancy Department",
    "Automotive Technology Department",
    "Electronics Technology Department",
    "Food Technology Department",
    "Quality Assurance Department",
    "Human Resource Department",
    "Research and Development Department",
    "Financial Planning and Budget Department",
    "Risk Management Department",
  ];

  // Add function to handle document cancellation
  const handleCancel = async (docID) => {
    const token = sessionStorage.getItem("sessionToken");
    if (!token) {
      alert("Please login first");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/documents/cancel/${docID}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert(data.message || "Document cancelled successfully!");
        fetchDocuments(); // Refresh the list
      } else {
        throw new Error(data.message || "Failed to cancel document");
      }
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Failed to cancel document");
    }
  };

  // Add this new function to handle Google Form opening
  const handleGoogleFormOpen = () => {
    // Replace this URL with your actual Google Form URL
    const googleFormUrl = "https://forms.gle/rZqjYHrDLgHqyvBV6";
    window.open(googleFormUrl, "_blank", "noopener,noreferrer");
  };

  // Add new function to handle sync
  const handleSyncFromSheets = async () => {
    setIsSyncing(true); // Start loading
    try {
      const response = await fetch(
        "http://localhost:3000/documents/sync-sheets",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      if (data.success) {
        toast.success("Successfully synced data from Google Sheets!");
        fetchUserDocuments(userEmail);
      } else {
        toast.error("Failed to sync: " + (data.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("Error syncing from sheets: " + error.message);
    } finally {
      setIsSyncing(false); // End loading
    }
  };

  // Add this new function to handle search
  const filteredItems = documents.filter((item) => {
    const searchText = filterText.toLowerCase();
    return (
      item.docID?.toString().toLowerCase().includes(searchText) ||
      item.title?.toLowerCase().includes(searchText) ||
      item.content?.toLowerCase().includes(searchText) ||
      item.department?.toLowerCase().includes(searchText) ||
      item.email?.toLowerCase().includes(searchText) ||
      item.status?.toLowerCase().includes(searchText)
    );
  });

  // Add CSS for disabled buttons
  const styles = `
    .icon-button:disabled {
      cursor: not-allowed;
      background-color: #f5f5f5;
    }

    .icon-button:disabled:hover {
      background-color: #f5f5f5;
      transform: none;
    }

    /* Add tooltip styles */
    .icon-button {
      position: relative;
    }

    .icon-button[title]:hover:after {
      content: attr(title);
      position: absolute;
      bottom: 100%;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 12px;
      white-space: nowrap;
      z-index: 1000;
    }
  `;

  // Add the styles to your component
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="user-dashboard-container">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <UserSidebar isOpen={isSidebarOpen} />
      <div
        className={`user-dashboard-content1 ${
          isSidebarOpen ? "with-sidebar" : "without-sidebar"
        }`}
      >
        <button className="hamburger-icon" onClick={toggleSidebar}>
          <List size={24} />
        </button>
        <div>
          <div className="main-content">
          <div className="dashboard-header">
            <p style={{ opacity: 0.7 }}>
              <i>Quality Assurance Office's Document Request System</i>
            </p>
            <h1>User Documents</h1>
            <p>
              <i>Welcome! Here you can view and manage your document requests.</i>
            </p>
          </div>
          
          <div
            className="button-container"
            style={{ display: "flex", gap: "10px" }}
          >
            <button onClick={handleOpenModal} className="custom-btn">
              Request Document
            </button>
            <button onClick={handleGoogleFormOpen} className="custom-btnA">
              Open Google Form
            </button>
            <button 
              onClick={handleSyncFromSheets} 
              className="custom-btnB"
              disabled={isSyncing}
            >
              {isSyncing ? (
                <div className="button-content">
                  <div className="spinner"></div>
                  <span>Syncing...</span>
                </div>
              ) : (
                "Sync from Sheets"
              )}
            </button>
          </div>

          {/* Modal for document request */}
          <Modal
            isOpen={isModalOpen}
            onRequestClose={() => setIsModalOpen(false)}
            style={customStyles}
            contentLabel="Request Document Modal"
          >
            <div className="modal-header">
              <h2>Request Document</h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="close-button"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  value={userEmail}
                  readOnly
                  className="form-control readonly-input"
                />
              </div>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Content:</label>
                <textarea
                  value={formData.content}
                  onChange={(e) =>
                    setFormData({ ...formData, content: e.target.value })
                  }
                  required
                  className="form-control"
                />
              </div>
              <div className="form-group">
                <label>Department:</label>
                <select
                  value={formData.department}
                  onChange={(e) =>
                    setFormData({ ...formData, department: e.target.value })
                  }
                  required
                  className="form-control"
                >
                  <option value="">Select Department</option>
                  {departments.map((dept, index) => (
                    <option key={index} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>
              <div className="modal-buttons">
                <button type="submit" className="custom-btn">
                  Submit
                </button>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="custom-btn1"
                >
                  Cancel
                </button>
              </div>
            </form>
          </Modal>

          <Modal
            isOpen={isEditModalOpen}
            onRequestClose={() => setIsEditModalOpen(false)}
            style={customStyles}
            contentLabel="Edit Document Modal"
          >
            <div className="modal-header">
              <h2>Edit Document</h2>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="close-button"
              >
                &times;
              </button>
            </div>
            {editingDocument && (
              <form onSubmit={handleEditSubmit}>
                <div>
                  <label>Title:</label>
                  <input
                    type="text"
                    value={editingDocument.title}
                    onChange={(e) =>
                      setEditingDocument({
                        ...editingDocument,
                        title: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label>Content:</label>
                  <textarea
                    value={editingDocument.content}
                    onChange={(e) =>
                      setEditingDocument({
                        ...editingDocument,
                        content: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div>
                  <label>Department:</label>
                  <select
                    value={editingDocument.department}
                    onChange={(e) =>
                      setEditingDocument({
                        ...editingDocument,
                        department: e.target.value,
                      })
                    }
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept, index) => (
                      <option key={index} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="button-group">
                  <button type="submit">Save Changes</button>
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </Modal>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
              marginTop: "20px",
              marginLeft: "20px",
            }}
          >
            <div className="search-container">
              <input
                type="text"
                className="search-input"
                placeholder="Search documents..."
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
              />
            </div>
          </div>
          <div className="documents-table-container">
            <DataTable
              columns={columns}
              data={filteredItems}
              pagination
              highlightOnHover
              striped
              fixedHeader
              fixedHeaderScrollHeight="calc(100vh - 350px)"
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
    </div>
  );
}

export default UserDocuments;
