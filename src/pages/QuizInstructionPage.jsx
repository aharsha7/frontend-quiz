import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const QuizInstructionPage = () => {
  const { categoryId } = useParams();
  const [category, setCategory] = useState(null);
  const [isAgreed, setIsAgreed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`/api/quiz/categories/${categoryId}`);
        setCategory(res.data);
      } catch (err) {
        console.error("Failed to load category", err);
      }
    };
    fetchCategory();
  }, [categoryId]);

  const handleStartQuiz = () => {
    if (isAgreed) {
      navigate(`/quiz/${categoryId}`);
    }
  };

  if (!category) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-lg">Loading quiz instructions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Quiz Instructions
          </h1>
          <p className="text-lg text-gray-600">
            Please read the instructions carefully before starting
          </p>
        </div>

        {/* Main Instructions Card */}
        <div className=" p-8 mb-6">
          {/* Important Notice */}
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-6 w-6 text-red-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-lg font-semibold text-red-800">
                  Important Notice
                </h3>
                <p className="text-red-700">
                  Once you start the quiz, you cannot pause or restart it. Make
                  sure you have a stable internet connection.
                </p>
              </div>
            </div>
          </div>

          {/* Instructions Grid */}
    <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* General Instructions */}
        <div className="bg-blue-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-blue-800 mb-4 flex items-center">
                <svg
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                </svg>
                General Instructions
            </h3>
            <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full min-w-6 w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                        1
                    </span>
                    <span>
                        Read each question carefully before selecting your answer
                    </span>
                </li>
                <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full min-w-6 w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                        2
                    </span>
                    <span>
                        You can navigate between questions using Previous/Next
                        buttons
                    </span>
                </li>
                <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full min-w-6 w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                        3
                    </span>
                    <span>
                        Use the question navigator to jump to any question quickly
                    </span>
                </li>
                <li className="flex items-start">
                    <span className="bg-blue-500 text-white rounded-full min-w-6 w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                        4
                    </span>
                    <span>
                        You can change your answers anytime before submitting
                    </span>
                </li>
            </ul>
        </div>

        {/* Submission Rules */}
        <div className="bg-green-50 rounded-xl p-6">
            <h3 className="text-xl font-semibold text-green-800 mb-4 flex items-center">
                <svg
                    className="h-6 w-6 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                </svg>
                Submission Rules
            </h3>
            <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                    <span className="bg-green-500 text-white rounded-full min-w-6 w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                        1
                    </span>
                    <span>Submit the quiz manually when you're ready</span>
                </li>
                <li className="flex items-start">
                    <span className="bg-green-500 text-white rounded-full min-w-6 w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                        2
                    </span>
                    <span>Auto-submission will occur when time runs out</span>
                </li>
                <li className="flex items-start">
                    <span className="bg-green-500 text-white rounded-full min-w-6 w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                        3
                    </span>
                    <span>
                        A warning will appear if you try to submit with unanswered
                        questions
                    </span>
                </li>
                <li className="flex items-start">
                    <span className="bg-green-500 text-white rounded-full min-w-6 w-6 h-6 flex items-center justify-center text-sm font-semibold mr-3 mt-0.5 flex-shrink-0">
                        4
                    </span>
                    <span>Once submitted, you cannot modify your answers</span>
                </li>
            </ul>
        </div>
    </div>

          {/* Agreement Checkbox */}
          <div className="border-2 border-gray-200 rounded-xl p-6 bg-gray-50">
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="agreement"
                checked={isAgreed}
                onChange={(e) => setIsAgreed(e.target.checked)}
                className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="agreement"
                className="cursor-pointer text-gray-700 leading-relaxed"
              >
                <span className="font-semibold text-gray-800">
                  I acknowledge that:
                </span>
                <ul className="mt-2 space-y-1 text-sm">
                  <li>• I understand that my submission will be final</li>
                </ul>
              </label>
            </div>
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center flex flex-col sm:flex-row justify-center gap-4 mt-8">
          {/* Back to Dashboard Button */}
          <button
            onClick={() => navigate("/quiz/dashboard")}
            className="px-8 py-4 rounded-2xl font-bold text-lg shadow-lg bg-gray-400 text-gray-700 hover:bg-gray-300 transition duration-300"
          >
            Back
          </button>

          {/* Start Quiz Button */}
          <button
            onClick={handleStartQuiz}
            disabled={!isAgreed}
            className={`px-8 py-4 rounded-2xl font-bold text-lg shadow-lg transform transition-all duration-300 ${
              isAgreed
                ? "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:scale-105 hover:shadow-xl cursor-pointer"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isAgreed ? (
              <span className="flex items-center justify-center space-x-2">
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
                <span>Start Quiz Now</span>
              </span>
            ) : (
              <span>Please accept the terms to continue</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuizInstructionPage;
