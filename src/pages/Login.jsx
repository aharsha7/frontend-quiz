import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";
import { Eye, EyeOff } from "lucide-react";
import { SyncLoader } from "react-spinners";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login: authLogin } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const userData = await loginUser({ email, password });

      if (!userData || !userData.token) {
        setError("Login failed - No authentication token received");
        setLoading(false);
        return;
      }

      authLogin(userData);

      if (userData.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/quiz/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Left Side */}
      <div className="w-full md:w-1/2 bg-white-100 text-white flex flex-col justify-center items-center p-10 min-h-[300px]">
        <img
          src="logo8.png"
          alt="QuizApp Logo"
          className="mb-4 w-44 md:w-auto"
        />
        <h2 className="text-3xl md:text-4xl text-cyan-600 font-bold mb-4 text-center">
          Welcome to QuizApp!
        </h2>
        <p className="text-base md:text-lg  text-cyan-950 text-center px-2 md:px-4">
          Test your knowledge with fun quizzes. Sign in to get started!
        </p>
      </div>

      {/* Right Side */}
      <div className="w-full md:w-1/2 flex justify-center items-center bg-gray-100 mt-4 min-h-[300px]">
        <div className="bg-white p-6 md:p-12 rounded-2xl shadow-2xl border border-blue-200 flex flex-col items-center w-full max-w-md min-w-0">
          <form onSubmit={handleSubmit} className="w-full">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-gray-800 underline">
              Login
            </h2>
            {error && (
              <div className="bg-red-100 border-l-4 border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            {loading && (
              <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 px-4 py-3 rounded mb-4">
                <p className="text-sm">Please wait a few seconds while we log you in...</p>
              </div>
            )}
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
              className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 rounded-xl font-semibold transition duration-200 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span>Logging in...</span>
                  <SyncLoader color="#fff" size={5} speedMultiplier={0.5} />
                </>
              ) : (
                "Login"
              )}
            </button>
            <div className="mt-6 text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/register"
                className="text-blue-600 hover:underline font-medium"
              >
                Register
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;