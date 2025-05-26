import React, { useState, useEffect } from "react";

const ManualQuestionForm = ({
  onSubmit,
  submissionSuccess,
  setSubmissionSuccess,
}) => {
  const [category, setCategory] = useState("");
  const [timer, setTimer] = useState("");
  const [questions, setQuestions] = useState([
    {
      text: "",
      options: ["", "", "", ""],
      correctOption: 0,
    },
  ]);

  const handleQuestionChange = (index, key, value) => {
    const updatedQuestions = [...questions];
    if (key === "correctOption") {
      updatedQuestions[index][key] = Number(value); // ensure it's a number
    } else {
      updatedQuestions[index][key] = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { text: "", options: ["", "", "", ""], correctOption: 0 },
    ]);
  };

  const removeQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const addOption = (qIndex) => {
    const updated = [...questions];
    updated[qIndex].options.push("");
    setQuestions(updated);
  };

  const removeOption = (qIndex, optIndex) => {
    const updated = [...questions];
    updated[qIndex].options.splice(optIndex, 1);

    // Adjust correctOption if needed
    if (updated[qIndex].correctOption >= updated[qIndex].options.length) {
      updated[qIndex].correctOption = 0; // reset to first option if current correctOption removed
    }
    setQuestions(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate that correctOption is within options array bounds
    for (const q of questions) {
      if (
        q.correctOption === undefined ||
        q.correctOption < 0 ||
        q.correctOption >= q.options.length
      ) {
        alert(`Invalid correct option selected for question: "${q.text}"`);
        return;
      }
    }

    // Send the data to backend with correctOption as index
    const formattedQuestions = questions.map((q) => ({
      text: q.text,
      options: q.options,
      correctOption: q.correctOption,
    }));

    onSubmit({ category, timer, questions: formattedQuestions });
  };

  useEffect(() => {
    if (submissionSuccess) {
      setCategory("");
      setTimer("");
      setQuestions([{ text: "", options: ["", "", "", ""], correctOption: 0 }]);
      setSubmissionSuccess(false);
    }
  }, [submissionSuccess, setSubmissionSuccess]);

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4 text-gray-800">
        Manage Categories
      </h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-6 p-4 bg-white shadow rounded-lg"
      >
        <div className="flex gap-4">
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

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="border p-4 rounded space-y-3">
            <div className="flex justify-between items-center">
              <label className="font-semibold">Question {qIndex + 1}</label>
              <button
                type="button"
                onClick={() => removeQuestion(qIndex)}
                className="text-red-500 text-sm"
              >
                Remove
              </button>
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

            <div className="space-y-2">
              {q.options.map((opt, optIndex) => (
                <div key={optIndex} className="flex items-center gap-2">
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
                  <input
                    type="radio"
                    name={`correct-${qIndex}`}
                    checked={q.correctOption === optIndex}
                    onChange={() =>
                      handleQuestionChange(qIndex, "correctOption", optIndex)
                    }
                  />
                  <span>Correct</span>
                  {q.options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => removeOption(qIndex, optIndex)}
                      className="text-red-500 text-sm"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addOption(qIndex)}
                className="text-blue-500 text-sm mt-2"
              >
                + Add Option
              </button>
            </div>
          </div>
        ))}

        <div className="flex justify-between items-center gap-4">
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
