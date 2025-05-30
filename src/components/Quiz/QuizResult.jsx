import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { IoChevronBack } from "react-icons/io5";
import confetti from "canvas-confetti"; // ← ADD THIS

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
  const scorePercentage = (correctCount / questions.length) * 100;

  // 🎉 Fire confetti if score > 50%
  useEffect(() => {
    if (scorePercentage > 50) {
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
    }
  }, [scorePercentage]);

return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 py-8 px-4">
    <div className="max-w-4xl mx-auto">
      {/* Header Section */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-8">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate("/quiz/dashboard")}
            className="text-blue-700 hover:bg-blue-100 bg-blue-50 rounded-xl p-3 focus:outline-none focus:ring-4 focus:ring-blue-200 transition-all duration-200 hover:scale-110"
            title="Back to Home"
          >
            <IoChevronBack className="text-xl" />
          </button>
          <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 tracking-tight flex-1 text-center">
            🎉 Quiz Results
          </h2>
        </div>

        {/* Score Display */}
        <div className="flex justify-center mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-2xl p-8 text-center min-w-[300px] transform transition-all duration-300">
            <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl p-6 mb-4">
              <span className="text-6xl font-black text-white mb-2 block drop-shadow-lg">
                {scoreText}
              </span>
              <span className="text-xl text-white font-semibold opacity-90">
                Final Score
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-100 to-green-200 p-4 rounded-xl border border-green-300">
            <div className="text-green-700 font-semibold text-sm">Correct Answers</div>
            <div className="text-2xl font-bold text-green-800">
              {answersToShow.filter((answer, i) => answer === (backendResult?.correctAnswers?.[questions[i]._id] || questions[i].correctAnswer)).length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-red-100 to-red-200 p-4 rounded-xl border border-red-300">
            <div className="text-red-700 font-semibold text-sm">Incorrect Answers</div>
            <div className="text-2xl font-bold text-red-800">
              {answersToShow.filter((answer, i) => answer && answer !== (backendResult?.correctAnswers?.[questions[i]._id] || questions[i].correctAnswer)).length}
            </div>
          </div>
          <div className="bg-gradient-to-br from-gray-100 to-gray-200 p-4 rounded-xl border border-gray-300">
            <div className="text-gray-700 font-semibold text-sm">Unanswered</div>
            <div className="text-2xl font-bold text-gray-800">
              {answersToShow.filter(answer => !answer).length}
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Question Breakdown */}
      <div className="space-y-6 mb-10">
        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2 mb-6">
          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
          Detailed Review
        </h3>
        
        {questions.map((q, i) => {
          const userAnswer = answersToShow[i];
          const isUnanswered = !userAnswer;
          const correctAnswer =
            backendResult?.correctAnswers?.[q._id] || q.correctAnswer;
          const isCorrect = userAnswer === correctAnswer;

          return (
            <div
              key={q._id || i}
              className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-[1.01]"
            >
              {/* Question Header */}
              <div className="flex items-start gap-4 mb-6">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  isUnanswered ? 'bg-gray-400' : isCorrect ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {i + 1}
                </div>
                <p className="font-bold text-lg text-gray-800 flex-1 leading-relaxed">
                  {q.questionText}
                </p>
                <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  isUnanswered ? 'bg-gray-100 text-gray-600' : 
                  isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {isUnanswered ? 'UNANSWERED' : isCorrect ? 'CORRECT' : 'INCORRECT'}
                </div>
              </div>

              {/* Options */}
              <div className="space-y-3 mb-6">
                {q.options.map((opt, idx) => {
                  const isCorrectAnswer = opt === correctAnswer;
                  const isUserAnswer = opt === userAnswer;

                  let className = "p-4 rounded-xl border-2 flex items-center transition-all duration-200";
                  let icon = null;
                  let textClass = "font-medium text-gray-700";

                  if (isUnanswered) {
                    if (isCorrectAnswer) {
                      className += " bg-green-50 border-green-300 shadow-sm";
                      textClass = "font-semibold text-green-800";
                      icon = <span className="text-green-600 mr-3 text-lg">✓</span>;
                    } else {
                      className += " bg-gray-50 border-gray-200";
                    }
                  } else {
                    if (isUserAnswer && isCorrectAnswer) {
                      className += " bg-green-50 border-green-400 shadow-md";
                      textClass = "font-semibold text-green-800";
                      icon = <span className="text-green-600 mr-3 text-lg">✓</span>;
                    } else if (isUserAnswer && !isCorrectAnswer) {
                      className += " bg-red-50 border-red-400 shadow-md";
                      textClass = "font-semibold text-red-800";
                      icon = <span className="text-red-600 mr-3 text-lg">✗</span>;
                    } else if (isCorrectAnswer && !isUserAnswer) {
                      className += " bg-green-50 border-green-300 shadow-sm";
                      textClass = "font-semibold text-green-800";
                      icon = <span className="text-green-600 mr-3 text-lg">✓</span>;
                    } else {
                      className += " bg-gray-50 border-gray-200";
                    }
                  }

                  return (
                    <div key={idx} className={className}>
                      {icon}
                      <span className={textClass}>{opt}</span>

                      {/* Status Labels */}
                      {isCorrectAnswer && !isUserAnswer && (
                        <span className="ml-auto text-xs bg-green-200 text-green-800 px-3 py-1 rounded-full font-semibold">
                          Correct Answer
                        </span>
                      )}
                      {isUserAnswer && !isCorrectAnswer && (
                        <span className="ml-auto text-xs bg-red-200 text-red-800 px-3 py-1 rounded-full font-semibold">
                          Your Choice
                        </span>
                      )}
                      {isCorrectAnswer && isUserAnswer && (
                        <span className="ml-auto text-xs bg-green-200 text-green-800 px-3 py-1 rounded-full font-semibold">
                          Your Correct Answer ✓
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Answer Summary */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <div className="flex flex-wrap items-center gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-700">Your Answer:</span>
                    <span className={`font-semibold px-2 py-1 rounded ${
                      isUnanswered ? "text-gray-500 bg-gray-200" :
                      isCorrect ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
                    }`}>
                      {userAnswer || "Not answered"}
                    </span>
                  </div>
                  
                  <div className={`font-semibold flex items-center gap-1 ${
                    isUnanswered ? "text-gray-500" :
                    isCorrect ? "text-green-600" : "text-red-600"
                  }`}>
                    {isUnanswered ? (
                      <>⚪ Skipped</>
                    ) : isCorrect ? (
                      <>✅ Correct</>
                    ) : (
                      <>❌ Incorrect</>
                    )}
                  </div>

                  {!isCorrect && !isUnanswered && (
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-700">Correct:</span>
                      <span className="font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
                        {correctAnswer}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="p-8">
        <div className="flex flex-col sm:flex-row justify-center gap-6">
          <button
            onClick={() => navigate("/quiz/dashboard")}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-4 rounded-xl font-bold shadow-lg text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>🏠</span>
            <span>Back to Dashboard</span>
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
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-4 rounded-xl font-bold shadow-lg text-lg transition-all duration-200 transform hover:scale-105 flex items-center justify-center gap-2"
          >
            <span>🔄</span>
            <span>Retake Quiz</span>
          </button>
        </div>
      </div>
    </div>
  </div>
);
};

export default QuizResult;
