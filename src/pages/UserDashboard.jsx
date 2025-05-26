// components/User/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const UserDashboard = () => {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("userInfo")) || {};
  const token = userData.token;
  const [categories, setCategories] = useState([]);

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

        const response = await axios.get(
          "http://localhost:5000/api/quiz/categories",
          config
        );

        setCategories(response.data);
      } catch (error) {
        if (error.response?.status === 401) {
          localStorage.removeItem("userInfo");
          navigate("/login");
        }
      }
    };

    fetchCategories();
  }, [navigate, token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Welcome, {userData?.name} 👋</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left Card - Available Quizzes */}
        <div className="flex-1 p-6 border rounded-xl shadow-md bg-white min-w-[300px]">
          <h2 className="text-xl font-semibold mb-4">Available Quizzes</h2>
          {categories.length === 0 ? (
            <p className="text-gray-500">No quiz categories available yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {categories.map((cat) => (
                <Link
                  key={cat._id}
                  to={`/quiz/${cat._id}`}
                  className="block px-4 py-3 border rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium"
                >
                  {cat.name}
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Right Card - Quiz History */}
        <div className="flex-1 p-6 border rounded-xl shadow-md bg-white min-w-[300px]">
          <h2 className="text-xl font-semibold mb-2">Your Quiz History</h2>
          <p className="text-sm text-gray-600 mb-4">
            See your previous quiz attempts and scores.
          </p>
          <Link
            to="/quiz/history"
            className="inline-block px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            View History
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
