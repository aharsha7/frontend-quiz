import axios from 'axios';

const API = 'http://localhost:5000/api/category';
const getToken = () => localStorage.getItem('token');

const categoryService = {
  getCategories: async () => {
    const res = await axios.get(API, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  },

  addCategory: async (category) => {
    const res = await axios.post(API, category, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  },

  deleteCategory: async (id) => {
    const res = await axios.delete(`${API}/${id}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    });
    return res.data;
  },
};

export default categoryService;
