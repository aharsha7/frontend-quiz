// src/components/Quiz/QuizHistory.jsx
import React, { useEffect, useState } from "react";
import { fetchQuizHistory } from "../../services/resultService";
import { DotLoader } from "react-spinners"; 
import { useNavigate } from "react-router-dom";

const QuizHistory = () => {
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        setLoading(true);
        const data = await fetchQuizHistory();
        setHistory(Array.isArray(data) ? data : []);
        setError(null);
      } catch (error) {
        console.error("Error fetching quiz history:", error);
        setError("Failed to load quiz history");
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    loadHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-green-600 bg-green-100";
    if (percentage >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-10">
        <div className="flex flex-col items-center justify-center h-64">
          <span className="text-medium">Loading</span>
          <DotLoader color="#6366f1" size={20} />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6 mt-10">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10">
      <div className="bg-white shadow-xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 flex items-center gap-4">
          <button
            onClick={() => navigate("/quiz/dashboard")}
            className="text-white hover:bg-blue-700 bg-blue-500 rounded-full p-2 focus:outline-none focus:ring-2 focus:ring-white transition"
            title="Back to Dashboard"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 19.5L8.25 12l7.5-7.5"
              />
            </svg>
          </button>
          <div>
            <h1 className="text-3xl font-bold text-white">Quiz History</h1>
            <p className="text-blue-100 mt-2">
              Your quiz performance over time
            </p>
          </div>
        </div>

        <div className="p-8">
          {history.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">
                No Quiz History Yet
              </h3>
              <p className="text-gray-500">
                Take your first quiz to see your results here!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {history.map((result) => (
                <div
                  key={result._id}
                  className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-200"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-4 mb-3">
                        <h3 className="text-lg font-semibold text-gray-800">
                          {result.category?.name || "Deleted Category"}
                        </h3>

                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(
                            result.score,
                            result.total
                          )}`}
                        >
                          {result.score}/{result.total}
                        </span>
                      </div>

                      <div className="text-sm text-gray-500 mb-3">
                        Taken on {formatDate(result.createdAt)}
                      </div>

                      <div className="space-y-2">
                        <div className="text-sm font-medium text-gray-700">
                          Your Answers:
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                          {result.answers.map((answer, index) => (
                            <div
                              key={answer._id}
                              className={`px-3 py-2 rounded text-sm border ${
                                answer.isCorrect
                                  ? "bg-green-50 border-green-200 text-green-800"
                                  : "bg-red-50 border-red-200 text-red-800"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>Q{index + 1}</span>
                                <span>{answer.isCorrect ? "✓" : "✗"}</span>
                              </div>
                              <div className="text-xs mt-1 opacity-75">
                                {answer.selectedAnswer}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 md:mt-0 md:ml-6">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-gray-800">
                          {Math.round((result.score / result.total) * 100)}%
                        </div>
                        <div className="text-sm text-gray-500">Score</div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizHistory;
