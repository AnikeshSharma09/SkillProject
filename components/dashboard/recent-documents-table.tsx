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
} from "lucide-react";
import { DocumentItem } from "@/types";
import { formatTimeAgo, formatBytes } from "@/lib/utils";

export function RecentDocumentsTable({
  documents,
}: {
  documents: DocumentItem[];
}) {
  const getStatusBadge = (status: DocumentItem["status"]) => {
    switch (status) {
      case "COMPLETED":
      case "READY":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Processed
          </span>
        );
      case "REVIEW_REQUIRED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            Review Required
          </span>
        );
      case "PROCESSING":
      case "CLASSIFIED":
      case "EXTRACTING":
      case "WORKFLOW_RUNNING":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800 animate-pulse">
            <Clock className="w-3 h-3 text-blue-500" />
            Processing
          </span>
        );
      case "FAILED":
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800">
            <XCircle className="w-3 h-3 text-rose-500" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  const getConfidenceBadge = (confidence: number, status: string) => {
    if (status === "PROCESSING" || !confidence) {
      return <span className="text-slate-400 font-mono text-xs">—</span>;
    }

    const percentage = Math.round(confidence * 100);
    const isHigh = percentage >= 90;
    const isMed = percentage >= 70 && percentage < 90;

    return (
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-bold tabular-nums ${
            isHigh
              ? "text-emerald-600 dark:text-emerald-400"
              : isMed
              ? "text-blue-600 dark:text-blue-400"
              : "text-amber-600 dark:text-amber-400"
          }`}
        >
          {percentage}%
        </span>
        <div className="w-16 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden hidden sm:block">
          <div
            className={`h-full rounded-full ${
              isHigh
                ? "bg-emerald-500"
                : isMed
                ? "bg-blue-500"
                : "bg-amber-500"
            }`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            Recent Documents
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Realtime ingestion, OCR parsing, and classification pipeline status
          </p>
        </div>

        <Link
          href="/documents"
          className="text-xs font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center gap-1 group"
        >
          <span>View All Documents</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
            <tr>
              <th className="py-3 px-5">Document</th>
              <th className="py-3 px-5">Type</th>
              <th className="py-3 px-5">Status</th>
              <th className="py-3 px-5">Confidence</th>
              <th className="py-3 px-5">Uploaded</th>
              <th className="py-3 px-5 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {documents.slice(0, 7).map((doc) => (
              <tr
                key={doc.id}
                className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
              >
                <td className="py-3.5 px-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center shrink-0">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="min-w-0">
                      <Link
                        href={`/documents/${doc.id}`}
                        className="font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block truncate max-w-[200px] sm:max-w-xs"
                      >
                        {doc.name}
                      </Link>
                      <div className="text-[11px] text-slate-400">
                        {formatBytes(doc.fileSizeBytes)} • {doc.pageCount} pg
                      </div>
                    </div>
                  </div>
                </td>

                <td className="py-3.5 px-5">
                  <span className="inline-block text-xs font-medium text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                    {doc.documentType}
                  </span>
                </td>

                <td className="py-3.5 px-5">{getStatusBadge(doc.status)}</td>

                <td className="py-3.5 px-5">
                  {getConfidenceBadge(doc.overallConfidence, doc.status)}
                </td>

                <td className="py-3.5 px-5 text-xs text-slate-500 dark:text-slate-400">
                  {formatTimeAgo(doc.uploadedAt)}
                </td>

                <td className="py-3.5 px-5 text-right">
                  {doc.status === "REVIEW_REQUIRED" ? (
                    <Link
                      href={`/review?id=${doc.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-2xs transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      Review Now
                    </Link>
                  ) : (
                    <Link
                      href={`/documents/${doc.id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                    >
                      <span>Inspect</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
