import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    const isAuthenticated = sessionStorage.getItem('sessionToken'); // Check if user is logged in
    const userInfo = JSON.parse(sessionStorage.getItem('userInfo')); // Get user info

    if (!isAuthenticated || !userInfo) {
        return <Navigate to="/login" />;  // Redirect to login if unauthenticated
    }

    // Check the user role and render the correct dashboard component
    if (userInfo.role === 'admin') {
        return children;  // Admin is allowed to access
    } else if (userInfo.role === 'user') {
        return children;  // User is allowed to access
    }

    return <Navigate to="/login" />; // Redirect to login for any other cases
}

export default ProtectedRoute;
