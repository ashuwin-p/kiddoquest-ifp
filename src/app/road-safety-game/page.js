"use client";
import dynamic from "next/dynamic";

const RoadSafetyGame = dynamic(
	() => import("../../../components/RoadSafetyGame/Game.jsx"),
	{ ssr: false }
);

export default function RoadSafetyGamePage() {
	return <RoadSafetyGame />;
}
