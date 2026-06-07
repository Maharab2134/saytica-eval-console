import { cn, getStatusColor, getStatusLabel } from "@/lib/utils";
import { TaskStatus } from "@/types/task";

interface StatusBadgeProps {
  status:    TaskStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        getStatusColor(status),
        className
      )}
      aria-label={`Status: ${getStatusLabel(status)}`}
    >
      <span
        className={cn(
          "mr-1.5 h-1.5 w-1.5 rounded-full",
          status === "pending"     && "bg-amber-500",
          status === "in_progress" && "bg-blue-500",
          status === "done"        && "bg-emerald-500",
          status === "unknown"     && "bg-zinc-400",
        )}
        aria-hidden="true"
      />
      {getStatusLabel(status)}
    </span>
  );
}