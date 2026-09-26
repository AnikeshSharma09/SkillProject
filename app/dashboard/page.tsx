"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  Zap,
  CheckCircle2,
  Clock,
  Plus,
  GitFork,
  ArrowRight,
  ShieldAlert,
  Sparkles,
  Bot,
  Activity,
  Layers,
  ArrowUpRight,
} from "lucide-react";
import { useApp } from "@/lib/store/app-context";
import { MetricCard } from "@/components/dashboard/metric-card";
import { AIInsightCard } from "@/components/dashboard/ai-insight-card";
import { RecentDocumentsTable } from "@/components/dashboard/recent-documents-table";
import { PipelineLifecycleTracker } from "@/components/dashboard/pipeline-lifecycle-tracker";

export default function DashboardPage() {
  const { currentUser, documents, approvals } = useApp();

  const pendingApprovals = approvals.filter((a) => a.status === "PENDING");
  const reviewRequiredDocs = documents.filter((d) => d.status === "REVIEW_REQUIRED");

  return (
    <div className="space-y-7 animate-in fade-in duration-300">
      {/* Hero Welcome & Autonomous Operations Bar */}
      <div className="relative rounded-2xl glass-surface-elevated dark:bg-[#0D1322]/90 border border-slate-200/80 dark:border-white/[0.08] p-6 sm:p-7 shadow-xl overflow-hidden">
        {/* Luminous background gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-[0_0_12px_rgba(99,102,241,0.2)]">
                <Sparkles className="w-3 h-3 text-cyan-400 animate-spin" />
                AUTONOMOUS DOCUMENT OS
              </span>
              <span className="text-xs text-slate-400 font-medium">
                • {currentUser.organizationName}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Command Center, {currentUser.fullName.split(" ")[0]}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
              Real-time ingestion pipelines, deterministic Python rule evaluations,
              and multi-tier approval gates are currently operational with zero anomalies.
            </p>
          </div>

          {/* High-Impact Action Dock */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/documents?action=upload"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-500 via-purple-600 to-indigo-700 hover:from-indigo-600 hover:to-purple-700 shadow-lg hover:shadow-indigo-500/30 transition-all active:scale-[0.98]"
            >
              <Plus className="w-4 h-4" />
              <span>Ingest Document</span>
            </Link>

            <Link
              href="/workflows/builder"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white/80 dark:bg-white/[0.05] border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.09] shadow-xs transition-all active:scale-[0.98]"
            >
              <GitFork className="w-4 h-4 text-purple-400" />
              <span>Visual Workflow</span>
            </Link>

            <Link
              href="/assistant"
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold text-cyan-500 dark:text-cyan-400 bg-cyan-500/10 border border-cyan-500/30 hover:bg-cyan-500/20 shadow-xs transition-all active:scale-[0.98]"
            >
              <Bot className="w-4 h-4" />
              <span>Ask RAG</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Action Required Banner if Low Confidence / Pending Approvals */}
      {(reviewRequiredDocs.length > 0 || pendingApprovals.length > 0) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-900 dark:text-amber-200 shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-wider text-amber-500 dark:text-amber-400">
                Action Items Pending Deterministic Verification
              </p>
              <p className="text-xs sm:text-sm font-semibold text-slate-900 dark:text-slate-100">
                {pendingApprovals.length} signoff requests awaiting authorization •{" "}
                {reviewRequiredDocs.length} documents below 70% threshold
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            {reviewRequiredDocs.length > 0 && (
              <Link
                href="/review"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-white dark:bg-[#111728] text-amber-500 border border-amber-500/40 hover:bg-amber-500/10 transition-colors"
              >
                Review Items ({reviewRequiredDocs.length})
              </Link>
            )}
            {pendingApprovals.length > 0 && (
              <Link
                href="/approvals"
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-colors"
              >
                Approvals ({pendingApprovals.length})
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 5-Stage Autonomous Pipeline Lifecycle Tracker */}
      <PipelineLifecycleTracker documents={documents} />

      {/* 4 Elevated Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Documents Processed"
          value="2,481"
          change="18.4%"
          trend="up"
          trendType="positive"
          icon={FileText}
          description="Total documents parsed this month"
        />

        <MetricCard
          title="Automation Rate"
          value="91.4%"
          change="6.2%"
          trend="up"
          trendType="positive"
          icon={Zap}
          description="Processed without human intervention"
        />

        <MetricCard
          title="Pending Approvals"
          value={String(pendingApprovals.length || 27)}
          change="12.8%"
          trend="down"
          trendType="positive"
          icon={CheckCircle2}
          description="Awaiting department signoff"
        />

        <MetricCard
          title="Avg. Processing Time"
          value="3.8 sec"
          change="24.1%"
          trend="down"
          trendType="positive"
          icon={Clock}
          description="End-to-end OCR and extraction"
        />
      </div>

      {/* AI Strategic Insight Card */}
      <AIInsightCard />

      {/* Recent Documents Realtime Table */}
      <RecentDocumentsTable documents={documents} />
    </div>
  );
}
