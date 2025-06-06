import React, { useState } from "react";

const ManualQuestionForm = ({ onSubmit, onClose }) => {
  const [category, setCategory] = useState("");
  const [timer, setTimer] = useState("");
  const [showNotification, setShowNotification] = useState(false);
  const [questions, setQuestions] = useState([
    {
      text: "",
      options: ["", "", "", ""],
      correctOption: 0,
    },
  ]);

  const handleQuestionChange = (index, key, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index][key] =
      key === "correctOption" ? Number(value) : value;
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updated = [...questions];
    updated[qIndex].options[optIndex] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", options: ["", "", "", ""], correctOption: 0 },
    ]);
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const removeOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(optIndex, 1);
    if (updated[qIndex].correctOption >= updated[qIndex].options.length) {
      updated[qIndex].correctOption = 0;
    }
    setQuestions(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate correctOption bounds
    for (const q of questions) {
      if (
        q.correctOption === undefined ||
        q.correctOption < 0 ||
        q.correctOption >= q.options.length
      ) {
        return;
      }
    }

    const formattedQuestions = questions.map((q) => ({
      text: q.text,
      options: q.options,
      correctOption: q.correctOption,
    }));

    try {
      await onSubmit({ category, timer, questions: formattedQuestions });

      setCategory("");
      setTimer("");
      setQuestions([{ text: "", options: ["", "", "", ""], correctOption: 0 }]);
      setShowNotification(true);

      setTimeout(() => setShowNotification(false), 3000);
      setTimeout(() => {
        if (onClose) onClose();
      }, 500);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="px-4">
      {showNotification && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg text-center font-medium">
          Questions uploaded successfully!
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Add Questions Manually
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-4 bg-white shadow rounded-lg"
      >
        {/* Category and Timer */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <label className="block font-medium">Category</label>
            <input
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex-1">
            <label className="block font-medium">Timer (in minutes)</label>
            <input
              type="number"
              value={timer}
              onChange={(e) => setTimer(e.target.value)}
              required
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        {/* Questions List */}
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="border p-4 rounded space-y-4">
            <div className="flex justify-between items-center flex-wrap gap-2">
              <label className="font-semibold">Question {qIndex + 1}</label>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-red-500 text-sm hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
            <input
              type="text"
              placeholder="Enter question"
              value={q.text}
              onChange={(e) =>
                handleQuestionChange(qIndex, "text", e.target.value)
              }
              required
              className="w-full p-2 border rounded"
            />

            {/* Options */}
            <div className="space-y-3">
              {q.options.map((opt, optIndex) => (
                <div
                  key={optIndex}
                  className="flex flex-col sm:flex-row sm:items-center gap-2"
                >
                  <input
                    type="text"
                    placeholder={`Option ${optIndex + 1}`}
                    value={opt}
                    onChange={(e) =>
                      handleOptionChange(qIndex, optIndex, e.target.value)
                    }
                    required
                    className="flex-1 p-2 border rounded"
                  />
                  <div className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`correct-${qIndex}`}
                      checked={q.correctOption === optIndex}
                      onChange={() =>
                        handleQuestionChange(qIndex, "correctOption", optIndex)
                      }
                    />
                    <span className="text-sm">Correct</span>
                    {q.options.length > 2 && (
                      <button
                        type="button"
                        onClick={() => removeOption(qIndex, optIndex)}
                        className="text-red-500 text-sm hover:underline"
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(qIndex)}
                className="text-blue-500 text-sm"
              >
                + Add Option
              </button>
            </div>
          </div>
        ))}

        {/* Action Buttons */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <button
            type="button"
            onClick={addQuestion}
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            + Add Another Question
          </button>
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded"
          >
            Submit Questions
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManualQuestionForm;
