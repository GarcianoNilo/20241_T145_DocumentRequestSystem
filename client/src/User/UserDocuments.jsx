import React, { useState } from "react";
import UDocumentContent from "../components/UserContent/UDocumentContent.jsx";
// import "../User-css/UserDocuments.css";
import "bootstrap/dist/css/bootstrap.min.css";
import Sidebar from "../components/UserSidebar/Sidebar.jsx";
import StepsPanel from "../components/UserContent/StepsPanel.jsx";

function Documents() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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
      <UDocumentContent isSidebarOpen={isSidebarOpen} />

      {/* StepsPanel */}
      <StepsPanel />
    </div>
  );
}

export default Documents;
