// src/pages/AdminUploadPage.jsx
import React from 'react';
import UploadQuestions from '../components/Admin/UploadQuestions';

const AdminUploadPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-6">Admin Quiz Upload</h1>
      <UploadQuestions />
    </div>
  );
};

export default AdminUploadPage;
