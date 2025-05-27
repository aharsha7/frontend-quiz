import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, LogOut, Home } from "lucide-react";

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
    <nav className="bg-gradient-to-r from-teal-600 via-cyan-500 to-blue-900 text-white px-4 py-4 shadow flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      {/* Left side: Quiz App */}
      <div className="flex flex-col items-center md:block w-full md:w-auto">
        <div
          className="text-lg font-bold cursor-pointer hover:opacity-90 transition text-center md:text-left"
          onClick={() => navigate("/")}
        >
          Quiz App
        </div>
        
        {/* Home button below Quiz App on mobile */}
        {user?.role === "user" && (
          <div className="block md:hidden mt-4">
            <Link
              to="/quiz/dashboard"
              className="flex items-center justify-center gap-2 text-lg font-medium text-white hover:underline"
            >
              <Home className="w-5 h-5" />
              Home
            </Link>
          </div>
        )}
      </div>

      {/* Centered Home button on desktop */}
      {user?.role === "user" && (
        <div className="hidden md:flex flex-1 justify-center">
          <Home className="w-5 h-5 mt-1" />
          <Link
            className="text-lg ml-1 font-medium hover:underline text-white text-center"
            to="/quiz/dashboard"
          >
            Home
          </Link>
        </div>
      )}

      {/* Right side: user info + logout */}
      <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 md:ml-auto">
        {user && (
          <>
            <div className="flex items-center gap-2">
              <User className="w-7 h-7 text-white bg-blue-700 p-1 rounded-full border border-blue-300" />
              <span className="font-medium text-white break-words max-w-[150px] text-center md:text-left">
                {user.name}
              </span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition text-white font-medium"
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
