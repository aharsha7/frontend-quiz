import api from './api';

const categoryService = {
  getCategories: async () => {
    const res = await api.get('/api/category');
    return res.data;
  },

  addCategory: async (category) => {
    const res = await api.post('/api/category', category);
    return res.data;
  },

  deleteCategory: async (id) => {
    const res = await api.delete(`/api/category/${id}`);
    return res.data;
  },
};

export default categoryService;