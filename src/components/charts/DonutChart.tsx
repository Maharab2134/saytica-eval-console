"use client";

import { motion } from "framer-motion";
import { useMemo } from "react";

interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  slices:    DonutSlice[];
  size?:     number;
  thickness?: number;
  className?: string;
}

export function DonutChart({ slices, size = 120, thickness = 20, className }: DonutChartProps) {
  const total   = slices.reduce((s, sl) => s + sl.value, 0);
  const radius  = (size - thickness) / 2;
  const cx      = size / 2;
  const cy      = size / 2;
  const circumference = 2 * Math.PI * radius;

  const rendered = useMemo(() => {
    if (total === 0) return [];
    let cumulative = 0;
    return slices
      .filter(s => s.value > 0)
      .map((slice, i) => {
        const pct    = slice.value / total;
        const offset = circumference * (1 - cumulative);
        cumulative  += pct;
        return { ...slice, pct, offset, index: i };
      });
  }, [slices, total, circumference]);

  return (
    <div className={className} aria-label="Donut chart" role="img">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
        {/* Background track */}
        <circle cx={cx} cy={cy} r={radius} fill="none"
          stroke="hsl(var(--muted))" strokeWidth={thickness} />

        {rendered.map(slice => (
          <motion.circle
            key={slice.label}
            cx={cx} cy={cy} r={radius}
            fill="none"
            stroke={slice.color}
            strokeWidth={thickness}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset: slice.offset - circumference * slice.pct }}
            transition={{ duration: 0.8, delay: slice.index * 0.15, ease: "easeOut" }}
            strokeLinecap="round"
          />
        ))}
      </svg>
    </div>
  );
}