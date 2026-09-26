"use client";

import React from "react";
import Link from "next/link";
import {
  CheckSquare,
  Clock,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  GitFork,
  FileText,
} from "lucide-react";
import { useApp } from "@/lib/store/app-context";
import { formatTimeAgo, formatCurrency } from "@/lib/utils";

export default function TasksPage() {
  const { documents, approvals } = useApp();

  const reviewTasks = documents.filter((d) => d.status === "REVIEW_REQUIRED");
  const pendingApprovals = approvals.filter((a) => a.status === "PENDING");

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Operational Tasks
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Active human review exceptions and authorization checkpoints
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Human Review Tasks */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-amber-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Human Review Tasks ({reviewTasks.length})
              </h2>
            </div>
            <Link
              href="/review"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>Review Workspace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {reviewTasks.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              No low-confidence documents currently waiting for review.
            </p>
          ) : (
            <div className="space-y-3">
              {reviewTasks.map((doc) => (
                <div
                  key={doc.id}
                  className="p-3.5 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/30 dark:bg-amber-950/20 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {doc.name}
                    </p>
                    <p className="text-[11px] text-amber-700 dark:text-amber-400">
                      Confidence: {(doc.overallConfidence * 100).toFixed(0)}% • Category: {doc.documentType}
                    </p>
                  </div>
                  <Link
                    href={`/review?id=${doc.id}`}
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-2xs shrink-0"
                  >
                    Verify →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pending Approvals */}
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Pending Approvals ({pendingApprovals.length})
              </h2>
            </div>
            <Link
              href="/approvals"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {pendingApprovals.length === 0 ? (
            <p className="text-xs text-slate-400 py-4 text-center">
              All approval queues are clear.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingApprovals.map((task) => (
                <div
                  key={task.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 flex items-center justify-between gap-3"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {task.title}
                    </p>
                    <p className="text-[11px] text-slate-500">
                      {task.amount ? formatCurrency(task.amount, task.currency) : "Signoff"} • Role: {task.requiredRole}
                    </p>
                  </div>
                  <Link
                    href="/approvals"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-2xs shrink-0"
                  >
                    Decide →
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
