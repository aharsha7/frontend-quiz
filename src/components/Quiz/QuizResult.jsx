// src/components/Quiz/QuizResult.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Ensure fallback to empty arrays if undefined
  const questions = location.state?.questions || [];
  const answers = location.state?.answers || [];

  if (!questions.length) {
    return (
      <div className="p-6 text-center">
        <p>No quiz data found.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  // Calculate number of correct answers - use backendResult if available
  let correctCount = 0;
  let attemptedCount = 0;
  let percentage = 0;
  let answersToShow = answers;
  let backendResult = location.state?.backendResult;

  if (backendResult && backendResult.correctAnswers) {
    // Use backend's correct answers
    answersToShow = questions.map((q, idx) => {
      return backendResult.answers?.find(a => a.question === q._id)?.answer || answers[idx];
    });
    correctCount = backendResult.correctCount || 0;
    attemptedCount = backendResult.answers?.filter(a => a.answer !== null && a.answer !== undefined && a.answer !== '').length || 0;
    percentage = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
  } else {
    // Fallback to frontend calculation
    correctCount = questions.reduce((acc, question, index) => {
      const userAnswer = answers[index];
      return acc + (userAnswer && question.correctAnswer === userAnswer ? 1 : 0);
    }, 0);
    attemptedCount = answers.filter(
      (ans) => ans !== null && ans !== undefined && ans !== ""
    ).length;
    percentage =
      questions.length > 0
        ? Math.round((correctCount / questions.length) * 100)
        : 0;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
        Quiz Results
      </h2>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-2xl font-bold text-blue-600">
              {questions.length}
            </p>
            <p className="text-sm text-gray-600">Total Questions</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-2xl font-bold text-yellow-600">
              {attemptedCount}
            </p>
            <p className="text-sm text-gray-600">Attempted</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-2xl font-bold text-green-600">{correctCount}</p>
            <p className="text-sm text-gray-600">Correct</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <p className="text-2xl font-bold text-purple-600">{percentage}%</p>
            <p className="text-sm text-gray-600">Score</p>
          </div>
        </div>
      </div>

      <div className="space-y-6 mb-8">
        {questions.map((q, i) => {
          const userAnswer = answersToShow[i];
          let isCorrect = false;
          let isUnanswered = !userAnswer || userAnswer === "";
          if (backendResult && backendResult.correctAnswers) {
            isCorrect = backendResult.correctAnswers[q._id] === userAnswer;
          } else {
            isCorrect = userAnswer && userAnswer === q.correctAnswer;
          }

          return (
            <div
              key={q._id || i}
              className="border-2 border-gray-200 p-6 rounded-lg shadow-sm"
            >
              <p className="font-bold mb-4 text-lg text-gray-800">
                Q{i + 1}: {q.questionText}
              </p>
              <div className="space-y-3">
                {q.options.map((opt, idx) => {
                  const isCorrectAnswer = opt === q.correctAnswer;
                  const isUserAnswer = opt === userAnswer;

                  let bgColor = "bg-white";
                  let borderColor = "border-gray-200";
                  let textColor = "text-gray-700";
                  let icon = "";

                  if (isCorrectAnswer) {
                    bgColor = "bg-green-50";
                    borderColor = "border-green-400";
                    textColor = "text-green-800";
                    icon = "✓ ";
                  }

                  if (isUserAnswer && !isCorrectAnswer) {
                    bgColor = "bg-red-50";
                    borderColor = "border-red-400";
                    textColor = "text-red-800";
                    icon = "✗ ";
                  }

                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-2 ${bgColor} ${borderColor}`}
                    >
                      <div className="flex items-center">
                        <span
                          className={`font-bold mr-2 ${
                            isCorrectAnswer
                              ? "text-green-600"
                              : isUserAnswer
                              ? "text-red-600"
                              : ""
                          }`}
                        >
                          {icon}
                        </span>
                        <span className={`font-medium ${textColor}`}>
                          {opt}
                        </span>
                        {isCorrectAnswer && (
                          <span className="ml-auto text-sm bg-green-100 text-green-800 px-2 py-1 rounded">
                            Correct Answer
                          </span>
                        )}
                        {isUserAnswer && !isCorrectAnswer && (
                          <span className="ml-auto text-sm bg-red-100 text-red-800 px-2 py-1 rounded">
                            Your Answer
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 p-3 bg-gray-100 rounded">
                <p className="text-sm">
                  <span className="font-medium">Your Answer: </span>
                  <span
                    className={`${
                      isUnanswered
                        ? "text-gray-500"
                        : isCorrect
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }`}
                  >
                    {userAnswer || "Not answered"}
                  </span>
                  <span
                    className={`ml-2 font-medium ${
                      isUnanswered
                        ? "text-gray-500"
                        : isCorrect
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {isUnanswered
                      ? "– Unanswered"
                      : isCorrect
                      ? "– Correct!"
                      : "– Incorrect"}
                  </span>
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center space-x-4">
        <button
          onClick={() => navigate("/quiz/dashboard")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium shadow-md"
        >
          Back to Home
        </button>
        <button
          onClick={() => {
            // Shuffle questions
            const shuffled = [...questions].sort(() => Math.random() - 0.5);
            // Get categoryId from first question (assuming all questions are from the same category)
            const categoryId = questions[0]?.category || questions[0]?.categoryId;
            if (categoryId) {
              navigate(`/quiz/${categoryId}`, { state: { questions: shuffled } });
            } else {
              alert('Category ID not found for retake.');
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium shadow-md"
        >
          Retake Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizResult;
