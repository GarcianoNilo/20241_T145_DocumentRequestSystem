import React from "react";
import { MDBListGroup, MDBBadge, MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import "./../components-css/AdminSidebar.css";

export default function AdminSidebar({ isOpen }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("sessionToken");
    navigate("/login");
  };

  return (
    <div className={`sidebar ${isOpen ? "open" : ""}`}>
      {/* Logo */}
      <div className="d-flex justify-content-center">
        <img
          src="./src/assets/userlogo.svg"
          alt="Logo"
          className="img-fluid"
          style={{ width: "150px" }}
        />
      </div>

      {/* User Info */}
      <div className="text-center mb-4">
        <MDBIcon icon="user-circle" size="3x" />
        <h5>Administrator</h5>
        <MDBBadge color="danger" className="text-white">
          Admin
        </MDBBadge>
      </div>

      {/* Navigation Links */}
      <MDBListGroup className="mb-4 flex-grow-1">
        <MDBBtn href="/dashboard" className="mb-4 custom-btn">
          <MDBIcon fas icon="tachometer-alt" className="me-3" /> Dashboard
        </MDBBtn>
        <MDBBtn href="/documents" className="mb-4 custom-btn">
          <MDBIcon fas icon="file-alt" className="me-3" /> Document Request
        </MDBBtn>
        <MDBBtn href="/account" className="mb-4 custom-btn">
          <MDBIcon fas icon="user-cog" className="me-3" /> Account
        </MDBBtn>
        <MDBBtn href="/displayUsers" className="mb-4 custom-btn">
          <MDBIcon fas icon="user-cog" className="me-3" /> Users
        </MDBBtn>
      </MDBListGroup>

      {/* Logout Button */}
      <div className="mt-auto">
        <MDBBtn color="danger" className="w-100" onClick={handleLogout}>
          <MDBIcon fas icon="sign-out-alt" className="me-2" /> Log Out
        </MDBBtn>
      </div>
    </div>
  );
}
