"use client";
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";

const TrafficLearningGame = () => {
  const [gameState, setGameState] = useState("menu"); 
  const [currentLevel, setCurrentLevel] = useState(1);
  const [score, setScore] = useState(0);
  const [showInstructions, setShowInstructions] = useState(true);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const placeholderImage = "https://i.imghippo.com/files/Uec5955w.png";
  const trafficSignals = [
    { id: 1, image: placeholderImage, text: "Stop" },
    { id: 2, image: placeholderImage, text: "Wait" },
    { id: 3, image: placeholderImage, text: "Go" },
  ];
  const trafficSigns = [
    { id: 4, image: placeholderImage, text: "Left Turn" },
    { id: 5, image: placeholderImage, text: "Right Turn" },
    { id: 6, image: placeholderImage, text: "Speed Breaker" },
    { id: 7, image: placeholderImage, text: "School Zone" },
    { id: 8, image: placeholderImage, text: "No Parking" },
  ];

  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  const [imageItems, setImageItems] = useState([]);
  const [textItems, setTextItems] = useState([]);

  useEffect(() => {
    if (gameState === "playing") {
      const items = currentLevel === 1 ? trafficSignals : trafficSigns;
      setImageItems([...items]);
      setTextItems(shuffleArray([...items]));
    }
  }, [gameState, currentLevel]);

  const startGame = (level) => {
    setCurrentLevel(level);
    setGameState("playing");
    setScore(0);
    setMatchedPairs([]);
    setSelectedItem(null);
  };

  const handleItemClick = (item, isImage) => {
    if (matchedPairs.includes(item.id)) return;

    if (!selectedItem) {
      setSelectedItem({ ...item, isImage });
    } else {
      if (selectedItem.isImage === isImage) {
        setSelectedItem({ ...item, isImage });
        return;
      }

      if (selectedItem.id === item.id) {
        setMatchedPairs((prev) => [...prev, item.id]);
        setScore((prev) => prev + 10);
      }
      setSelectedItem(null);
    }
  };

  useEffect(() => {
    const currentItems = currentLevel === 1 ? trafficSignals : trafficSigns;
    if (matchedPairs.length === currentItems.length && matchedPairs.length > 0) {
      setTimeout(() => setGameState("end"), 1000);
    }
  }, [matchedPairs, currentLevel]);

  return (
    <div className="font-sans bg-gradient-to-br from-blue-50 via-pink-50 to-green-50 min-h-screen flex flex-col items-center justify-center p-6">
      {showInstructions && (
        <div className="bg-white shadow-xl rounded-2xl p-8 max-w-lg text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">🚦 Traffic Learning Adventure</h2>
          <p className="text-gray-600 mb-4">Learn about traffic signals and signs through matching!</p>
          <ul className="text-gray-700 text-left mb-6 space-y-2">
            <li>✅ Match traffic signals/signs with their meanings</li>
            <li>✅ Click on an image and its matching text</li>
            <li>✅ Each correct match = 10 points</li>
            <li>✅ Complete all matches to finish the level</li>
          </ul>
          <div className="flex flex-col gap-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              onClick={() => {
                setShowInstructions(false);
                startGame(1);
              }}
            >
              Play Level 1: Traffic Signals
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
              onClick={() => {
                setShowInstructions(false);
                startGame(2);
              }}
            >
              Play Level 2: Traffic Signs
            </button>
          </div>
        </div>
      )}

      {gameState === "playing" && (
        <div className="game-area p-6 rounded-3xl shadow-lg bg-white/80 max-w-5xl w-full mt-8">
          <div className="flex justify-between items-center mb-6 bg-gray-100 rounded-xl px-6 py-4 border">
            <div className="font-bold text-lg text-blue-600">Score: {score}</div>
            <div className="font-bold text-lg text-green-600">Level: {currentLevel}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[400px]">
            <div className="flex flex-col gap-6">
              {imageItems.map((item) => (
                <motion.div
                  key={`img-${item.id}`}
                  id={`image-${item.id}`}
                  className={`flex items-center gap-4 px-4 py-3 rounded-xl border-2 shadow-md cursor-pointer transition-all duration-200 text-lg ${
                    selectedItem?.id === item.id && selectedItem?.isImage
                      ? "border-blue-500 bg-blue-50"
                      : matchedPairs.includes(item.id)
                      ? "border-green-500 bg-green-100"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  onClick={() => handleItemClick(item, true)}
                  whileHover={{ scale: 1.05 }}
                >
                  <img src={item.image} alt={`Traffic ${item.id}`} className="w-12 h-12 object-contain" />
                </motion.div>
              ))}
            </div>

            <div className="flex flex-col gap-6">
              {textItems.map((item) => (
                <motion.div
                  key={`text-${item.id}`}
                  id={`text-${item.id}`}
                  className={`px-4 py-3 rounded-xl border-2 shadow-md cursor-pointer transition-all duration-200 text-lg flex items-center ${
                    selectedItem?.id === item.id && !selectedItem?.isImage
                      ? "border-blue-500 bg-blue-50"
                      : matchedPairs.includes(item.id)
                      ? "border-green-500 bg-green-100"
                      : "border-gray-200 bg-gray-50"
                  }`}
                  onClick={() => handleItemClick(item, false)}
                  whileHover={{ scale: 1.05 }}
                >
                  <span className="font-semibold text-gray-800">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}

      {gameState === "end" && (
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center mt-8">
          <h2 className="text-2xl font-bold text-green-600 mb-4">🎉 Level Complete!</h2>
          <p className="text-lg text-gray-700 mb-6">Your score: {score}</p>
          <div className="flex gap-4 justify-center">
            <button
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
              onClick={() => {
                setShowInstructions(true);
                setGameState("menu");
              }}
            >
              Main Menu
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
              onClick={() => {
                const nextLevel = currentLevel === 1 ? 2 : 1;
                startGame(nextLevel);
              }}
            >
              Play Level {currentLevel === 1 ? "2" : "1"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrafficLearningGame;
