"use client";
import dynamic from "next/dynamic";

const GameCards = dynamic(() => import("../../../components/GameCards.jsx"), {
	ssr: false,
});

export default function GamesPage() {
	return (
		<main className="min-h-screen flex items-center justify-center p-6">
			<div className="max-w-6xl w-full">
				<GameCards />
			</div>
		</main>
	);
}


