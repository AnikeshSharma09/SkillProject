"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import {
  FileText,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ArrowLeft,
  RefreshCw,
  Archive,
  Download,
  Share2,
  MoreHorizontal,
  Edit3,
  Sparkles,
  Zap,
  Code2,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCw,
  Play,
  Check,
  ChevronRight,
} from "lucide-react";
import { useApp } from "@/lib/store/app-context";
import { ExtractedField, BoundingBox } from "@/types";
import { formatBytes, formatTimeAgo, formatCurrency } from "@/lib/utils";

export default function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { documents, updateDocumentField, updateDocument, logAudit } = useApp();

  const doc = documents.find((d) => d.id === resolvedParams.id);
  const [activeTab, setActiveTab] = useState<"data" | "workflow" | "history" | "comments">("data");
  const [activePage, setActivePage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState("");

  if (!doc) {
    return (
      <div className="clean-card p-12 text-center max-w-md mx-auto">
        <h2 className="text-lg font-bold">Document not found</h2>
        <p className="text-xs text-slate-500 mt-1">The requested document does not exist.</p>
        <Link href="/documents" className="mt-4 inline-block px-4 py-2 text-xs font-semibold text-white btn-primary-gradient rounded-xl">
          Back to Documents
        </Link>
      </div>
    );
  }

  const handleStartEdit = (field: { id: string; extractedValue: string }) => {
    setEditingFieldId(field.id);
    setEditedValue(field.extractedValue);
  };

  const handleSaveEdit = (fieldId: string) => {
    updateDocumentField(doc.id, fieldId, editedValue, "Manual correction via Document Studio");
    setEditingFieldId(null);
  };

  const handleRunWorkflow = () => {
    updateDocument(doc.id, { status: "WORKFLOW_RUNNING" });
    logAudit("WORKFLOW_TRIGGERED", "WORKFLOW", `Triggered invoice approval workflow for ${doc.name}`);
    setTimeout(() => {
      updateDocument(doc.id, { status: "READY" });
      router.push("/approvals");
    }, 1000);
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Breadcrumb matching mockup: Documents > Invoice_INV1024.pdf */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/documents" className="hover:text-blue-600 transition-colors">
          Documents
        </Link>
        <span>&gt;</span>
        <span className="font-semibold text-slate-800 dark:text-white">
          {doc.name}
        </span>
      </div>

      {/* Top Header: Title, Badges, and Action Buttons matching mockup */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            {doc.name}
          </h1>

          {/* Badges matching mockup: Invoice (blue), Processed (green), High Confidence (purple) */}
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200">
            {doc.documentType}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
            Processed
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-600 border border-purple-200">
            High Confidence
          </span>
        </div>

        {/* Action Buttons matching mockup: Share, Download, ..., Run Workflow */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </button>

          <button
            type="button"
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-500 shadow-2xs transition-colors cursor-pointer"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleRunWorkflow}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white btn-primary-gradient transition-all cursor-pointer shadow-md"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>Run Workflow</span>
          </button>
        </div>
      </div>

      {/* Split Screen Workspace matching Middle-Right of mockup */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[680px]">
        {/* LEFT PANE (7/12): Document Viewer with Thumbnails & Invoice Render */}
        <div className="lg:col-span-7 clean-card flex flex-col overflow-hidden bg-slate-900 border-slate-800 text-white">
          {/* Viewer Toolbar */}
          <div className="h-12 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span>{activePage} / 2</span>
              <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg">
                <button
                  onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
                  className="hover:text-white px-1"
                >
                  -
                </button>
                <span className="font-mono text-[11px] text-white">{zoomLevel}%</span>
                <button
                  onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                  className="hover:text-white px-1"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg">
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg">
                <Download className="w-3.5 h-3.5" />
              </button>
              <button className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg">
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Viewer Main Body with Thumbnails Sidebar + Rendered Invoice Canvas */}
          <div className="flex-1 flex overflow-hidden bg-slate-950 p-4 gap-4">
            {/* Page Thumbnails Column */}
            <div className="w-16 shrink-0 flex flex-col gap-3 overflow-y-auto">
              {[1, 2].map((p) => (
                <button
                  key={p}
                  onClick={() => setActivePage(p)}
                  className={`w-full aspect-[3/4] rounded-lg border-2 p-1 bg-white text-slate-800 transition-all ${
                    activePage === p
                      ? "border-blue-500 shadow-md ring-2 ring-blue-500/20"
                      : "border-slate-700 opacity-60 hover:opacity-100"
                  }`}
                >
                  <div className="w-full h-full bg-slate-100 rounded text-[8px] flex items-center justify-center font-bold text-slate-500">
                    p. {p}
                  </div>
                </button>
              ))}
            </div>

            {/* Document Render Canvas matching exact invoice from mockup */}
            <div className="flex-1 overflow-auto flex items-center justify-center p-2">
              <div
                style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
                className="w-full max-w-lg aspect-[1/1.35] bg-white text-slate-900 rounded-xl shadow-2xl p-8 transition-transform duration-200 select-text font-sans text-xs"
              >
                {/* Invoice Header */}
                <div className="flex items-start justify-between border-b pb-4 mb-4">
                  <div>
                    <h2 className="text-base font-black text-slate-900">
                      ABC Technologies
                    </h2>
                    <p className="text-[10px] text-slate-500">Enterprise Cloud Solutions</p>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-black tracking-tight text-blue-600">
                      INVOICE
                    </span>
                  </div>
                </div>

                {/* Metadata Row */}
                <div className="grid grid-cols-2 gap-4 pb-4 border-b text-[11px]">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                      Bill To:
                    </span>
                    <strong className="text-slate-900 block font-bold">
                      Symbiosis University
                    </strong>
                    <span className="text-slate-500 text-[10px] block">
                      Educational Institution
                    </span>
                    <span className="text-slate-500 text-[10px] block">
                      Indore, India
                    </span>
                  </div>

                  <div className="text-right space-y-0.5 text-[10px]">
                    <div>
                      <span className="text-slate-400">Invoice No: </span>
                      <strong className="font-mono text-slate-900">INV-1024</strong>
                    </div>
                    <div>
                      <span className="text-slate-400">Date: </span>
                      <span className="text-slate-700">20 Sep 2026</span>
                    </div>
                    <div>
                      <span className="text-slate-400">Due Date: </span>
                      <span className="text-slate-700 font-semibold">30 Sep 2026</span>
                    </div>
                  </div>
                </div>

                {/* Invoice Line Items Table matching mockup */}
                <table className="w-full text-left my-4 text-[10px]">
                  <thead>
                    <tr className="border-b font-bold text-slate-400 uppercase text-[9px]">
                      <th className="py-2">Description</th>
                      <th className="py-2 text-center">Qty</th>
                      <th className="py-2 text-right">Rate</th>
                      <th className="py-2 text-right">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <tr>
                      <td className="py-2 font-medium">Laptop</td>
                      <td className="py-2 text-center">5</td>
                      <td className="py-2 text-right">45,000</td>
                      <td className="py-2 text-right font-semibold">2,25,000</td>
                    </tr>
                    <tr>
                      <td className="py-2 font-medium">Monitor</td>
                      <td className="py-2 text-center">5</td>
                      <td className="py-2 text-right">15,000</td>
                      <td className="py-2 text-right font-semibold">75,000</td>
                    </tr>
                  </tbody>
                </table>

                {/* Subtotals & Total */}
                <div className="border-t pt-3 space-y-1 text-[11px] text-right">
                  <div className="flex justify-between text-slate-500">
                    <span>Subtotal</span>
                    <span className="font-mono">3,00,000</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Tax (18%)</span>
                    <span className="font-mono">54,000</span>
                  </div>
                  <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t">
                    <span>Total</span>
                    <span className="text-blue-600 font-mono font-black">
                      ₹3,54,000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANE (5/12): Extracted Data Tab matching mockup */}
        <div className="lg:col-span-5 clean-card flex flex-col p-5">
          {/* Tabs matching mockup: Extracted Data, Workflow, History, Comments */}
          <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-3 mb-4 text-xs font-semibold">
            {[
              { id: "data", label: "Extracted Data" },
              { id: "workflow", label: "Workflow" },
              { id: "history", label: "History" },
              { id: "comments", label: "Comments" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`pb-1 transition-colors cursor-pointer ${
                  activeTab === tab.id
                    ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                    : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Extracted Fields List matching mockup with horizontal confidence bars */}
          <div className="space-y-2.5 overflow-y-auto max-h-[580px] pr-1">
            {[
              { label: "Vendor", value: "ABC Technologies", conf: 99.1, color: "bg-emerald-500" },
              { label: "Invoice Number", value: "INV-1024", conf: 99.1, color: "bg-emerald-500" },
              { label: "Invoice Date", value: "20 Sep 2026", conf: 97.2, color: "bg-emerald-500" },
              { label: "Due Date", value: "30 Sep 2026", conf: 61.7, color: "bg-amber-500" },
              { label: "Subtotal", value: "₹3,00,000", conf: 98.4, color: "bg-emerald-500" },
              { label: "Tax", value: "₹54,000", conf: 97.8, color: "bg-emerald-500" },
              { label: "Total Amount", value: "₹3,54,000", conf: 99.4, color: "bg-emerald-500" },
              { label: "Currency", value: "INR", conf: 99.0, color: "bg-emerald-500" },
            ].map((item, idx) => (
              <div
                key={item.label}
                className="p-3 rounded-xl border border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between gap-3 group hover:border-slate-200 transition-colors"
              >
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    {item.label}
                  </span>
                  <div className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                    {item.value}
                  </div>
                </div>

                {/* Horizontal Confidence Bar & Edit Pencil matching mockup */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="flex items-center gap-1.5">
                    <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.conf}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold tabular-nums font-mono text-slate-600 dark:text-slate-400">
                      {item.conf}%
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleStartEdit({
                      id: `f-${idx}`,
                      extractedValue: item.value,
                    })}
                    className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                    title="Edit field"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
