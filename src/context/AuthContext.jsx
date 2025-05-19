// context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';
import { getCurrentUser, logoutUser } from '../services/authService';

// Create the AuthContext
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from localStorage on initial mount
  useEffect(() => {
    const loadUser = () => {
      const currentUser = getCurrentUser();
      setUser(currentUser);
      setLoading(false);
    };
    
    loadUser();
  }, []);

  // Login function - update context after login
  const login = (userData) => {
    setUser(userData);
  };

  // Logout function
  const logout = () => {
    logoutUser();
    setUser(null);
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Context value
  const contextValue = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated: !!user,
    isAdmin: user && user.role === 'admin',
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;