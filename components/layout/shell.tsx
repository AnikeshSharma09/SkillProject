"use client";

import React, { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Sidebar } from "./sidebar";
import { TopNav } from "./top-nav";
import { CommandPalette } from "./command-palette";
import { useApp } from "@/lib/store/app-context";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isAuthenticated, isHydrated } = useApp();

  const isAuthRoute = pathname === "/" || pathname === "/login" || pathname === "/register";

  // Enforce authentication on all enterprise dashboard & workspace routes
  useEffect(() => {
    if (isHydrated && !isAuthenticated && !isAuthRoute) {
      router.push("/");
    }
  }, [isHydrated, isAuthenticated, isAuthRoute, router]);

  // Full-screen dedicated layout for login, register, and root auth routes
  if (isAuthRoute) {
    return (
      <div className="min-h-screen w-screen bg-[#F8FAFC] dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 transition-colors duration-200">
        {children}
      </div>
    );
  }

  // If unauthenticated and still on a private route during redirect, show loading skeleton
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-screen flex items-center justify-center bg-[#F8FAFC] dark:bg-[#0B0F19]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
          <span className="text-xs text-slate-500 font-medium">Redirecting to corporate authentication...</span>
        </div>
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
