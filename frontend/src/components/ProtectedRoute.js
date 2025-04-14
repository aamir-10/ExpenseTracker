import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Check if the user is authenticated
  if (!token) {
    return <Navigate to="/login" />; // Redirect to login if not authenticated
  }
  return children;
};

export default ProtectedRoute;