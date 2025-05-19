import React, { useState } from 'react';

const QuizStart = ({ categories, onStart }) => {
  const [category, setCategory] = useState('');

  const handleStart = () => {
    if (category) onStart(category);
  };

  return (
    <div className="bg-white p-6 rounded shadow text-center">
      <h2 className="text-xl font-semibold mb-4">Start a New Quiz</h2>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full mb-4 p-2 border rounded"
      >
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat._id} value={cat._id}>
            {cat.name}
          </option>
        ))}
      </select>
      <button
        onClick={handleStart}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        disabled={!category}
      >
        Start Quiz
      </button>
    </div>
  );
};

export default QuizStart;
