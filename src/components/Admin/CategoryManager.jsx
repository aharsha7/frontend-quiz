import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Modal from "react-modal";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import { useNavigate } from "react-router-dom";
import { PulseLoader } from "react-spinners";

const notyf = new Notyf({
  position: { x: "center", y: "top" },
});
Modal.setAppElement("#root");

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteToast, setDeleteToast] = useState(false);
  const [viewQuestions, setViewQuestions] = useState(null);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch categories (array of strings)
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get("/api/quiz/admin/categories");
      setCategories(res.data || []);
    } catch (err) {
      notyf.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  // Replace the fetchQuestions function in CategoryManager.jsx with this:

  const fetchQuestions = async (categoryName) => {
    setQuestionsLoading(true);
    try {
      // Use the correct endpoint that matches your backend route
      const res = await api.get(
        `/api/quiz/category/${encodeURIComponent(categoryName)}/questions`
      );
      setViewQuestions({ category: categoryName, questions: res.data });
    } catch (err) {
      console.error(
        "Error fetching questions:",
        err.response?.data || err.message
      );
      notyf.error("Failed to load questions");
      setViewQuestions({ category: categoryName, questions: [] });
    } finally {
      setQuestionsLoading(false);
    }
  };

  const confirmDelete = (categoryName) => {
    setSelectedCategory(categoryName);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(
        `/api/quiz/admin/category/${encodeURIComponent(selectedCategory)}`
      );
      setDeleteToast(true);
      fetchCategories();
      if (viewQuestions?.category === selectedCategory) {
        setViewQuestions(null);
      }
    } catch (err) {
      notyf.error("Failed to delete category");
    } finally {
      setDeleteModalOpen(false);
      setTimeout(() => setDeleteToast(false), 2000);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <button
        onClick={() => navigate("/admin/dashboard")}
        className="mb-6 mr-2 bg-gray-200 hover:bg-gray-300 rounded-full p-2 shadow flex items-center justify-center"
        title="Back to Dashboard"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="w-6 h-6 text-gray-700"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 19.5L8.25 12l7.5-7.5"
          />
        </svg>
      </button>

      {deleteToast && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg text-center font-semibold">
          Category deleted
        </div>
      )}

      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Manage Categories
      </h2>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-8">
          <PulseLoader color="#6366f1" size={16} speedMultiplier={0.9} />
          <span className="text-gray-500 font-medium mt-4">
            Loading categories...
          </span>
        </div>
      ) : categories.length === 0 ? (
        <p className="text-gray-500">No categories found.</p>
      ) : (
        <ul className="space-y-4">
          {categories.map((cat) => (
            <li
              key={cat}
              className="flex justify-between items-center bg-white p-4 rounded-lg shadow-sm border"
            >
              <span className="capitalize font-medium text-gray-700">
                {cat}
              </span>
              <div className="space-x-3">
                <button
                  onClick={() => fetchQuestions(cat)}
                  className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 border border-blue-300 rounded hover:bg-blue-200"
                >
                  View
                </button>
                <button
                  onClick={() => confirmDelete(cat)}
                  className="px-3 py-1.5 text-sm bg-red-100 text-red-700 border border-red-300 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {viewQuestions && (
        <div className="mt-8 bg-gray-100 p-6 rounded-lg shadow-inner">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-gray-800">
              Questions in "{viewQuestions.category}"
            </h3>
            <button
              onClick={() => setViewQuestions(null)}
              className="px-3 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm"
            >
              Close
            </button>
          </div>

          {questionsLoading ? (
            <p>Loading questions...</p>
          ) : Array.isArray(viewQuestions.questions) &&
            viewQuestions.questions.length > 0 ? (
            <ul className="space-y-4">
              {viewQuestions.questions.map((q, index) => (
                <li
                  key={q._id || index}
                  className="bg-white p-4 rounded border shadow-sm"
                >
                  <p className="font-medium text-gray-800 mb-2">
                    Q{index + 1}: {q.questionText || q.question}
                  </p>
                  {Array.isArray(q.options) && q.options.length > 0 && (
                    <ul className="pl-5 list-disc text-sm text-gray-700">
                      {q.options.map((opt, i) => (
                        <li key={i}>{opt}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No questions in this category.</p>
          )}
        </div>
      )}

      <Modal
        isOpen={deleteModalOpen}
        onRequestClose={() => setDeleteModalOpen(false)}
        contentLabel="Confirm Delete"
        className="bg-white p-6 max-w-md mx-auto mt-20 rounded-lg shadow-lg outline-none"
        overlayClassName="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Confirm Deletion
        </h3>
        <p className="text-gray-600 mb-6">
          Are you sure you want to delete the category{" "}
          <span className="font-bold text-red-500">{selectedCategory}</span>?
        </p>
        <div className="flex justify-end gap-4">
          <button
            onClick={() => setDeleteModalOpen(false)}
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CategoryManager;
