// import React, { useEffect, useState } from 'react';
// import { useParams } from 'react-router-dom';
// import Navbar from '../components/Common/Navbar';
// import { submitResult, getHistory } from "../services/resultService";


// const ResultPage = () => {
//   const { id } = useParams();
//   const [result, setResult] = useState(null);

//   useEffect(() => {
//     const fetchResult = async () => {
//       const data = await getHistory(id);
//       setResult(data);
//     };

//     fetchResult();
//   }, [id]);

//   if (!result) return <div className="p-6">Loading...</div>;

//   return (
//     <div>
//       <Navbar />
//       <div className="max-w-4xl mx-auto p-6">
//         <h2 className="text-2xl font-bold mb-4">
//           Result - {result.category?.name || 'Unknown Category'}
//         </h2>
//         <p className="mb-2 text-gray-700">Score: {result.score}/{result.total}</p>
//         <div className="space-y-4 mt-4">
//           {result.answers.map((ans, index) => (
//             <div
//               key={index}
//               className={`p-4 border rounded ${
//                 ans.isCorrect ? 'bg-green-100' : 'bg-red-100'
//               }`}
//             >
//               <p className="font-medium">Q: {ans.question?.text || 'Question not found'}</p>
//               <p>Your Answer: {ans.selectedAnswer || 'No answer selected'}</p>
//               <p>Correct: {ans.isCorrect ? 'Yes' : 'No'}</p>
//             </div>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ResultPage;
