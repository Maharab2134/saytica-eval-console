import { NextRequest, NextResponse } from "next/server";
import { RawTask, TaskStatus, VALID_TRANSITIONS } from "@/types/task";
import { normalizeStatus, normalizeTasks } from "@/lib/normalize";
import { ApiError } from "@/types/api";
import {
  hasSupabaseTaskStore,
  loadRawTasks,
  persistTaskStatus,
} from "@/lib/taskStore";

export const dynamic = "force-dynamic";

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as { status?: string };
    const newRaw = body?.status;

    if (!newRaw || typeof newRaw !== "string") {
      const err: ApiError = {
        error: "Missing or invalid status field",
        code: "VALIDATION_ERROR",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(err, { status: 400 });
    }

    const newStatus = normalizeStatus(newRaw);
    if (newStatus === "unknown") {
      const err: ApiError = {
        error: `Invalid status: "${newRaw}"`,
        code: "INVALID_STATUS",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(err, { status: 400 });
    }

    // Read current data
    const rawList = (await loadRawTasks()) as RawTask[];
    const tasks = normalizeTasks(rawList);

    const taskIndex = tasks.findIndex((t) => t.id === id);
    if (taskIndex === -1) {
      const err: ApiError = {
        error: `Task "${id}" not found`,
        code: "NOT_FOUND",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(err, { status: 404 });
    }

    const currentTask = tasks[taskIndex];
    const currentStatus = currentTask.status as TaskStatus;
    const allowed = VALID_TRANSITIONS[currentStatus] ?? [];

    if (!allowed.includes(newStatus)) {
      const err: ApiError = {
        error: `Invalid transition: "${currentStatus}" → "${newStatus}". Allowed: ${allowed.join(", ") || "none"}`,
        code: "INVALID_TRANSITION",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(err, { status: 422 });
    }

    // Persist updated status back to JSON
    await persistTaskStatus(id, newStatus);

    const updatedTask = { ...currentTask, status: newStatus };

    return NextResponse.json({
      data: updatedTask,
      success: true,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("[/api/tasks/:id] PATCH error:", err);
    const isReadonlyFsError =
      err instanceof Error &&
      (err.message.includes("EROFS") ||
        err.message.includes("read-only") ||
        err.message.includes("permission"));

    const errorBody: ApiError = {
      error:
        isReadonlyFsError && !hasSupabaseTaskStore()
          ? "Persistence is not configured for production. Set Supabase env vars to enable task updates."
          : "Internal server error",
      code: isReadonlyFsError ? "PERSISTENCE_UNAVAILABLE" : "INTERNAL_ERROR",
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(errorBody, { status: 500 });
  }
}
