// Add this function to your resultService.js file

import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

// Function to fetch quiz history
export const fetchQuizHistory = async () => {
  try {
    const token = localStorage.getItem("userInfo")
      ? JSON.parse(localStorage.getItem("userInfo")).token
      : null;

    const response = await axios.get(`${API_BASE_URL}/result/history`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    throw error;
  }
};