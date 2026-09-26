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
  Activity,
  Cpu,
} from "lucide-react";
import { Logo } from "@/components/ui/logo";
import { useApp } from "@/lib/store/app-context";
import { cn } from "@/lib/utils";

interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number | string;
  badgeVariant?: "blue" | "amber" | "green" | "purple";
}

interface NavSection {
  title: string;
  items: NavItem[];
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

  const navSections: NavSection[] = [
    {
      title: "Core Intelligence",
      items: [
        { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
        { name: "Documents", href: "/documents", icon: FileText, badge: documents.length },
        {
          name: "Human Review",
          href: "/review",
          icon: Eye,
          badge: reviewRequiredCount > 0 ? reviewRequiredCount : undefined,
          badgeVariant: "amber",
        },
        { name: "AI Assistant", href: "/assistant", icon: Sparkles, badgeVariant: "purple" },
      ],
    },
    {
      title: "Automation & Logic",
      items: [
        { name: "Workflows", href: "/workflows", icon: GitFork },
        {
          name: "Approvals",
          href: "/approvals",
          icon: CheckCircle2,
          badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
          badgeVariant: "blue",
        },
        { name: "System Tasks", href: "/tasks", icon: CheckSquare },
        { name: "Integrations", href: "/integrations", icon: Network },
      ],
    },
    {
      title: "Governance & Ops",
      items: [
        { name: "Platform Analytics", href: "/analytics", icon: BarChart3 },
        { name: "Audit Trail", href: "/audit-logs", icon: History },
        { name: "Settings & RBAC", href: "/settings", icon: Settings },
      ],
    },
  ];

  return (
    <aside className="w-[264px] h-screen shrink-0 border-r border-slate-200 dark:border-white/[0.08] bg-white/90 dark:bg-[#090D18]/95 backdrop-blur-2xl flex flex-col justify-between select-none z-30 transition-colors duration-200">
      {/* Top Header & Logo */}
      <div className="flex flex-col min-h-0">
        <div className="h-16 px-5 flex items-center border-b border-slate-100 dark:border-white/[0.06]">
          <Link href="/dashboard" className="transition-transform hover:scale-[1.02] active:scale-[0.98]">
            <Logo size="md" />
          </Link>
        </div>

        {/* Navigation Sections */}
        <div className="p-3.5 space-y-5 overflow-y-auto max-h-[calc(100vh-210px)] custom-scrollbar">
          {navSections.map((section) => (
            <div key={section.title} className="space-y-1">
              <div className="px-3 pb-1.5 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                {section.title}
              </div>

              {section.items.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/dashboard" && pathname.startsWith(item.href));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "group relative flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-200",
                      isActive
                        ? "bg-gradient-to-r from-indigo-500/15 via-purple-500/10 to-transparent text-indigo-600 dark:text-indigo-400 font-bold border-l-2 border-indigo-500 shadow-2xs"
                        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-white/[0.04]"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={cn(
                          "w-4 h-4 transition-all duration-200",
                          isActive
                            ? "text-indigo-600 dark:text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] scale-110"
                            : "text-slate-400 dark:text-slate-500 group-hover:text-slate-700 dark:group-hover:text-slate-300 group-hover:scale-105"
                        )}
                      />
                      <span className="tracking-tight">{item.name}</span>
                    </div>

                    {item.badge !== undefined && (
                      <span
                        className={cn(
                          "text-[10px] font-extrabold px-1.5 py-0.5 rounded-full tracking-tight transition-transform",
                          item.badgeVariant === "amber"
                            ? "bg-amber-500/15 text-amber-500 border border-amber-500/30 animate-pulse"
                            : item.badgeVariant === "blue"
                            ? "bg-indigo-500/15 text-indigo-400 border border-indigo-500/30"
                            : "bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400"
                        )}
                      >
                        {item.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Bottom User Profile Dock & Quick Switcher */}
      <div className="p-3 border-t border-slate-100 dark:border-white/[0.08] bg-slate-50/60 dark:bg-black/30 backdrop-blur-md">
        <div className="relative group">
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200/80 dark:border-white/[0.08] bg-white dark:bg-[#111728]/80 shadow-xs hover:border-indigo-500/40 transition-all duration-200">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="relative shrink-0">
                <img
                  src={currentUser.avatarUrl}
                  alt={currentUser.fullName}
                  className="w-8 h-8 rounded-lg object-cover ring-1 ring-white/20"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-[#111728]" />
              </div>
              <div className="flex flex-col min-w-0 text-left">
                <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser.fullName}
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
                    {currentUser.role}
                  </span>
                  <span className="text-[9px] text-slate-400 truncate">• {currentUser.organizationName?.split(" ")[0] || "Apex"}</span>
                </div>
              </div>
            </div>

            {/* In-place role select overlay */}
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

            <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-indigo-400 transition-colors shrink-0" />
          </div>

          {/* Quick Action Footer inside Sidebar */}
          <div className="mt-2 px-1 flex items-center justify-between text-[10px]">
            {isAuthenticated ? (
              <button
                onClick={() => {
                  logout();
                  router.push("/login");
                }}
                className="text-slate-400 hover:text-rose-400 flex items-center gap-1 font-semibold transition-colors cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>Sign Out</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="text-indigo-500 dark:text-indigo-400 hover:underline flex items-center gap-1 font-bold"
              >
                <LogIn className="w-3 h-3" />
                <span>Sign In</span>
              </Link>
            )}

            <div className="flex items-center gap-1.5 font-mono text-[9px] text-emerald-500 dark:text-emerald-400 font-semibold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_6px_#10B981]" />
              <span>DETERMINISTIC 100%</span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
