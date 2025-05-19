import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-r from-blue-100 to-purple-100 text-center p-6">
      <h1 className="text-4xl font-bold mb-4">Welcome to the Quiz App!</h1>
      <p className="mb-6 text-lg">Test your knowledge across various categories and track your progress.</p>
      <div className="space-x-4">
        <Link to="/login" className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          Login 
        </Link>
        <Link to="/register" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700">
          Register
        </Link>
      </div>
    </div>
  );
};

export default Home;
