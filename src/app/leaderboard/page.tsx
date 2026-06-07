import type { Metadata } from "next";
import { LeaderboardClient } from "@/components/leaderboard/LeaderboardClient";

export const metadata: Metadata = {
  title: "Model Leaderboard",
  description: "Compare AI models by accuracy, latency, and cost",
};

export default function LeaderboardPage() {
  return <LeaderboardClient />;
}