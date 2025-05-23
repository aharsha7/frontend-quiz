// components/Admin/AdminDashboard.jsx
import React, { useState } from "react";
import UploadQuestions from "../components/Admin/UploadQuestions";
import AdminAddQuestions from "../components/Admin/ManualQuestionForm";
import CategoryManager from "../components/Admin/CategoryManager";

const AdminDashboard = () => {
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  const handleManualSubmit = async (data) => {
    try {
      const user = JSON.parse(localStorage.getItem("userInfo"));
      const token = user?.token;

      if (!token) {
        alert("❌ No token found. Please login again.");
        return;
      }

      const response = await fetch("http://localhost:5000/api/quiz/manual-upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const resData = await response.json();
      if (response.ok) {
        alert("✅ Questions added successfully!");
        setSubmissionSuccess(true);
      } else {
        alert("❌ Error: " + (resData?.message || "Unknown error"));
      }
    } catch (error) {
      alert("❌ Submission failed: " + error.message);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">Admin Dashboard</h1>

      <CategoryManager />

      <div className="mb-10">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">Upload Questions via CSV</h2>
        <UploadQuestions />
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Add Questions Manually</h2>
        <AdminAddQuestions
          onSubmit={handleManualSubmit}
          submissionSuccess={submissionSuccess}
          setSubmissionSuccess={setSubmissionSuccess}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
