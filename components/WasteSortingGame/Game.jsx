import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Game.css';

const WasteSortingGame = () => {
  // Game states
  const [gameState, setGameState] = useState('menu'); // menu, learning, playing, end
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentItems, setCurrentItems] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);
  const [showInstructions, setShowInstructions] = useState(true);
  const [playerName, setPlayerName] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  const gameAreaRef = useRef(null);
  const timerRef = useRef(null);

  // Trash items data
  const trashItems = [
    { 
      id: 1, 
      name: 'Banana Peel', 
      type: 'bio', 
      image: 'https://cdn-icons-png.flaticon.com/512/7112/7112978.png' 
    },
    { 
      id: 2, 
      name: 'Plastic Bottle', 
      type: 'non-bio', 
      image: 'https://cdn-icons-png.flaticon.com/512/3239/3239567.png' 
    },
    { 
      id: 3, 
      name: 'Apple Core', 
      type: 'bio', 
      image: 'https://cdn-icons-png.flaticon.com/512/2371/2371799.png' 
    },
    { 
      id: 4, 
      name: 'Battery', 
      type: 'non-bio', 
      image: 'https://cdn-icons-png.flaticon.com/512/12807/12807879.png' 
    },
    { 
      id: 5, 
      name: 'Leaf', 
      type: 'bio', 
      image: 'https://cdn-icons-png.flaticon.com/512/4786/4786832.png' 
    },
    { 
      id: 6, 
      name: 'Glass Bottle', 
      type: 'non-bio', 
      image: 'https://cdn-icons-png.flaticon.com/512/3437/3437515.png' 
    },
    { 
      id: 7, 
      name: 'Bread', 
      type: 'bio', 
      image: 'https://cdn-icons-png.flaticon.com/512/5671/5671101.png' 
    },
    { 
      id: 8, 
      name: 'Paper', 
      type: 'bio', 
      image: 'https://cdn-icons-png.flaticon.com/512/8134/8134703.png' 
    },
    { 
      id: 9, 
      name: 'Tyre', 
      type: 'non-bio', 
      image: 'https://cdn-icons-png.flaticon.com/512/3863/3863416.png' 
    },
    { 
      id: 10, 
      name: 'Plastic Box', 
      type: 'non-bio', 
      image: 'https://cdn-icons-png.flaticon.com/512/5977/5977152.png' 
    }
  ];

  // Start game
  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(30);
    generateItems(); // This will generate all items once
    startTimer();
  };

  // Generate items in a specific area
  const generateItems = () => {
    // Create a copy of all trash items
    const items = [...trashItems].map((item, index) => {
      // Calculate position in a grid-like pattern
      const row = Math.floor(index / 5); // 5 items per row
      const col = index % 5;
      const itemWidth = 60; // Width of each item
      const itemHeight = 60; // Height of each item
      const spacing = 30; // Space between items
      
      // Calculate positions relative to game area
      const gameAreaWidth = gameAreaRef.current?.clientWidth || window.innerWidth;
      const gameAreaHeight = gameAreaRef.current?.clientHeight || window.innerHeight;
      
      // Position items in the upper area
      const startY = gameAreaHeight * 0.15; // Start 15% from top
      
      // Calculate starting X position to center the grid
      const totalGridWidth = (5 * itemWidth) + (4 * spacing); // Width of all items + spacing
      const startX = (gameAreaWidth - totalGridWidth) / 5; // Center the grid
      
      return {
        ...item,
        position: {
          x: startX + (col * (itemWidth + spacing)),
          y: startY + (row * (itemHeight + spacing))
        }
      };
    });
    setCurrentItems(items);
  };

  // Start timer
  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          setGameState('end');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Handle drag start
  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    if (!isMuted) {
      new Audio('https://assets.mixkit.co/active_storage/sfx/2579/2579-preview.mp3').play();
    }
  };

  // Handle drag end
  const handleDragEnd = (e) => {
    if (!draggedItem) return;

    // Find the bin element that received the drop
    const binElement = e.target.closest('.bin');
    if (!binElement) {
      setDraggedItem(null);
      return;
    }

    const binType = binElement.dataset.binType;
    
    if (binType === draggedItem.type) {
      // Correct sorting
      setScore(prev => prev + 10);
      setCurrentItems(prev => prev.filter(item => item.id !== draggedItem.id));
      if (!isMuted) {
        new Audio('https://assets.mixkit.co/active_storage/sfx/2579/2579-preview.mp3').play();
      }
      // Show immediate feedback
      const feedback = document.createElement('div');
      feedback.className = 'correct-feedback';
      feedback.textContent = 'Correct! +1';
      feedback.style.position = 'absolute';
      feedback.style.left = `${e.clientX}px`;
      feedback.style.top = `${e.clientY}px`;
      document.body.appendChild(feedback);
      setTimeout(() => feedback.remove(), 1000);
    } else {
      // Incorrect sorting - prevent drop
      e.preventDefault();
      if (!isMuted) {
        new Audio('https://assets.mixkit.co/active_storage/sfx/2579/2579-preview.mp3').play();
      }
      // Show immediate feedback
      const feedback = document.createElement('div');
      feedback.className = 'incorrect-feedback';
      feedback.textContent = 'Wrong Bin!';
      feedback.style.position = 'absolute';
      feedback.style.left = `${e.clientX}px`;
      feedback.style.top = `${e.clientY}px`;
      document.body.appendChild(feedback);
      setTimeout(() => feedback.remove(), 1000);
    }
    setDraggedItem(null);
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  return (
    <div className="game-container">
      {showInstructions && (
        <div className="instructions-modal">
          <div className="instructions-content">
            <h2>EcoHero: Waste Sorting Adventure</h2>
            <p>Help save the planet by sorting waste correctly!</p>
            <ul>
              <li>Sort items into the correct bins</li>
              <li>Bio waste goes in the green bin</li>
              <li>Non-bio waste goes in the red bin</li>
              <li>You have 30 seconds to sort as many items as you can</li>
              <li>Each correct sort gives you 1 point</li>
            </ul>
            <button 
              className="start-button"
              onClick={() => {
                setShowInstructions(false);
                startGame();
              }}
            >
              Let's Play!
            </button>
          </div>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-area" ref={gameAreaRef}>
          <div className="game-header">
            <div className="score">Score: {score}</div>
            <div className="timer">Time: {timeLeft}s</div>
            <button 
              className="mute-button"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? '🔇' : '🔊'}
            </button>
          </div>

          <div className="bins-container">
            <div 
              className="bin bio-bin"
              data-bin-type="bio"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDragEnd}
            >
              <span>Bio</span>
            </div>
            <div 
              className="bin non-bio-bin"
              data-bin-type="non-bio"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDragEnd}
            >
              <span>Non-Bio</span>
            </div>
          </div>

          {currentItems.map(item => (
            <motion.div
              key={item.id}
              className="trash-item"
              draggable
              onDragStart={(e) => handleDragStart(e, item)}
              style={{
                position: 'absolute',
                left: item.position.x,
                top: item.position.y,
                backgroundImage: `url(${item.image})`
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      )}

      {gameState === 'end' && (
        <div className="end-screen">
          <h2>Game Over!</h2>
          <p>Your score: {score}</p>
          <button 
            className="restart-button"
            onClick={startGame}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default WasteSortingGame; 