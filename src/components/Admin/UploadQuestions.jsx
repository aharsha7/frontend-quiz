import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UploadQuestions = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchCategories = async () => {
    try {
      // Update the API endpoint to use the correct path
      // In development with Vite, API calls might need to use a full URL or proxy
      const response = await axios.get('http://localhost:5000/api/quiz/categories', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      // Check if response has expected data structure
      const data = response.data;
      
      // Make sure categories is an array before setting state
      if (Array.isArray(data)) {
        setCategories(data);
      } else if (data && typeof data === 'object' && Array.isArray(data.categories)) {
        // If the API returns { categories: [...] }
        setCategories(data.categories);
      } else {
        console.error('API returned invalid data format:', data);
        // For debugging - show the first 100 chars of response if it's string
        if (typeof data === 'string') {
          console.log('Response preview:', data.substring(0, 100));
        }
        setCategories([]); // Set to empty array as fallback
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
      if (error.response) {
        console.log('Error response:', error.response.status, error.response.statusText);
      }
      setCategories([]); // Set to empty array on error
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedCategory || !file) {
      return setMessage('Please select a category and a file.');
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      setLoading(true);
      const { data } = await axios.post(`/api/quiz/upload/${selectedCategory}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setMessage(`✅ ${data.message} (${data.count} questions)`);
    } catch (error) {
      setMessage(`❌ ${error.response?.data?.message || 'Upload failed'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-4 border rounded-xl shadow-md bg-white">
      <h2 className="text-2xl font-bold mb-4">Upload Quiz Questions (CSV)</h2>
      
      <form onSubmit={handleUpload} className="space-y-4">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full border rounded p-2"
        >
          <option value="">-- Select Category --</option>
          {Array.isArray(categories) && categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>

        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files[0])}
          className="w-full p-2 border rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded"
        >
          {loading ? 'Uploading...' : 'Upload CSV'}
        </button>

        {message && (
          <p className="mt-2 text-sm text-gray-700">
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default UploadQuestions;