// components/Admin/AdminDashboard.jsx
import React from 'react';
import UploadQuestions from '../components/Admin/UploadQuestions';
import CategoryList from '../components/Admin/CategoryList';

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <UploadQuestions />
      <CategoryList />
    </div>
  );
};

export default AdminDashboard;
