import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-links">
          <h3>Quick Links</h3>
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/levels">Games</a></li>
            <li><a href="/progress">Progress</a></li>
            <li><a href="/about">About</a></li>
            <li><a href="/contact">Contact</a></li>
          </ul>
        </div>

      </div>
      
      <div className="marquee-container">
        <div className="marquee">
          <span>🌱 Save Earth • 🚦 Be Safe • 💚 Help Others • 📚 Keep Learning • 🎯 Play with Purpose</span>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; 2025 Kiddo Quest. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer; 