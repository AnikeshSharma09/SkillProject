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
  Edit3,
  Sparkles,
  Zap,
  Code2,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Layers,
  History,
  Check,
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
  const { documents, updateDocumentField, archiveDocument, updateDocument, logAudit } = useApp();

  const doc = documents.find((d) => d.id === resolvedParams.id);
  const [activeFieldId, setActiveFieldId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"fields" | "ocr" | "json">("fields");
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState("");
  const [zoomLevel, setZoomLevel] = useState(100);

  if (!doc) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <h2 className="text-lg font-bold">Document not found</h2>
        <p className="text-xs text-slate-500 mt-1">The requested document does not exist.</p>
        <Link
          href="/documents"
          className="mt-4 inline-block px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl"
        >
          Back to Documents
        </Link>
      </div>
    );
  }

  const selectedField = doc.extractedFields?.find((f) => f.id === activeFieldId);

  const handleStartEdit = (field: ExtractedField) => {
    setEditingFieldId(field.id);
    setEditedValue(field.extractedValue);
  };

  const handleSaveEdit = (fieldId: string) => {
    updateDocumentField(doc.id, fieldId, editedValue, "Manual correction via Document Intelligence view");
    setEditingFieldId(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Breadcrumb & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/documents"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100 truncate max-w-md">
                {doc.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900">
                {doc.documentType}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Uploaded {formatTimeAgo(doc.uploadedAt)} by {doc.createdBy?.fullName || "System"} • {formatBytes(doc.fileSizeBytes)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {doc.status === "REVIEW_REQUIRED" && (
            <Link
              href={`/review?id=${doc.id}`}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-amber-500 hover:bg-amber-600 shadow-xs transition-colors flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Review Queue</span>
            </Link>
          )}

          <button
            onClick={() => {
              archiveDocument(doc.id);
              router.push("/documents");
            }}
            className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 transition-colors"
          >
            Archive
          </button>
        </div>
      </div>

      {/* Main Split Screen Container */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[680px]">
        {/* LEFT PANE: Document Preview Canvas with Interactive Bounding Boxes (5/12 or 6/12) */}
        <div className="lg:col-span-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col overflow-hidden">
          {/* Canvas Toolbar */}
          <div className="p-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Document Visual Canvas (Page 1)
            </span>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoomLevel((z) => Math.max(z - 10, 70))}
                className="p-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 text-slate-500"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-medium text-slate-500 px-1">
                {zoomLevel}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(z + 10, 150))}
                className="p-1 rounded-lg hover:bg-slate-200/60 dark:hover:bg-slate-700 text-slate-500"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Document Sheet View */}
          <div className="flex-1 p-6 bg-slate-100/60 dark:bg-slate-950 flex items-center justify-center overflow-auto">
            <div
              className="relative w-full max-w-lg aspect-[1/1.35] bg-white text-slate-900 p-8 shadow-xl rounded-lg border border-slate-200 text-[11px] select-none transition-transform"
              style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: "top center" }}
            >
              {/* Document Header Representation */}
              <div className="border-b pb-4 mb-4 flex justify-between items-start">
                <div>
                  <h3 className="font-bold text-sm tracking-wide text-slate-900 uppercase">
                    {doc.documentType === "Invoice" ? "TAX INVOICE" : doc.documentType.toUpperCase()}
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-0.5">
                    Apex Cloud Global Technologies Verification Copy
                  </p>
                </div>
                <div className="text-right text-[10px] font-mono text-slate-500">
                  REF: {doc.fileHash.substring(0, 12)}
                </div>
              </div>

              {/* Simulated Document Body Content */}
              <div className="space-y-4 font-sans leading-relaxed text-slate-700">
                <div className="p-3 bg-slate-50 rounded border border-slate-100 text-[10px] whitespace-pre-wrap font-mono">
                  {doc.rawOcrText || "Simulated text content extracted via OCR engine..."}
                </div>
              </div>

              {/* Dynamic Bounding Box Highlights */}
              {doc.extractedFields?.map((field) => {
                if (!field.sourceBbox) return null;
                const isHighlighted = field.id === activeFieldId;

                return (
                  <div
                    key={field.id}
                    onClick={() => setActiveFieldId(field.id)}
                    className={`absolute rounded transition-all cursor-pointer ${
                      isHighlighted
                        ? "border-2 border-blue-600 bg-blue-500/20 ring-4 ring-blue-500/10 z-20"
                        : "border border-purple-400/40 bg-purple-500/5 hover:border-purple-600 hover:bg-purple-500/15"
                    }`}
                    style={{
                      left: `${field.sourceBbox.x * 100}%`,
                      top: `${field.sourceBbox.y * 100}%`,
                      width: `${field.sourceBbox.w * 100}%`,
                      height: `${field.sourceBbox.h * 100}%`,
                    }}
                    title={`${field.fieldLabel}: ${field.extractedValue}`}
                  >
                    {isHighlighted && (
                      <div className="absolute -top-5 left-0 px-1.5 py-0.5 rounded bg-blue-600 text-white text-[9px] font-bold whitespace-nowrap shadow-xs">
                        {field.fieldLabel}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT PANE: AI Extracted Data & Schema Inspector (6/12) */}
        <div className="lg:col-span-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col overflow-hidden">
          {/* Header & Tabs */}
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Confidence:
              </span>
              <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                {(doc.overallConfidence * 100).toFixed(1)}%
              </span>
              <span className="text-xs text-slate-400">• High Certainty</span>
            </div>

            <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800">
              <button
                onClick={() => setActiveTab("fields")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === "fields"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                }`}
              >
                Extracted Fields
              </button>
              <button
                onClick={() => setActiveTab("ocr")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === "ocr"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                }`}
              >
                Raw OCR
              </button>
              <button
                onClick={() => setActiveTab("json")}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  activeTab === "json"
                    ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold"
                    : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
                }`}
              >
                Schema JSON
              </button>
            </div>
          </div>

          {/* Tab 1: Extracted Fields List */}
          {activeTab === "fields" && (
            <div className="flex-1 p-5 overflow-y-auto space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400 pb-1">
                <span>Select a field to highlight source in preview</span>
                <span>Click &apos;Edit&apos; to correct</span>
              </div>

              {doc.extractedFields?.map((field) => {
                const isSelected = field.id === activeFieldId;
                const isEditing = field.id === editingFieldId;

                return (
                  <div
                    key={field.id}
                    onClick={() => setActiveFieldId(field.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer ${
                      isSelected
                        ? "border-blue-500 bg-blue-50/40 dark:bg-blue-950/20 ring-2 ring-blue-500/10 shadow-xs"
                        : "border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                          {field.fieldLabel}
                        </span>

                        {isEditing ? (
                          <div className="mt-2 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editedValue}
                              onChange={(e) => setEditedValue(e.target.value)}
                              className="px-2.5 py-1 text-xs rounded-lg border border-blue-400 dark:border-blue-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                              autoFocus
                            />
                            <button
                              onClick={() => handleSaveEdit(field.id)}
                              className="p-1 rounded-md bg-blue-600 text-white hover:bg-blue-700"
                              title="Save"
                            >
                              <Check className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        ) : (
                          <p className="text-base font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                            {field.dataType === "currency" && !field.extractedValue.includes("₹")
                              ? `₹${Number(field.extractedValue).toLocaleString("en-IN")}`
                              : field.extractedValue}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            field.confidence >= 0.9
                              ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                              : field.confidence >= 0.7
                              ? "bg-blue-100 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400"
                              : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400"
                          }`}
                        >
                          {(field.confidence * 100).toFixed(0)}% Conf
                        </span>

                        {!isEditing && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartEdit(field);
                            }}
                            className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Correct Field"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {field.isCorrected && (
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center gap-1.5 text-[11px] text-amber-600 dark:text-amber-400">
                        <History className="w-3 h-3" />
                        <span>Human-corrected value (confidence upgraded to 100%)</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Tab 2: Raw OCR */}
          {activeTab === "ocr" && (
            <div className="flex-1 p-5 overflow-y-auto">
              <pre className="p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-800 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                {doc.rawOcrText || "No raw OCR text available for this document."}
              </pre>
            </div>
          )}

          {/* Tab 3: Schema JSON */}
          {activeTab === "json" && (
            <div className="flex-1 p-5 overflow-y-auto">
              <pre className="p-4 rounded-xl bg-slate-900 text-emerald-400 text-xs font-mono whitespace-pre-wrap overflow-x-auto">
                {JSON.stringify(
                  {
                    document_id: doc.id,
                    name: doc.name,
                    category: doc.documentType,
                    classification_confidence: doc.classificationConfidence,
                    overall_confidence: doc.overallConfidence,
                    fields: doc.extractedFields?.reduce((acc: any, f) => {
                      acc[f.fieldName] = {
                        value: f.extractedValue,
                        confidence: f.confidence,
                        is_corrected: f.isCorrected || false,
                      };
                      return acc;
                    }, {}),
                  },
                  null,
                  2
                )}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
