// components/Common/SecureRoute.jsx
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';

const SecureRoute = ({ children, requiredRole = null }) => {
  const { user, loading } = useContext(AuthContext);

  // Wait for auth to load
  if (loading) {
    return <div>Loading...</div>; 
  }

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but doesn't match the required role (if provided)
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized
  return children;
};

export default SecureRoute;
