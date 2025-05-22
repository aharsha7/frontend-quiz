import api from './api';

const categoryService = {
  getCategories: async () => {
    const res = await api.get('/category');
    return res.data;
  },

  addCategory: async (category) => {
    const res = await api.post('/category', category);
    return res.data;
  },

  deleteCategory: async (id) => {
    const res = await api.delete(`/category/${id}`);
    return res.data;
  },
};

export default categoryService;
