"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  History,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Upload,
  Archive,
  Mail,
  GitFork,
  Sparkles,
  User,
  ShieldCheck,
  Search,
  Filter,
} from "lucide-react";
import { useApp } from "@/lib/store/app-context";
import { AuditLogItem } from "@/types";
import { formatTimeAgo } from "@/lib/utils";

export default function AuditLogsPage() {
  const { auditLogs } = useApp();
  const [filterEntity, setFilterEntity] = useState<string>("ALL");
  const [search, setSearch] = useState("");

  const filteredLogs = auditLogs.filter((log) => {
    const matchesEntity = filterEntity === "ALL" || log.entityType === filterEntity;
    const matchesSearch =
      log.action.toLowerCase().includes(search.toLowerCase()) ||
      log.detail.toLowerCase().includes(search.toLowerCase()) ||
      log.actor.name.toLowerCase().includes(search.toLowerCase()) ||
      (log.documentName && log.documentName.toLowerCase().includes(search.toLowerCase()));

    return matchesEntity && matchesSearch;
  });

  const getActionIcon = (action: string) => {
    if (action.includes("UPLOAD")) return <Upload className="w-4 h-4 text-blue-500" />;
    if (action.includes("EXTRACT")) return <Sparkles className="w-4 h-4 text-purple-500" />;
    if (action.includes("APPROV")) return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (action.includes("REJECT")) return <AlertTriangle className="w-4 h-4 text-rose-500" />;
    if (action.includes("ARCHIVE")) return <Archive className="w-4 h-4 text-slate-500" />;
    if (action.includes("WORKFLOW")) return <GitFork className="w-4 h-4 text-indigo-500" />;
    return <FileText className="w-4 h-4 text-blue-500" />;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Security & Audit Trail
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Cryptographically referenced immutable timeline of all approvals, extractions, corrections, and archival events
        </p>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search audit records by actor, action or doc..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 focus:outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-400">Entity:</span>
          <select
            aria-label="Filter by Entity"
            value={filterEntity}
            onChange={(e) => setFilterEntity(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="ALL">All Entities</option>
            <option value="DOCUMENT">Documents</option>
            <option value="APPROVAL">Approvals</option>
            <option value="WORKFLOW">Workflows</option>
            <option value="RULE">Rules</option>
          </select>
        </div>
      </div>

      {/* Timeline (Section 37) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="relative border-l-2 border-slate-100 dark:border-slate-800 ml-3 space-y-8">
          {filteredLogs.map((log) => {
            const timeStr = new Date(log.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div key={log.id} className="relative pl-7 group">
                {/* Node icon dot */}
                <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center shadow-2xs group-hover:scale-110 transition-transform">
                  {getActionIcon(log.action)}
                </div>

                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                      {timeStr}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                      {log.action.replace(/_/g, " ")}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {log.entityType}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {log.detail}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <User className="w-3 h-3 text-slate-400" />
                      <strong>{log.actor.name}</strong> ({log.actor.role})
                    </span>

                    {log.documentName && log.documentId && (
                      <Link
                        href={`/documents/${log.documentId}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-medium"
                      >
                        <FileText className="w-3 h-3" />
                        <span>{log.documentName}</span>
                      </Link>
                    )}

                    <span suppressHydrationWarning>{formatTimeAgo(log.timestamp)}</span>
                  </div>

                  {/* Diff view if recorded */}
                  {log.diff && (
                    <div className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-700 dark:text-slate-300">
                      <span className="text-slate-400 font-semibold uppercase text-[10px] block mb-1">
                        State Transition Diff:
                      </span>
                      <pre className="overflow-x-auto">
                        {JSON.stringify(log.diff, null, 2)}
                      </pre>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
