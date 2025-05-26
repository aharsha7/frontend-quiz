import React, { useState } from 'react';
import axios from 'axios';

const UploadQuestions = () => {
  const [categoryName, setCategoryName] = useState('');
  const [timer, setTimer] = useState('');
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!categoryName.trim() || !file || !timer.trim()) {
      return setMessage('Please enter a category name, timer, and select a CSV file.');
    }

    const timerNum = Number(timer);
    if (isNaN(timerNum) || timerNum <= 0) {
      return setMessage('Timer must be a positive number (in minutes).');
    }

    let token = null;
    try {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        const user = JSON.parse(userInfo);
        token = user.token;
      }
    } catch (error) {
      console.error('Error parsing userInfo:', error);
    }

    if (!token) {
      return setMessage('❌ Please log in to upload questions.');
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', categoryName.trim());
    formData.append('timer', timerNum);

    try {
      setLoading(true);
      const { data } = await axios.post(`http://localhost:5000/api/quiz/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setMessage(`✅ ${data.message} (${data.count} questions)`);
      setCategoryName('');
      setTimer('');
      setFile(null);
      const fileInput = document.getElementById('file');
      if (fileInput) fileInput.value = '';
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response?.status === 401) {
        setMessage('❌ Authentication failed. Please log in again.');
      } else {
        setMessage(`❌ ${error.response?.data?.message || 'Upload failed'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto my-6 bg-white rounded-xl shadow-lg p-8 overflow-y-auto max-h-[90vh]">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Upload Questions via CSV</h2>
      <form onSubmit={handleUpload} className="space-y-5">
        <div>
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700 mb-2">
            Category Name
          </label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            placeholder="Enter category name"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="timer" className="block text-sm font-medium text-gray-700 mb-2">
            Timer (in minutes)
          </label>
          <input
            type="number"
            id="timer"
            value={timer}
            onChange={(e) => setTimer(e.target.value)}
            placeholder="Enter timer duration"
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={loading}
          />
        </div>

        <div>
          <label htmlFor="file" className="block text-sm font-medium text-gray-700 mb-2">
            CSV File
          </label>
          <input
            type="file"
            id="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files[0])}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={loading}
          />
          <p className="mt-1 text-xs text-gray-500">Upload a CSV file with your quiz questions</p>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md font-medium text-white transition duration-200 ${
            loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-600 hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
          }`}
        >
          {loading ? 'Uploading...' : 'Upload Questions'}
        </button>
      </form>

      {message && (
        <div
          className={`mt-6 p-4 rounded-md border text-sm ${
            message.includes('✅')
              ? 'bg-green-50 text-green-700 border-green-200'
              : 'bg-red-50 text-red-700 border-red-200'
          }`}
        >
          {message}
        </div>
      )}
    </div>
  );
};

export default UploadQuestions;
