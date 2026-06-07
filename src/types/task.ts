export type TaskStatus = "pending" | "in_progress" | "done" | "unknown";

export interface RawTask {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  clientId: string;
  assignedTo: string | null;
  status: string;
}

export interface NormalizedTask {
  id: string;
  title: string;
  projectId: string;
  projectName: string;
  clientId: string;
  assignedTo: string | null;
  status: TaskStatus;
}

export type UserRole = "annotator" | "client";

export interface ProjectSummary {
  projectId: string;
  projectName: string;
  clientId: string;
  total: number;
  pending: number;
  inProgress: number;
  done: number;
  unknown: number;
  completionRate: number;
}

export interface TaskStats {
  total: number;
  pending: number;
  inProgress: number;
  done: number;
  unknown: number;
  completionRate: number;
  pendingRate: number;
  activeRate: number;
  totalProjects: number;
}

export interface StatusTransition {
  from: TaskStatus;
  to: TaskStatus;
  label: string;
  action: string;
}

export const STATUS_TRANSITIONS: StatusTransition[] = [
  { from: "pending",     to: "in_progress", label: "Start Task",    action: "Start" },
  { from: "in_progress", to: "done",        label: "Mark Complete", action: "Complete" },
];

export const VALID_TRANSITIONS: Record<TaskStatus, TaskStatus[]> = {
  pending:     ["in_progress"],
  in_progress: ["done"],
  done:        [],
  unknown:     [],
};