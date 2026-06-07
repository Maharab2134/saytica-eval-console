import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAccuracy(value: number | null): string {
  if (value === null) return "N/A";
  return `${(value * 100).toFixed(1)}%`;
}

export function formatLatency(ms: number | null): string {
  if (ms === null) return "N/A";
  if (ms >= 1000) return `${(ms / 1000).toFixed(1)}s`;
  return `${ms}ms`;
}

export function formatCost(value: number | null): string {
  if (value === null) return "N/A";
  if (value === 0)    return "Free";
  return `$${value.toFixed(2)}`;
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "pending":     return "Pending";
    case "in_progress": return "In Progress";
    case "done":        return "Done";
    default:            return "Unknown";
  }
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "pending":     return "bg-amber-500/15 text-amber-500 border-amber-500/20";
    case "in_progress": return "bg-blue-500/15 text-blue-500 border-blue-500/20";
    case "done":        return "bg-emerald-500/15 text-emerald-500 border-emerald-500/20";
    default:            return "bg-zinc-500/15 text-zinc-400 border-zinc-500/20";
  }
}

export function debounce<T extends (...args: unknown[]) => unknown>(fn: T, delay: number): (...args: Parameters<T>) => void {
  let timer: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}