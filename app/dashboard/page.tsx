"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Zap,
  Clock,
  Timer,
  Calendar,
  ChevronDown,
  UploadCloud,
} from "lucide-react";
import { useApp } from "@/lib/store/app-context";
import { MetricCard } from "@/components/dashboard/metric-card";
import { AIInsightCard } from "@/components/dashboard/ai-insight-card";
import { DocumentTypesChart } from "@/components/dashboard/document-types-chart";
import { RecentDocumentsTable } from "@/components/dashboard/recent-documents-table";
import { DocumentUploadModal } from "@/components/documents/document-upload-modal";

export default function DashboardPage() {
  const { currentUser, documents, approvals } = useApp();
  const [selectedRange, setSelectedRange] = useState("Last 30 days");
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  const pendingApprovalsCount = approvals.filter((a) => a.status === "PENDING").length;

  const automatedDocs = documents.filter(
    (d) => d.status === "COMPLETED" || d.status === "READY"
  ).length;
  const automationRate =
    documents.length > 0
      ? `${Math.round((automatedDocs / documents.length) * 100)}%`
      : "0%";

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Greeting & Actions matching mockup */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Good morning, {currentUser.fullName.split(" ")[0]} 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Here&apos;s what&apos;s happening with your workflows today.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          {/* Upload Document Primary Action */}
          <button
            type="button"
            onClick={() => setIsUploadOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-white btn-primary-gradient shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <UploadCloud className="w-4 h-4" />
            <span>Upload Document</span>
          </button>

          {/* Date Filter pill matching mockup: Last 30 days ▾ */}
          <div className="relative">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/10 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-2xs cursor-pointer">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              <span>{selectedRange}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <select
              value={selectedRange}
              onChange={(e) => setSelectedRange(e.target.value)}
              className="opacity-0 absolute inset-0 w-full h-full cursor-pointer"
              aria-label="Select Date Range"
            >
              <option value="Today">Today</option>
              <option value="Last 7 days">Last 7 days</option>
              <option value="Last 30 days">Last 30 days</option>
              <option value="This Quarter">This Quarter</option>
              <option value="Year to Date">Year to Date</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4 Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Documents Processed"
          value={documents.length.toLocaleString()}
          change={documents.length > 0 ? "18.4%" : "0.0%"}
          trend="up"
          trendType="positive"
          icon={FileText}
          iconBgColor="bg-[#EFF6FF] dark:bg-blue-950/60"
          iconColor="text-[#3B82F6]"
        />

        <MetricCard
          title="Automation Rate"
          value={automationRate}
          change={documents.length > 0 ? "6.2%" : "0%"}
          trend="up"
          trendType="positive"
          icon={Zap}
          iconBgColor="bg-[#ECFDF5] dark:bg-emerald-950/60"
          iconColor="text-[#10B981]"
        />

        <MetricCard
          title="Pending Approvals"
          value={String(pendingApprovalsCount)}
          change={pendingApprovalsCount > 0 ? "12.8%" : "0%"}
          trend="down"
          trendType="negative"
          icon={Clock}
          iconBgColor="bg-[#FEE2E2] dark:bg-rose-950/60"
          iconColor="text-[#EF4444]"
        />

        <MetricCard
          title="Avg Processing Time"
          value={documents.length > 0 ? "3.8s" : "0.0s"}
          change={documents.length > 0 ? "24.1%" : "0.0%"}
          trend="down"
          trendType="negative"
          icon={Timer}
          iconBgColor="bg-[#F3E8FF] dark:bg-purple-950/60"
          iconColor="text-[#8B5CF6]"
        />
      </div>

      {/* Middle Row: AI Insight Card (Left) + Document Types Donut Chart (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-7">
          <AIInsightCard onUploadClick={() => setIsUploadOpen(true)} />
        </div>
        <div className="lg:col-span-5">
          <DocumentTypesChart />
        </div>
      </div>

      {/* Bottom Row: Recent Documents Realtime Table */}
      <RecentDocumentsTable
        documents={documents}
        onUploadClick={() => setIsUploadOpen(true)}
      />

      {/* Direct Ingestion Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}
