import React from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("userInfo"));

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
        <Link to="/admin/dashboard">Admin Dashboard</Link>
      )}
      {user?.role === "user" && (
        <Link to="/quiz/dashboard">Quiz Dashboard</Link>
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
