import React, { useState } from "react";
import UDashContent from "../components/UserContent/UDashContent.jsx";
import "./User-css/UserDashboard.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/UserSidebar/Sidebar.jsx";
import StepsPanel from "../components/UserContent/StepsPanel.jsx";

function UserDashboard() {
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
      <Sidebar isOpen={isSidebarOpen} />

      {/* Main Content */}
      <UDashContent isSidebarOpen={isSidebarOpen} />

      {/* StepsPanel */}
      <StepsPanel />
    </div>
  );
}

export default UserDashboard;
