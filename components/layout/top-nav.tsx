"use client";

import React from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  Sun,
  Moon,
  Building2,
  Sparkles,
  Command,
  ChevronDown,
} from "lucide-react";
import { useApp } from "@/lib/store/app-context";
import { NotificationPopover } from "./notification-popover";

export function TopNav() {
  const pathname = usePathname();
  const {
    currentUser,
    theme,
    toggleTheme,
    setIsCommandPaletteOpen,
  } = useApp();

  // Determine dynamic title based on path
  const getPageTitle = () => {
    if (pathname === "/" || pathname === "/dashboard") return "Overview";
    if (pathname.startsWith("/documents/")) return "Document Intelligence";
    if (pathname.startsWith("/documents")) return "Documents Repository";
    if (pathname.startsWith("/review")) return "Human Review Queue";
    if (pathname.startsWith("/assistant")) return "AI Document Assistant";
    if (pathname.startsWith("/workflows/builder")) return "Visual Workflow Canvas";
    if (pathname.startsWith("/workflows")) return "Workflow Automation";
    if (pathname.startsWith("/approvals")) return "Approval Tasks";
    if (pathname.startsWith("/tasks")) return "System Tasks";
    if (pathname.startsWith("/integrations")) return "Enterprise Integrations";
    if (pathname.startsWith("/analytics/ai")) return "AI Accuracy & Evaluation";
    if (pathname.startsWith("/analytics")) return "Platform Analytics";
    if (pathname.startsWith("/audit-logs")) return "Audit Logs & Security Trail";
    if (pathname.startsWith("/settings")) return "Settings & Policies";
    return "AI-FLOW";
  };

  return (
    <header className="h-16 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between z-30 transition-colors">
      {/* Left: Dynamic Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
          {getPageTitle()}
        </h1>
        {pathname === "/dashboard" && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80">
            <Sparkles className="w-3 h-3 text-purple-600 dark:text-purple-400" />
            AI Active
          </span>
        )}
      </div>

      {/* Right: Search, Org, Theme, Notifications, User */}
      <div className="flex items-center gap-2.5">
        {/* Command palette search trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs transition-colors shadow-2xs group"
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden md:inline">Quick actions & search...</span>
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 font-mono text-[10px] text-slate-500 shadow-2xs">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Organization Badge */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-100/60 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 text-xs font-medium text-slate-700 dark:text-slate-300">
          <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
          <span className="max-w-[120px] truncate">Apex Global</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4 text-slate-600" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Notification Bell Popover */}
        <NotificationPopover />

        {/* User Avatar & Role */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-800">
          <img
            src={currentUser.avatarUrl}
            alt={currentUser.fullName}
            className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700"
          />
          <div className="hidden sm:flex flex-col text-left">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
              {currentUser.fullName}
            </span>
            <span className="text-[10px] font-medium text-blue-600 dark:text-blue-400 leading-tight">
              {currentUser.role}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
