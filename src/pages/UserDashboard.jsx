import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api"; // Adjust the import path as necessary
import { BarLoader } from "react-spinners";

const UserDashboard = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userInfo")) || {};
  const token = userData.token;
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await api.get("/api/quiz/categories");

        setCategories(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("userInfo");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [navigate, token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, {userData?.name} 👋</h1>

      <div className="flex justify-center">
        <div className="w-full max-w-4xl p-6 border rounded-xl shadow-md bg-white min-w-[300px] relative">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Available Quizzes
          </h2>

          {/* History Button - below title on mobile, top-right on md+ */}
          <div className="flex justify-center md:justify-end mb-4 md:mb-0 md:absolute md:top-4 md:right-4">
            <Link
              to="/quiz/history"
              className="px-4 py-2 text-sm bg-green-600 text-white rounded hover:bg-green-700"
            >
              View History
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-24">
              <BarLoader color="#3b82f6" height={4} width={150} />
            </div>
          ) : categories.length === 0 ? (
            <p className="text-gray-500 text-center">
              No quiz categories available yet.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/quiz/${cat._id}`}
                  className="block px-4 py-3 border rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium text-center"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
