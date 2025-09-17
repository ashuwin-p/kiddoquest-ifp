"use client";
import dynamic from "next/dynamic";

const WordScrambleGame = dynamic(
	() => import("../../../components/WordScrambleGame/Game.jsx"),
	{ ssr: false }
);

export default function WordScrambleGamePage() {
	return <WordScrambleGame />;
}
