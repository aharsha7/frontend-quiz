import React, { useEffect, useState } from "react";
import api from "../../services/api";
import Modal from "react-modal";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";

const notyf = new Notyf();

Modal.setAppElement("#root");

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [deleteToast, setDeleteToast] = useState(false);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const res = await api.get("/api/quiz/admin/categories");
      const data = res.data;
      setCategories(data);
    } catch (err) {
      notyf.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (category) => {
    setSelectedCategory(category);
    setDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
      const res = await api.delete(
        `/api/quiz/admin/category/${selectedCategory}`
      );
      const result = res.data;
      setDeleteToast(true);
      fetchCategories();
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
    <div className="mb-6 relative">
      {/* Top center red toast notification */}
      {deleteToast && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-50 bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in-out text-center font-semibold">
          Category deleted
        </div>
      )}
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Manage Categories
      </h2>
      {loading ? (
        <p>Loading...</p>
      ) : categories.length === 0 ? (
        <p className="text-gray-500">No categories found.</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat}
              className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded shadow-sm"
            >
              <span className="capitalize text-gray-700">{cat}</span>
              <button
                onClick={() => confirmDelete(cat)}
                className="px-3 py-1.5 text-sm font-medium text-red-600 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 hover:text-red-700 hover:border-red-300 focus:outline-none focus:ring-2"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}

      {/* Delete confirmation modal */}
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
