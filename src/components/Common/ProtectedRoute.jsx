import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useContext(AuthContext);
  
  // Show loading state or spinner while checking authentication
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    // Not logged in, redirect to login
    console.log("No user found, redirecting to login");
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== 'admin') {
    // Logged in but not admin, redirect to dashboard
    console.log("User is not admin, redirecting to dashboard");
    return <Navigate to="/dashboard" replace />;
  }
  
  // User is authenticated and has appropriate role
  return children;
};

export default ProtectedRoute;