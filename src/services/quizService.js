import axios from 'axios';

const API = 'http://localhost:5000/api/quiz';
const getToken = () => localStorage.getItem('token');

const quizService = {
  uploadQuestions: async (formData) => {
    const res = await axios.post(`${API}/upload`, formData, {
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  // ... other quiz related methods if any
};

export default quizService;
