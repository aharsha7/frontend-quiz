import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { BarLoader } from "react-spinners";

const RecentResults = () => {
  const [recentResults, setRecentResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const res = await api.get("/api/result/recent-results", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setRecentResults(res.data);
      } catch (err) {
        console.error("Failed to load recent results", err);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchResults();
    } else {
      setLoading(false);
    }
  }, [token]);

  const formatDate = (date) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(date).toLocaleDateString('en-US', options);
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 bg-green-50';
    if (score >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getScoreIcon = (score) => {
    if (score >= 80) return '🎉';
    if (score >= 60) return '👍';
    return '📚';
  };

  return (
  <div className="p-6 mb-8">
    <div className="flex items-center gap-2 mb-6">
      <h2 className="text-2xl font-bold text-gray-800">Recent Results</h2>
      <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
        Last 2 attempts
      </span>
    </div>
    
    {loading ? (
      <div className="flex flex-col justify-center items-center h-32">
        <BarLoader color="#3b82f6" width={150} height={4} />
        <p className="text-gray-500 mt-3">Loading recent results...</p>
      </div>
    ) : recentResults.length === 0 ? (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📊</div>
        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Quiz Results Yet</h3>
        <p className="text-gray-500">Start taking quizzes to see your recent results here!</p>
      </div>
    ) : (
      <div className="grid md:grid-cols-2 gap-6">
        {recentResults.map((result, idx) => (
          <div 
            key={result._id || idx} 
            className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all duration-300"
          >
            {/* Header with Category and Date */}
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800">
                  {result.category?.name || "Quiz"}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {formatDate(result.createdAt)}
                </p>
              </div>
              <div className="text-2xl">
                {getScoreIcon(result.score)}
              </div>
            </div>

            {/* Score Badge */}
            <div className="mb-4">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold ${getScoreColor(result.score)}`}>
                <span>Score: {result.score}%</span>
              </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between py-3 border-t border-gray-100">
              <div className="text-center">
                <div className="text-lg font-bold text-green-600">
                  {result.correctAnswers}
                </div>
                <div className="text-xs text-gray-500">Correct</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-gray-600">
                  {result.totalQuestions}
                </div>
                <div className="text-xs text-gray-500">Total</div>
              </div>
              
              <div className="text-center">
                <div className="text-lg font-bold text-blue-600">
                  {Math.round((result.correctAnswers / result.totalQuestions) * 100)}%
                </div>
                <div className="text-xs text-gray-500">Accuracy</div>
              </div>
            </div>

            {/* Time Taken (if available) */}
            {result.timeTaken && (
              <div className="mt-3 flex items-center justify-center gap-2 text-sm text-gray-600">
                <span>⏱️</span>
                <span>Time: {result.timeTaken}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);
};

export default RecentResults;