import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

const Hero = () => {
  const navigate = useNavigate();

  const handlePlayClick = () => {
    navigate('/games');
  };

  return (
    <section className="hero">
      <div className="hero-content">
        <h1 className="hero-title">Welcome to Kiddo Quest!</h1>
        <p className="hero-subtitle">Play. Learn. Grow. One quest at a time.</p>
        <button className="play-button" onClick={handlePlayClick}>
          Play Now
          <span className="button-icon">🎮</span>
        </button>
      </div>
      <div className="hero-background">
        <div className="cloud cloud1"></div>
        <div className="cloud cloud2"></div>
        <div className="cloud cloud3"></div>
      </div>
    </section>
  );
};

export default Hero; 