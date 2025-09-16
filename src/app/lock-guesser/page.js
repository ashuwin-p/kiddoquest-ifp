"use client";
import dynamic from "next/dynamic";

const LockGuesser = dynamic(
	() => import("../../../components/LockGuesser/Game.jsx"),
	{ ssr: false }
);

export default function LockGuesserPage() {
	return <LockGuesser />;
}


