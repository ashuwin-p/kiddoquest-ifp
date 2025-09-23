"use client";
import dynamic from "next/dynamic";

const HealthyHabitsGame = dynamic(
  () => import("../../../components/HealthyHabitsGame/Game.jsx"),
  { ssr: false }
);

export default function HealthyHabitsGamePage() {
  return <HealthyHabitsGame />;
}


