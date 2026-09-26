"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Sparkles,
  GitFork,
  CheckCircle2,
  CheckSquare,
  Network,
  BarChart3,
  History,
  Settings,
  HelpCircle,
  Eye,
  ChevronRight,
  ShieldCheck,
  ChevronDown,
  LogOut,
  LogIn,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useApp } from "@/lib/store/app-context";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeVariant?: "blue" | "amber" | "green";
}

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    currentUser,
    setCurrentUser,
    availableUsers,
    approvals,
    documents,
    isAuthenticated,
    logout,
  } = useApp();

  const pendingApprovalsCount = approvals.filter((a) => a.status === "PENDING").length;
  const reviewRequiredCount = documents.filter((d) => d.status === "REVIEW_REQUIRED").length;

  const mainNavItems: NavItem[] = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Documents", href: "/documents", icon: FileText, badge: documents.length },
    {
      name: "Human Review",
      href: "/review",
      icon: Eye,
      badge: reviewRequiredCount > 0 ? reviewRequiredCount : undefined,
      badgeVariant: "amber",
    },
    { name: "AI Assistant", href: "/assistant", icon: Sparkles },
    { name: "Workflows", href: "/workflows", icon: GitFork },
    {
      name: "Approvals",
      href: "/approvals",
      icon: CheckCircle2,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      badgeVariant: "blue",
    },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Integrations", href: "/integrations", icon: Network },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Audit Logs", href: "/audit-logs", icon: History },
  ];

  const secondaryNavItems: NavItem[] = [
    { name: "Settings", href: "/settings", icon: Settings },
    { name: "Help & Docs", href: "https://github.com", icon: HelpCircle },
  ];

  return (
    <aside className="w-[260px] h-screen shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/95 flex flex-col justify-between select-none transition-colors duration-200">
      {/* Top Header & Brand */}
      <div>
        <div className="h-16 px-5 flex items-center border-b border-slate-100 dark:border-slate-800/80">
          <Link href="/dashboard" className="transition-opacity hover:opacity-90">
            <Logo size="md" />
          </Link>
        </div>

        {/* Navigation Links */}
        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-190px)]">
          <div className="px-3 pt-2 pb-1 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            Workspace
          </div>

          {mainNavItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group relative flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl transition-all duration-150",
                  isActive
                    ? "bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold shadow-xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-200"
                    )}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={cn(
                      "text-[11px] font-bold px-1.5 py-0.5 rounded-full tracking-tight transition-transform",
                      item.badgeVariant === "amber"
                        ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                        : item.badgeVariant === "blue"
                        ? "bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div className="pt-4 pb-1 px-3 text-[11px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
            System
          </div>

          {secondaryNavItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group flex items-center justify-between px-3 py-2 text-sm font-medium rounded-xl transition-all duration-150",
                  isActive
                    ? "bg-blue-50/80 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-semibold"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-slate-100/70 dark:hover:bg-slate-800/60"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  <span>{item.name}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom User Profile & Switcher */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="relative group">
          <div className="flex items-center justify-between p-2 rounded-xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-800/80 shadow-2xs">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <img
                src={currentUser.avatarUrl}
                alt={currentUser.fullName}
                className="w-8 h-8 rounded-lg object-cover ring-1 ring-slate-200 dark:ring-slate-700 shrink-0"
              />
              <div className="flex flex-col min-w-0">
                <span className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {currentUser.fullName}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {currentUser.role}
                  </span>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500">• Apex</span>
                </div>
              </div>
            </div>

            {/* Role dropdown trigger */}
            <select
              aria-label="Switch User Role"
              value={currentUser.id}
              onChange={(e) => {
                const selected = availableUsers.find((u) => u.id === e.target.value);
                if (selected) setCurrentUser(selected);
              }}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
            >
              {availableUsers.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.fullName} ({u.role})
                </option>
              ))}
            </select>

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          </div>

          <div className="mt-1.5 px-1 flex items-center justify-between text-[10px]">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="text-slate-400 hover:text-red-500 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign In</span>
              </Link>
            )}
            <span className="font-mono text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {isAuthenticated ? "Authenticated" : "Guest Mode"}
            </span>
          </div>
        </div>
      </div>
    </aside>
  );
}
