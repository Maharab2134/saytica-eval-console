import { promises as fs } from "fs";
import path from "path";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { RawTask } from "@/types/task";

const DATA_PATH = path.join(process.cwd(), "data", "tasks.json");

function getSupabaseClient(): SupabaseClient | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) return null;
  return createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function toRawTask(row: Record<string, unknown>): RawTask {
  return {
    id: String(row.id ?? ""),
    title: String(row.title ?? ""),
    projectId: String(row.projectId ?? row.project_id ?? ""),
    projectName: String(row.projectName ?? row.project_name ?? ""),
    clientId: String(row.clientId ?? row.client_id ?? ""),
    assignedTo:
      typeof row.assignedTo === "string"
        ? row.assignedTo
        : typeof row.assigned_to === "string"
          ? row.assigned_to
          : null,
    status: String(row.status ?? ""),
  };
}

export function hasSupabaseTaskStore(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

export async function loadRawTasks(): Promise<RawTask[]> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { data, error } = await supabase.from("tasks").select("*");
    if (error) throw new Error(`Supabase read failed: ${error.message}`);
    return (data ?? []).map((row) => toRawTask(row as Record<string, unknown>));
  }

  const raw = await fs.readFile(DATA_PATH, "utf-8");
  return JSON.parse(raw) as RawTask[];
}

export async function persistTaskStatus(
  taskId: string,
  nextStatus: string,
): Promise<void> {
  const supabase = getSupabaseClient();

  if (supabase) {
    const { error } = await supabase
      .from("tasks")
      .update({ status: nextStatus })
      .eq("id", taskId);

    if (error) throw new Error(`Supabase update failed: ${error.message}`);
    return;
  }

  const raw = await fs.readFile(DATA_PATH, "utf-8");
  const rawList = JSON.parse(raw) as RawTask[];
  const updatedRaw = rawList.map((task) =>
    task.id === taskId ? { ...task, status: nextStatus } : task,
  );
  await fs.writeFile(DATA_PATH, JSON.stringify(updatedRaw, null, 2), "utf-8");
}
