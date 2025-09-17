"use client";

import { useEffect, useRef, useState } from "react";
import "./Game.css";

const WordScrambleGame = () => {
  const [gameState, setGameState] = useState("start"); // start, playing, finished
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const startTimeRef = useRef(0);
  const [message, setMessage] = useState("Press start button");
  const [app, setApp] = useState(null);
  const [shuffledWords, setShuffledWords] = useState([]);
  const canvasRef = useRef(null);
  const pixiLoaded = useRef(false);

  const myWords = ["intelligence", "understand", "creativity", "genius", "perfection", "superb"];

  useEffect(() => {
    // Load PIXI.js dynamically
    if (!window.PIXI && !pixiLoaded.current) {
      pixiLoaded.current = true;
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pixi.js/7.2.0/pixi.min.js';
      script.onload = () => {
        if (window.PIXI) {
          initializeGame();
        }
      };
      document.head.appendChild(script);
    } else if (window.PIXI) {
      initializeGame();
    }

    return () => {
      if (app) {
        app.destroy(true, true);
      }
    };
  }, []);

  const initializeGame = () => {
    if (!window.PIXI) return;
    
    const pixiApp = new window.PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      backgroundColor: 0xf0f8ff,
    });
    
    if (canvasRef.current) {
      canvasRef.current.appendChild(pixiApp.view);
    }
    
    setApp(pixiApp);
  };

  const scrambleWord = (word) => {
    const arr = word.split("");
    arr.sort(() => 0.5 - Math.random());
    return arr.join("");
  };

  const startGame = () => {
    if (!app || !app.stage) {
      console.log("App or stage not ready");
      return;
    }
    
    setGameState("playing");
    setCurrentWordIndex(0);
    startTimeRef.current = Date.now();
    setMessage("");

    // Clear previous boxes
    app.stage.removeChildren();

    // Create shuffled order for the words to be selected
    const shuffledOrder = myWords.slice().sort(() => 0.5 - Math.random());
    setShuffledWords(shuffledOrder);

    // Store current word index in a ref to avoid state issues
    let currentIndex = 0;

    // Create boxes for all words
    myWords.forEach((item, index) => {
      const scrambled = scrambleWord(item);

      const box = new window.PIXI.Graphics();
      box.beginFill(0xff6347);
      box.drawRoundedRect(0, 0, 150, 50, 10);
      box.endFill();

      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      const cols = Math.min(3, Math.floor(screenWidth / 200));
      const row = Math.floor(index / cols);
      const col = index % cols;
      const xSpacing = (screenWidth - cols * 200) / 2 + 100;
      const ySpacing = 150;

      box.x = col * 200 + xSpacing - 75;
      box.y = row * ySpacing + 100;
      box.interactive = true;
      box.buttonMode = true;

      const text = new window.PIXI.Text("Select", {
        fontFamily: 'Comic Sans MS',
        fontSize: 18,
        fill: 0xffffff,
        align: 'center',
      });
      text.anchor.set(0.5);
      text.x = 75;
      text.y = 25;

      box.addChild(text);
      box.correctWord = item;
      box.scrambledWord = scrambled;

      box.on("mouseover", () => {
        box.clear();
        box.beginFill(0xffffff);
        box.drawRoundedRect(0, 0, 150, 50, 10);
        box.endFill();
        text.text = scrambled;
        text.style.fill = 0xff6347;
      });

      box.on("mouseout", () => {
        box.clear();
        box.beginFill(0xff6347);
        box.drawRoundedRect(0, 0, 150, 50, 10);
        box.endFill();
        text.text = "Select";
        text.style.fill = 0xffffff;
      });

      box.on("pointerdown", () => {
        if (box.correctWord === shuffledOrder[currentIndex]) {
          app.stage.removeChild(box);
          currentIndex++;
          setCurrentWordIndex(currentIndex);
          
          if (currentIndex >= shuffledOrder.length) {
            const duration = ((Date.now() - startTimeRef.current) / 1000).toFixed(2);
            setMessage(`Game Over! It took you ${duration} seconds!`);
            setGameState("finished");
            
            if (app) {
              app.destroy(true, true);
            }
          } else {
            setMessage(`Select this Word: ${shuffledOrder[currentIndex]}`);
          }
        } else {
          console.log("Wrong! Expected:", shuffledOrder[currentIndex], "Got:", box.correctWord);
        }
      });

      app.stage.addChild(box);
    });

    setMessage(`Select this Word: ${shuffledOrder[0]}`);
  };


  const handleStart = () => {
    console.log("Starting game, app:", app);
    if (app) {
      startGame();
    } else {
      console.log("App not ready, retrying...");
      setTimeout(() => {
        if (app) {
          startGame();
        } else {
          console.log("App still not ready");
        }
      }, 500);
    }
  };

  const handleRestart = () => {
    setGameState("start");
    setCurrentWordIndex(0);
    setMessage("Press start button");
    setShuffledWords([]);
    startTimeRef.current = 0;
    
    // Clean up existing app
    if (app) {
      try {
        app.destroy(true, true);
      } catch (e) {
        console.log("Error destroying app:", e);
      }
      setApp(null);
    }
    
    // Clear the canvas
    if (canvasRef.current) {
      canvasRef.current.innerHTML = '';
    }
    
    // Reinitialize the PIXI app
    setTimeout(() => {
      initializeGame();
    }, 200);
  };

  return (
    <div className="word-scramble-container">
      <div className="message">{message}</div>
      
      {gameState === "start" && (
        <button className="start-button" onClick={handleStart}>
          Start Game
        </button>
      )}
      
      {gameState === "finished" && (
        <button className="start-button" onClick={handleRestart}>
          Play Again
        </button>
      )}
      
      <div ref={canvasRef} className="game-canvas" />
    </div>
  );
};

export default WordScrambleGame;
