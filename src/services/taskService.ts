import { NormalizedTask, TaskStatus } from "@/types/task";
import { ApiResponse } from "@/types/api";

export async function fetchTasks(): Promise<NormalizedTask[]> {
  const res = await fetch("/api/tasks");

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? `Failed to fetch tasks (${res.status})`);
  }

  const json: ApiResponse<NormalizedTask[]> = await res.json();

  if (!json.success || !Array.isArray(json.data)) {
    throw new Error("Unexpected response format from /api/tasks");
  }

  return json.data;
}

export async function updateTaskStatus(
  id: string,
  newStatus: TaskStatus
): Promise<NormalizedTask> {
  const res = await fetch(`/api/tasks/${id}`, {
    method:  "PATCH",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ status: newStatus }),
  });

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json?.error ?? `Failed to update task (${res.status})`);
  }

  return json.data as NormalizedTask;
}