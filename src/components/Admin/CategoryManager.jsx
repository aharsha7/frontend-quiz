// components/Admin/CategoryManager.jsx
import React, { useEffect, useState } from "react";

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

const fetchCategories = async () => {
  setLoading(true);
  try {
    const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
    const res = await fetch("http://localhost:5000/api/quiz/admin/categories", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setCategories(data);
  } catch (err) {
    alert("Failed to load categories");
  } finally {
    setLoading(false);
  }
};

const deleteCategory = async (category) => {
  if (!window.confirm(`Delete all questions in "${category}"?`)) return;

  try {
    const token = JSON.parse(localStorage.getItem("userInfo"))?.token;
    const res = await fetch(`http://localhost:5000/api/quiz/admin/category/${category}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    const result = await res.json();
    alert(result.message);
    fetchCategories();
  } catch (err) {
    alert("Failed to delete category");
  }
};

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <div className="mb-10">
      <h2 className="text-xl font-semibold mb-2 text-gray-700">Manage Categories</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li
              key={cat}
              className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded"
            >
              <span className="capitalize">{cat}</span>
              <button
                onClick={() => deleteCategory(cat)}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CategoryManager;
