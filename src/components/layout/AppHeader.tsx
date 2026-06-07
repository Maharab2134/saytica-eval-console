"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { MobileNav } from "@/components/layout/MobileNav";
import { Zap } from "lucide-react";

const ROUTE_LABELS: Record<string, string> = {
  "/": "Dashboard",
  "/leaderboard": "Model Leaderboard",
  "/tasks": "Task Board",
};

export function AppHeader() {
  const pathname = usePathname();
  const label = ROUTE_LABELS[pathname] ?? "Saytica Console";

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-4 border-b border-border bg-background/80 backdrop-blur-sm px-4 md:px-6">
      {/* Mobile logo */}
      <div className="flex items-center gap-2 md:hidden">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary">
          <Zap className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-sm">Saytica</span>
      </div>

      <MobileNav />

      <div className="hidden md:block">
        <Link
          href="/"
          className="text-sm font-semibold text-foreground hover:text-muted-foreground transition-colors"
        >
          {label}
        </Link>
      </div>

      <div className="flex flex-1 items-center justify-end gap-2">
        <ThemeToggle />
        {/* User avatar placeholder */}
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-500 text-xs font-semibold text-white cursor-pointer"
          title="Logged in as: Annotator"
          aria-label="User avatar"
        >
          SA
        </div>
      </div>
    </header>
  );
}
