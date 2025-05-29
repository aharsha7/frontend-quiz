import api from './api';

const quizService = {
  uploadQuestions: async (formData) => {
    const res = await api.post('/api/quiz/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // Admin functions
  getAllCategories: async () => {
    const res = await api.get('/api/quiz/admin/categories');            
    return res.data;
  },

  // Fixed: Use the correct endpoint that matches your backend
  getQuestionsByCategoryName: async (categoryName) => {
    const res = await api.get(`/api/quiz/category/${encodeURIComponent(categoryName)}/questions`);
    return res.data;
  },

  deleteCategory: async (categoryName) => {
    const res = await api.delete(`/api/quiz/admin/category/${encodeURIComponent(categoryName)}`);
    return res.data;
  }
};

export const fetchCategories = async () => {
  const response = await api.get('/api/quiz/categories'); 
  return response.data;
};

export const fetchQuestionsByCategory = async (categoryId) => {
  const response = await api.get(`/api/quiz/questions/${categoryId}`);
  return response.data;
};

export default quizService;