import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkUserInfo = () => {
      const userInfo = localStorage.getItem("userInfo");
      if (userInfo) {
        setUser(JSON.parse(userInfo));
      } else {
        setUser(null);
      }
    };

    // Check initially
    checkUserInfo();

    // Check periodically for changes
    const interval = setInterval(checkUserInfo, 100);
    
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo"); // Fixed: was "user", now matches the key
    setUser(null); // Clear user state to trigger re-render
    navigate("/login");
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        Quiz App
      </h1>
      {user?.role === "admin" && (
        <Link to="/admin/dashboard">Home</Link>
      )}
      {user?.role === "user" && (
        <Link to="/quiz/dashboard">Home</Link>
      )}
      <div className="flex items-center gap-4">
        {user && (
          <>
            <span>{user.name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;