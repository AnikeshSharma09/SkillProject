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
  Bell,
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

  const handleSignOut = () => {
    logout();
    setIsUserMenuOpen(false);
    router.push("/login");
  };

  return (
    <header className="h-16 shrink-0 border-b border-[#E8EEF5] dark:border-white/[0.08] bg-white dark:bg-[#111827] px-6 flex items-center justify-between z-30 transition-colors">
      {/* Search Input matching mockup: Search documents, workflows, or ask AI... ⌘K */}
      <div className="flex-1 max-w-lg">
        <button
          onClick={() => setIsCommandPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-[#F8FAFC] dark:bg-white/[0.04] hover:bg-slate-100/70 text-slate-400 text-xs transition-colors shadow-2xs group cursor-pointer"
        >
          <div className="flex items-center gap-2.5">
            <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            <span className="text-slate-400 text-xs">Search documents, workflows, or ask AI...</span>
          </div>
          <kbd className="hidden sm:flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 font-mono text-[10px] text-slate-400 shadow-2xs">
            <Command className="w-2.5 h-2.5" /> K
          </kbd>
        </button>
      </div>

      {/* Right: Organization selector, Notification bell, Theme, User Profile */}
      <div className="flex items-center gap-3">
        {/* Organization Dropdown matching mockup: Symbiosis University ▾ */}
        <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200/80 dark:border-white/[0.08] text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800/60 shadow-2xs">
          <span>{currentUser.organizationName || "Symbiosis University"}</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          aria-label="Toggle Theme"
          className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-white/[0.06] transition-colors cursor-pointer"
        >
          {theme === "light" ? (
            <Moon className="w-4 h-4 text-slate-500" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* Notification Bell Popover */}
        <NotificationPopover />

        {/* User Profile Avatar with fast dropdown */}
        <div className="relative pl-1" ref={userMenuRef}>
          <button
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-0.5 rounded-full hover:ring-2 hover:ring-blue-500/30 transition-all cursor-pointer"
            aria-expanded={isUserMenuOpen}
            aria-haspopup="menu"
          >
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-white/20"
            />
          </button>

          {/* Interactive User Dropdown Menu */}
          {isUserMenuOpen && (
            <div
              className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 dark:border-white/[0.12] bg-white dark:bg-[#111827] shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
              role="menu"
            >
              <div className="p-3 border-b border-slate-100 dark:border-white/[0.06]">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser.fullName}
                </p>
                <p className="text-[11px] text-slate-400 truncate">
                  {currentUser.email}
                </p>
                <div className="mt-1 flex items-center gap-1.5">
                  <span className="px-1.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 font-mono text-[9px] font-bold">
                    {currentUser.role}
                  </span>
                  <span className="text-[10px] text-slate-400 truncate">
                    {currentUser.organizationName}
                  </span>
                </div>
              </div>

              {/* Role Switcher */}
              <div className="p-2 border-b border-slate-100 dark:border-white/[0.06]">
                <div className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Switch Active Role
                </div>
                <div className="space-y-1 mt-0.5">
                  {availableUsers.map((u) => {
                    const isSelected = u.id === currentUser.id;
                    return (
                      <button
                        key={u.id}
                        onClick={() => {
                          setCurrentUser(u);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold"
                            : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={u.avatarUrl}
                            alt={u.fullName}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="truncate">{u.fullName}</span>
                        </div>
                        {isSelected && <Check className="w-3.5 h-3.5 text-blue-600" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Links */}
              <div className="p-1 border-b border-slate-100 dark:border-white/[0.06]">
                <Link
                  href="/settings"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] rounded-lg"
                >
                  <Settings className="w-3.5 h-3.5 text-slate-400" />
                  <span>Settings</span>
                </Link>
                <Link
                  href="/audit-logs"
                  onClick={() => setIsUserMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.04] rounded-lg"
                >
                  <History className="w-3.5 h-3.5 text-slate-400" />
                  <span>Audit Logs</span>
                </Link>
              </div>

              {/* Auth Button */}
              <div className="p-1">
                {isAuthenticated ? (
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-lg cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Sign Out</span>
                  </button>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsUserMenuOpen(false)}
                    className="w-full flex items-center gap-2 px-3 py-1.5 text-xs font-semibold text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 rounded-lg"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>Sign In</span>
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
