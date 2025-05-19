// components/User/UserDashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const UserDashboard = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Welcome, {user?.name} 👋</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Start Quiz Section */}
        <div className="p-4 border rounded-xl shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-2">Take a Quiz</h2>
          <p className="text-sm text-gray-600 mb-4">Choose from a list of categories and start practicing.</p>
          <Link
            to="/quiz/start"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Start Quiz
          </Link>
        </div>

        {/* History Section */}
        <div className="p-4 border rounded-xl shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-2">Your Quiz History</h2>
          <p className="text-sm text-gray-600 mb-4">Check how you've performed in previous quizzes.</p>
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
