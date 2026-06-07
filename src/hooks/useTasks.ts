"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useMemo, useState, useCallback } from "react";
import { fetchTasks, updateTaskStatus } from "@/services/taskService";
import { NormalizedTask, TaskStatus, UserRole, VALID_TRANSITIONS } from "@/types/task";
import { getTaskStats, getProjectSummaries } from "@/lib/analytics";

const QUERY_KEY = ["tasks"] as const;
const ANNOTATOR_ID = "u_annotator";
const CLIENT_ID    = "c1";

export function useTasks() {
  const [role, setRole] = useState<UserRole>("annotator");
  const queryClient     = useQueryClient();

  const query = useQuery({
    queryKey: QUERY_KEY,
    queryFn:  fetchTasks,
    staleTime: 30_000,
  });

  const allTasks = query.data ?? [];

  // Annotator sees only their assigned tasks
  const annotatorTasks = useMemo(
    () => allTasks.filter(t => t.assignedTo === ANNOTATOR_ID),
    [allTasks]
  );

  // Client sees tasks for their client ID
  const clientTasks = useMemo(
    () => allTasks.filter(t => t.clientId === CLIENT_ID),
    [allTasks]
  );

  const visibleTasks = role === "annotator" ? annotatorTasks : clientTasks;

  const stats          = useMemo(() => getTaskStats(visibleTasks), [visibleTasks]);
  const projectSummaries = useMemo(() => getProjectSummaries(visibleTasks), [visibleTasks]);
  const globalStats    = useMemo(() => getTaskStats(allTasks), [allTasks]);

  // ── Status update mutation with optimistic UI ──
  const mutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      updateTaskStatus(id, status),

    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEY });
      const previous = queryClient.getQueryData<NormalizedTask[]>(QUERY_KEY);

      // Optimistic update
      queryClient.setQueryData<NormalizedTask[]>(QUERY_KEY, old =>
        old?.map(t => t.id === id ? { ...t, status } : t) ?? []
      );

      return { previous };
    },

    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(QUERY_KEY, context.previous);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });

  const updateStatus = useCallback(
    (task: NormalizedTask, newStatus: TaskStatus) => {
      const allowed = VALID_TRANSITIONS[task.status] ?? [];
      if (!allowed.includes(newStatus)) {
        throw new Error(`Invalid transition: ${task.status} → ${newStatus}`);
      }
      mutation.mutate({ id: task.id, status: newStatus });
    },
    [mutation]
  );

  const getNextStatus = useCallback(
    (current: TaskStatus): TaskStatus | null => {
      const transitions = VALID_TRANSITIONS[current];
      return transitions?.length ? transitions[0] : null;
    },
    []
  );

  return {
    tasks:           visibleTasks,
    allTasks,
    annotatorTasks,
    clientTasks,
    stats,
    globalStats,
    projectSummaries,
    role,
    setRole,
    updateStatus,
    getNextStatus,
    isUpdating:      mutation.isPending,
    updateError:     mutation.error,
    isLoading:       query.isLoading,
    isError:         query.isError,
    error:           query.error,
    refetch:         query.refetch,
  };
}