"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { NormalizedModel } from "@/types/model";
import { cn } from "@/lib/utils";

interface TopPerformerCardProps {
  label: string;
  emoji: string;
  icon: LucideIcon;
  model: NormalizedModel | null;
  metric: string;
  color: string;
  bgColor: string;
  delay?: number;
}

const COLOR_STYLES = {
  amber: {
    border: "border-amber-500/20",
    bg: "bg-amber-500/10",
    text: "text-amber-500",
  },
  blue: {
    border: "border-blue-500/20",
    bg: "bg-blue-500/10",
    text: "text-blue-500",
  },
  emerald: {
    border: "border-emerald-500/20",
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
  },
} as const;

export function TopPerformerCard({
  label,
  emoji,
  icon: Icon,
  model,
  metric,
  color,
  bgColor,
  delay = 0,
}: TopPerformerCardProps) {
  const palette = COLOR_STYLES[color as keyof typeof COLOR_STYLES] ?? {
    border: "border-border/20",
    bg: "bg-muted/10",
    text: "text-muted-foreground",
  };

  if (!model) {
    return (
      <div className="rounded-xl border border-border bg-card p-5 opacity-50">
        <p className="text-xs text-muted-foreground">No data</p>
        <p className="text-sm font-medium mt-1">{label}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      className={cn(
        "rounded-xl border bg-card p-5 relative overflow-hidden cursor-default",
        "hover:shadow-lg transition-shadow duration-300",
        palette.border,
      )}
    >
      {/* Glow accent */}
      <div
        className={cn(
          "absolute top-0 right-0 h-20 w-20 rounded-full blur-2xl opacity-10",
          bgColor,
        )}
      />

      <div className="relative flex items-start gap-3">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-lg",
            bgColor,
            "bg-opacity-15",
          )}
        >
          {emoji}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
            {label}
          </p>
          <p className="text-sm font-bold text-foreground mt-0.5 truncate">
            {model.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {model.provider}
          </p>
        </div>
      </div>

      <div
        className={cn(
          "mt-3 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold",
          palette.bg,
          palette.text,
        )}
      >
        <Icon className="h-3 w-3" aria-hidden="true" />
        {metric}
      </div>
    </motion.div>
  );
}
