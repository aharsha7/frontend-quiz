import React from 'react';

const QuizQuestions = ({ question, currentIndex, total, selected, onSelect }) => {
  return (
    <div className="bg-white p-6 rounded shadow">
      <h3 className="text-lg font-semibold mb-2">Question {currentIndex + 1} of {total}</h3>
      <p className="mb-4">{question.text}</p>
      <div className="space-y-2">
        {question.options.map((option, idx) => (
          <button
            key={idx}
            onClick={() => onSelect(option)}
            className={`block w-full text-left p-2 border rounded ${
              selected === option ? 'bg-blue-500 text-white' : 'bg-gray-100'
            }`}
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuizQuestions;
