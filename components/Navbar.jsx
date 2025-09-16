import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import './Navbar.css';
import logo from '../assets/Kiddo-quest.png';

const Navbar = ({ user }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo-container">
          <Link to="/" className="logo">
            <img src={logo} alt="Life Kiddo Quest Logo" className="logo-img" />
          </Link>
        </div>
      
        
        <div className="nav-links">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/games" className="nav-link">Games</Link>
          <Link to="/progress" className="nav-link">Progress</Link>
          <Link to="/about" className="nav-link">About</Link>
          <Link to="/contact" className="nav-link">Contact</Link>
          {user ? (
            <div className="profile-section">
              <span className="welcome-text">Welcome, {user.email}</span>
              <button onClick={handleLogout} className="logout-button">
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="nav-link login-button">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 