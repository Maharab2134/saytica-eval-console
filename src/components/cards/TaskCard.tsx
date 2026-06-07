"use client";

import { motion } from "framer-motion";
import { NormalizedTask, TaskStatus, VALID_TRANSITIONS } from "@/types/task";
import { StatusBadge } from "@/components/shared/StatusBadge";
import { Button } from "@/components/ui/button";
import { Folder, ArrowRight, Loader2, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface TaskCardProps {
  task:         NormalizedTask;
  onUpdate:     (task: NormalizedTask, newStatus: TaskStatus) => void;
  isUpdating:   boolean;
  delay?:       number;
}

export function TaskCard({ task, onUpdate, isUpdating, delay = 0 }: TaskCardProps) {
  const nextStatuses = VALID_TRANSITIONS[task.status] ?? [];
  const nextStatus   = nextStatuses[0] ?? null;

  const ACTION_LABELS: Partial<Record<TaskStatus, string>> = {
    in_progress: "Mark Complete",
    pending:     "Start Task",
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.3, delay }}
      whileHover={{ y: -1, transition: { duration: 0.15 } }}
      className="rounded-xl border border-border bg-card p-4 space-y-3 hover:shadow-md transition-all duration-200"
      aria-label={`Task: ${task.title}`}
    >
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground leading-snug flex-1 min-w-0">
          {task.title}
        </h3>
        <StatusBadge status={task.status} />
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Folder className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span className="truncate">{task.projectName}</span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <User className="h-3 w-3 shrink-0" aria-hidden="true" />
        <span>{task.assignedTo ?? "Unassigned"}</span>
      </div>

      {nextStatus && (
        <Button
          size="sm"
          variant={nextStatus === "done" ? "default" : "outline"}
          className={cn(
            "w-full gap-2 text-xs h-8 mt-1",
            nextStatus === "done" && "bg-emerald-600 hover:bg-emerald-700 text-white border-0"
          )}
          onClick={() => onUpdate(task, nextStatus)}
          disabled={isUpdating}
          aria-label={`${ACTION_LABELS[task.status]} for task ${task.title}`}
        >
          {isUpdating ? (
            <Loader2 className="h-3 w-3 animate-spin" aria-hidden="true" />
          ) : (
            <>
              {ACTION_LABELS[task.status]}
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </>
          )}
        </Button>
      )}

      {task.status === "done" && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-500 font-medium">
          <span aria-hidden="true">✓</span>
          Completed
        </div>
      )}
    </motion.article>
  );
}