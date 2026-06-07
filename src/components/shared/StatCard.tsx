"use client";

import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title:       string;
  value:       string | number;
  subtitle?:   string;
  icon:        LucideIcon;
  iconColor?:  string;
  trend?:      { value: number; label: string };
  delay?:      number;
  className?:  string;
}

export function StatCard({
  title, value, subtitle, icon: Icon, iconColor = "text-primary",
  trend, delay = 0, className,
}: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className={cn(
        "rounded-xl border border-border bg-card p-5 hover:shadow-md transition-shadow duration-200",
        className
      )}
      role="region"
      aria-label={`${title}: ${value}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-foreground tabular-nums">{value}</p>
          {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        </div>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-lg bg-muted", iconColor)}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
      </div>
      {trend && (
        <div className={cn("mt-3 flex items-center gap-1 text-xs font-medium",
          trend.value >= 0 ? "text-emerald-500" : "text-red-500"
        )}>
          <span>{trend.value >= 0 ? "↑" : "↓"} {Math.abs(trend.value)}%</span>
          <span className="text-muted-foreground font-normal">{trend.label}</span>
        </div>
      )}
    </motion.div>
  );
}