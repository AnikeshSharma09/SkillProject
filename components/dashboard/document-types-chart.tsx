"use client";

import React from "react";
import { useApp } from "@/lib/store/app-context";

export function DocumentTypesChart() {
  const { documents } = useApp();

  const typeCounts: Record<string, number> = {};
  documents.forEach((d) => {
    typeCounts[d.documentType] = (typeCounts[d.documentType] || 0) + 1;
  });

  const colorMap: Record<string, string> = {
    Invoice: "#3B82F6",
    "Leave Application": "#06B6D4",
    "Purchase Order": "#F59E0B",
    Contract: "#10B981",
    Resume: "#8B5CF6",
    Other: "#EC4899",
  };

  const total = documents.length;
  const categories = Object.keys(typeCounts);

  const data =
    total > 0
      ? categories.map((cat) => ({
          label: cat,
          percentage: Math.round((typeCounts[cat] / total) * 100),
          color: colorMap[cat] || "#94A3B8",
        }))
      : [
          { label: "Invoice", percentage: 0, color: "#3B82F6" },
          { label: "Leave Application", percentage: 0, color: "#06B6D4" },
          { label: "Purchase Order", percentage: 0, color: "#F59E0B" },
          { label: "Contract", percentage: 0, color: "#10B981" },
          { label: "Other", percentage: 0, color: "#EC4899" },
        ];

  // Calculate SVG stroke dashes for donut segments
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  let accumulatedOffset = 0;

  return (
    <div className="clean-card p-6 flex flex-col justify-between h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
          Document Types
        </h3>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 my-auto">
        {/* SVG Donut Chart */}
        <div className="relative w-40 h-40 shrink-0 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
            {/* Background ring */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              fill="transparent"
              stroke="#F1F5F9"
              strokeWidth="16"
              className="dark:stroke-slate-800"
            />
            {total > 0 &&
              data.map((item, idx) => {
                const strokeDash = (item.percentage / 100) * circumference;
                const strokeDashoffset = -accumulatedOffset;
                accumulatedOffset += strokeDash;

                return (
                  <circle
                    key={idx}
                    cx="70"
                    cy="70"
                    r={radius}
                    fill="transparent"
                    stroke={item.color}
                    strokeWidth="16"
                    strokeDasharray={`${strokeDash} ${circumference}`}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-500 hover:opacity-85"
                  />
                );
              })}
          </svg>

          {/* Center Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-lg font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
              {total.toLocaleString()}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">
              Documents
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="grid grid-cols-1 gap-2 w-full text-xs">
          {data.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-slate-600 dark:text-slate-300 font-medium">
                  {item.label}
                </span>
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">
                {item.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
