import { RawModel, NormalizedModel } from "@/types/model";
import { RawTask, NormalizedTask, TaskStatus } from "@/types/task";

// ──────────────────────────────────────────────
// Provider normalization map (case-insensitive)
// ──────────────────────────────────────────────
const PROVIDER_MAP: Record<string, string> = {
  openforma: "OpenForma",
  toloka:    "Toloka",
  outlier:   "Outlier",
  mercor:    "Mercor",
  saytica:   "Saytica",
};

export function normalizeProvider(raw: string): string {
  if (!raw || typeof raw !== "string") return "Unknown";
  const key = raw.trim().toLowerCase();
  return PROVIDER_MAP[key] ?? raw.trim();
}

// ──────────────────────────────────────────────
// Date normalization
// Handles: "2026-05-02", "02/05/2026", null, ""
// ──────────────────────────────────────────────
export function normalizeDate(raw: string | null | undefined): string | null {
  if (!raw || typeof raw !== "string" || raw.trim() === "") return null;

  const trimmed = raw.trim();

  // ISO format: YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) {
    const d = new Date(trimmed + "T00:00:00Z");
    return isNaN(d.getTime()) ? null : trimmed;
  }

  // DD/MM/YYYY format
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(trimmed)) {
    const [day, month, year] = trimmed.split("/");
    const iso = `${year}-${month}-${day}`;
    const d = new Date(iso + "T00:00:00Z");
    return isNaN(d.getTime()) ? null : iso;
  }

  // Attempt generic parse as fallback
  const d = new Date(trimmed);
  if (!isNaN(d.getTime())) {
    return d.toISOString().split("T")[0];
  }

  return null;
}

export function formatDate(iso: string | null): string {
  if (!iso) return "N/A";
  try {
    return new Intl.DateTimeFormat("en-US", {
      year:  "numeric",
      month: "short",
      day:   "numeric",
      timeZone: "UTC",
    }).format(new Date(iso + "T00:00:00Z"));
  } catch {
    return "N/A";
  }
}

// ──────────────────────────────────────────────
// Model normalization
// ──────────────────────────────────────────────
export function normalizeModel(raw: RawModel): NormalizedModel {
  return {
    id:          raw.id ?? "unknown",
    name:        typeof raw.name === "string" ? raw.name.trim() : "Unnamed Model",
    provider:    normalizeProvider(raw.provider ?? ""),
    accuracy:    typeof raw.accuracy === "number" && isFinite(raw.accuracy) ? raw.accuracy : null,
    latencyMs:   typeof raw.latencyMs === "number" && isFinite(raw.latencyMs) && raw.latencyMs < 9000
                   ? raw.latencyMs
                   : raw.latencyMs === 9999 ? 9999 : raw.latencyMs,
    costPer1k:   typeof raw.costPer1k === "number" && isFinite(raw.costPer1k) ? raw.costPer1k : null,
    evaluatedAt: normalizeDate(raw.evaluatedAt),
  };
}

export function normalizeModels(raws: RawModel[]): NormalizedModel[] {
  return raws
    .filter((r): r is RawModel => r !== null && typeof r === "object" && Boolean(r.id))
    .map(normalizeModel);
}

// ──────────────────────────────────────────────
// Task status normalization
// ──────────────────────────────────────────────
const VALID_STATUSES: TaskStatus[] = ["pending", "in_progress", "done"];

export function normalizeStatus(raw: string | null | undefined): TaskStatus {
  if (!raw || typeof raw !== "string" || raw.trim() === "") return "unknown";
  const normalized = raw.trim().toLowerCase() as TaskStatus;
  return VALID_STATUSES.includes(normalized) ? normalized : "unknown";
}

export function normalizeTask(raw: RawTask): NormalizedTask {
  return {
    id:          raw.id ?? "unknown",
    title:       typeof raw.title === "string" && raw.title.trim() ? raw.title.trim() : "Untitled Task",
    projectId:   raw.projectId ?? "unknown",
    projectName: raw.projectName ?? "Unknown Project",
    clientId:    raw.clientId ?? "unknown",
    assignedTo:  raw.assignedTo && typeof raw.assignedTo === "string" ? raw.assignedTo : null,
    status:      normalizeStatus(raw.status),
  };
}

export function normalizeTasks(raws: RawTask[]): NormalizedTask[] {
  return raws
    .filter((r): r is RawTask => r !== null && typeof r === "object" && Boolean(r.id))
    .map(normalizeTask);
}