import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Zap, TrendingUp } from "lucide-react";

export function AIInsightCard() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-indigo-500/30 bg-gradient-to-r from-indigo-950/40 via-purple-950/30 to-cyan-950/20 p-6 shadow-xl backdrop-blur-xl">
      {/* Decorative gradient radial orbs */}
      <div className="absolute -top-16 -right-16 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="space-y-2 max-w-3xl">
          <div className="flex items-center gap-2.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/40 shadow-[0_0_12px_rgba(99,102,241,0.25)]">
              <Sparkles className="w-3 h-3 text-cyan-400" />
              NEURAL OPTIMIZATION TELEMETRY
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Confidence Index: 99.4%
            </span>
          </div>

          <p className="text-sm sm:text-base font-medium text-slate-900 dark:text-slate-100 leading-relaxed">
            &ldquo;Autonomous workflows processed{" "}
            <span className="font-bold text-indigo-600 dark:text-indigo-400 underline decoration-indigo-400/40 underline-offset-2">
              18% more documents
            </span>{" "}
            this week while reducing manual human review volume by{" "}
            <span className="font-bold text-purple-600 dark:text-purple-400 underline decoration-purple-400/40 underline-offset-2">
              12%
            </span>
            . Python deterministic rule engine rejected 0 valid records.&rdquo;
          </p>
        </div>

        <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
          <Link
            href="/analytics"
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-indigo-500/30 transition-all active:scale-[0.98] group"
          >
            <span>Model Analytics</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
}
