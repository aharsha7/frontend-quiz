import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("aharsha7na@gmail.com");
  const [password, setPassword] = useState("123456");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
    <div className="flex h-screen bg-gray-100">
      {/* Left Side */}
      <div className="w-1/2 bg-blue-600 text-white flex flex-col justify-center items-center p-10">
        <h2 className="text-4xl font-bold mb-4">Welcome to QuizMaster!</h2>
        <p className="text-lg text-center px-4">
          Test your knowledge with fun quizzes. Sign in to get started!
        </p>
      </div>

      {/* Right Side */}
      <div className="w-1/2 flex justify-center items-center bg-gray-100">
        <div className="bg-white p-12 rounded-2xl shadow-2xl border border-blue-200 flex flex-col items-center min-w-[350px] max-w-md">
          <form onSubmit={handleSubmit} className="w-full">
            <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
              Login
            </h2>
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
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
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition duration-200"
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
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
