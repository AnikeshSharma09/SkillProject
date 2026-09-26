"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";
import { CommandPalette } from "./command-palette";
import { useApp } from "@/lib/store/app-context";
import Link from "next/link";
import { LogIn, Sparkles, ShieldCheck } from "lucide-react";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { isAuthenticated } = useApp();

  // Full-screen dedicated layout for login and register routes
  if (pathname === "/login" || pathname === "/register") {
    return (
      <div className="min-h-screen w-screen bg-[#080B11] text-slate-100 transition-colors duration-200">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F8FAFC] dark:bg-[#080B11] text-slate-900 dark:text-slate-100 transition-colors duration-200 relative">
      {/* Ambient background glows for deep space aesthetic */}
      <div className="absolute top-0 -left-40 w-96 h-96 bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px] pointer-events-none" />

      {/* 264px Cyber Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
        {/* Sticky Top Navigation */}
        <TopNav />

        {/* Guest Session Notification Banner if not logged in */}
        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-cyan-600 px-6 py-2 text-white text-xs font-semibold flex items-center justify-between shadow-md z-20">
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-200 animate-spin" />
              <span>
                Enterprise Demo Mode Active. Log in to save custom rules and deploy live webhook pipelines.
              </span>
            </div>
            <div className="flex items-center gap-2.5">
              <Link
                href="/login"
                className="px-3 py-1 rounded-lg bg-white/20 hover:bg-white/30 text-white font-bold transition-colors flex items-center gap-1"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </Link>
              <Link
                href="/register"
                className="px-3 py-1 rounded-lg bg-white text-indigo-700 font-bold hover:bg-slate-100 transition-colors"
              >
                Register
              </Link>
            </div>
          </div>
        )}

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-6 py-7 md:px-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-7">{children}</div>
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette />
    </div>
  );
}
