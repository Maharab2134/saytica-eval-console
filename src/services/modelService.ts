import { NormalizedModel } from "@/types/model";
import { ApiResponse } from "@/types/api";

export async function fetchModels(): Promise<NormalizedModel[]> {
  const res = await fetch("/api/models", { next: { revalidate: 60 } });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.error ?? `Failed to fetch models (${res.status})`);
  }

  const json: ApiResponse<NormalizedModel[]> = await res.json();

  if (!json.success || !Array.isArray(json.data)) {
    throw new Error("Unexpected response format from /api/models");
  }

  return json.data;
}