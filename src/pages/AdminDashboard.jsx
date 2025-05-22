// components/Admin/AdminDashboard.jsx
import React from 'react';
import UploadQuestions from '../components/Admin/UploadQuestions';

const AdminDashboard = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <UploadQuestions />
    </div>
  );
};

export default AdminDashboard;
