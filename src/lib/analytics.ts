import { NormalizedModel, TopPerformers, ModelStats } from "@/types/model";
import { NormalizedTask, ProjectSummary, TaskStats } from "@/types/task";

// ──────────────────────────────────────────────
// Model Analytics
// ──────────────────────────────────────────────
export function getTopPerformers(models: NormalizedModel[]): TopPerformers {
  const withAccuracy  = models.filter(m => m.accuracy  !== null);
  const withLatency   = models.filter(m => m.latencyMs !== null);
  const withCost      = models.filter(m => m.costPer1k !== null);

  return {
    bestAccuracy:  withAccuracy.length  ? withAccuracy.reduce((a, b) => (a.accuracy!  > b.accuracy!  ? a : b)) : null,
    fastestModel:  withLatency.length   ? withLatency.reduce((a, b) => (a.latencyMs! < b.latencyMs! ? a : b)) : null,
    cheapestModel: withCost.length      ? withCost.reduce((a, b)    => (a.costPer1k! < b.costPer1k! ? a : b)) : null,
  };
}

export function getModelStats(models: NormalizedModel[]): ModelStats {
  const withAccuracy = models.filter(m => m.accuracy  !== null);
  const withLatency  = models.filter(m => m.latencyMs !== null);

  const avgAccuracy = withAccuracy.length
    ? withAccuracy.reduce((s, m) => s + m.accuracy!, 0) / withAccuracy.length
    : null;

  const avgLatency = withLatency.length
    ? withLatency.reduce((s, m) => s + m.latencyMs!, 0) / withLatency.length
    : null;

  const providers = [...new Set(models.map(m => m.provider))].sort();

  return { totalModels: models.length, avgAccuracy, avgLatency, providers };
}

export function rankModels(models: NormalizedModel[]): NormalizedModel[] {
  return [...models]
    .sort((a, b) => {
      if (a.accuracy === null && b.accuracy === null) return 0;
      if (a.accuracy === null) return 1;
      if (b.accuracy === null) return -1;
      return b.accuracy - a.accuracy;
    })
    .map((m, i) => ({ ...m, rank: i + 1 }));
}

// ──────────────────────────────────────────────
// Task Analytics
// ──────────────────────────────────────────────
export function getTaskStats(tasks: NormalizedTask[]): TaskStats {
  const total      = tasks.length;
  const pending    = tasks.filter(t => t.status === "pending").length;
  const inProgress = tasks.filter(t => t.status === "in_progress").length;
  const done       = tasks.filter(t => t.status === "done").length;
  const unknown    = tasks.filter(t => t.status === "unknown").length;
  const projects   = new Set(tasks.map(t => t.projectId)).size;

  return {
    total,
    pending,
    inProgress,
    done,
    unknown,
    completionRate: total > 0 ? Math.round((done / total) * 100) : 0,
    pendingRate:    total > 0 ? Math.round((pending / total) * 100) : 0,
    activeRate:     total > 0 ? Math.round((inProgress / total) * 100) : 0,
    totalProjects:  projects,
  };
}

export function getProjectSummaries(tasks: NormalizedTask[]): ProjectSummary[] {
  const projectMap = new Map<string, ProjectSummary>();

  tasks.forEach(task => {
    if (!projectMap.has(task.projectId)) {
      projectMap.set(task.projectId, {
        projectId:   task.projectId,
        projectName: task.projectName,
        clientId:    task.clientId,
        total:       0, pending: 0, inProgress: 0, done: 0, unknown: 0,
        completionRate: 0,
      });
    }
    const summary = projectMap.get(task.projectId)!;
    summary.total++;
    if (task.status === "pending")     summary.pending++;
    if (task.status === "in_progress") summary.inProgress++;
    if (task.status === "done")        summary.done++;
    if (task.status === "unknown")     summary.unknown++;
  });

  projectMap.forEach(s => {
    s.completionRate = s.total > 0 ? Math.round((s.done / s.total) * 100) : 0;
  });

  return [...projectMap.values()];
}