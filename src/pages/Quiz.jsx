// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import Navbar from '../components/Common/Navbar';

// const QuizPage = () => {
//   const { categoryId } = useParams();
//   const [questions, setQuestions] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [answers, setAnswers] = useState([]);
//   const [timeLeft, setTimeLeft] = useState(60); // Total quiz time in seconds
//   const [submitted, setSubmitted] = useState(false);
//   const [result, setResult] = useState(null);
//   const navigate = useNavigate();

//   // Fetch questions on load
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get(`http://localhost:5000/api/quiz/${categoryId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setQuestions(res.data.questions);
//         if (res.data.timeLimit) setTimeLeft(res.data.timeLimit); // use backend-defined time
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchQuestions();
//   }, [categoryId]);

//   // Timer
//   useEffect(() => {
//     if (submitted) return;

//     if (timeLeft === 0) {
//       handleSubmit(); // Auto-submit when time is up
//       return;
//     }

//     const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
//     return () => clearInterval(timer);
//   }, [timeLeft, submitted]);

//   const handleAnswer = (selected) => {
//     const questionId = questions[current]._id;
//     const updated = [...answers.filter(a => a.question !== questionId), { question: questionId, answer: selected }];
//     setAnswers(updated);
//   };

//   const handleSubmit = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.post(
//         'http://localhost:5000/api/result/submit',
//         { categoryId, answers },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSubmitted(true);
//       setResult(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (questions.length === 0) return <div className="text-center mt-10">Loading...</div>;

//   const currentQuestion = questions[current];
//   const selectedAnswer = answers.find(a => a.question === currentQuestion._id)?.answer;

//   const isCorrect = (option) => {
//     if (!submitted || !result) return false;
//     const correctMap = result.correctAnswers || {};
//     return correctMap[currentQuestion._id] === option;
//   };

//   const isIncorrect = (option) => {
//     return submitted && selectedAnswer === option && !isCorrect(option);
//   };

//   const progressPercent = Math.round((timeLeft / 60) * 100);

//   return (
//     <div className="min-h-screen bg-gray-100">
//       <Navbar />
//       <div className="max-w-3xl mx-auto py-10 px-4">
//         <div className="mb-6">
//           <div className="text-xl font-semibold mb-2">
//             Time Left: {Math.floor(timeLeft / 60)}:{('0' + (timeLeft % 60)).slice(-2)}
//           </div>
//           <div className="w-full bg-gray-300 h-4 rounded">
//             <div
//               className="bg-green-500 h-4 rounded transition-all duration-300"
//               style={{ width: `${progressPercent}%` }}
//             ></div>
//           </div>
//         </div>

//         <div className="bg-white shadow-md rounded-lg p-6">
//           <h2 className="text-lg font-bold mb-4">Question {current + 1} of {questions.length}</h2>
//           <p className="mb-4">{currentQuestion.question}</p>

//           <div className="space-y-2">
//             {currentQuestion.options.map((opt, idx) => (
//               <button
//                 key={idx}
//                 onClick={() => handleAnswer(opt)}
//                 disabled={submitted}
//                 className={`
//                   w-full text-left px-4 py-2 rounded border
//                   ${selectedAnswer === opt ? 'border-blue-500' : 'border-gray-300'}
//                   ${isCorrect(opt) ? 'bg-green-200' : ''}
//                   ${isIncorrect(opt) ? 'bg-red-200' : ''}
//                 `}
//               >
//                 {opt}
//               </button>
//             ))}
//           </div>

//           <div className="flex justify-between mt-6">
//             <button
//               className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
//               onClick={() => setCurrent((prev) => prev - 1)}
//               disabled={current === 0}
//             >
//               Previous
//             </button>
//             {current < questions.length - 1 ? (
//               <button
//                 className="px-4 py-2 bg-blue-500 text-white rounded"
//                 onClick={() => setCurrent((prev) => prev + 1)}
//               >
//                 Next
//               </button>
//             ) : (
//               !submitted && (
//                 <button
//                   className="px-4 py-2 bg-green-500 text-white rounded"
//                   onClick={handleSubmit}
//                 >
//                   Submit
//                 </button>
//               )
//             )}
//           </div>
//         </div>

//         {submitted && result && (
//           <div className="mt-6 bg-white p-6 shadow rounded-lg">
//             <h3 className="text-xl font-semibold mb-2">Your Score</h3>
//             <p className="text-lg mb-2">Correct Answers: {result.correctCount}</p>
//             <p className="text-lg mb-4">Total Questions: {questions.length}</p>
//             <button
//               className="px-4 py-2 bg-indigo-600 text-white rounded"
//               onClick={() => navigate('/history')}
//             >
//               View History
//             </button>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default QuizPage;

// import React, { useEffect, useState } from 'react';
// import axios from 'axios';
// import { useParams, useNavigate } from 'react-router-dom';
// import Navbar from '../components/Common/Navbar';

// const QuizPage = () => {
//   const { categoryId } = useParams();
//   const [questions, setQuestions] = useState([]);
//   const [current, setCurrent] = useState(0);
//   const [answers, setAnswers] = useState([]);
//   const [timeLeft, setTimeLeft] = useState(60); // Total quiz time in seconds
//   const [submitted, setSubmitted] = useState(false);
//   const [result, setResult] = useState(null);
//   const navigate = useNavigate();

//   // Fetch questions on load
//   useEffect(() => {
//     const fetchQuestions = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         const res = await axios.get(`http://localhost:5000/api/quiz/start/${category}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setQuestions(res.data.questions);
//         if (res.data.timeLimit) setTimeLeft(res.data.timeLimit); // use backend-defined time
//       } catch (err) {
//         console.error(err);
//       }
//     };
//     fetchQuestions();
//   }, [categoryId]);

//   // Timer
//   useEffect(() => {
//     if (submitted) return;

//     if (timeLeft === 0) {
//       handleSubmit(); // Auto-submit when time is up
//       return;
//     }

//     const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
//     return () => clearInterval(timer);
//   }, [timeLeft, submitted]);

//   const handleAnswer = (selected) => {
//     const questionId = questions[current]._id;
//     const updated = [...answers.filter(a => a.question !== questionId), { question: questionId, answer: selected }];
//     setAnswers(updated);
//   };

//   const handleSubmit = async () => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await axios.post(
//         'http://localhost:5000/api/result/submit',
//         { categoryId, answers },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//       setSubmitted(true);
//       setResult(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   if (questions.length === 0) return <div>Loading...</div>;

//   const currentQuestion = questions[current];
//   const selectedAnswer = answers.find(a => a.question === currentQuestion._id)?.answer;

//   const isCorrect = (option) => {
//     if (!submitted || !result) return false;
//     const correctMap = result.correctAnswers || {};
//     return correctMap[currentQuestion._id] === option;
//   };

//   const isIncorrect = (option) => {
//     return submitted && selectedAnswer === option && !isCorrect(option);
//   };

//   const progressPercent = Math.round((timeLeft / 60) * 100);

//   return (
//     <div>
//       <Navbar />
//       <div className="max-w-2xl mx-auto p-6">
//         {/* Timer bar */}
//         <div className="mb-4">
//           <div className="flex justify-between text-sm text-gray-700 mb-1">
//             <span>Time Left: {timeLeft}s</span>
//             <span>{progressPercent}%</span>
//           </div>
//           <div className="w-full bg-gray-200 rounded-full h-2">
//             <div
//               className="bg-red-500 h-2 rounded-full transition-all duration-300"
//               style={{ width: `${progressPercent}%` }}
//             ></div>
//           </div>
//         </div>

//         <div className="flex justify-between mb-4">
//           <h2 className="text-xl font-semibold">Question {current + 1} of {questions.length}</h2>
//         </div>

//         <div className="bg-white p-6 rounded shadow">
//           <h3 className="text-lg font-medium mb-4">{currentQuestion.questionText}</h3>
//           <div className="space-y-2">
//             {currentQuestion.options.map((opt, idx) => (
//               <div
//                 key={idx}
//                 className={`p-2 border rounded cursor-pointer ${
//                   submitted
//                     ? isCorrect(opt)
//                       ? 'bg-green-100 border-green-500 text-green-800 font-semibold'
//                       : isIncorrect(opt)
//                       ? 'bg-red-100 border-red-500 text-red-800'
//                       : 'bg-gray-100'
//                     : selectedAnswer === opt
//                     ? 'bg-blue-100 border-blue-500'
//                     : 'hover:bg-gray-100'
//                 }`}
//                 onClick={() => !submitted && handleAnswer(opt)}
//               >
//                 {opt}
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className="flex justify-between mt-6">
//           <button
//             disabled={current === 0}
//             onClick={() => setCurrent((prev) => prev - 1)}
//             className="bg-gray-300 px-4 py-2 rounded disabled:opacity-50"
//           >
//             Previous
//           </button>

//           {current === questions.length - 1 ? (
//             <button
//               onClick={handleSubmit}
//               className="bg-green-500 text-white px-4 py-2 rounded"
//               disabled={submitted}
//             >
//               {submitted ? 'Submitted' : 'Submit'}
//             </button>
//           ) : (
//             <button
//               onClick={() => setCurrent((prev) => prev + 1)}
//               className="bg-blue-500 text-white px-4 py-2 rounded"
//               disabled={submitted}
//             >
//               Next
//             </button>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default QuizPage;


