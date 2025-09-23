"use client";
import React, { useEffect, useRef, useState } from "react";
import "./Game.css";

const HABITS = [
  { text: "🪥 Brush Teeth", type: "good" },
  { text: "🍎 Eat Fruits", type: "good" },
  { text: "😴 Sleep Early", type: "good" },
  { text: "🥗 Eat Veggies", type: "good" },
  { text: "🚰 Drink Water", type: "good" },
  { text: "🍭 Too Many Candies", type: "bad" },
  { text: "📱 Late Night Phone", type: "bad" },
  { text: "🥤 Soda Overload", type: "bad" },
  { text: "🍔 Junk Food Daily", type: "bad" },
];

export default function HealthyHabitsGame() {
  const gameAreaRef = useRef(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [message, setMessage] = useState("");
  const spawnIntervalRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    spawnIntervalRef.current = setInterval(() => {
      spawnHabit();
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (timerRef.current) clearInterval(timerRef.current);
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    }
  }, [timeLeft]);

  const spawnHabit = () => {
    const area = gameAreaRef.current;
    if (!area || timeLeft <= 0) return;
    const habit = HABITS[Math.floor(Math.random() * HABITS.length)];
    const el = document.createElement("div");
    el.className = `habit ${habit.type}`;
    el.textContent = habit.text;

    // Size-aware random placement
    const areaRect = area.getBoundingClientRect();
    const maxTop = Math.max(0, areaRect.height - 50);
    const maxLeft = Math.max(0, areaRect.width - 150);
    el.style.top = Math.floor(Math.random() * maxTop) + "px";
    el.style.left = Math.floor(Math.random() * maxLeft) + "px";

    el.addEventListener("click", () => {
      if (habit.type === "good") {
        setScore((s) => s + 1);
        setMessage(`✅ Great! ${habit.text} is healthy.`);
      } else {
        setScore((s) => s - 1);
        setMessage(`❌ Oh no! ${habit.text} is unhealthy.`);
      }
      if (area.contains(el)) area.removeChild(el);
    });

    area.appendChild(el);
    setTimeout(() => {
      if (area.contains(el)) area.removeChild(el);
    }, 1500);
  };

  const progressPercent = Math.max(0, Math.min(100, (timeLeft / 30) * 100));

  const restart = () => {
    setScore(0);
    setMessage("");
    setTimeLeft(30);
    if (timerRef.current) clearInterval(timerRef.current);
    if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);
    spawnIntervalRef.current = setInterval(() => {
      spawnHabit();
    }, 1000);
  };

  return (
    <div className="hh-page">
      <div className="hh-container">
      <h1>🌟 Healthy Habits Hero 🦸‍♀️</h1>
      <p>
        Click on the <b>healthy habits</b> ✅ and avoid the <b>unhealthy ones</b> ❌!
      </p>

      <div className="hh-stats">
        <div id="timer">Time left: {Math.max(0, timeLeft)}s</div>
        <div id="score">Score: {score}</div>
      </div>

      <div className="hh-badges">
        <div className="hh-badge">✅ Good habits +1</div>
        <div className="hh-badge">❌ Bad habits -1</div>
      </div>

      <div className="hh-progress">
        <div className="hh-progress-bar" style={{ width: `${progressPercent}%` }} />
      </div>

      <div id="game" ref={gameAreaRef} className="hh-game" />

      <div id="message" className="hh-message">
        {timeLeft <= 0 ? `🏆 Game Over! Your final score: ${score}` : message}
      </div>

      {timeLeft <= 0 ? (
        <div className="hh-actions">
          <button className="hh-button" onClick={restart}>
            🔄 Play Again
          </button>
        </div>
      ) : null}

      <div id="footer" className="hh-footer">Stay healthy, stay happy! 🌈</div>
      </div>
    </div>
  );
}


