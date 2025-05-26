// src/components/Quiz/QuizQuestions.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuestionsByCategory } from "../../services/quizService";
import { ClipLoader } from "react-spinners"; // ✅ Import spinner

const QuizQuestions = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [timer, setTimer] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true); // ✅ Loading state

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchQuestionsByCategory(categoryId);
        setQuestions(data.questions);
        setTimer(data.categoryTimer * 60);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false); // ✅ Stop loader
      }
    };
    loadQuestions();
  }, [categoryId]);

  useEffect(() => {
    if (timer <= 0 && questions.length > 0 && !isSubmitted) {
      handleSubmit();
      return;
    }

    const countdown = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(countdown);
  }, [timer, isSubmitted, questions]);

  const handleOptionSelect = (questionId, option) => {
    setSelectedOptions((prev) => ({ ...prev, [questionId]: option }));
  };

  const handlePrevious = () => {
    if (currentQ > 0) setCurrentQ(currentQ - 1);
  };

  const handleNext = () => {
    if (currentQ < questions.length - 1) setCurrentQ(currentQ + 1);
  };

  const handleSubmit = async () => {
    setIsSubmitted(true);
    const answersArray = questions.map((q) => selectedOptions[q._id] || null);

    try {
      const token = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo")).token
        : null;

      const response = await fetch("http://localhost:5000/api/result/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          categoryId,
          answers: questions.map((q, idx) => ({
            question: q._id,
            answer: answersArray[idx],
          })),
        }),
      });

      const resultData = await response.json();
      navigate("/result", {
        state: {
          questions,
          answers: answersArray,
          backendResult: resultData,
        },
      });
    } catch (error) {
      console.error("Error submitting results:", error);
      navigate("/result", {
        state: {
          questions,
          answers: answersArray,
        },
      });
    }
  };

  const formatTime = (sec) => {
    const min = Math.floor(sec / 60);
    const seconds = sec % 60;
    return `${min.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <ClipLoader color="#3b82f6" size={60} />
      </div>
    );
  }

  const question = questions[currentQ];

  return (
    <div className="max-w-3xl mx-auto p-6 mt-10 bg-gradient-to-br from-blue-50 to-white shadow-xl rounded-2xl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">
          Question {currentQ + 1} / {questions.length}
        </h2>
        <span className="text-red-700 font-semibold text-lg bg-red-100 px-4 py-1 rounded-full">
          ⏳ {formatTime(timer)}
        </span>
      </div>

      <div className="mb-8">
        <p className="text-xl font-semibold text-gray-700 mb-6">
          {question.questionText}
        </p>

        <div className="space-y-4">
          {question.options.map((option, index) => {
            const isSelected = selectedOptions[question._id] === option;
            return (
              <div
                key={index}
                onClick={() => handleOptionSelect(question._id, option)}
                className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                    : "bg-white border-gray-300 hover:bg-blue-100 hover:border-blue-400"
                }`}
              >
                <input
                  type="radio"
                  name={`option-${question._id}`}
                  checked={isSelected}
                  onChange={() => handleOptionSelect(question._id, option)}
                  className="form-radio h-5 w-5 text-blue-600 mr-4 cursor-pointer"
                />
                <span className="text-base font-medium">{option}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex justify-between mt-10">
        <button
          onClick={handlePrevious}
          disabled={currentQ === 0}
          className={`px-6 py-3 rounded-lg font-medium ${
            currentQ === 0
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600 text-white shadow-md"
          }`}
        >
          ⬅ Previous
        </button>

        {currentQ < questions.length - 1 ? (
          <button
            onClick={handleNext}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-medium shadow-md"
          >
            Next ➡
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-medium shadow-md"
          >
            ✅ Submit Quiz
          </button>
        )}
      </div>
    </div>
  );
};

export default QuizQuestions;
