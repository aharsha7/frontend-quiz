import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Side */}
      <div className="w-1/2 bg-blue-600 text-white flex flex-col justify-center items-center p-10">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2913/2913465.png"
          alt="Quiz Illustration"
          className="w-1/4 max-w-sm mb-6"
        />
        <h2 className="text-4xl font-bold mb-4">Join QuizMaster!</h2>
        <p className="text-lg text-center px-4">
          Create your account to start taking quizzes, track your progress, and
          challenge your friends!
        </p>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex justify-center items-center bg-gray-100">
        <div className="bg-white p-12 rounded-2xl shadow-2xl border border-blue-200 flex flex-col items-center min-w-[350px] max-w-md">
          <form onSubmit={handleRegister} className="w-75%">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Register
            </h2>
            {error && (
              <div className="mb-4 text-red-600 bg-red-100 border border-red-400 p-2 rounded text-sm text-center">
                {error}
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-1">Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition duration-200 mb-2"
            >
              Register
            </button>
            <div className="mt-4 text-center text-sm text-gray-600">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-600 hover:underline font-medium"
              >
                Login
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
