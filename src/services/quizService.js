import api from './api'; // This instance should handle token automatically

const quizService = {
  uploadQuestions: async (formData) => {
    const res = await api.post('/quiz/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  }
};

export const fetchCategories = async () => {
  const response = await api.get('/quiz/categories'); // Uses api instead of axios
  return response.data;
};

export const fetchQuestionsByCategory = async (categoryId) => {
  const response = await api.get(`/quiz/questions/${categoryId}`); // Uses api instead of axios
  return response.data;
};

export default quizService;
