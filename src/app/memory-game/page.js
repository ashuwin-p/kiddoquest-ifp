"use client";
import dynamic from "next/dynamic";

const MemoryGame = dynamic(
	() => import("../../../components/MemoryGame/Game.jsx"),
	{ ssr: false }
);

export default function MemoryGamePage() {
	return <MemoryGame />;
}


