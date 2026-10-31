"use client";

import React from "react";
import Link from "next/link";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  ArrowRight,
  ExternalLink,
  Eye,
  Sparkles,
} from "lucide-react";
import { DocumentItem } from "@/types";
import { formatTimeAgo, formatBytes } from "@/lib/utils";

export function RecentDocumentsTable({
  documents,
  onUploadClick,
}: {
  documents: DocumentItem[];
  onUploadClick?: () => void;
}) {
  const getStatusBadge = (status: DocumentItem["status"]) => {
    switch (status) {
      case "COMPLETED":
      case "READY":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 shadow-[0_0_8px_rgba(16,185,129,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Processed
          </span>
        );
      case "REVIEW_REQUIRED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30 shadow-[0_0_8px_rgba(245,158,11,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
            Review Needed
          </span>
        );
      case "PROCESSING":
      case "CLASSIFIED":
      case "EXTRACTING":
      case "WORKFLOW_RUNNING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 shadow-[0_0_8px_rgba(99,102,241,0.2)]">
            <div className="w-2 h-2 border border-indigo-400 border-t-transparent rounded-full animate-spin" />
            Extracting
          </span>
        );
      case "FAILED":
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-500/10 text-rose-400 border border-rose-500/25">
            <XCircle className="w-3 h-3 text-rose-400" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-300">
            {status}
          </span>
        );
    }
  };

  const getConfidenceBadge = (confidence: number, status: string) => {
    if (status === "PROCESSING" || !confidence) {
      return <span className="text-slate-500 font-mono text-xs">—</span>;
    }

    const percentage = Math.round(confidence * 100);
    const isHigh = percentage >= 90;
    const isMed = percentage >= 70 && percentage < 90;

    return (
      <div className="flex items-center gap-2.5">
        <span
          className={`text-xs font-black tabular-nums font-mono ${
            isHigh
              ? "text-emerald-400"
              : isMed
              ? "text-indigo-400"
              : "text-amber-400"
          }`}
        >
          {percentage}%
        </span>
        <div className="w-16 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              isHigh
                ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_#10B981]"
                : isMed
                ? "bg-gradient-to-r from-indigo-500 to-purple-400"
                : "bg-gradient-to-r from-amber-500 to-orange-400"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-[#111827] border border-slate-200/80 dark:border-white/[0.08] shadow-sm overflow-hidden">
      {/* Table Header Strip */}
      <div className="p-5 border-b border-slate-100 dark:border-white/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50/50 dark:bg-black/20">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
              Realtime Ingestion & Pipeline Stream
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              Live
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Active OCR parsing, deterministic rule validation, and approval stage monitoring
          </p>
        </div>

        <Link
          href="/documents"
          className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 flex items-center gap-1 group self-start sm:self-auto"
        >
          <span>All Documents Repository</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* High-Tech Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/80 dark:bg-white/[0.02] text-[10px] font-extrabold text-slate-400 dark:text-slate-500 uppercase tracking-widest border-b border-slate-100 dark:border-white/[0.06]">
            <tr>
              <th className="py-3 px-5">Document Name</th>
              <th className="py-3 px-5">Classification</th>
              <th className="py-3 px-5">Pipeline Status</th>
              <th className="py-3 px-5">Extraction Confidence</th>
              <th className="py-3 px-5">Timestamp</th>
              <th className="py-3 px-5 text-right">Inspect</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
            {documents.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center space-y-2">
                    <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      No documents in pipeline yet
                    </p>
                    <p className="text-xs text-slate-400 max-w-sm">
                      Upload your first document to trigger AI classification, OCR extraction, and rule automation.
                    </p>
                    {onUploadClick ? (
                      <button
                        type="button"
                        onClick={onUploadClick}
                        className="mt-2 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors shadow-sm cursor-pointer"
                      >
                        <span>Upload Documents</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    ) : (
                      <Link
                        href="/documents?action=upload"
                        className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
                      >
                        <span>Upload Documents</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              documents.slice(0, 6).map((doc) => (
              <tr
                key={doc.id}
                className="group hover:bg-slate-50/70 dark:hover:bg-white/[0.03] transition-colors"
              >
                {/* Document Name & Size */}
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-slate-300 group-hover:scale-105 group-hover:border-indigo-500/40 group-hover:text-indigo-400 transition-all">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/documents/${doc.id}`}
                        className="text-xs font-bold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 truncate block max-w-[200px] sm:max-w-xs transition-colors"
                      >
                        {doc.name}
                      </Link>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-mono">
                        <span>{formatBytes(doc.fileSizeBytes)}</span>
                        <span>•</span>
                        <span>{doc.mimeType.split("/")[1]?.toUpperCase() || "PDF"}</span>
                      </div>
                    </div>
                  </div>
                </td>

                {/* Category / Type */}
                <td className="py-3.5 px-5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-bold bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-slate-300">
                    {doc.documentType}
                  </span>
                </td>

                {/* Status Badge */}
                <td className="py-3.5 px-5">{getStatusBadge(doc.status)}</td>

                {/* Confidence */}
                <td className="py-3.5 px-5">
                  {getConfidenceBadge(doc.overallConfidence, doc.status)}
                </td>

                {/* Ingest Time */}
                <td
                  className="py-3.5 px-5 text-xs text-slate-400 font-mono"
                  suppressHydrationWarning
                >
                  {formatTimeAgo(doc.uploadedAt)}
                </td>

                {/* Quick Action Button */}
                <td className="py-3.5 px-5 text-right">
                  <Link
                    href={`/documents/${doc.id}`}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/30 transition-all"
                  >
                    <span>Studio</span>
                    <ExternalLink className="w-3 h-3" />
                  </Link>
                </td>
              </tr>
            )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
