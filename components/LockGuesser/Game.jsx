"use client";
import React, { useEffect, useRef, useState } from "react";

const LockGuesser = () => {
  const [gamePlay, setGamePlay] = useState(false);
  const [score, setScore] = useState(0);
  const inputContainerRef = useRef(null);
  const inputsRef = useRef([]);

  useEffect(() => {
    if (gamePlay) {
      if (inputContainerRef.current) {
        inputContainerRef.current.innerHTML = "";
        inputsRef.current = [];
        for (let i = 0; i < 6; i++) {
          const el = document.createElement("input");
          el.setAttribute("type", "number");
          el.max = 9;
          el.min = 0;
          el.className =
            "numb w-12 h-12 text-center text-xl font-bold rounded-xl border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-400 transition-all m-1";
          el.value = 0;
          // @ts-ignore
          el.correct = Math.floor(Math.random() * 10);
          inputContainerRef.current.appendChild(el);
          inputsRef.current.push(el);
        }
      }
    }
  }, [gamePlay]);

  const onStartOrCheck = () => {
    if (!gamePlay) {
      setScore(0);
      setGamePlay(true);
      return;
    }
    setScore((prev) => prev + 1);
    let winCondition = 0;
    inputsRef.current.forEach((el) => {
      const value = Number(el.value || 0);
      // @ts-ignore
      const correct = Number(el.correct);
      if (value === correct) {
        el.style.backgroundColor = "#4caf50";
        el.style.color = "white";
        winCondition++;
      } else {
        const color = value < correct ? "#2196f3" : "#f44336";
        el.style.backgroundColor = color;
        el.style.color = "white";
      }
    });
    if (winCondition === inputsRef.current.length) {
      setGamePlay(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-100 to-yellow-50">
      <div className="bg-white shadow-2xl rounded-2xl p-8 w-[90%] max-w-lg text-center">
        <h1 className="text-3xl font-extrabold text-orange-500 mb-6 tracking-wide">
          🔐 Guess the Combo
        </h1>

        <div
          ref={inputContainerRef}
          className="game flex justify-center gap-2 flex-wrap mb-6"
        />

        <button
          onClick={onStartOrCheck}
          className="px-8 py-3 text-lg font-semibold bg-orange-500 text-white rounded-xl shadow-lg hover:bg-orange-600 active:scale-95 transition-all"
        >
          {gamePlay ? "Check Combo" : score === 0 ? "Start" : "Restart Game"}
        </button>

        <p className="mt-4 text-gray-600 text-sm">
          💡 Blue = Higher, Red = Lower. Solve in as few guesses as possible!
        </p>

        {gamePlay ? (
          <p className="mt-6 text-gray-800 text-lg font-medium">
            Guesses: <span className="font-bold">{score}</span>
          </p>
        ) : score > 0 ? (
          <p className="mt-6 text-green-600 font-semibold text-xl">
            🎉 You solved the combo in {score} guesses! 🎉
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default LockGuesser;
