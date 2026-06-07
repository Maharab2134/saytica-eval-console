import { NormalizedModel } from "@/types/model";
import { NormalizedTask } from "@/types/task";
import { formatDate } from "./normalize";

function escapeCSV(value: string | number | null | undefined): string {
  if (value === null || value === undefined) return "N/A";
  const str = String(value);
  if (str.includes(",") || str.includes('"') || str.includes("\n")) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export function exportModelsToCSV(models: NormalizedModel[]): void {
  const headers = ["Rank", "Model Name", "Provider", "Accuracy", "Latency (ms)", "Cost per 1K", "Evaluated At"];
  const rows = models.map(m => [
    escapeCSV(m.rank ?? ""),
    escapeCSV(m.name),
    escapeCSV(m.provider),
    escapeCSV(m.accuracy !== null ? `${(m.accuracy * 100).toFixed(1)}%` : null),
    escapeCSV(m.latencyMs),
    escapeCSV(m.costPer1k !== null ? `$${m.costPer1k.toFixed(2)}` : null),
    escapeCSV(formatDate(m.evaluatedAt)),
  ]);

  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  downloadCSV(csv, "saytica-model-leaderboard.csv");
}

export function exportTasksToCSV(tasks: NormalizedTask[]): void {
  const headers = ["ID", "Title", "Project", "Assigned To", "Status"];
  const rows = tasks.map(t => [
    escapeCSV(t.id),
    escapeCSV(t.title),
    escapeCSV(t.projectName),
    escapeCSV(t.assignedTo ?? "Unassigned"),
    escapeCSV(t.status),
  ]);

  const csv = [headers.join(","), ...rows.map(r => r.join(","))].join("\n");
  downloadCSV(csv, "saytica-tasks.csv");
}

function downloadCSV(content: string, filename: string): void {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}