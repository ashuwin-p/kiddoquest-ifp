import React from 'react';
import { useRouter } from 'next/navigation';
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
    title: 'Memory Game',
    icon: '🧠',
    description: 'Strengthen memory by matching pairs in a timed challenge.',
    color: '#8E44AD',
    path: '/memory-game'
  },
  {
    id: 5,
    title: 'Lock Guesser',
    icon: '🔐',
    description: 'Guess the combo with higher/lower hints.',
    color: '#FF9800',
    path: '/lock-guesser'
  },
  {
    id: 6,
    title: 'Word Scramble',
    icon: '🔤',
    description: 'Unscramble words to test your vocabulary and spelling skills!',
    color: '#6366F1',
    path: '/word-scramble-game'
  }
];

const GameCards = () => {
  const router = useRouter();

  const handlePlayGame = (path) => {
    router.push(path);
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