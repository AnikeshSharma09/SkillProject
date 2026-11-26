"use client";

import React, { useState } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  CheckCircle2,
  XCircle,
  Clock,
  AlertCircle,
  FileText,
  DollarSign,
  User,
  ShieldCheck,
  Check,
  X,
  Eye,
  MessageSquare,
  Sparkles,
  CreditCard,
  ArrowUpRight,
} from "lucide-react";
import { useApp } from "@/lib/store/app-context";
import { ApprovalTask, ApprovalStatus } from "@/types";
import { formatCurrency, formatTimeAgo } from "@/lib/utils";

export default function ApprovalsPage() {
  const { currentUser, approvals, approveTask, rejectTask, clearApprovals } = useApp();

  const [activeTab, setActiveTab] = useState<ApprovalStatus | "ALL">("PENDING");
  const [selectedTask, setSelectedTask] = useState<ApprovalTask | null>(null);
  const [modalAction, setModalAction] = useState<"APPROVE" | "REJECT" | null>(null);
  const [decisionComment, setDecisionComment] = useState("");

  const pendingCount = approvals.filter((a) => a.status === "PENDING").length;
  const approvedCount = approvals.filter((a) => a.status === "APPROVED").length;
  const rejectedCount = approvals.filter((a) => a.status === "REJECTED").length;

  const filteredApprovals = approvals.filter((task) => {
    if (activeTab === "ALL") return true;
    return task.status === activeTab;
  });

  const handleOpenModal = (task: ApprovalTask, action: "APPROVE" | "REJECT") => {
    setSelectedTask(task);
    setModalAction(action);
    setDecisionComment(
      action === "APPROVE"
        ? "Verified and approved in accordance with operational budget."
        : "Discrepancy identified. Rejected."
    );
  };

  const handleConfirmDecision = () => {
    if (!selectedTask || !modalAction) return;

    if (modalAction === "APPROVE") {
      approveTask(selectedTask.id, decisionComment);
      // Trigger subtle celebration confetti
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 },
        });
      } catch (e) {
        // fallback if canvas not available
      }
    } else {
      rejectTask(selectedTask.id, decisionComment);
    }

    setSelectedTask(null);
    setModalAction(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Approval Management
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deterministic business authorization queue with role-based sign-offs
          </p>
        </div>

        {/* Current user role info badge & queue controls */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          {approvals.length > 0 && (
            <button
              onClick={() => {
                if (confirm("Reset and purge all approval queue items?")) {
                  clearApprovals();
                }
              }}
              className="text-xs text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-800 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 transition-all font-medium"
            >
              Reset Queue
            </button>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-900/60 text-xs text-blue-700 dark:text-blue-300">
            <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span>
              Signing as: <strong>{currentUser.fullName}</strong> ({currentUser.role})
            </span>
          </div>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        {[
          { key: "PENDING", label: "Pending Signoff", count: pendingCount },
          { key: "APPROVED", label: "Approved", count: approvedCount },
          { key: "REJECTED", label: "Rejected", count: rejectedCount },
          { key: "ALL", label: "All Records", count: approvals.length },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
              activeTab === tab.key
                ? "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs"
                : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                activeTab === tab.key
                  ? "bg-white/20 text-white dark:bg-slate-900/20 dark:text-slate-900"
                  : "bg-slate-200/60 dark:bg-slate-800 text-slate-600 dark:text-slate-400"
              }`}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* Approvals Grid */}
      {filteredApprovals.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
          <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
            No approvals in &quot;{activeTab}&quot; status
          </h2>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            You&apos;re completely up to date. Workflows will route new tasks here when conditions trigger.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredApprovals.map((task) => (
            <div
              key={task.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Header: Document type and status badge */}
                <div className="flex items-center justify-between gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                    {task.documentType}
                  </span>

                  {task.status === "PENDING" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-md">
                      <Clock className="w-3 h-3" />
                      Pending
                    </span>
                  ) : task.status === "APPROVED" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-md">
                      <CheckCircle2 className="w-3 h-3" />
                      Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-md">
                      <XCircle className="w-3 h-3" />
                      Rejected
                    </span>
                  )}
                </div>

                {/* Title & Description */}
                <div className="mt-3">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 line-clamp-1">
                    {task.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {task.description}
                  </p>
                </div>

                {/* Amount Highlight */}
                {task.amount !== undefined && (
                  <div className="mt-4 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    <span className="text-xs text-slate-500">Authorized Value:</span>
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      {formatCurrency(task.amount, task.currency)}
                    </span>
                  </div>
                )}

                {/* Metadata */}
                <div className="mt-3 space-y-1 text-xs text-slate-500">
                  <div className="flex items-center justify-between">
                    <span>Vendor / Applicant:</span>
                    <strong className="text-slate-800 dark:text-slate-200 truncate max-w-[140px]">
                      {task.vendorOrRequester}
                    </strong>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Required Role:</span>
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      {task.requiredRole}
                    </span>
                  </div>
                  {task.decidedBy && (
                    <div className="flex items-center justify-between pt-1 border-t border-slate-100 dark:border-slate-800">
                      <span>Decided by:</span>
                      <strong className="text-slate-700 dark:text-slate-300">{task.decidedBy}</strong>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <Link
                  href={`/documents/${task.documentId}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </Link>

                {task.status === "APPROVED" && (
                  <Link
                    href="/payments"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/40 border border-emerald-200 dark:border-emerald-800 transition-colors"
                  >
                    <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Disburse Payout</span>
                  </Link>
                )}

                {task.status === "PENDING" && (
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenModal(task, "REJECT")}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => handleOpenModal(task, "APPROVE")}
                      className="px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Approve</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      {selectedTask && modalAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs"
            onClick={() => setSelectedTask(null)}
          />

          <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                {modalAction === "APPROVE" ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600" />
                )}
                <span>
                  {modalAction === "APPROVE" ? "Confirm Approval" : "Confirm Rejection"}
                </span>
              </h3>
              <button
                onClick={() => setSelectedTask(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600 dark:text-slate-400">
              <p>
                <strong>Task:</strong> {selectedTask.title}
              </p>
              {selectedTask.amount && (
                <p>
                  <strong>Amount:</strong>{" "}
                  {formatCurrency(selectedTask.amount, selectedTask.currency)}
                </p>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Audit Decision Comment
              </label>
              <textarea
                value={decisionComment}
                onChange={(e) => setDecisionComment(e.target.value)}
                rows={3}
                className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                placeholder="Enter justification for the audit trail..."
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedTask(null)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDecision}
                className={`px-5 py-2 rounded-xl text-xs font-semibold text-white shadow-xs transition-colors ${
                  modalAction === "APPROVE"
                    ? "bg-emerald-600 hover:bg-emerald-700"
                    : "bg-rose-600 hover:bg-rose-700"
                }`}
              >
                {modalAction === "APPROVE" ? "Confirm & Authorize" : "Reject Task"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
