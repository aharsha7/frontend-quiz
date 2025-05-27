import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { Eye, EyeOff } from "lucide-react";
import { ClipLoader } from "react-spinners";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const res = await api.post("/api/auth/register", {
        name,
        email,
        password,
      });
      const data = res.data;
      localStorage.setItem("token", data.token);
      setShowToast(true);
      setTimeout(() => {
        setShowToast(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-green-600 text-white px-6 py-3 rounded-xl shadow-lg animate-fade-in-out text-base font-semibold">
          Account created. Please log in.
        </div>
      )}

      {/* Left Side */}
      <div className="w-full md:w-1/2 bg-gradient-to-r from-green-500 via-lime-400 to-emerald-500 text-white flex flex-col justify-center items-center p-10 min-h-[300px]">
        <img
          src="quiz2.jpeg"
          alt="Quiz Illustration"
          className="w-32 md:w-4/5 max-w-sm mb-6"
        />
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-center">
          Join QuizMaster!
        </h2>
        <p className="text-base md:text-lg text-center px-2 md:px-4">
          Create your account to start taking quizzes, track your progress, and
          challenge your friends!
        </p>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-100 min-h-[300px] mt-24 md:mt-0">
        <div className="bg-white p-6 md:p-12 rounded-2xl shadow-2xl border border-blue-200 flex flex-col items-center w-full max-w-lg min-w-0">
          <form onSubmit={handleRegister} className="w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800">
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
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 pr-12"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className={`w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl font-semibold transition duration-200 mb-2 flex justify-center items-center`}
              disabled={loading}
            >
              {loading ? <ClipLoader size={20} color="#ffffff" /> : "Register"}
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
