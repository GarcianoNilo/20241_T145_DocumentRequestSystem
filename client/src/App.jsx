
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import "@fortawesome/fontawesome-free/css/all.min.css";
import Oauth from './components/Oauth';
import UserDashboard from './UserDashboard';
import AdminDashboard from './AdminDashboard';
import UserDocuments from './UserDocuments';
import DocumentRequest from './DocumentRequest';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Oauth />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <UserDashboard />
          </ProtectedRoute>
        }
      />
      <Route 
        path="/admin" 
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        } 
        />
        <Route 
        path="/documents" 
        element={
          <ProtectedRoute>
            <UserDocuments />
          </ProtectedRoute>
        } 
        />
        <Route 
        path="/request" 
        element={
          <ProtectedRoute>
            <DocumentRequest />
          </ProtectedRoute>
        } 
        />
    </Routes>
  );
}

export default App;
