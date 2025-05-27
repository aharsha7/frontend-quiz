import axios from 'axios';

// Centralized API configuration
const API_BASE_URL = 'https://backend-quiz-1-rx4t.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Request interceptor to attach token
api.interceptors.request.use(
  (config) => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
    if (userInfo && userInfo.token) {
      config.headers.Authorization = `Bearer ${userInfo.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Export both the api instance and base URL for other services
export { API_BASE_URL };
export default api;