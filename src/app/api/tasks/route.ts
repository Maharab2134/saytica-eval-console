import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { RawTask } from "@/types/task";
import { normalizeTasks } from "@/lib/normalize";
import { ApiResponse, ApiError } from "@/types/api";

export const dynamic = "force-dynamic";

const DATA_PATH = path.join(process.cwd(), "data", "tasks.json");

export async function GET() {
  try {
    const raw    = await fs.readFile(DATA_PATH, "utf-8");
    const parsed = JSON.parse(raw) as RawTask[];
    const tasks  = normalizeTasks(parsed);

    const body: ApiResponse<typeof tasks> = {
      data:      tasks,
      success:   true,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(body);
  } catch (err) {
    console.error("[/api/tasks] GET error:", err);
    const errorBody: ApiError = {
      error:     "Failed to load tasks",
      code:      "LOAD_ERROR",
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(errorBody, { status: 500 });
  }
}