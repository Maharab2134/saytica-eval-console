"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value:      number; // 0–100
  label?:     string;
  color?:     string;
  height?:    string;
  showLabel?: boolean;
  delay?:     number;
  className?: string;
}

export function ProgressBar({
  value, label, color = "bg-primary", height = "h-2",
  showLabel = true, delay = 0, className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn("space-y-1", className)}>
      {(label || showLabel) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="text-muted-foreground">{label}</span>}
          {showLabel && <span className="font-medium text-foreground tabular-nums">{clamped}%</span>}
        </div>
      )}
      <div
        className={cn("w-full rounded-full bg-muted overflow-hidden", height)}
        role="progressbar"
        aria-valuenow={clamped}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label ? `${label}: ${clamped}%` : `${clamped}% complete`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.8, delay, ease: "easeOut" }}
          className={cn("h-full rounded-full", color)}
        />
      </div>
    </div>
  );
}