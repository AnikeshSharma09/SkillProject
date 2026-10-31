"use client";

import React, { useState } from "react";
import {
  Sliders,
  ShieldCheck,
  Building2,
  Key,
  Copy,
  Check,
  UserPlus,
  Users,
  Save,
  Database,
  Sparkles,
  Trash2,
} from "lucide-react";
import { useApp } from "@/lib/store/app-context";

export default function SettingsPage() {
  const {
    currentUser,
    availableUsers,
    setCurrentUser,
    seedDemoData,
    resetAllData,
    documents,
  } = useApp();

  const [confidenceThreshold, setConfidenceThreshold] = useState(70);
  const [autoApprovalThreshold, setAutoApprovalThreshold] = useState(90);
  const [copiedKey, setCopiedKey] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [dataMessage, setDataMessage] = useState<string | null>(null);

  const mockApiKey = "ak_live_a1f79bc8429188e99120489";

  const handleSeed = () => {
    seedDemoData();
    setDataMessage("Sample enterprise dataset loaded successfully! (5 documents, 2 approvals)");
    setTimeout(() => setDataMessage(null), 3500);
  };

  const handleReset = () => {
    resetAllData();
    setDataMessage("Workspace cleared to 0 documents and clean slate.");
    setTimeout(() => setDataMessage(null), 3500);
  };

  const handleCopyKey = () => {
    navigator.clipboard.writeText(mockApiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSaveSettings = () => {
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-200">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Organization & Policy Settings
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Configure AI confidence boundaries, automated routing rules, team RBAC, and API keys
        </p>
      </div>

      {/* Section 1: AI Confidence & Human Review Thresholds (Section 21) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-6">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-purple-50 dark:bg-purple-950/60 flex items-center justify-center text-purple-600 dark:text-purple-400">
            <Sliders className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              AI Confidence Scoring Floors (Section 21)
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Determine when documents automatically proceed vs trigger Human-in-the-Loop review
            </p>
          </div>
        </div>

        <div className="space-y-6 max-w-xl">
          {/* Human Review Floor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Human Review Threshold (&lt; {confidenceThreshold}%)
              </label>
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                {confidenceThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="85"
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
            />
            <p className="text-[11px] text-slate-400">
              Any document with composite confidence below this score is immediately routed to the Human Review Queue.
            </p>
          </div>

          {/* Auto Process Ceiling */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Automatic Straight-Through Processing (&ge; {autoApprovalThreshold}%)
              </label>
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
                {autoApprovalThreshold}%
              </span>
            </div>
            <input
              type="range"
              min="85"
              max="98"
              value={autoApprovalThreshold}
              onChange={(e) => setAutoApprovalThreshold(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-emerald-500"
            />
            <p className="text-[11px] text-slate-400">
              Documents meeting or exceeding this certainty bypass preliminary checks and enter the deterministic DAG.
            </p>
          </div>
        </div>
      </div>

      {/* Section 2: Team Members & RBAC (Section 40) */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Team Role-Based Access Control (RBAC)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Enforcing strict authorization across Admin, Manager, Approver, and Employee roles
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Member</th>
                <th className="py-2.5 px-4">Email</th>
                <th className="py-2.5 px-4">Assigned Role</th>
                <th className="py-2.5 px-4 text-right">Switch Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {availableUsers.map((user) => (
                <tr key={user.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                  <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                    <img
                      src={user.avatarUrl}
                      alt={user.fullName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span>{user.fullName}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-500">{user.email}</td>
                  <td className="py-3 px-4">
                    <span className="font-semibold px-2 py-0.5 rounded-full text-[10px] bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200">
                      {user.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {currentUser.id === user.id ? (
                      <span className="text-[11px] font-bold text-emerald-600">
                        Current Session
                      </span>
                    ) : (
                      <button
                        onClick={() => setCurrentUser(user)}
                        className="px-2.5 py-1 rounded-lg text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                      >
                        Simulate Role
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 3: Developer API Keys */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/60 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              API Access & Secret Tokens
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Programmatic ingestion and webhook endpoint authorization
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 max-w-lg">
          <input
            type="text"
            readOnly
            value={mockApiKey}
            className="flex-1 px-3 py-2 text-xs font-mono rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
          />
          <button
            onClick={handleCopyKey}
            className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors"
            title="Copy API Key"
          >
            {copiedKey ? (
              <Check className="w-4 h-4 text-emerald-500" />
            ) : (
              <Copy className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      {/* Section 4: Workspace State & Sample Datasets */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 sm:p-8 space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
            <Database className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Workspace State & Demo Data
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Manage your local workspace persistence, test datasets, and blank slate resets
            </p>
          </div>
        </div>

        <div className="space-y-4 max-w-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/70 dark:border-slate-700/60">
            <div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Current Workspace Count
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {documents.length} document{documents.length === 1 ? "" : "s"} currently saved and persisted in browser storage.
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleSeed}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 border border-indigo-200 dark:border-indigo-800 transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Load Sample Data</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/50 border border-rose-200 dark:border-rose-800 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All (Reset)</span>
              </button>
            </div>
          </div>

          {dataMessage && (
            <div className="text-xs font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-200 dark:border-emerald-800/60 flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-500" />
              <span>{dataMessage}</span>
            </div>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end gap-3 pt-2">
        {saveSuccess && (
          <span className="text-xs font-semibold text-emerald-600">
            Settings saved successfully!
          </span>
        )}
        <button
          onClick={handleSaveSettings}
          className="px-6 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>
    </div>
  );
}
