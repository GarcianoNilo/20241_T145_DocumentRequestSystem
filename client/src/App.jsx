import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import Oauth from "./components/Oauth";
import UserDashboard from "./User/UserDashboard";
import AdminDashboard from "./Admin/AdminDashboard";
import UserDocuments from "./User/UserDocuments";
import DocumentRequest from "./Admin/DocumentRequest";
import ProtectedRoute from "./components/ProtectedRoute";
import DisplayUser from "./Admin/DisplayUsers";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Oauth />} />
      <Route
        path="/user"
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
      <Route
        path="/displayUsers"
        element={
          <ProtectedRoute>
            <DisplayUser />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
