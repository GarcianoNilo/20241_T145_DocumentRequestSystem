import React from 'react';
import UDashContent from './components/UDashContent.jsx';
import './css/UserDashboard.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Sidebar from './components/Sidebar.jsx';
import StepsPanel from './components/StepsPanel.jsx';

function UserDashboard() {
  return (
    <div className="app-container d-flex">
        <Sidebar />
        <UDashContent />
        <StepsPanel />
    </div>
  );
}

export default UserDashboard;
