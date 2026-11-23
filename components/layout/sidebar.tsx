"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
  CreditCard,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useApp } from "@/lib/store/app-context";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeVariant?: "blue" | "amber" | "red";
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
    payments,
    isAuthenticated,
    logout,
  } = useApp();

  const pendingApprovalsCount = approvals.filter((a) => a.status === "PENDING").length;
  const pendingPaymentsCount = (payments || []).filter((p) => p.status === "PENDING_APPROVAL").length;

  // Exact navigation item order matching the mockup
  const navItems: NavItem[] = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "Documents", href: "/documents", icon: FileText },
    { name: "AI Assistant", href: "/assistant", icon: Sparkles },
    { name: "Workflows", href: "/workflows", icon: GitFork },
    {
      name: "Approvals",
      href: "/approvals",
      icon: CheckCircle2,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      badgeVariant: "red",
    },
    {
      name: "Payments",
      href: "/payments",
      icon: CreditCard,
      badge: pendingPaymentsCount > 0 ? pendingPaymentsCount : undefined,
      badgeVariant: "amber",
    },
    { name: "Tasks", href: "/tasks", icon: CheckSquare },
    { name: "Integrations", href: "/integrations", icon: Network },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Audit Logs", href: "/audit-logs", icon: History },
  ];

  return (
    <aside className="w-[230px] h-screen shrink-0 border-r border-[#E8EEF5] dark:border-white/[0.08] bg-white dark:bg-[#111827] flex flex-col justify-between select-none z-30 transition-colors duration-200">
      {/* Top Header & Logo */}
      <div className="flex flex-col min-h-0">
        <div className="h-16 px-5 flex items-center border-b border-[#F1F5F9] dark:border-white/[0.06]">
          <Link href="/dashboard" className="transition-opacity hover:opacity-90">
            <Logo size="md" />
          </Link>
        </div>

        {/* Navigation Item List */}
        <div className="p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-170px)]">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "group relative flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-150",
                  isActive
                    ? "bg-[#EEF4FF] dark:bg-blue-950/60 text-[#2563EB] dark:text-blue-400 font-bold shadow-2xs"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/[0.04]"
                )}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={cn(
                      "w-4 h-4 transition-colors",
                      isActive
                        ? "text-[#2563EB] dark:text-blue-400"
                        : "text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300"
                    )}
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge !== undefined && (
                  <span
                    className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-full tracking-tight",
                      item.badgeVariant === "red"
                        ? "bg-[#EF4444] text-white"
                        : "bg-blue-100 text-blue-700"
                    )}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Bottom Profile Dock matching mockup: Anikesh Sharma, Admin • Symbiosis */}
      <div className="p-3 border-t border-[#F1F5F9] dark:border-white/[0.08] bg-white dark:bg-[#111827]">
        <div className="relative group flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-white/[0.04] transition-colors cursor-pointer">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.fullName}
              className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200 dark:ring-white/20 shrink-0"
            />
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                {currentUser.fullName}
              </span>
              <span className="text-[10px] text-slate-400 font-medium truncate">
                {currentUser.role === "ADMIN" ? "Admin" : currentUser.role} • {(currentUser.organizationName?.split(" ")[0]) || "Symbiosis"}
              </span>
            </div>
          </div>

          <select
            aria-label="Switch User Profile"
            value={currentUser.id}
            onChange={(e) => {
              const selected = availableUsers.find((u) => u.id === e.target.value);
              if (selected) setCurrentUser(selected);
            }}
            className="opacity-0 absolute inset-0 w-full h-full cursor-pointer z-10"
          >
            {availableUsers.map((u) => (
              <option key={u.id} value={u.id}>
                {u.fullName} ({u.role})
              </option>
            ))}
          </select>

          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
        </div>
      </div>
    </aside>
  );
}
