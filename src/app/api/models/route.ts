import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { RawModel } from "@/types/model";
import { normalizeModels } from "@/lib/normalize";
import { ApiResponse, ApiError } from "@/types/api";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const filePath = path.join(process.cwd(), "data", "models.json");
    const raw      = await fs.readFile(filePath, "utf-8");

    let parsed: unknown;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const errorBody: ApiError = {
        error:     "Failed to parse models data",
        code:      "PARSE_ERROR",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorBody, { status: 500 });
    }

    if (!Array.isArray(parsed)) {
      const errorBody: ApiError = {
        error:     "Invalid data format: expected array",
        code:      "INVALID_FORMAT",
        timestamp: new Date().toISOString(),
      };
      return NextResponse.json(errorBody, { status: 500 });
    }

    const normalized = normalizeModels(parsed as RawModel[]);

    const body: ApiResponse<typeof normalized> = {
      data:      normalized,
      success:   true,
      timestamp: new Date().toISOString(),
    };

    return NextResponse.json(body, {
      headers: {
        "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
      },
    });
  } catch (err) {
    console.error("[/api/models] Unexpected error:", err);
    const errorBody: ApiError = {
      error:     "Internal server error",
      code:      "INTERNAL_ERROR",
      timestamp: new Date().toISOString(),
    };
    return NextResponse.json(errorBody, { status: 500 });
  }
}