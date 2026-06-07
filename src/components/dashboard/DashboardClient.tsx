"use client";

import { useModels } from "@/hooks/useModels";
import { useTasks } from "@/hooks/useTasks";
import { StatCard } from "@/components/shared/StatCard";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { motion } from "framer-motion";
import { Trophy, ClipboardList, Zap, TrendingUp, CheckCircle, Activity } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { formatAccuracy, formatLatency } from "@/lib/utils";

export function DashboardClient() {
  const { stats: modelStats, topPerformers, isLoading: modelsLoading } = useModels();
  const { globalStats: taskStats, isLoading: tasksLoading } = useTasks();

  const isLoading = modelsLoading || tasksLoading;

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl border border-border bg-gradient-to-br from-card to-muted/30 p-6 md:p-8"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-foreground tracking-tight">Welcome back 👋</h2>
            <p className="text-muted-foreground mt-1 text-sm">
              Here's a snapshot of your AI evaluation pipeline.
            </p>
          </div>
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline">
              <Link href="/leaderboard">View Leaderboard</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/tasks">Manage Tasks</Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard title="Total Models"   value={isLoading ? "—" : modelStats.totalModels} icon={Zap}           iconColor="text-violet-500" delay={0}    />
        <StatCard title="Total Tasks"    value={isLoading ? "—" : taskStats.total}        icon={ClipboardList}  iconColor="text-blue-500"   delay={0.05} />
        <StatCard title="Completed"      value={isLoading ? "—" : taskStats.done}         icon={CheckCircle}    iconColor="text-emerald-500" delay={0.1} />
        <StatCard title="Completion"     value={isLoading ? "—" : `${taskStats.completionRate}%`} icon={TrendingUp} iconColor="text-amber-500" delay={0.15} />
      </div>

      {/* Two-column quick view */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Model summary */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl border border-border bg-card p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Trophy className="h-4 w-4 text-amber-500" aria-hidden="true" />
              Top Performers
            </h3>
            <Link href="/leaderboard" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            {[
              { label: "🥇 Best Accuracy",  model: topPerformers.bestAccuracy,  metric: formatAccuracy(topPerformers.bestAccuracy?.accuracy ?? null) },
              { label: "⚡ Fastest",         model: topPerformers.fastestModel,  metric: formatLatency(topPerformers.fastestModel?.latencyMs ?? null) },
              { label: "💰 Cheapest",        model: topPerformers.cheapestModel, metric: topPerformers.cheapestModel?.costPer1k === 0 ? "Free" : `$${topPerformers.cheapestModel?.costPer1k?.toFixed(2) ?? "N/A"}` },
            ].map(item => (
              <div key={item.label} className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{item.label}</span>
                <div className="text-right">
                  <p className="font-medium text-foreground">{item.model?.name ?? "N/A"}</p>
                  <p className="text-xs text-muted-foreground">{item.metric}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Task summary */}
        <motion.div
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-xl border border-border bg-card p-5 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
              <Activity className="h-4 w-4 text-blue-500" aria-hidden="true" />
              Task Overview
            </h3>
            <Link href="/tasks" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
              View all →
            </Link>
          </div>
          <div className="space-y-3">
            <ProgressBar value={taskStats.completionRate} label="Completed"   color="bg-emerald-500" delay={0.3} />
            <ProgressBar value={taskStats.activeRate}     label="In Progress" color="bg-blue-500"    delay={0.35} />
            <ProgressBar value={taskStats.pendingRate}    label="Pending"     color="bg-amber-500"   delay={0.4} />
          </div>
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[
              { label: "Pending",    value: taskStats.pending,    color: "text-amber-500"   },
              { label: "Active",     value: taskStats.inProgress, color: "text-blue-500"    },
              { label: "Done",       value: taskStats.done,       color: "text-emerald-500" },
            ].map(s => (
              <div key={s.label} className="text-center rounded-lg bg-muted/40 py-2">
                <p className={`text-xl font-bold tabular-nums ${s.color}`}>{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}