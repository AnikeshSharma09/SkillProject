import React from "react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  trendType?: "positive" | "negative";
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
    <div className="relative group p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800/90 shadow-xs hover:shadow-lg hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-200 overflow-hidden">
      {/* Top subtle sheen highlight */}
      <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-blue-500/20 to-transparent group-hover:via-blue-500/50 transition-all" />

      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="w-8 h-8 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700/60 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:scale-105 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/40 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-all duration-200 shadow-2xs">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      <div className="mt-4 flex items-baseline justify-between gap-2">
        <div className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-slate-100 tabular-nums">
          {value}
        </div>

        <div
          className={cn(
            "flex items-center gap-0.5 text-xs font-bold px-2 py-0.5 rounded-full shadow-2xs",
            isPositive
              ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/60"
              : "bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60"
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
        <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 font-medium">
          {description}
        </p>
      )}

      {/* Micro progress indicator bar */}
      <div className="mt-4 w-full h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            isPositive ? "bg-gradient-to-r from-blue-500 to-emerald-500 w-3/4" : "bg-gradient-to-r from-amber-500 to-red-500 w-1/2"
          )}
        />
      </div>
    </div>
  );
}
