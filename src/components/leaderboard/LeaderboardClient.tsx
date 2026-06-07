"use client";

import { useModels } from "@/hooks/useModels";
import { LeaderboardFilters } from "@/components/leaderboard/LeaderboardFilters";
import { TopPerformerCard } from "@/components/cards/TopPerformerCard";
import { ModelTable } from "@/components/tables/ModelTable";
import { EmptyState } from "@/components/shared/EmptyState";
import { ErrorState } from "@/components/shared/ErrorState";
import { SkeletonRow } from "@/components/shared/SkeletonCard";
import { exportModelsToCSV } from "@/lib/export";
import { formatAccuracy, formatLatency, formatCost } from "@/lib/utils";
import { motion } from "framer-motion";
import { Trophy, Zap, DollarSign, Search } from "lucide-react";
import { toast } from "sonner";

export function LeaderboardClient() {
  const {
    models, allModels, providers, filters, topPerformers, stats,
    isLoading, isError, error, refetch,
    setSearch, setProvider, toggleSort,
  } = useModels();

  function handleExport() {
    try {
      exportModelsToCSV(allModels);
      toast.success("CSV exported successfully");
    } catch {
      toast.error("Failed to export CSV");
    }
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page header */}
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        <h2 className="text-xl font-bold text-foreground tracking-tight">Model Leaderboard</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Compare {stats.totalModels} AI models by accuracy, latency, and cost.
        </p>
      </motion.div>

      {/* Top performer cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <TopPerformerCard
          label="Best Accuracy"
          emoji="🥇"
          icon={Trophy}
          model={topPerformers.bestAccuracy}
          metric={formatAccuracy(topPerformers.bestAccuracy?.accuracy ?? null)}
          color="amber"
          bgColor="bg-amber-500"
          delay={0}
        />
        <TopPerformerCard
          label="Fastest Model"
          emoji="⚡"
          icon={Zap}
          model={topPerformers.fastestModel}
          metric={formatLatency(topPerformers.fastestModel?.latencyMs ?? null)}
          color="blue"
          bgColor="bg-blue-500"
          delay={0.1}
        />
        <TopPerformerCard
          label="Cheapest Model"
          emoji="💰"
          icon={DollarSign}
          model={topPerformers.cheapestModel}
          metric={formatCost(topPerformers.cheapestModel?.costPer1k ?? null)}
          color="emerald"
          bgColor="bg-emerald-500"
          delay={0.2}
        />
      </div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}>
        <LeaderboardFilters
          filters={filters}
          providers={providers}
          onSearch={setSearch}
          onProvider={setProvider}
          onExport={handleExport}
          onRefresh={refetch}
          isLoading={isLoading}
        />
      </motion.div>

      {/* Table section */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        {isError ? (
          <ErrorState
            title="Failed to load models"
            message={(error as Error)?.message ?? "Unknown error"}
            onRetry={refetch}
          />
        ) : isLoading ? (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-sm" aria-label="Loading models..." aria-busy="true">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  {["#", "Model", "Provider", "Accuracy", "Latency", "Cost / 1K", "Evaluated"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {Array.from({ length: 7 }).map((_, i) => <SkeletonRow key={i} />)}
              </tbody>
            </table>
          </div>
        ) : models.length === 0 ? (
          <EmptyState
            icon={Search}
            title="No models found"
            description="Try adjusting your search or filter criteria."
            action={{ label: "Clear filters", onClick: () => { setSearch(""); setProvider("all"); } }}
          />
        ) : (
          <>
            <ModelTable models={models} filters={filters} onSort={toggleSort} />
            <p className="text-xs text-muted-foreground mt-2 text-right">
              Showing {models.length} of {allModels.length} models
            </p>
          </>
        )}
      </motion.div>
    </div>
  );
}