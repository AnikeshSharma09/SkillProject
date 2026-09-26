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
} from "lucide-react";
import { useApp } from "@/lib/store/app-context";
import { MetricCard } from "@/components/dashboard/metric-card";
import { AIInsightCard } from "@/components/dashboard/ai-insight-card";
import { RecentDocumentsTable } from "@/components/dashboard/recent-documents-table";

export default function DashboardPage() {
  const { currentUser, documents, approvals } = useApp();

  const pendingApprovals = approvals.filter((a) => a.status === "PENDING");
  const reviewRequiredDocs = documents.filter((d) => d.status === "REVIEW_REQUIRED");

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Good morning, {currentUser.fullName.split(" ")[0]}
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here&apos;s what&apos;s happening with your intelligent workflows today.
          </p>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="/documents?action=upload"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs hover:shadow-md transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Document</span>
          </Link>

          <Link
            href="/workflows/builder"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 shadow-2xs transition-all active:scale-[0.98]"
          >
            <GitFork className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Create Workflow</span>
          </Link>
        </div>
      </div>

      {/* Action Required Banner if Low Confidence / Approvals */}
      {(reviewRequiredDocs.length > 0 || pendingApprovals.length > 0) && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/60 text-amber-900 dark:text-amber-200">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-700 dark:text-amber-400">
                Action Items Detected
              </p>
              <p className="text-sm font-medium">
                {pendingApprovals.length} approval tasks pending •{" "}
                {reviewRequiredDocs.length} documents require human review
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {reviewRequiredDocs.length > 0 && (
              <Link
                href="/review"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-slate-900 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800 hover:bg-amber-100/50 transition-colors"
              >
                Review Items ({reviewRequiredDocs.length})
              </Link>
            )}
            {pendingApprovals.length > 0 && (
              <Link
                href="/approvals"
                className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 hover:bg-amber-700 text-white transition-colors"
              >
                Go to Approvals ({pendingApprovals.length})
              </Link>
            )}
          </div>
        </div>
      )}

      {/* 4 Metric Cards */}
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

      {/* AI Insight Card */}
      <AIInsightCard />

      {/* Recent Documents Live Pipeline Table */}
      <RecentDocumentsTable documents={documents} />
    </div>
  );
}
