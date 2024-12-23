// components/Navbar/Navbar.js
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../App.css';

const Navbar = ({ onLogout }) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">VideoHub</Link>
      </div>
      <div className="navbar-links">
        <Link to="/" className="nav-link">Home</Link>
        <Link to="/upload" className="nav-link">Upload</Link>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;