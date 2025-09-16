"use client";
import dynamic from "next/dynamic";

const WasteSortingGame = dynamic(
	() => import("../../../components/WasteSortingGame/Game.jsx"),
	{ ssr: false }
);

export default function WasteSortingGamePage() {
	return <WasteSortingGame />;
}
