import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api"; // Adjust the import path as necessary
import { BarLoader } from "react-spinners";
import RecentResults from "../components/Quiz/RecentResults";

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

        const response = await api.get("/api/quiz/categories", config);

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
    <div className="min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="p-8 mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-500 mb-2">
                Quiz Categories
              </h1>
              <p className="text-gray-600 text-lg">
                Choose your challenge and test your knowledge!
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 items-center">
              <Link
                to="/quiz/history"
                className="bg-gradient-to-r from-teal-600 to-sky-700 hover:from-sky-700 hover:to-sky-800 text-white px-6 py-3 rounded-xl font-semibold shadow-lg flex items-center gap-2"
              >
                <span>📊</span>
                <span>View History</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="p-12">
            <div className="flex flex-col justify-center items-center">
              <span className="text-gray-600 font-medium text-lg">
                Loading quiz categories...
              </span>
              <BarLoader
                color="#3b82f6"
                height={4}
                width={200}
                className="mt-4"
              />
            </div>
          </div>
        ) : categories.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-12 text-center">
            <div className="text-6xl mb-4">📚</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">
              No Categories Available
            </h3>
            <p className="text-gray-600 text-lg">
              Quiz categories will appear here once they're added by
              administrators.
            </p>
          </div>
        ) : (
          <>
            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
              {categories.map((cat) => (
                <div
                  key={cat._id}
                  className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 h-full group hover:border-blue-300 transition"
                >
                  {/* Category Header */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-sky-500 to-cyan-900 rounded-xl flex items-center justify-center text-white text-xl font-bold shadow-lg">
                        {cat.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 group-hover:text-sky-500 transition-colors duration-200">
                      {cat.name || "Unnamed Category"}
                    </h3>
                  </div>

                  {/* Category Stats */}
                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                        Questions
                      </span>
                      <span className="font-semibold text-gray-800">
                        {typeof cat.questionCount === "number"
                          ? `${cat.questionCount} questions`
                          : "Loading..."}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                        Duration
                      </span>
                      <span className="font-semibold text-gray-800">
                        {typeof cat.timer === "number"
                          ? `${cat.timer} minutes`
                          : "Loading..."}
                      </span>
                    </div>
                  </div>

                  {/* Start Quiz Button with Link */}
                  <Link to={`/quiz/instructions/${cat._id}`} className="block">
                    <button className="w-full bg-gradient-to-r from-cyan-500 to-teal-600 hover:from-sky-600 hover:to-sky-700 hover:brightness-110 transition-all duration-300 text-white py-3 rounded-xl font-semibold shadow-md flex items-center justify-center gap-2">
                      <span>🚀</span>
                      <span>Start Quiz</span>
                    </button>
                  </Link>
                </div>
              ))}
            </div>
            <RecentResults />
          </>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;
