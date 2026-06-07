"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react";
import { NormalizedModel, SortField, ModelFilters } from "@/types/model";
import { formatAccuracy, formatLatency, formatCost } from "@/lib/utils";
import { formatDate } from "@/lib/normalize";
import { cn } from "@/lib/utils";

interface ModelTableProps {
  models:    NormalizedModel[];
  filters:   ModelFilters;
  onSort:    (field: SortField) => void;
}

interface ColumnConfig {
  key:       SortField | "provider" | "evaluatedAt";
  label:     string;
  sortable:  boolean;
  align?:    "left" | "right" | "center";
}

const COLUMNS: ColumnConfig[] = [
  { key: "name",        label: "Model",         sortable: true,  align: "left"  },
  { key: "provider",    label: "Provider",       sortable: false, align: "left"  },
  { key: "accuracy",    label: "Accuracy",       sortable: true,  align: "right" },
  { key: "latencyMs",   label: "Latency",        sortable: true,  align: "right" },
  { key: "costPer1k",   label: "Cost / 1K",      sortable: true,  align: "right" },
  { key: "evaluatedAt", label: "Evaluated",      sortable: false, align: "right" },
];

const RANK_MEDALS: Record<number, string> = { 1: "🥇", 2: "🥈", 3: "🥉" };

function SortIcon({ field, filters }: { field: SortField; filters: ModelFilters }) {
  if (filters.sortField !== field) return <ChevronsUpDown className="h-3 w-3 opacity-40" />;
  return filters.sortDirection === "asc"
    ? <ChevronUp className="h-3 w-3 text-primary" />
    : <ChevronDown className="h-3 w-3 text-primary" />;
}

function AccuracyBar({ value }: { value: number | null }) {
  if (value === null) return <span className="text-muted-foreground text-xs">N/A</span>;
  const pct = value * 100;
  return (
    <div className="flex items-center gap-2 justify-end">
      <div className="w-14 h-1.5 rounded-full bg-muted overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className={cn(
            "h-full rounded-full",
            pct >= 90 ? "bg-emerald-500" : pct >= 80 ? "bg-blue-500" : pct >= 70 ? "bg-amber-500" : "bg-red-400"
          )}
        />
      </div>
      <span className="text-xs font-medium tabular-nums w-10 text-right">{formatAccuracy(value)}</span>
    </div>
  );
}

export function ModelTable({ models, filters, onSort }: ModelTableProps) {
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-sm" role="grid" aria-label="Model leaderboard">
        <thead>
          <tr className="border-b border-border bg-muted/30">
            <th className="px-4 py-3 text-left w-12 text-xs font-semibold text-muted-foreground" scope="col">#</th>
            {COLUMNS.map(col => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  "px-4 py-3 text-xs font-semibold text-muted-foreground",
                  col.align === "right" ? "text-right" : "text-left",
                  col.sortable && "cursor-pointer select-none hover:text-foreground transition-colors"
                )}
                onClick={col.sortable ? () => onSort(col.key as SortField) : undefined}
                aria-sort={
                  filters.sortField === col.key
                    ? filters.sortDirection === "asc" ? "ascending" : "descending"
                    : undefined
                }
              >
                <span className="inline-flex items-center gap-1">
                  {col.label}
                  {col.sortable && <SortIcon field={col.key as SortField} filters={filters} />}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <AnimatePresence mode="popLayout">
            {models.map((model, idx) => (
              <motion.tr
                key={model.id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                className="border-b border-border/50 hover:bg-muted/30 transition-colors group"
                role="row"
              >
                <td className="px-4 py-3 text-center">
                  <span className="text-sm">
                    {RANK_MEDALS[model.rank ?? 0] ?? (
                      <span className="text-muted-foreground tabular-nums text-xs">{model.rank}</span>
                    )}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="font-medium text-foreground">{model.name}</span>
                </td>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {model.provider}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <AccuracyBar value={model.accuracy} />
                </td>
                <td className="px-4 py-3 text-right">
                  <LatencyBadge ms={model.latencyMs} />
                </td>
                <td className="px-4 py-3 text-right">
                  <span className={cn(
                    "text-xs font-medium",
                    model.costPer1k === null
                      ? "text-muted-foreground"
                      : model.costPer1k === 0
                      ? "text-emerald-500 font-semibold"
                      : "text-foreground"
                  )}>
                    {formatCost(model.costPer1k)}
                  </span>
                </td>
                <td className="px-4 py-3 text-right text-xs text-muted-foreground tabular-nums">
                  {formatDate(model.evaluatedAt)}
                </td>
              </motion.tr>
            ))}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  );
}

function LatencyBadge({ ms }: { ms: number | null }) {
  if (ms === null) return <span className="text-muted-foreground text-xs">N/A</span>;
  const isHigh = ms > 500;
  const isSlow = ms === 9999;
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
      isSlow ? "bg-red-500/10 text-red-400"
        : isHigh ? "bg-amber-500/10 text-amber-500"
        : "bg-emerald-500/10 text-emerald-500"
    )}>
      {isSlow ? "Very Slow" : formatLatency(ms)}
    </span>
  );
}