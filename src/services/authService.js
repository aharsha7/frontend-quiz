// services/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Configure axios with interceptors for auth
const api = axios.create({
  baseURL: API_URL,
});

// Add an interceptor to automatically add the token to requests
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials) => {
  try {
    const res = await api.post('/login', credentials);
    const data = res.data;
    
    if (data && data.token) {
      // Store the entire user object, including the token
      localStorage.setItem('userInfo', JSON.stringify(data));
      console.log('Token stored in localStorage:', data.token.substring(0, 10) + '...');
    } else {
      console.error('No token received from server');
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const res = await api.post('/register', userData);
    const data = res.data;
    
    if (data && data.token) {
      // Store the entire user object, including the token
      localStorage.setItem('userInfo', JSON.stringify(data));
    }
    
    return data;
  } catch (error) {
    console.error('Registration error:', error.response?.data?.message || error.message);
    throw error;
  }
};

export const logoutUser = () => {
  localStorage.removeItem('userInfo');
  console.log('User logged out, storage cleared');
};

export const getCurrentUser = () => {
  try {
    const userInfo = localStorage.getItem('userInfo');
    return userInfo ? JSON.parse(userInfo) : null;
  } catch (error) {
    console.error('Error parsing user info:', error);
    return null;
  }
};

export const getAuthHeader = () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (userInfo && userInfo.token) {
      return { Authorization: `Bearer ${userInfo.token}` };
    }
    return {};
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