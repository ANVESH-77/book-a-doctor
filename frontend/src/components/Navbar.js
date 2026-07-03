import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const dashboardPath = {
  patient: "/dashboard",
  doctor: "/doctor-dashboard",
  admin: "/admin-dashboard",
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="brand">
        🩺 Book a Doctor
      </Link>
      <div className="nav-links">
        <Link to="/doctors">Find Doctors</Link>
        {user ? (
          <>
            <Link to={dashboardPath[user.role] || "/"}>Dashboard</Link>
            <Link to="/notifications">Notifications</Link>
            <span className="nav-user">Hi, {user.name}</span>
            <button className="btn-link" onClick={handleLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn-primary-sm">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
