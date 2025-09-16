"use client";
import React, { useEffect, useRef, useState } from "react";

const LockGuesser = () => {
	const [gamePlay, setGamePlay] = useState(false);
	const [score, setScore] = useState(0);
	const inputContainerRef = useRef(null);
	const inputsRef = useRef([]);

	useEffect(() => {
		if (gamePlay) {
			// initialize 6 inputs
			if (inputContainerRef.current) {
				inputContainerRef.current.innerHTML = "";
				inputsRef.current = [];
				for (let i = 0; i < 6; i++) {
					const el = document.createElement("input");
					el.setAttribute("type", "number");
					el.max = 9;
					el.min = 0;
					el.className = "numb";
					el.value = 0;
					// @ts-ignore custom property to hold correct value
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
		// Check
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
		<div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#fffae3" }}>
			<div style={{ textAlign: "center", padding: 20 }}>
				<div style={{ fontSize: "2em", color: "#f57c00", marginBottom: 20 }}>Guess Combo</div>
				<div ref={inputContainerRef} className="game" style={{ margin: "20px 0" }} />
				<button
					onClick={onStartOrCheck}
					style={{ fontSize: "1.5em", backgroundColor: "#4caf50", color: "white", border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer" }}
				>
					{gamePlay ? "Check Combo" : score === 0 ? "Start" : "Restart Game"}
				</button>
				<div style={{ marginTop: 12, color: "#666" }}>
					<small>Instructions: Guess the combo, blue means higher, red means lower. Try to solve it in as few guesses as possible!</small>
				</div>
				{gamePlay ? (
					<p style={{ marginTop: 12 }}>Guesses: {score}</p>
				) : score > 0 ? (
					<p style={{ marginTop: 12 }}>🎉 You solved the combo in {score} guesses! 🎉</p>
				) : null}
			</div>
		</div>
	);
};

export default LockGuesser;


