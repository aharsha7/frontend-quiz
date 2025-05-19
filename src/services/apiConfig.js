// In your API service file or axios setup file
import axios from 'axios';

// Create an axios instance for API requests
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Your API base URL
});

// Add request interceptor to include token in all requests
api.interceptors.request.use(
  (config) => {
    // Try to get token from localStorage
    try {
      const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
      
      if (userInfo && userInfo.token) {
        // Add token to headers
        config.headers.Authorization = `Bearer ${userInfo.token}`;
        console.log('Added token to request:', userInfo.token.substring(0, 10) + '...');
      } else {
        console.log('No token available for request to:', config.url);
      }
    } catch (error) {
      console.error('Error setting auth token:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle authentication errors
    if (error.response && error.response.status === 401) {
      console.warn('Unauthorized request detected');
      
      // Option: Auto logout on auth failure
      // localStorage.removeItem('userInfo');
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default api;