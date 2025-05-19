import React from 'react';
import { Link } from 'react-router-dom';

const QuizHistory = ({ results }) => {
  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div
          key={result._id}
          className="p-4 bg-white shadow rounded border flex items-center justify-between"
        >
          <div>
            <p className="text-lg font-semibold">
              {result.category?.name || 'Unknown Category'}
            </p>
            <p className="text-gray-600">
              Score: {result.score}/{result.total} •{' '}
              {new Date(result.createdAt).toLocaleString()}
            </p>
          </div>
          <Link
            to={`/result/${result._id}`}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            View
          </Link>
        </div>
      ))}
    </div>
  );
};

export default QuizHistory;
