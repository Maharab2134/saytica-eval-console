"use client";

import { useQuery } from "@tanstack/react-query";
import { useMemo, useState, useCallback } from "react";
import { fetchModels } from "@/services/modelService";
import { NormalizedModel, ModelFilters, SortField, SortDirection, TopPerformers, ModelStats } from "@/types/model";
import { getTopPerformers, getModelStats, rankModels } from "@/lib/analytics";

const QUERY_KEY = ["models"] as const;

export function useModels() {
  const [filters, setFilters] = useState<ModelFilters>({
    search:        "",
    provider:      "all",
    sortField:     "accuracy",
    sortDirection: "desc",
  });

  const query = useQuery({
    queryKey:   QUERY_KEY,
    queryFn:    fetchModels,
    staleTime:  60_000,
    retry:      2,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 30000),
  });

  const rankedModels = useMemo(
    () => rankModels(query.data ?? []),
    [query.data]
  );

  const providers = useMemo(
    () => [...new Set(rankedModels.map(m => m.provider))].sort(),
    [rankedModels]
  );

  const filteredModels = useMemo(() => {
    let list = [...rankedModels];

    // Filter by search
    if (filters.search.trim()) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        m => m.name.toLowerCase().includes(q) || m.provider.toLowerCase().includes(q)
      );
    }

    // Filter by provider
    if (filters.provider !== "all") {
      list = list.filter(m => m.provider === filters.provider);
    }

    // Sort
    list.sort((a, b) => {
      const dir = filters.sortDirection === "asc" ? 1 : -1;

      if (filters.sortField === "accuracy") {
        if (a.accuracy === null && b.accuracy === null) return 0;
        if (a.accuracy === null) return 1;
        if (b.accuracy === null) return -1;
        return (a.accuracy - b.accuracy) * dir;
      }
      if (filters.sortField === "latencyMs") {
        if (a.latencyMs === null && b.latencyMs === null) return 0;
        if (a.latencyMs === null) return 1;
        if (b.latencyMs === null) return -1;
        return (a.latencyMs - b.latencyMs) * dir;
      }
      if (filters.sortField === "costPer1k") {
        if (a.costPer1k === null && b.costPer1k === null) return 0;
        if (a.costPer1k === null) return 1;
        if (b.costPer1k === null) return -1;
        return (a.costPer1k - b.costPer1k) * dir;
      }
      if (filters.sortField === "name") {
        return a.name.localeCompare(b.name) * dir;
      }
      return 0;
    });

    return list;
  }, [rankedModels, filters]);

  const topPerformers = useMemo<TopPerformers>(
    () => getTopPerformers(rankedModels),
    [rankedModels]
  );

  const stats = useMemo<ModelStats>(
    () => getModelStats(rankedModels),
    [rankedModels]
  );

  const setSearch        = useCallback((s: string)           => setFilters(f => ({ ...f, search: s })),        []);
  const setProvider      = useCallback((p: string)           => setFilters(f => ({ ...f, provider: p })),      []);
  const setSortField     = useCallback((field: SortField)    => setFilters(f => ({ ...f, sortField: field })), []);
  const setSortDirection = useCallback((dir: SortDirection)  => setFilters(f => ({ ...f, sortDirection: dir })), []);

  const toggleSort = useCallback((field: SortField) => {
    setFilters(f => ({
      ...f,
      sortField:     field,
      sortDirection: f.sortField === field && f.sortDirection === "desc" ? "asc" : "desc",
    }));
  }, []);

  return {
    models:         filteredModels,
    allModels:      rankedModels,
    providers,
    filters,
    topPerformers,
    stats,
    isLoading:      query.isLoading,
    isError:        query.isError,
    error:          query.error,
    refetch:        query.refetch,
    setSearch,
    setProvider,
    setSortField,
    setSortDirection,
    toggleSort,
  };
}