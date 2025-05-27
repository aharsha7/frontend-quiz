import api from './api';

// Login
export const loginUser = async (credentials) => {
  try {
    const { data } = await api.post('/api/auth/login', credentials);
    if (data?.token) {
      localStorage.setItem('userInfo', JSON.stringify(data));
    } else {
      console.error('No token received.');
    }
    return data;
  } catch (error) {
    console.error('Login failed:', error.response?.data?.message || error.message);
    throw error;
  }
};

// Register
export const registerUser = async (userData) => {
  try {
    const { data } = await api.post('/api/auth/register', userData);
    if (data?.token) {
      localStorage.setItem('userInfo', JSON.stringify(data));
      console.log('Registered and token stored.');
    }
    return data;
  } catch (error) {
    console.error('Registration failed:', error.response?.data?.message || error.message);
    throw error;
  }
};

// Logout
export const logoutUser = () => {
  localStorage.removeItem('userInfo');
  console.log('Logged out and storage cleared.');
};

// Get current user
export const getCurrentUser = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Error parsing user info:', error);
    return null;
  }
};

// Get auth headers for manual requests
export const getAuthHeader = () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    return userInfo?.token ? { Authorization: `Bearer ${userInfo.token}` } : {};
  } catch (error) {
    console.error('Error getting auth header:', error);
    return {};
  }
};

export default {
  loginUser,
  registerUser,
  logoutUser,
  getCurrentUser,
  getAuthHeader,
};