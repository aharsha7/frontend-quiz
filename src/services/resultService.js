import api from './api';

// Function to fetch quiz history
export const fetchQuizHistory = async () => {
  try {
    const response = await api.get('/api/result/history');
    return response.data;
  } catch (error) {
    console.error('Error fetching quiz history:', error);
    throw error;
  }
};