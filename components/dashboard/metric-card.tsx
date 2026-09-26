import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  trendType?: "positive" | "negative"; // up is good for docs, down is good for latency/approvals
  icon: React.ElementType;
  description?: string;
}

export function MetricCard({
  title,
  value,
  change,
  trend,
  trendType = "positive",
  icon: Icon,
  description,
}: MetricCardProps) {
  const isPositive =
    (trend === "up" && trendType === "positive") ||
    (trend === "down" && trendType === "negative");

  return (
    <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-100 dark:border-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-300">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <div className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
          {value}
        </div>

        <div
          className={cn(
            "flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full",
            isPositive
              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
              : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400"
          )}
        >
          {trend === "up" ? (
            <ArrowUpRight className="w-3.5 h-3.5" />
          ) : (
            <ArrowDownRight className="w-3.5 h-3.5" />
          )}
          <span>{change}</span>
        </div>
      </div>

      {description && (
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          {description}
        </p>
      )}
    </div>
  );
}
