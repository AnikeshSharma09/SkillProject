"use client";

import React, { useState, useRef, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Sun,
  Moon,
  Building2,
  Sparkles,
  Command,
  ChevronDown,
  LogOut,
  LogIn,
  Settings,
  History,
  ShieldCheck,
  Check,
  Upload,
  Cpu,
  Activity,
  Layers,
} from "lucide-react";
import { useApp } from "@/lib/store/app-context";
import { NotificationPopover } from "./notification-popover";

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentUser,
    setCurrentUser,
    availableUsers,
    isAuthenticated,
    logout,
    theme,
    toggleTheme,
    setIsCommandPaletteOpen,
  } = useApp();

  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        userMenuRef.current &&
        !userMenuRef.current.contains(event.target as Node)
      ) {
        setIsUserMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Determine dynamic title and category
  const getNavContext = () => {
    if (pathname === "/" || pathname === "/dashboard")
      return { title: "Command Center", category: "Intelligence" };
    if (pathname.startsWith("/documents/"))
      return { title: "Document Intelligence Studio", category: "Repository" };
    if (pathname.startsWith("/documents"))
      return { title: "Document Repository", category: "Storage" };
    if (pathname.startsWith("/review"))
      return { title: "Human Review Cockpit", category: "Verification" };
    if (pathname.startsWith("/assistant"))
      return { title: "Semantic RAG Assistant", category: "Neural Retrieval" };
    if (pathname.startsWith("/workflows/builder"))
      return { title: "Visual DAG Workflow Builder", category: "Automation" };
    if (pathname.startsWith("/workflows"))
      return { title: "Orchestration & Workflows", category: "Automation" };
    if (pathname.startsWith("/approvals"))
      return { title: "Authorization & Signoffs", category: "Governance" };
    if (pathname.startsWith("/tasks"))
      return { title: "System Workers & Tasks", category: "Execution" };
    if (pathname.startsWith("/integrations"))
      return { title: "Enterprise Connectors", category: "Ecosystem" };
    if (pathname.startsWith("/analytics/ai"))
      return { title: "Model Accuracy & Telemetry", category: "Evaluation" };
    if (pathname.startsWith("/analytics"))
      return { title: "Operational Analytics", category: "Metrics" };
    if (pathname.startsWith("/audit-logs"))
      return { title: "Immutable Audit Trail", category: "Security" };
    if (pathname.startsWith("/settings"))
      return { title: "Policies & Access Control", category: "Configuration" };
    return { title: "AI-FLOW Workspace", category: "Enterprise" };
  };

  const navContext = getNavContext();

  const handleSignOut = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push("/login");
  };

  return (
    <header className="h-16 shrink-0 border-b border-slate-200 dark:border-white/[0.08] bg-white/80 dark:bg-[#080B11]/85 backdrop-blur-2xl px-6 flex items-center justify-between z-30 transition-colors">
      {/* Left: Dynamic Title with Breadcrumb Pill & Live Pulse */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
            {navContext.category}
          </span>
          <span className="text-slate-300 dark:text-slate-600 font-mono">/</span>
          <h1 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {navContext.title}
          </h1>
        </div>

        {/* Live Autonomous Engine Pulse Tag */}
        <div className="hidden xl:flex items-center gap-2 ml-4 px-2.5 py-1 rounded-full text-[10px] font-bold bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 shadow-[0_0_12px_rgba(99,102,241,0.15)]">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span>AI Engine: 99.4% Accuracy</span>
          <span className="text-slate-400">•</span>
          <span>142ms Avg Latency</span>
        </div>
      </div>

      {/* Right Controls: Quick Search, Ingest Action, Org, Theme, User */}
      <div className="flex items-center gap-3">
        {/* Command palette search trigger */}
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-slate-50/80 dark:bg-white/[0.04] hover:bg-slate-100 dark:hover:bg-white/[0.08] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs font-medium transition-all shadow-2xs group cursor-pointer"
        >
          <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors" />
          <span className="hidden md:inline text-xs">Search documents, rules, workflows...</span>
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white dark:bg-[#111728] border border-slate-200 dark:border-white/10 font-mono text-[10px] text-slate-500 dark:text-slate-400 shadow-2xs">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>

        {/* Quick Upload Action */}
        <Link
          href="/documents?action=upload"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-indigo-500 via-indigo-600 to-purple-600 hover:from-indigo-600 hover:to-purple-700 shadow-md hover:shadow-indigo-500/25 transition-all active:scale-[0.98]"
        >
          <Upload className="w-3.5 h-3.5" />
          <span>Upload</span>
        </Link>

        {/* Organization Badge */}
        <div className="hidden lg:flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-slate-100/70 dark:bg-white/[0.04] border border-slate-200/80 dark:border-white/[0.08] text-xs font-semibold text-slate-700 dark:text-slate-300">
          <Building2 className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400" />
          <span className="max-w-[120px] truncate">{currentUser.organizationName || "Apex Global"}</span>
        </div>

        {/* Theme Toggle Button with Cyber Polish */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4 text-slate-600 hover:rotate-12 transition-transform" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
          )}
        </button>

        {/* Notification Bell */}
        <NotificationPopover />

        {/* User Profile & Menu Dropdown */}
        <div className="relative pl-1 border-l border-slate-200 dark:border-white/[0.08]" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2.5 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-all cursor-pointer"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="menu"
          >
            <div className="relative">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/20"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-[#080B11]" />
            </div>
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                {currentUser.fullName}
              </span>
              <span className="text-[10px] font-extrabold text-indigo-500 dark:text-indigo-400 leading-tight uppercase tracking-wider">
                {currentUser.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Interactive User Dropdown Menu */}
          {isUserMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 dark:border-white/[0.12] bg-white dark:bg-[#0D1222] shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150 backdrop-blur-3xl"
              role="menu"
            >
              {/* User Identity Header */}
              <div className="p-3 border-b border-slate-100 dark:border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/20"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-extrabold text-slate-900 dark:text-white truncate">
                      {currentUser.fullName}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {currentUser.email}
                    </p>
                    <div className="mt-1.5 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/15 text-indigo-400 font-mono text-[10px] font-bold border border-indigo-500/30">
                        {currentUser.role}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate">
                        {currentUser.organizationName || "Apex Global"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fast Role Switcher */}
              <div className="p-2 border-b border-slate-100 dark:border-white/[0.06]">
                <div className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest px-2 py-1">
                  Active Role Switcher
                </div>
                <div className="space-y-1 mt-1">
                  {availableUsers.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-all cursor-pointer ${
                          isSelected
                            ? "bg-indigo-500/15 text-indigo-400 font-bold border border-indigo-500/30"
                            : "hover:bg-slate-100 dark:hover:bg-white/[0.05] text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={u.avatarUrl}
                            alt={u.fullName}
                            className="w-5 h-5 rounded-md object-cover"
                          />
                          <span className="truncate">{u.fullName}</span>
                          <span className="text-[10px] text-slate-400 uppercase">
                            ({u.role})
                          </span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="p-1 border-b border-slate-100 dark:border-white/[0.06]">
                <Link
                  href="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] rounded-xl transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Workspace Settings & RBAC</span>
                </Link>
                <Link
                  href="/audit-logs"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-white/[0.05] rounded-xl transition-colors"
                >
                  <History className="w-4 h-4 text-slate-400" />
                  <span>Audit Logs & Security Trail</span>
                </Link>
              </div>

              {/* Auth Action */}
              <div className="p-1">
                {isAuthenticated ? (
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out of Workspace</span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-indigo-400 hover:bg-indigo-500/10 rounded-xl transition-colors"
                  >
                    <LogIn className="w-4 h-4" />
                    <span>Sign In with Enterprise Account</span>
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
