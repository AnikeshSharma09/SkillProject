import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, BarChart2 } from "lucide-react";

export function AIInsightCard() {
  return (
    <div className="clean-card p-6 relative overflow-hidden flex flex-col justify-between h-full bg-gradient-to-br from-white via-indigo-50/20 to-blue-50/30 dark:from-[#111827] dark:to-[#1A2234]">
      {/* Top Header with AI Insight pill and Bar Chart icon */}
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-[#F3E8FF] dark:bg-purple-950/60 text-[#7C3AED] dark:text-purple-300">
          <Sparkles className="w-3 h-3 text-[#7C3AED]" />
          <span>AI INSIGHT</span>
        </div>

        <div className="p-2 rounded-xl bg-blue-50 dark:bg-slate-800 text-blue-600 dark:text-blue-400">
          <BarChart2 className="w-4 h-4" />
        </div>
      </div>

      {/* Main Insight Text matching mockup */}
      <div className="relative z-10 space-y-4 my-auto">
        <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 leading-snug">
          Your workflows processed{" "}
          <strong className="text-slate-900 dark:text-white font-extrabold">18% more documents</strong>{" "}
          this week while reducing manual review by{" "}
          <strong className="text-slate-900 dark:text-white font-extrabold">12%</strong>.
        </p>

        <div>
          <Link
            href="/analytics"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white btn-primary-gradient transition-all"
          >
            <span>View Analytics</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Decorative Wave at Bottom Right matching mockup */}
      <div className="absolute -bottom-2 -right-4 w-64 h-28 pointer-events-none opacity-40 dark:opacity-20">
        <svg viewBox="0 0 200 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <path
            d="M0 60C40 20 80 70 120 40C160 10 180 50 200 30V80H0V60Z"
            fill="url(#wave-gradient)"
          />
          <defs>
            <linearGradient id="wave-gradient" x1="0" y1="0" x2="200" y2="80" gradientUnits="userSpaceOnUse">
              <stop stopColor="#3B82F6" stopOpacity="0.8" />
              <stop offset="1" stopColor="#8B5CF6" stopOpacity="0.4" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}
