import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { RawTask, TaskStatus, VALID_TRANSITIONS } from "@/types/task";
import { normalizeStatus, normalizeTasks } from "@/lib/normalize";
import { ApiError } from "@/types/api";

export const dynamic = "force-dynamic";

const DATA_PATH = path.join(process.cwd(), "data", "tasks.json");

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id }  = await params;
    const body    = await request.json() as { status?: string };
    const newRaw  = body?.status;

    if (!newRaw || typeof newRaw !== "string") {
      const err: ApiError = { error: "Missing or invalid status field", code: "VALIDATION_ERROR", timestamp: new Date().toISOString() };
      return NextResponse.json(err, { status: 400 });
    }

    const newStatus = normalizeStatus(newRaw);
    if (newStatus === "unknown") {
      const err: ApiError = { error: `Invalid status: "${newRaw}"`, code: "INVALID_STATUS", timestamp: new Date().toISOString() };
      return NextResponse.json(err, { status: 400 });
    }

    // Read current data
    const raw     = await fs.readFile(DATA_PATH, "utf-8");
    const rawList = JSON.parse(raw) as RawTask[];
    const tasks   = normalizeTasks(rawList);

    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      const err: ApiError = { error: `Task "${id}" not found`, code: "NOT_FOUND", timestamp: new Date().toISOString() };
      return NextResponse.json(err, { status: 404 });
    }

    const currentTask   = tasks[taskIndex];
    const currentStatus = currentTask.status as TaskStatus;
    const allowed       = VALID_TRANSITIONS[currentStatus] ?? [];

    if (!allowed.includes(newStatus)) {
      const err: ApiError = {
        error: `Invalid transition: "${currentStatus}" → "${newStatus}". Allowed: ${allowed.join(", ") || "none"}`,
        code:  "INVALID_TRANSITION",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(err, { status: 422 });
    }

    // Persist updated status back to JSON
    const updatedRaw = rawList.map(t =>
      t.id === id ? { ...t, status: newStatus } : t
    );
    await fs.writeFile(DATA_PATH, JSON.stringify(updatedRaw, null, 2), "utf-8");

    const updatedTask = { ...currentTask, status: newStatus };

    return NextResponse.json({ data: updatedTask, success: true, timestamp: new Date().toISOString() });
  } catch (err) {
    console.error("[/api/tasks/:id] PATCH error:", err);
    const errorBody: ApiError = { error: "Internal server error", code: "INTERNAL_ERROR", timestamp: new Date().toISOString() };
    return NextResponse.json(errorBody, { status: 500 });
  }
}