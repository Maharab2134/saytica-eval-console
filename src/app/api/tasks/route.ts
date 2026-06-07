import { NextResponse } from "next/server";
import { RawTask } from "@/types/task";
import { normalizeTasks } from "@/lib/normalize";
import { ApiResponse, ApiError } from "@/types/api";
import { loadRawTasks } from "@/lib/taskStore";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const parsed = (await loadRawTasks()) as RawTask[];
    const tasks = normalizeTasks(parsed);

    const body: ApiResponse<typeof tasks> = {
      data: tasks,
      success: true,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(body);
  } catch (err) {
    console.error("[/api/tasks] GET error:", err);
    const errorBody: ApiError = {
      error: "Failed to load tasks",
      code: "LOAD_ERROR",
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(errorBody, { status: 500 });
  }
}
