"use client";

import { motion } from "framer-motion";
import { ProjectSummary, TaskStats } from "@/types/task";
import { StatCard } from "@/components/shared/StatCard";
import { ProgressBar } from "@/components/shared/ProgressBar";
import { DonutChart } from "@/components/charts/DonutChart";
import { ClipboardList, Clock, Loader, CheckCircle, FolderOpen } from "lucide-react";

interface ClientDashboardProps {
  stats:    TaskStats;
  projects: ProjectSummary[];
}

export function ClientDashboard({ stats, projects }: ClientDashboardProps) {
  const donutSlices = [
    { label: "Done",        value: stats.done,       color: "#10b981" },
    { label: "In Progress", value: stats.inProgress, color: "#3b82f6" },
    { label: "Pending",     value: stats.pending,    color: "#f59e0b" },
    { label: "Unknown",     value: stats.unknown,    color: "#71717a" },
  ];

  return (
    <div className="space-y-6">
      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Tasks"    value={stats.total}      icon={ClipboardList} iconColor="text-primary"     delay={0}    />
        <StatCard title="Pending"        value={stats.pending}    icon={Clock}         iconColor="text-amber-500"   delay={0.05} />
        <StatCard title="In Progress"    value={stats.inProgress} icon={Loader}        iconColor="text-blue-500"    delay={0.1}  />
        <StatCard title="Completed"      value={stats.done}       icon={CheckCircle}   iconColor="text-emerald-500" delay={0.15} />
      </div>

      {/* Completion overview */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="rounded-xl border border-border bg-card p-6"
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          {/* Donut */}
          <div className="flex flex-col items-center gap-2">
            <div className="relative">
              <DonutChart slices={donutSlices} size={120} thickness={16} />
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-bold text-foreground">{stats.completionRate}%</span>
                <span className="text-[10px] text-muted-foreground font-medium">Complete</span>
              </div>
            </div>
          </div>

          {/* Legend + Bars */}
          <div className="flex-1 space-y-3 w-full">
            <h3 className="text-sm font-semibold text-foreground">Overall Completion</h3>
            <ProgressBar value={stats.completionRate} label="Completed"   color="bg-emerald-500" delay={0.3} />
            <ProgressBar value={stats.activeRate}     label="In Progress" color="bg-blue-500"    delay={0.35} />
            <ProgressBar value={stats.pendingRate}    label="Pending"     color="bg-amber-500"   delay={0.4} />

            {/* Legend dots */}
            <div className="flex flex-wrap gap-3 pt-1">
              {donutSlices.map(s => (
                <span key={s.label} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color }} aria-hidden="true" />
                  {s.label} ({s.value})
                </span>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Project breakdowns */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
          <FolderOpen className="h-4 w-4" aria-hidden="true" />
          Project Summaries
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {projects.map((proj, i) => (
            <motion.div
              key={proj.projectId}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.08 }}
              className="rounded-xl border border-border bg-card p-4 space-y-3"
              role="region"
              aria-label={`Project: ${proj.projectName}`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-semibold text-foreground">{proj.projectName}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{proj.total} tasks total</p>
                </div>
                <span className="text-lg font-bold text-foreground">{proj.completionRate}%</span>
              </div>
              <ProgressBar
                value={proj.completionRate}
                color={proj.completionRate >= 75 ? "bg-emerald-500" : proj.completionRate >= 40 ? "bg-blue-500" : "bg-amber-500"}
                showLabel={false}
                height="h-1.5"
              />
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: "Pending",     value: proj.pending,    color: "text-amber-500"   },
                  { label: "Active",      value: proj.inProgress, color: "text-blue-500"    },
                  { label: "Done",        value: proj.done,       color: "text-emerald-500" },
                ].map(s => (
                  <div key={s.label} className="text-center">
                    <p className={`text-base font-bold tabular-nums ${s.color}`}>{s.value}</p>
                    <p className="text-[10px] text-muted-foreground">{s.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}