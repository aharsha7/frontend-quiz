import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/quiz/categories', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      const data = response.data;
      
      // Make sure categories is an array before setting state
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data && typeof data === 'object' && Array.isArray(data.categories)) {
        // If the API returns { categories: [...] }
        setCategories(data.categories);
      } else {
        console.error('API returned invalid data format:', data);
        setError('Failed to load categories. Invalid data format.');
        setCategories([]); // Set to empty array as fallback
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      setError('Failed to load categories.');
      setCategories([]); // Set to empty array on error
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const { data } = await axios.post('/api/quiz/categories', 
        { name: newCategory },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setCategories([...categories, data]);
      setNewCategory('');
    } catch (error) {
      console.error('Failed to add category:', error);
      alert('Failed to add category.');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    
    try {
      await axios.delete(`/api/quiz/categories/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setCategories(categories.filter(cat => cat._id !== id));
    } catch (error) {
      console.error('Failed to delete category:', error);
      alert('Failed to delete category.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 border rounded-xl shadow-md bg-white mt-6">
      <h2 className="text-2xl font-bold mb-4">Manage Categories</h2>
      
      <form onSubmit={handleAddCategory} className="mb-4 flex gap-2">
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="New category name"
          className="flex-1 border rounded p-2"
        />
        <button
          type="submit"
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded"
        >
          Add
        </button>
      </form>

      {loading ? (
        <p>Loading categories...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <ul className="divide-y">
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((cat) => (
              <li key={cat._id} className="py-2 flex justify-between items-center">
                <span>{cat.name}</span>
                <button
                  onClick={() => handleDeleteCategory(cat._id)}
                  className="text-red-600 hover:text-red-800"
                >
                  Delete
                </button>
              </li>
            ))
          ) : (
            <li className="py-2">No categories found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CategoryList;