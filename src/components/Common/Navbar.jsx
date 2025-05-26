import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut } from "lucide-react";

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

    // Initial and periodic check
    checkUserInfo();
    const interval = setInterval(checkUserInfo, 100);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userInfo");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-900 text-white p-4 flex justify-between items-center shadow">
      <h1
        className="text-lg font-bold cursor-pointer hover:opacity-90 transition"
        onClick={() => navigate("/")}
      >
        Quiz App
      </h1>

      {user?.role === "user" && (
        <Link
          className="text-lg font-medium hover:underline"
          to="/quiz/dashboard"
        >
          Home
        </Link>
      )}

      <div className="flex items-center gap-4">
        {user && (
          <>
            <div className="flex items-center gap-2">
              <User className="w-7 h-7 text-white bg-blue-700 p-1 rounded-full border border-blue-300" />
              <span className="font-medium text-white">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-3 py-1 rounded transition text-white font-medium"
            >
              <LogOut size={18} /> Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
