import React from "react";
import { MDBListGroup, MDBBadge, MDBBtn, MDBIcon } from "mdb-react-ui-kit";
import { useNavigate } from "react-router-dom";
import "./../components-css/Sidebar.css";

export default function Sidebar({ isOpen }) {
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
        <h5>Nilo Garciano</h5>
        <MDBBadge color="warning" className="text-dark">
          User
        </MDBBadge>
      </div>

      {/* Navigation Links */}
      <MDBListGroup className="mb-4 flex-grow-1">
        <MDBBtn href="/dashboard" className="mb-4 custom-btn">
          <MDBIcon fas icon="tachometer-alt" className="me-3" /> Dashboard
        </MDBBtn>
        <MDBBtn href="/documents" className="mb-4 custom-btn">
          <MDBIcon fas icon="file-alt" className="me-3" /> Documents
        </MDBBtn>
        <MDBBtn href="/request-history" className="mb-4 custom-btn">
          <MDBIcon fas icon="history" className="me-3" /> Request History
        </MDBBtn>
        <MDBBtn href="/account" className="mb-4 custom-btn">
          <MDBIcon fas icon="bell" className="me-3" /> Notification
        </MDBBtn>
        <MDBBtn href="/account" className="mb-4 custom-btn">
          <MDBIcon fas icon="user-cog" className="me-3" /> Account
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
