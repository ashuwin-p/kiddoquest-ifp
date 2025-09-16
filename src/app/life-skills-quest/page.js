"use client";
import dynamic from "next/dynamic";

const LifeSkillsQuestGame = dynamic(
	() => import("../../../components/LifeSkillsQuestGame.jsx"),
	{ ssr: false }
);

export default function LifeSkillsQuestGamePage() {
	return <LifeSkillsQuestGame />;
}
