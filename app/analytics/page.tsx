"use client";

import React from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  FileText,
  Zap,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { MetricCard } from "@/components/dashboard/metric-card";
import { useApp } from "@/lib/store/app-context";

export default function AnalyticsPage() {
  const { documents } = useApp();
  const volumeData = [
    { day: "Mon", documents: 320, automated: 295 },
    { day: "Tue", documents: 410, automated: 380 },
    { day: "Wed", documents: 380, automated: 350 },
    { day: "Thu", documents: 460, automated: 425 },
    { day: "Fri", documents: 510, automated: 470 },
    { day: "Sat", documents: 190, automated: 180 },
    { day: "Sun", documents: 211, automated: 195 },
  ];

  const distributionData = [
    { name: "Invoices", value: 45, color: "#2563EB" },
    { name: "Receipts", value: 20, color: "#7C3AED" },
    { name: "Leave Forms", value: 15, color: "#10B981" },
    { name: "POs", value: 12, color: "#F59E0B" },
    { name: "Contracts", value: 8, color: "#64748B" },
  ];

  const latencyData = [
    { step: "Storage Upload", time: 0.4 },
    { step: "OCR Text Parse", time: 1.1 },
    { step: "Classification", time: 0.6 },
    { step: "AI Extraction", time: 1.2 },
    { step: "Rule Evaluation", time: 0.2 },
    { step: "DAG Step Route", time: 0.3 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Platform Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Throughput, straight-through automation rates, and workflow operational health
          </p>
        </div>

        <Link
          href="/analytics/ai"
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-purple-600" />
          <span>AI Observability & Benchmarks →</span>
        </Link>
      </div>

      {/* 4 Top KPI Cards (Section 34) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Documents Processed"
          value={documents.length.toLocaleString()}
          change={documents.length > 0 ? "18.4%" : "0.0%"}
          trend="up"
          icon={FileText}
          description="Total documents in pipeline"
        />

        <MetricCard
          title="Automation Rate"
          value={documents.length > 0 ? "91.4%" : "0%"}
          change={documents.length > 0 ? "6.2%" : "0%"}
          trend="up"
          icon={Zap}
          description="Straight-through zero touch"
        />

        <MetricCard
          title="Human Review Rate"
          value={documents.length > 0 ? "8.6%" : "0%"}
          change={documents.length > 0 ? "12.0%" : "0%"}
          trend="down"
          trendType="positive"
          icon={CheckCircle2}
          description="Quarantined to review queue"
        />

        <MetricCard
          title="Avg. Processing Time"
          value={documents.length > 0 ? "3.8s" : "0.0s"}
          change={documents.length > 0 ? "24.1%" : "0.0%"}
          trend="down"
          trendType="positive"
          icon={Clock}
          description="End-to-end ingestion to DAG"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Chart 1: Volume Over Time (8/12) */}
        <div className="lg:col-span-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Document Ingestion & Automation (Last 7 Days)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Total documents received vs automatically cleared
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600" /> Total Received
              </span>
              <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full bg-purple-600" /> Automated
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={volumeData}>
                <defs>
                  <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAuto" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#7C3AED" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#7C3AED" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    borderRadius: "12px",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="documents" stroke="#2563EB" strokeWidth={2.5} fillOpacity={1} fill="url(#colorTotal)" />
                <Area type="monotone" dataKey="automated" stroke="#7C3AED" strokeWidth={2.5} fillOpacity={1} fill="url(#colorAuto)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Document Distribution (4/12) */}
        <div className="lg:col-span-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Taxonomy Breakdown
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Document categories processed
            </p>
          </div>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    borderRadius: "8px",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-2">
            {distributionData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                  {item.name}
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 3: Pipeline Processing Latency Breakdown (12/12) */}
        <div className="lg:col-span-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Pipeline Latency Breakdown (Seconds)
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Average duration spent in each asynchronous processing phase
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
              Total Avg: 3.8 sec
            </span>
          </div>

          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={latencyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" opacity={0.6} />
                <XAxis dataKey="step" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#94A3B8" }} unit="s" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1E293B",
                    borderRadius: "10px",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="time" fill="#2563EB" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
