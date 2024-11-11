// src/Dashboard.jsx
import React, { useState } from "react"; // Added useState import
import AdminSidebar from "../components/AdminSidebar/AdminSidebar.jsx";
import ADashContent from "../components/AdminContent/ADashContent.jsx";
import "./Admin-css/AdminDashboard.css";

function AdminDashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="app-container d-flex">
      {/* Hamburger Icon */}
      <button className="hamburger-icon" onClick={toggleSidebar}>
        <i className="fas fa-bars"></i>
      </button>

      {/* Sidebar */}
      <AdminSidebar isOpen={isSidebarOpen} />

      {/* Main Content */}
      <ADashContent isSidebarOpen={isSidebarOpen} />
    </div>
  );
}

export default AdminDashboard;
