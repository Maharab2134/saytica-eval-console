export interface RawModel {
  id: string;
  name: string;
  provider: string;
  accuracy: number | null;
  latencyMs: number | null;
  costPer1k: number | null;
  evaluatedAt: string | null;
}

export interface NormalizedModel {
  id: string;
  name: string;
  provider: string;
  accuracy: number | null;
  latencyMs: number | null;
  costPer1k: number | null;
  evaluatedAt: string | null;
  rank?: number;
}

export type SortField = "accuracy" | "latencyMs" | "costPer1k" | "name";
export type SortDirection = "asc" | "desc";

export interface ModelFilters {
  search: string;
  provider: string;
  sortField: SortField;
  sortDirection: SortDirection;
}

export interface TopPerformers {
  bestAccuracy: NormalizedModel | null;
  fastestModel: NormalizedModel | null;
  cheapestModel: NormalizedModel | null;
}

export interface ModelStats {
  totalModels: number;
  avgAccuracy: number | null;
  avgLatency: number | null;
  providers: string[];
}