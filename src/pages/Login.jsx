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
      // Use the authService login function
      const userData = await loginUser({ email, password });
      
      // Verify token exists
      if (!userData || !userData.token) {
        setError("Login failed - No authentication token received");
        console.error("No token in login response:", userData);
        setLoading(false);
        return;
      }
      
      console.log("Login successful, user role:", userData.role);
      
      // Update auth context
      authLogin(userData);
      
      // Navigate based on role
      if (userData.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/quiz/dashboard');
      }
    } catch (err) {
      console.error('Login failed', err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <input
          type="email"
          placeholder="Email"
          className="w-full mb-3 p-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 p-2 border rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="mt-4 text-center">
          <span>Don't have an account? </span>
          <a href="/register" className="text-blue-600 hover:underline">
            Register
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;