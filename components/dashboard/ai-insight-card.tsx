import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, TrendingUp } from "lucide-react";

export function AIInsightCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-blue-100 dark:border-blue-900/60 bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-purple-50/50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-purple-950/30 p-6 shadow-xs">
      {/* Subtle decorative background glow */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-gradient-to-br from-blue-400/10 to-purple-500/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1.5 max-w-3xl">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-2xs">
              <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
              AI INSIGHT
            </span>
            <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">
              Autonomous Pipeline Analysis • Just updated
            </span>
          </div>

          <p className="text-base sm:text-lg font-medium text-slate-900 dark:text-slate-100 leading-snug">
            &ldquo;Your workflows processed{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              18% more documents
            </span>{" "}
            this week while reducing manual human review volume by{" "}
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              12%
            </span>
            . Overall classification accuracy reached 98.4%.&rdquo;
          </p>
        </div>

        <Link
          href="/analytics"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xs hover:shadow-md transition-all self-start md:self-auto shrink-0 group"
        >
          <span>View Analytics</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
