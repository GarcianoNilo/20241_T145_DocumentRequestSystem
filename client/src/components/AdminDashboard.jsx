import React, { useState, useEffect } from "react";
<<<<<<< HEAD
import axios from "axios";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import Modal from "react-modal";
import "./components-css/AdminDashboard.css";
import { List } from "react-bootstrap-icons";
import AdminSidebar from "./Sidebar/AdminSidebar";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [editUser, setEditUser] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  const [newUser, setNewUser] = useState({
    email: "",
    name: "",
    role: "",
    department: "",
  });
  const navigate = useNavigate();

  // Fetch users whenever the component mounts or when a user is added/updated
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:3000/users/");
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  useEffect(() => {
    const userInfo = sessionStorage.getItem("userInfo");
    const welcomeShown = localStorage.getItem("welcomeShown");
    
    if (userInfo && welcomeShown !== "true") {
      const user = JSON.parse(userInfo);
      Swal.fire({
        icon: 'success',
        title: `Welcome Admin ${user.name}! 👋`,
        showConfirmButton: false,
        timer: 1500,
        background: '#fff',
        customClass: {
          popup: 'animated fadeInDown'
        }
=======
import AdminSidebar from "./Sidebar/AdminSidebar";
import { List } from "react-bootstrap-icons";
import axios from "axios";
import { Line, Doughnut } from "react-chartjs-2";
import "./components-css/AdminDashboard.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import Swal from "sweetalert2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [users, setUsers] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [archivedDocs, setArchivedDocs] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isHamburgerVisible, setIsHamburgerVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    // Add welcome alert
    const userInfo = sessionStorage.getItem("userInfo");
    const welcomeShown = localStorage.getItem("welcomeShown");

    if (userInfo && welcomeShown !== "true") {
      const user = JSON.parse(userInfo);
      Swal.fire({
        icon: "success",
        title: `Welcome Admin ${user.name}! 👋`,
        showConfirmButton: false,
        timer: 1500,
        background: "#fff",
        customClass: {
          popup: "animated fadeInDown",
        },
>>>>>>> main
      });
      // Set the flag in localStorage
      localStorage.setItem("welcomeShown", "true");
    }
<<<<<<< HEAD
    fetchUsers();
  }, []);


  const handleEditUser = (user) => {
    setEditUser(user);
    setIsEditModalOpen(true);
  };

  const confirmEditUser = async () => {
    try {
      await axios.patch(`http://localhost:3000/users/${editUser.userID}`, editUser);
      fetchUsers();
      setIsEditModalOpen(false);
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'User updated successfully!',
        timer: 1500,
        showConfirmButton: false,
        background: '#fff',
        customClass: {
          popup: 'animated fadeInDown'
        }
      });
    } catch (error) {
      console.error("Error updating user:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to update user.',
        background: '#fff'
      });
    }
  };

  const handleDeleteUser = (userID) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      background: '#fff',
      customClass: {
        popup: 'animated fadeInDown'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        confirmDelete(userID);
      }
    });
  };

  const confirmDelete = async (userID) => {
    try {
      await axios.delete(`http://localhost:3000/users/${userID}`);
      fetchUsers();
      Swal.fire({
        icon: 'success',
        title: 'Deleted!',
        text: 'User has been deleted.',
        timer: 1500,
        showConfirmButton: false,
        background: '#fff',
        customClass: {
          popup: 'animated fadeInDown'
        }
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to delete user.',
        background: '#fff'
      });
    }
  };

  const handleAddUser = () => {
    setNewUser({ email: "", name: "", role: "", department: "" });
    setIsAddModalOpen(true);
  };

  const confirmAddUser = async () => {
    try {
      // Show loading state
      Swal.fire({
        title: 'Adding User',
        text: 'Please wait...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      await axios.post("http://localhost:3000/users/register", newUser);
      fetchUsers();
      setIsAddModalOpen(false);
      
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: 'New user added successfully!',
        timer: 1500,
        showConfirmButton: false,
        background: '#fff',
        customClass: {
          popup: 'animated fadeInDown'
        }
      });
    } catch (error) {
      console.error("Error adding user:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'Failed to add new user.',
        background: '#fff'
      });
    }
  };

  const columns = [
    { name: "UserID", selector: (row) => row.userID, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Role", selector: (row) => row.role, sortable: true },
    { name: "Department", selector: (row) => row.department, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div>
          <button onClick={() => handleEditUser(row)} className="custom-btn2">Edit</button>
          <button onClick={() => handleDeleteUser(row.userID)} className="custom-btn1">Delete</button>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-layout">
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
      
      {/* Hamburger Icon */}
      <button className="hamburger-icon" onClick={toggleSidebar}>
        <List size={24} />
      </button>

      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} />

      {/* Main Content */}
      <div className={`admin-container ${isSidebarOpen ? "with-sidebar" : ""}`}>
        <div className="admin-header">
          <h1 style={{ marginLeft: "10vh" }}>Admin Dashboard</h1>
          <p style={{ marginLeft: "10vh" }}>
            Welcome, Admin! Here you can manage users and view reports.
          </p>
        </div>

        <div className="admin-controls">
          <button onClick={handleAddUser} className="custom-btn">Add User</button>
          <input
            type="text"
            placeholder="Search by Email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        <div className="table-container">
          <DataTable
            columns={columns}
            data={users.filter((user) =>
              user.email.toLowerCase().includes(searchTerm.toLowerCase())
            )}
            pagination
            highlightOnHover
            striped
            fixedHeader
            fixedHeaderScrollHeight="calc(100vh - 350px)"
          />
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && (
          <Modal
            isOpen={isEditModalOpen}
            onRequestClose={() => setIsEditModalOpen(false)}
            className="modal-content"
          >
            <h2>Edit User</h2>
            <div className="modal-form">
              <input
                type="text"
                placeholder="Email"
                value={editUser.email}
                onChange={(e) =>
                  setEditUser({ ...editUser, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Name"
                value={editUser.name}
                onChange={(e) =>
                  setEditUser({ ...editUser, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Role"
                value={editUser.role}
                onChange={(e) =>
                  setEditUser({ ...editUser, role: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Department"
                value={editUser.department}
                onChange={(e) =>
                  setEditUser({ ...editUser, department: e.target.value })
                }
              />
              <div className="modal-buttons">
                <button onClick={confirmEditUser} className="custom-btn">Confirm</button>
                <button onClick={() => setIsEditModalOpen(false)} className="custom-btn1">
                  Cancel
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* Add Modal */}
        {isAddModalOpen && (
          <Modal
            isOpen={isAddModalOpen}
            onRequestClose={() => setIsAddModalOpen(false)}
            className="modal-content"
          >
            <h2>Add User</h2>
            <div className="modal-form">
              <input
                type="text"
                placeholder="Email"
                value={newUser.email}
                onChange={(e) =>
                  setNewUser({ ...newUser, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Name"
                value={newUser.name}
                onChange={(e) =>
                  setNewUser({ ...newUser, name: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Role"
                value={newUser.role}
                onChange={(e) =>
                  setNewUser({ ...newUser, role: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Department"
                value={newUser.department}
                onChange={(e) =>
                  setNewUser({ ...newUser, department: e.target.value })
                }
              />
              <div className="modal-buttons">
                <button onClick={confirmAddUser}  className="custom-btn">Confirm</button>
                <button onClick={() => setIsAddModalOpen(false)}  className="custom-btn1">Cancel</button>
              </div>
            </div>
          </Modal>
        )}
=======

    fetchData();
  }, []);

  useEffect(() => {
    const controlHamburger = () => {
      if (window.scrollY > lastScrollY) { // scrolling down
        setIsHamburgerVisible(false);
      } else { // scrolling up
        setIsHamburgerVisible(true);
      }
      setLastScrollY(window.scrollY);
    };

    window.addEventListener('scroll', controlHamburger);
    
    return () => {
      window.removeEventListener('scroll', controlHamburger);
    };
  }, [lastScrollY]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const baseURL = "http://localhost:3000"; // adjust if your port is different

      const [usersRes, docsRes, archivedRes] = await Promise.all([
        axios.get(`${baseURL}/users/`),
        axios.get(`${baseURL}/documents/`),
        axios.get(`${baseURL}/documents/archived`),
      ]);

      // Ensure we're setting arrays, even if empty
      setUsers(Array.isArray(usersRes.data) ? usersRes.data : []);
      setDocuments(Array.isArray(docsRes.data) ? docsRes.data : []);
      setArchivedDocs(Array.isArray(archivedRes.data) ? archivedRes.data : []);
      setError(null);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load dashboard data");
      // Set empty arrays on error
      setUsers([]);
      setDocuments([]);
      setArchivedDocs([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Document status distribution data
  const documentStatusData = {
    labels: ["Active", "Archived"],
    datasets: [
      {
        data: [documents.length || 0, archivedDocs.length || 0],
        backgroundColor: ["#36A2EB", "#FF6384"],
        hoverBackgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  // Monthly document requests data
  const monthlyDocumentData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Document Requests",
        data: [12, 19, 3, 5, 2, 3],
        fill: false,
        borderColor: "rgb(75, 192, 192)",
        tension: 0.1,
      },
    ],
  };

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="admin-dashboard-container">
        <div className="error-message">{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <AdminSidebar isOpen={isSidebarOpen} />
      <div
        className={`admin-dashboard-content ${!isSidebarOpen ? 'sidebar-closed' : ''}`}
        style={{ marginLeft: isSidebarOpen ? "250px" : "0" }}
      >
        <button 
          className={`hamburger-icon ${!isHamburgerVisible ? 'hidden' : ''}`} 
          onClick={toggleSidebar}
        >
          {isSidebarOpen && <List size={24} />}
        </button>
        <div className="main-content">
        <div className="dashboard-header">
          <p style={{ opacity: 0.7 }}>
            <i>Quality Assurance Office's Document Request System</i>
          </p>
            <h1>Dashboard Overview</h1>
          <p>Welcome Admin!</p>
        </div>

          {/* Stats Cards */}
          <div className="stats-cards">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{users.length}</p>
            </div>
            <div className="stat-card">
              <h3>Active Documents</h3>
              <p>{documents.length}</p>
            </div>
            <div className="stat-card">
              <h3>Archived Documents</h3>
              <p>{archivedDocs.length}</p>
            </div>
          </div>

          {/* Charts Grid */}
          <div className="charts-grid">
            <div className="chart-container">
              <h3>Document Status Distribution</h3>
              <Doughnut data={documentStatusData} />
            </div>
            <div className="chart-container">
              <h3>Monthly Document Requests</h3>
              <Line data={monthlyDocumentData} />
            </div>
          </div>

          {/* Recent Activity Section */}
          <div className="recent-activity">
            <h3>Recent Documents</h3>
            <div className="activity-list">
              {Array.isArray(documents) && documents.length > 0 ? (
                documents.slice(0, 5).map((doc, index) => (
                  <div key={index} className="activity-item">
                    <span className="title">{doc.title || "Untitled"}</span>
                    <span
                      className={`status ${
                        doc.status?.toLowerCase() || "pending"
                      }`}
                    >
                      {doc.status || "Pending"}
                    </span>
                    <span className="time">
                      {doc.createdAt
                        ? new Date(doc.createdAt).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="activity-item">
                  <span className="title">No documents available</span>
                </div>
              )}
            </div>
          </div>
        </div>
>>>>>>> main
      </div>
    </div>
  );
}

export default AdminDashboard;
