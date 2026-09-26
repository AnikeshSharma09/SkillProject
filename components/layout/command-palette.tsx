"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Sparkles,
  UploadCloud,
  GitFork,
  CheckCircle2,
  BarChart3,
  Settings,
  FileText,
  Sun,
  Moon,
  ShieldCheck,
  X,
} from "lucide-react";
import { useApp } from "@/lib/store/app-context";

export function CommandPalette() {
  const router = useRouter();
  const {
    isCommandPaletteOpen,
    setIsCommandPaletteOpen,
    documents,
    theme,
    toggleTheme,
    currentUser,
    setCurrentUser,
    availableUsers,
  } = useApp();

  const [search, setSearch] = useState("");

  if (!isCommandPaletteOpen) return null;

  const actions = [
    {
      id: "search-docs",
      label: "Search Documents Repository",
      description: "Jump to document list and search metadata",
      icon: Search,
      category: "Documents",
      onSelect: () => router.push("/documents"),
    },
    {
      id: "upload-doc",
      label: "Upload Document",
      description: "Upload invoices, receipts, leave forms, or contracts",
      icon: UploadCloud,
      category: "Documents",
      onSelect: () => router.push("/documents?action=upload"),
    },
    {
      id: "ask-ai",
      label: "Ask AI Assistant (RAG)",
      description: "Query document intelligence across all parsed data",
      icon: Sparkles,
      category: "AI",
      onSelect: () => router.push("/assistant"),
    },
    {
      id: "create-wf",
      label: "Open Visual Workflow Canvas",
      description: "Create or edit node-based automated pipelines",
      icon: GitFork,
      category: "Workflows",
      onSelect: () => router.push("/workflows/builder"),
    },
    {
      id: "generate-wf",
      label: "Generate Workflow from Natural Language",
      description: "Describe rules in English and let AI build the DAG",
      icon: Sparkles,
      category: "Workflows",
      onSelect: () => router.push("/workflows?tab=generator"),
    },
    {
      id: "view-approvals",
      label: "View Pending Approvals",
      description: "Sign off on pending invoices and exceptions",
      icon: CheckCircle2,
      category: "Approvals",
      onSelect: () => router.push("/approvals"),
    },
    {
      id: "analytics",
      label: "Open Analytics Dashboard",
      description: "Inspect throughput, automation rates, and accuracy",
      icon: BarChart3,
      category: "System",
      onSelect: () => router.push("/analytics"),
    },
    {
      id: "settings",
      label: "Organization & Threshold Settings",
      description: "Configure confidence floors and team RBAC",
      icon: Settings,
      category: "System",
      onSelect: () => router.push("/settings"),
    },
    {
      id: "toggle-theme",
      label: `Switch to ${theme === "light" ? "Dark" : "Light"} Mode`,
      description: "Toggle UI theme mode",
      icon: theme === "light" ? Moon : Sun,
      category: "Preferences",
      onSelect: toggleTheme,
    },
  ];

  // Filter actions & documents by search query
  const filteredActions = actions.filter(
    (a) =>
      a.label.toLowerCase().includes(search.toLowerCase()) ||
      a.description.toLowerCase().includes(search.toLowerCase()) ||
      a.category.toLowerCase().includes(search.toLowerCase())
  );

  const matchedDocuments = documents
    .filter(
      (d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.documentType.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 4);

  const handleSelect = (callback: () => void) => {
    callback();
    setIsCommandPaletteOpen(false);
    setSearch("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
        onClick={() => setIsCommandPaletteOpen(false)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-10 animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-slate-400 dark:text-slate-500 shrink-0" />
          <input
            type="text"
            placeholder="Type a command or search documents (Ctrl+K)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
            className="w-full bg-transparent px-3 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
          />
          <button
            onClick={() => setIsCommandPaletteOpen(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="max-h-[380px] overflow-y-auto p-2 space-y-4">
          {/* Matched Documents */}
          {matchedDocuments.length > 0 && search.length > 0 && (
            <div>
              <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Matching Documents
              </div>
              <div className="space-y-1 mt-1">
                {matchedDocuments.map((doc) => (
                  <button
                    key={doc.id}
                    onClick={() => handleSelect(() => router.push(`/documents/${doc.id}`))}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {doc.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {doc.documentType} • Confidence: {(doc.overallConfidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-slate-400 group-hover:translate-x-0.5 transition-transform">
                      Open →
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div>
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Navigation & Actions
            </div>
            <div className="space-y-1 mt-1">
              {filteredActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    onClick={() => handleSelect(action.onSelect)}
                    className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 text-left transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:bg-blue-50 dark:group-hover:bg-blue-950/60 transition-colors">
                        <Icon className="w-4 h-4 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-blue-400" />
                      </div>
                      <div>
                        <div className="text-sm font-medium text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {action.label}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400">
                          {action.description}
                        </div>
                      </div>
                    </div>
                    <span className="text-[11px] font-medium text-slate-400 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                      {action.category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Switch Role Quick Actions */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
            <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
              Switch Simulation Role (RBAC)
            </div>
            <div className="grid grid-cols-2 gap-1 mt-1 px-1">
              {availableUsers.map((u) => (
                <button
                  key={u.id}
                  onClick={() => handleSelect(() => setCurrentUser(u))}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs text-left transition-colors ${
                    currentUser.id === u.id
                      ? "bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 font-semibold border border-blue-200 dark:border-blue-900"
                      : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                  <span className="truncate">
                    {u.fullName} ({u.role})
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
              ↑↓
            </kbd>
            <span>Select:</span>
            <kbd className="px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
              Enter
            </kbd>
          </div>
          <div>
            <kbd className="px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-mono text-[10px]">
              Esc
            </kbd>{" "}
            to close
          </div>
        </div>
      </div>
    </div>
  );
}
