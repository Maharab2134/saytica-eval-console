"use client";

import { useTasks } from "@/hooks/useTasks";
import { RoleToggle } from "@/components/tasks/RoleToggle";
import { TaskBoard } from "@/components/tasks/TaskBoard";
import { ClientDashboard } from "@/components/tasks/ClientDashboard";
import { ErrorState } from "@/components/shared/ErrorState";
import { exportTasksToCSV } from "@/lib/export";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { NormalizedTask, TaskStatus } from "@/types/task";

export function TasksClient() {
  const {
    tasks,
    stats,
    projectSummaries,
    role,
    setRole,
    updateStatus,
    isUpdating,
    isLoading,
    isError,
    error,
    refetch,
    allTasks,
    updateError,
  } = useTasks();

  function handleUpdate(task: NormalizedTask, newStatus: TaskStatus) {
    try {
      updateStatus(task, newStatus);
      toast.success(`Task moved to "${newStatus.replace("_", " ")}"`, {
        description: task.title,
      });
    } catch (e) {
      toast.error((e as Error).message ?? "Failed to update task");
    }
  }

  // Show mutation errors via toast
  if (updateError) {
    toast.error((updateError as Error).message ?? "Update failed");
  }

  function handleExport() {
    try {
      exportTasksToCSV(allTasks);
      toast.success("Tasks exported to CSV");
    } catch {
      toast.error("Failed to export");
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-xl font-bold text-foreground tracking-tight">
            Task Board
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {role === "annotator"
              ? `${tasks.length} tasks available`
              : `${tasks.length} tasks across ${stats.totalProjects} project${stats.totalProjects !== 1 ? "s" : ""}`}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <RoleToggle role={role} onRoleChange={setRole} />
          <Button
            variant="outline"
            size="sm"
            onClick={handleExport}
            className="gap-2"
            aria-label="Export tasks to CSV"
          >
            <Download className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Export</span>
          </Button>
        </div>
      </motion.div>

      {/* Content */}
      {isError ? (
        <ErrorState
          title="Failed to load tasks"
          message={(error as Error)?.message}
          onRetry={refetch}
        />
      ) : (
        <div className="space-y-6">
          <AnimatePresence mode="wait">
            {role === "client" ? (
              <motion.div
                key="client"
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.25 }}
              >
                <ClientDashboard stats={stats} projects={projectSummaries} />
              </motion.div>
            ) : null}
          </AnimatePresence>

          <TaskBoard
            tasks={tasks}
            onUpdate={handleUpdate}
            isUpdating={isUpdating}
            isLoading={isLoading}
          />
        </div>
      )}
    </div>
  );
}
