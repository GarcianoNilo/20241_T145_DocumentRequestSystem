//Imports
import React from 'react';
import { MDBListGroup, MDBBadge, MDBBtn, MDBIcon } from 'mdb-react-ui-kit';
import './components-css/AdminSidebar.css';

export default function AdminSidebar() {
  return (
    <div className="sidebar d-flex flex-column p-3" style={{ width: '250px', backgroundColor: '#f8f9fa', height: '100vh' }}>
      
      {/* Logo */}
      <div className="d-flex justify-content-center">
        <img src="./src/assets/userlogo.svg" alt="Logo" className="img-fluid" style={{ width: '150px' }} />
      </div>

      {/* User Info ITEMS POSTED ARE STILL PLACEHOLDERS*/}
      <div className="text-center mb-4">
        <MDBIcon icon="user-circle" size="3x" />
        <h5>Administrator</h5>
        <MDBBadge color="warning" className="text-dark">User</MDBBadge>
      </div>

      {/* Navigation Links HREF'S ARE STILL PLACEHOLDERS*/}
      <MDBListGroup className="mb-4 flex-grow-1">
        <MDBBtn href="#dashboard" className="mb-4 custom-btn">
          <MDBIcon fas icon="tachometer-alt" className="me-3" /> Dashboard
        </MDBBtn>
        <MDBBtn href="#documentrequest" className="mb-4 custom-btn">
          <MDBIcon fas icon="file-alt" className="me-3" /> Logs
        </MDBBtn>
        <MDBBtn href="#account" className="mb-4 custom-btn">
          <MDBIcon fas icon="history" className="me-3" /> Account
        </MDBBtn>
      </MDBListGroup>

      {/* Logout Button */}
      <div className="mt-auto">
        <MDBBtn color="primary" className="w-100">
          <MDBIcon fas icon="sign-out-alt" className="me-2" /> Log Out
        </MDBBtn>
      </div>
    </div>
  );
}
