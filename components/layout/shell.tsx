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

  // Full-screen dedicated layout for landing page, login, and register routes
  if (pathname === "/" || pathname === "/login" || pathname === "/register") {
    return (
      <div className="min-h-screen w-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F4F6FC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* 230px Sidebar matching mockup */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Sticky Top Navigation */}
        <TopNav />

        {/* Scrollable Page Body */}
        <main className="flex-1 overflow-y-auto px-6 py-6 md:px-8">
          <div className="max-w-7xl mx-auto space-y-6">{children}</div>
        </main>
      </div>

      {/* Global Command Palette */}
      <CommandPalette />
    </div>
  );
}
