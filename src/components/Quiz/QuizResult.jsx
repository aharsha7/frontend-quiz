import React from 'react';

const QuizResult = ({ score, total, onRestart }) => {
  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <h2 className="text-2xl font-bold mb-4">Quiz Completed!</h2>
      <p className="text-lg mb-2">Your Score: {score} / {total}</p>
      <button
        onClick={onRestart}
        className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Try Again
      </button>
    </div>
  );
};

export default QuizResult;
