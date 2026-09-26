import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  trendType?: "positive" | "negative";
  icon: React.ElementType;
  iconBgColor?: string;
  iconColor?: string;
  description?: string;
}

export function MetricCard({
  title,
  value,
  change,
  trend,
  trendType = "positive",
  icon: Icon,
  iconBgColor = "bg-blue-50 dark:bg-blue-950/60",
  iconColor = "text-blue-600 dark:text-blue-400",
  description,
}: MetricCardProps) {
  const isPositive =
    (trend === "up" && trendType === "positive") ||
    (trend === "down" && trendType === "negative");

  return (
    <div className="clean-card p-5 relative overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow">
      <div>
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className="mt-2 text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
          {value}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <div
          className={cn(
            "flex items-center gap-1 text-xs font-bold",
            isPositive
              ? "text-[#10B981]"
              : "text-[#EF4444]"
          )}
        >
          {trend === "up" ? (
            <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
          ) : (
            <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
          )}
          <span>{change}</span>
        </div>

        {/* Circular Icon Background matching mockup */}
        <div
          className={cn(
            "w-9 h-9 rounded-full flex items-center justify-center shrink-0",
            iconBgColor,
            iconColor
          )}
        >
          <Icon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
