"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";
import { CommandPalette } from "./command-palette";
import { useApp } from "@/lib/store/app-context";
import Link from "next/link";
import { LogIn, Sparkles, ShieldAlert } from "lucide-react";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useApp();

  // Full-screen dedicated layout for login and register routes
  if (pathname === "/login" || pathname === "/register") {
    return (
      <div className="min-h-screen w-screen bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#0B1120] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 240-260px Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Sticky Top Navigation */}
        <TopNav />

        {/* Guest Session Notification Banner if not logged in */}
        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-6 py-2 text-white text-xs font-medium flex items-center justify-between shadow-xs z-20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                You are currently previewing in Guest / Demo mode. Sign in to customize organizational workflows.
              </span>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-semibold transition-colors flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/register"
                className="px-3 py-1 rounded-lg bg-white text-blue-700 font-semibold hover:bg-slate-100 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        )}

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-6 py-8 md:px-8">
          <div className="max-w-7xl mx-auto space-y-8">{children}</div>
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette />
    </div>
  );
}
