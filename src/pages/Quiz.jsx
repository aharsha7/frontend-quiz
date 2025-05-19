import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Common/Navbar';

const QuizPage = () => {
  const { categoryId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:5000/api/quiz/${categoryId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setQuestions(res.data.questions);
      } catch (err) {
        console.error(err);
      }
    };
    fetchQuestions();
  }, [categoryId]);

  useEffect(() => {
    if (timeLeft === 0) handleSubmit();
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswer = (selected) => {
    const questionId = questions[current]._id;
    const updated = [...answers.filter(a => a.question !== questionId), { question: questionId, answer: selected }];
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/result/submit',
        { categoryId, answers },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      navigate(`/result/${res.data.resultId}`);
    } catch (err) {
      console.error(err);
    }
  };

  if (questions.length === 0) return <div>Loading...</div>;

  const currentQuestion = questions[current];
  const selectedAnswer = answers.find(a => a.question === currentQuestion._id)?.answer;

  return (
    <div>
      <Navbar />
      <div className="max-w-2xl mx-auto p-6">
        <div className="flex justify-between mb-4">
          <h2 className="text-xl font-semibold">Question {current + 1} of {questions.length}</h2>
          <span className="text-red-500">Time Left: {timeLeft}s</span>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-medium mb-4">{currentQuestion.questionText}</h3>
          <div className="space-y-2">
            {currentQuestion.options.map((opt, idx) => (
              <div
                key={idx}
                className={`p-2 border rounded cursor-pointer ${
                  selectedAnswer === opt ? 'bg-blue-100 border-blue-500' : 'hover:bg-gray-100'
                }`}
                onClick={() => handleAnswer(opt)}
              >
                {opt}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-between mt-6">
          <button
            disabled={current === 0}
            onClick={() => setCurrent((prev) => prev - 1)}
            className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
          >
            Previous
          </button>

          {current === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Submit
            </button>
          ) : (
            <button
              onClick={() => setCurrent((prev) => prev + 1)}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizPage;
