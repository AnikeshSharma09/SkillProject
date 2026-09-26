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
  UserCheck,
  Check,
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

  const handleSignOut = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push("/login");
  };

  return (
    <header className="h-16 shrink-0 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between z-30 transition-colors">
      {/* Left: Dynamic Title */}
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100 tracking-tight">
          {getPageTitle()}
        </h1>
        {pathname === "/dashboard" && (
          <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800/80 shadow-2xs">
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
          <span className="max-w-[120px] truncate">{currentUser.organizationName}</span>
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4 text-slate-600" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Notification Bell Popover */}
        <NotificationPopover />

        {/* User Profile & Menu Dropdown */}
        <div className="relative pl-2 border-l border-slate-200 dark:border-slate-800" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="menu"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
            />
            <div className="hidden sm:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight">
                {currentUser.fullName}
              </span>
              <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 leading-tight uppercase tracking-wider">
                {currentUser.role}
              </span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Interactive User Dropdown Menu */}
          {isUserMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              role="menu"
            >
              {/* User Identity Header */}
              <div className="p-3 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <img
                    src={currentUser.avatarUrl}
                    alt={currentUser.fullName}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate">
                      {currentUser.fullName}
                    </p>
                    <p className="text-xs text-slate-400 truncate">
                      {currentUser.email}
                    </p>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-bold">
                        {currentUser.role}
                      </span>
                      <span className="text-[10px] text-slate-400 truncate">
                        {currentUser.organizationName}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Fast Role Switcher */}
              <div className="p-2 border-b border-slate-100 dark:border-slate-800">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Switch Active Role
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
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
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
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Quick Navigation Links */}
              <div className="p-1 border-b border-slate-100 dark:border-slate-800">
                <Link
                  href="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Workspace Settings & RBAC</span>
                </Link>
                <Link
                  href="/audit-logs"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors"
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
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-xl transition-colors cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out of Workspace</span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-xl transition-colors"
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
