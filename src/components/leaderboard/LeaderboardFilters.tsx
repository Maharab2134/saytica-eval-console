"use client";

import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Download, RefreshCw } from "lucide-react";
import { ModelFilters } from "@/types/model";

interface LeaderboardFiltersProps {
  filters:    ModelFilters;
  providers:  string[];
  onSearch:   (v: string) => void;
  onProvider: (v: string) => void;
  onExport:   () => void;
  onRefresh:  () => void;
  isLoading:  boolean;
}

export function LeaderboardFilters({
  filters, providers, onSearch, onProvider, onExport, onRefresh, isLoading,
}: LeaderboardFiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center">
      {/* Search */}
      <div className="relative flex-1 min-w-0">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" aria-hidden="true" />
        <Input
          placeholder="Search models or providers..."
          className="pl-9 bg-background"
          value={filters.search}
          onChange={e => onSearch(e.target.value)}
          aria-label="Search models"
        />
      </div>

      {/* Provider Filter */}
      <Select value={filters.provider} onValueChange={onProvider}>
        <SelectTrigger className="w-full sm:w-44" aria-label="Filter by provider">
          <SelectValue placeholder="All Providers" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Providers</SelectItem>
          {providers.map(p => (
            <SelectItem key={p} value={p}>{p}</SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Actions */}
      <div className="flex gap-2">
        <Button variant="outline" size="icon" onClick={onRefresh} disabled={isLoading} aria-label="Refresh data">
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} aria-hidden="true" />
        </Button>
        <Button variant="outline" size="sm" onClick={onExport} className="gap-2" aria-label="Export to CSV">
          <Download className="h-4 w-4" aria-hidden="true" />
          <span className="hidden sm:inline">Export CSV</span>
        </Button>
      </div>
    </div>
  );
}