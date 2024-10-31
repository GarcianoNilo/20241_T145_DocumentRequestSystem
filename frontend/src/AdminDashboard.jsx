// src/Dashboard.jsx
import React from "react";
import AdminSidebar from "./components/AdminSidebar.jsx";
import ADashContent from "./components/ADashContent.jsx";
import { MDBContainer } from "mdb-react-ui-kit";
import "./css/AdminDashboard.css";

function AdminDashboard() {
  return (
    <div className="dashboard d-flex" style={{ height: '100vh' }}>
      <AdminSidebar />
      <ADashContent />
    </div>
  );
}

export default AdminDashboard;
