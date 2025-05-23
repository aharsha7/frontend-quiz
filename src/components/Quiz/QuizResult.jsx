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
  let scoreText = "";
  let answersToShow = answers;
  let backendResult = location.state?.backendResult;
  let correctCount = 0;

  if (backendResult && backendResult.correctAnswers) {
    answersToShow = questions.map((q, idx) => {
      return (
        backendResult.answers?.find((a) => a.question === q._id)?.answer ||
        answers[idx]
      );
    });
    // Fix: Use correctCount from backendResult, fallback to manual calculation if missing
    if (typeof backendResult.correctCount === "number") {
      correctCount = backendResult.correctCount;
    } else {
      correctCount = questions.reduce((acc, q, idx) => {
        const userAnswer = answersToShow[idx];
        return (
          acc + (backendResult.correctAnswers[q._id] === userAnswer ? 1 : 0)
        );
      }, 0);
    }
    scoreText = `${correctCount} / ${questions.length}`;
  } else {
    correctCount = questions.reduce((acc, question, index) => {
      const userAnswer = answers[index];
      return (
        acc + (userAnswer && question.correctAnswer === userAnswer ? 1 : 0)
      );
    }, 0);
    scoreText = `${correctCount} / ${questions.length}`;
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-gradient-to-br from-blue-100 to-purple-100 shadow-2xl rounded-3xl">
      <h2 className="text-4xl font-extrabold mb-8 text-center text-blue-800 tracking-tight drop-shadow-lg">
        🎉 Quiz Results
      </h2>

      <div className="flex flex-col items-center mb-10">
        <div className="bg-white rounded-2xl shadow-lg px-10 py-6 flex flex-col items-center w-full max-w-md">
          <span className="text-5xl font-black text-purple-700 mb-2">
            {scoreText}
          </span>
          <span className="text-lg text-gray-600 font-semibold mb-1">
            Score
          </span>
        </div>
      </div>

      <div className="space-y-8 mb-10">
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
              className="border-2 border-gray-200 p-6 rounded-2xl shadow-md bg-white hover:shadow-xl transition-shadow"
            >
              <p className="font-bold mb-4 text-lg text-blue-900">
                Q{i + 1}: {q.questionText}
              </p>
              <div className="space-y-3">
                {q.options.map((opt, idx) => {
                  const isCorrectAnswer = opt === q.correctAnswer;
                  const isUserAnswer = opt === userAnswer;
                  let bgColor = "bg-white";
                  let borderColor = "border-gray-200";
                  let textColor = "text-gray-700";
                  let icon = null;
                  if (isUserAnswer && isCorrectAnswer) {
                    bgColor = "bg-green-50";
                    borderColor = "border-green-400";
                    textColor = "text-green-800";
                    icon = <span className="text-green-600 mr-2">✓</span>;
                  } else if (isUserAnswer && !isCorrectAnswer) {
                    bgColor = "bg-red-50";
                    borderColor = "border-red-400";
                    textColor = "text-red-800";
                    icon = <span className="text-red-600 mr-2">✗</span>;
                  } else if (isCorrectAnswer) {
                    bgColor = "bg-green-50";
                    borderColor = "border-green-400";
                    textColor = "text-green-800";
                  }
                  return (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg border-2 ${bgColor} ${borderColor} flex items-center`}
                    >
                      {icon}
                      <span className={`font-medium ${textColor}`}>{opt}</span>
                      {isCorrectAnswer && !isUserAnswer && (
                        <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Correct Answer
                        </span>
                      )}
                      {isUserAnswer && !isCorrectAnswer && (
                        <span className="ml-auto text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          Your Answer
                        </span>
                      )}
                      {isCorrectAnswer && isUserAnswer && (
                        <span className="ml-auto text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          Correct & Your Answer
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
              <div className="mt-4 p-3 bg-gray-50 rounded-xl">
                <p className="text-sm">
                  <span className="font-medium">Your Answer: </span>
                  <span
                    className={
                      isUnanswered
                        ? "text-gray-500"
                        : isCorrect
                        ? "text-green-600 font-medium"
                        : "text-red-600 font-medium"
                    }
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
                {!isCorrect && (
                  <p className="text-xs mt-2 text-green-700">
                    Correct Answer:{" "}
                    <span className="font-semibold">{q.correctAnswer}</span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-center space-x-6 mt-8">
        <button
          onClick={() => navigate("/quiz/dashboard")}
          className="bg-blue-700 hover:bg-blue-800 text-white px-8 py-3 rounded-xl font-bold shadow-lg text-lg transition"
        >
          Back to Home
        </button>
        <button
          onClick={() => {
            const shuffled = [...questions].sort(() => Math.random() - 0.5);
            const categoryId =
              questions[0]?.category || questions[0]?.categoryId;
            if (categoryId) {
              navigate(`/quiz/${categoryId}`, {
                state: { questions: shuffled },
              });
            } else {
              alert("Category ID not found for retake.");
            }
          }}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg text-lg transition"
        >
          Retake Quiz
        </button>
      </div>
    </div>
  );
};

export default QuizResult;
