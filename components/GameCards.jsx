import React from 'react';
import { useNavigate } from 'react-router-dom';
import './GameCards.css';

const games = [
  {
    id: 1,
    title: 'Road Safety',
    icon: '🚦',
    description: 'Learn about road safety and traffic rules while having fun!',
    color: '#FF6B6B',
    path: '/road-safety'
  },
  {
    id: 2,
    title: 'Waste Sorting',
    icon: '🗑️',
    description: 'Learn about recycling and waste management through interactive gameplay.',
    color: '#4CAF50',
    path: '/waste-sorting'
  },
  {
    id: 3,
    title: 'Traffic Learning',
    icon: '🚸',
    description: 'Learn about traffic signals and signs through fun matching activities.',
    color: '#2196F3',
    path: '/traffic-learning'
  },
  {
    id: 4,
    title: 'Save the Oceans',
    icon: '��',
    description: 'Discover how to protect marine life and reduce pollution',
    color: '#2196F3',
    path: '/save-oceans'
  },
  {
    id: 5,
    title: 'Fire Escape Drill',
    icon: '🔥',
    description: 'Practice emergency procedures and safety measures',
    color: '#FF9800',
    path: '/fire-escape'
  }
];

const GameCards = () => {
  const navigate = useNavigate();

  const handlePlayGame = (path) => {
    navigate(path);
  };

  return (
    <section className="game-cards">
      <h2 className="section-title">Games</h2>
      <div className="cards-grid">
        {games.map((game) => (
          <div 
            key={game.id} 
            className="game-card"
            style={{ '--card-color': game.color }}
          >
            <div className="card-icon">{game.icon}</div>
            <h3 className="card-title">{game.title}</h3>
            <p className="card-description">{game.description}</p>
            <button 
              className="play-card-button"
              onClick={() => handlePlayGame(game.path)}
            >
              Play Now
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default GameCards; 