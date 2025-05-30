// src/components/Quiz/QuizQuestions.jsx
import React, { useEffect, useState } from "react";
import api from "../../services/api";
import { useParams, useNavigate } from "react-router-dom";
import { fetchQuestionsByCategory } from "../../services/quizService";
import { ClipLoader } from "react-spinners";

const QuizQuestions = () => {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState({});
  const [timer, setTimer] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const data = await fetchQuestionsByCategory(categoryId);
        setQuestions(data.questions);
        setTimer(data.categoryTimer * 60);
      } catch (error) {
        console.error("Error fetching questions:", error);
      } finally {
        setLoading(false);
      }
    };
    loadQuestions();
  }, [categoryId]);

  useEffect(() => {
    if (timer <= 0 && questions.length > 0 && !isSubmitted) {
      handleActualSubmit();
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

  const handleSubmit = () => {
    const answeredCount = Object.keys(selectedOptions).length;
    const totalQuestions = questions.length;
    
    if (answeredCount < totalQuestions) {
      setShowConfirmModal(true);
    } else {
      handleActualSubmit();
    }
  };

  const handleActualSubmit = async () => {
    setIsSubmitted(true);
    setShowConfirmModal(false);
    const answersArray = questions.map((q) => selectedOptions[q._id] || null);

    try {
      const token = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo")).token
        : null;

      const response = await api.post(
        "/api/result/submit",
        {
          categoryId,
          answers: questions.map((q, idx) => ({
            question: q._id,
            answer: answersArray[idx],
          })),
        },
        {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        }
      );

      const resultData = response.data;
      navigate("/result", {
        state: {
          questions,
          answers: answersArray,
          backendResult: resultData,
        },
      });
    } catch (error) {
      console.error("Error submitting results:", error.response?.data || error);
      navigate("/result", {
        state: {
          questions,
          answers: answersArray,
        },
      });
    }
  };

  const handleCancelSubmit = () => {
    setShowConfirmModal(false);
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
      <div className="flex flex-col justify-center items-center h-64">
        <span>Loading</span>
        <ClipLoader color="#3b82f6" size={30} />
      </div>
    );
  }

  const question = questions[currentQ];
  const answeredCount = Object.keys(selectedOptions).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <div className="flex flex-col lg:flex-row h-auto min-h-screen p-4 md:p-6 bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 transform transition-all duration-300 scale-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-yellow-100 mb-4">
                <svg className="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Incomplete Quiz
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                You have <span className="font-semibold text-red-600">{unansweredCount}</span> question{unansweredCount > 1 ? 's' : ''} still unanswered.
                <br />
                Do you still want to submit the quiz?
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={handleCancelSubmit}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  No, Go Back
                </button>
                <button
                  onClick={handleActualSubmit}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200"
                >
                  Yes, Submit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Left Section - 70% */}
      <div className="w-full lg:w-[70%] lg:pr-6 flex flex-col mb-6 lg:mb-0">
        {/* Timer Top Right */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Question {currentQ + 1} / {questions.length}
          </h2>
          <span className="text-red-700 font-semibold text-lg bg-red-100 px-4 py-2 rounded-full shadow-sm border border-red-200">
            ⏳ {formatTime(timer)}
          </span>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <p className="text-xl font-semibold text-gray-800 mb-4 leading-relaxed">
            {question.questionText}
          </p>
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected = selectedOptions[question._id] === option;
              return (
                <div
                  key={index}
                  onClick={() => handleOptionSelect(question._id, option)}
                  className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? "bg-blue-600 border-blue-600 text-white shadow-lg transform scale-[1.02]"
                      : "bg-white border-gray-300 hover:bg-blue-50 hover:border-blue-400 hover:shadow-sm"
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

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentQ === 0}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentQ === 0
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600 text-white shadow-md hover:shadow-lg transform hover:scale-105"
            }`}
          >
            ⬅ Previous
          </button>

          <button
            onClick={handleNext}
            disabled={currentQ >= questions.length - 1}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              currentQ >= questions.length - 1
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-green-500 hover:bg-green-600 text-white shadow-md hover:shadow-lg transform hover:scale-105"
            }`}
          >
            Next ➡
          </button>
        </div>
      </div>

      {/* Right Section - 30% */}
      <div className="w-full lg:w-[30%] flex flex-col p-4 md:p-6 ml-0 lg:ml-6">
        {/* Question Navigator */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
            Quick Navigation
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {questions.map((q, index) => {
              const isAnswered = selectedOptions[q._id] !== undefined;
              const isCurrent = index === currentQ;
              return (
                <button
                  key={q._id}
                  onClick={() => setCurrentQ(index)}
                  className={`w-12 h-12 text-black font-semibold rounded-lg shadow-md transition-all duration-200 transform hover:scale-110 ${
                    isCurrent
                      ? "ring-4 ring-blue-300 ring-opacity-50 shadow-lg"
                      : ""
                  } ${
                    isAnswered
                      ? "text-white bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
                      : "text-black bg-gradient-to-br from-slate-100 to-slate-200 hover:from-sky-300 hover:to-sky-700"
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quiz Stats */}
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="text-sm font-semibold text-gray-700 mb-2">
            Quiz Statistics
          </h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Completed:</span>
              <span className="font-medium text-green-600">
                {Object.keys(selectedOptions).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Remaining:</span>
              <span className="font-medium text-red-600">
                {questions.length - Object.keys(selectedOptions).length}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Questions:</span>
              <span className="font-medium text-gray-800">
                {questions.length}
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div>
          <button
            onClick={handleSubmit}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white px-6 py-4 rounded-lg font-semibold shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
          >
            <span>✅</span>
            <span>Submit Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizQuestions;