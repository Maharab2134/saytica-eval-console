"use client";

import { AnimatePresence, motion } from "framer-motion";
import { NormalizedTask, TaskStatus } from "@/types/task";
import { TaskCard } from "@/components/cards/TaskCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { SkeletonTaskCard } from "@/components/shared/SkeletonCard";
import { ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils";

type StatusColumn = { status: TaskStatus; label: string; color: string };

const COLUMNS: StatusColumn[] = [
  {
    status: "pending",
    label: "Pending",
    color: "border-amber-500/30 bg-amber-500/5",
  },
  {
    status: "in_progress",
    label: "In Progress",
    color: "border-blue-500/30 bg-blue-500/5",
  },
  {
    status: "done",
    label: "Done",
    color: "border-emerald-500/30 bg-emerald-500/5",
  },
  {
    status: "unknown",
    label: "Unknown",
    color: "border-zinc-500/30 bg-zinc-500/5",
  },
];

interface TaskBoardProps {
  tasks: NormalizedTask[];
  onUpdate: (task: NormalizedTask, status: TaskStatus) => void;
  isUpdating: boolean;
  isLoading: boolean;
}

export function TaskBoard({
  tasks,
  onUpdate,
  isUpdating,
  isLoading,
}: TaskBoardProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COLUMNS.map((col) => (
          <div key={col.status} className="space-y-3">
            <div className="h-6 w-24 bg-muted rounded animate-pulse" />
            {Array.from({ length: 2 }).map((_, i) => (
              <SkeletonTaskCard key={i} />
            ))}
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-4"
      role="region"
      aria-label="Task board"
    >
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.status);
        return (
          <motion.div
            key={col.status}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-xl border p-3 space-y-3 min-h-[200px]",
              col.color,
            )}
            role="group"
            aria-label={`${col.label} column (${colTasks.length})`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-foreground">
                {col.label}
              </h3>
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-muted px-1.5 text-xs font-medium text-muted-foreground">
                {colTasks.length}
              </span>
            </div>

            <AnimatePresence mode="popLayout">
              {colTasks.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center justify-center py-8 text-xs text-muted-foreground"
                >
                  No tasks
                </motion.div>
              ) : (
                colTasks.map((task, i) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onUpdate={onUpdate}
                    isUpdating={isUpdating}
                    delay={i * 0.05}
                  />
                ))
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
}
