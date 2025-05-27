import api from './api';

const quizService = {
  uploadQuestions: async (formData) => {
    const res = await api.post('/api/quiz/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
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