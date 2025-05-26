// src/components/Quiz/QuizResult.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const QuizResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const questions = location.state?.questions || [];
  const answers = location.state?.answers || [];
  const backendResult = location.state?.backendResult;

  if (!questions.length) {
    return (
      <div className="p-6 text-center">
        <p>No quiz data found.</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded"
        >
          Go Home
        </button>
      </div>
    );
  }

  // Determine answers to display
  let answersToShow = answers;
  let correctCount = 0;

  if (backendResult?.correctAnswers) {
    answersToShow = questions.map((q, idx) => {
      return (
        backendResult.answers?.find((a) => a.question === q._id)?.answer ||
        answers[idx]
      );
    });

    correctCount =
      typeof backendResult.correctCount === "number"
        ? backendResult.correctCount
        : questions.reduce((acc, q, idx) => {
            const userAnswer = answersToShow[idx];
            return (
              acc + (backendResult.correctAnswers[q._id] === userAnswer ? 1 : 0)
            );
          }, 0);
  } else {
    correctCount = questions.reduce((acc, question, index) => {
      const userAnswer = answers[index];
      return acc + (userAnswer === question.correctAnswer ? 1 : 0);
    }, 0);
  }

  const scoreText = `${correctCount} / ${questions.length}`;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-8 bg-gradient-to-br from-blue-100 to-purple-100 shadow-2xl rounded-3xl">
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

      {/* Detailed Question Breakdown */}
      <div className="space-y-8 mb-10">
        {questions.map((q, i) => {
          const userAnswer = answersToShow[i];
          const isUnanswered = !userAnswer;
          const correctAnswer = backendResult?.correctAnswers?.[q._id] || q.correctAnswer;
          const isCorrect = userAnswer === correctAnswer;

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
                  const isCorrectAnswer = opt === correctAnswer;
                  const isUserAnswer = opt === userAnswer;
                  
                  // Default styling
                  let className = "p-4 rounded-lg border-2 flex items-center bg-white border-gray-200";
                  let icon = null;
                  let textClass = "font-medium text-gray-700";

                  if (isUnanswered) {
                    // For unanswered questions: only show correct answer in green
                    if (isCorrectAnswer) {
                      className = "p-4 rounded-lg border-2 flex items-center bg-green-100 border-green-400";
                      textClass = "font-medium text-green-800";
                      icon = <span className="text-green-600 mr-2 text-lg">✓</span>;
                    }
                  } else {
                    // For answered questions
                    if (isUserAnswer && isCorrectAnswer) {
                      // User's answer is correct - green with tick
                      className = "p-4 rounded-lg border-2 flex items-center bg-green-100 border-green-400";
                      textClass = "font-medium text-green-800";
                      icon = <span className="text-green-600 mr-2 text-lg">✓</span>;
                    } else if (isUserAnswer && !isCorrectAnswer) {
                      // User's answer is wrong - red with cross
                      className = "p-4 rounded-lg border-2 flex items-center bg-red-100 border-red-400";
                      textClass = "font-medium text-red-800";
                      icon = <span className="text-red-600 mr-2 text-lg">✗</span>;
                    } else if (isCorrectAnswer && !isUserAnswer) {
                      // Show correct answer in green (when user answered incorrectly)
                      className = "p-4 rounded-lg border-2 flex items-center bg-green-100 border-green-400";
                      textClass = "font-medium text-green-800";
                      icon = <span className="text-green-600 mr-2 text-lg">✓</span>;
                    }
                  }

                  return (
                    <div key={idx} className={className}>
                      {icon}
                      <span className={textClass}>{opt}</span>
                      
                      {/* Labels */}
                      {isCorrectAnswer && !isUserAnswer && (
                        <span className="ml-auto text-xs bg-green-200 text-green-800 px-2 py-1 rounded font-medium">
                          Correct Answer
                        </span>
                      )}
                      {isUserAnswer && !isCorrectAnswer && (
                        <span className="ml-auto text-xs bg-red-200 text-red-800 px-2 py-1 rounded font-medium">
                          Your Answer
                        </span>
                      )}
                      {isCorrectAnswer && isUserAnswer && (
                        <span className="ml-auto text-xs bg-green-200 text-green-800 px-2 py-1 rounded font-medium">
                          Correct ✓
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
                        ? "text-gray-500 italic"
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
                      ? "– Correct ✓"
                      : "– Incorrect ✗"}
                  </span>
                </p>
                {!isCorrect && !isUnanswered && (
                  <p className="text-sm mt-2 text-green-700">
                    <span className="font-medium">Correct Answer: </span>
                    <span className="font-semibold text-green-800">{correctAnswer}</span>
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
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
            const categoryId = questions[0]?.category || questions[0]?.categoryId;
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