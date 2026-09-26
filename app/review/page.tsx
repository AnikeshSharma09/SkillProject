"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  FileText,
  Edit3,
  Check,
  Eye,
  History,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from "lucide-react";
import { useApp } from "@/lib/store/app-context";
import { ExtractedField, DocumentItem } from "@/types";
import { formatBytes, formatTimeAgo } from "@/lib/utils";

function HumanReviewContent() {
  const searchParams = useSearchParams();
  const docIdParam = searchParams.get("id");

  const {
    documents,
    updateDocumentField,
    updateDocument,
    logAudit,
    currentUser,
    addNotification,
  } = useApp();

  // Find documents needing review or all documents
  const reviewQueue = documents.filter((d) => d.status === "REVIEW_REQUIRED");
  const fallbackDocs = documents.filter((d) => d.extractedFields && d.extractedFields.length > 0);

  const displayList = reviewQueue.length > 0 ? reviewQueue : fallbackDocs;

  // Selected document for active review
  const [selectedDocId, setSelectedDocId] = useState<string>(
    docIdParam || displayList[0]?.id || ""
  );

  const currentDoc =
    documents.find((d) => d.id === selectedDocId) || displayList[0];

  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState("");
  const [editComment, setEditComment] = useState("");
  const [reviewDecisionNote, setReviewDecisionNote] = useState("");
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  const handleStartFieldEdit = (field: ExtractedField) => {
    setEditingFieldId(field.id);
    setEditValue(field.extractedValue);
    setEditComment("");
  };

  const handleSaveFieldEdit = (fieldId: string) => {
    if (!currentDoc) return;
    updateDocumentField(
      currentDoc.id,
      fieldId,
      editValue,
      editComment || "Corrected during Human-in-the-Loop review"
    );
    setEditingFieldId(null);
    setActionSuccessMessage(`Field successfully corrected.`);
    setTimeout(() => setActionSuccessMessage(null), 3000);
  };

  const handleApproveExtraction = () => {
    if (!currentDoc) return;
    updateDocument(currentDoc.id, {
      status: "READY",
      overallConfidence: 1.0, // Upgraded by human verifier
    });

    logAudit(
      "EXTRACTION_APPROVED",
      "DOCUMENT",
      `Human verified and approved extraction for ${currentDoc.name}. Note: ${
        reviewDecisionNote || "All fields verified."
      }`,
      { documentId: currentDoc.id, documentName: currentDoc.name }
    );

    addNotification({
      title: "Human Review Completed",
      message: `${currentDoc.name} verified and marked READY for workflow engine.`,
      type: "system",
      documentId: currentDoc.id,
    });

    setActionSuccessMessage(`Document ${currentDoc.name} marked as Approved & Verified!`);
    setTimeout(() => setActionSuccessMessage(null), 3500);
  };

  const handleRejectDocument = () => {
    if (!currentDoc) return;
    updateDocument(currentDoc.id, { status: "REJECTED" });

    logAudit(
      "DOCUMENT_REJECTED",
      "DOCUMENT",
      `Document ${currentDoc.name} rejected in human review. Reason: ${
        reviewDecisionNote || "Failed quality / validation requirements."
      }`,
      { documentId: currentDoc.id, documentName: currentDoc.name }
    );

    addNotification({
      title: "Document Rejected",
      message: `${currentDoc.name} was rejected during human review.`,
      type: "error",
      documentId: currentDoc.id,
    });

    setActionSuccessMessage(`Document ${currentDoc.name} marked as Rejected.`);
    setTimeout(() => setActionSuccessMessage(null), 3500);
  };

  if (!currentDoc) {
    return (
      <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
        <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
          Review Queue Clean
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
          All document extractions exceed confidence thresholds. No manual intervention required.
        </p>
        <Link
          href="/documents"
          className="inline-block px-4 py-2 text-xs font-semibold text-white bg-blue-600 rounded-xl"
        >
          View Documents
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Human-in-the-Loop Review
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800">
              {reviewQueue.length} Flagged
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Validate low-confidence extractions (&lt;70%) and audit field-level OCR certainty
          </p>
        </div>

        {/* Success toast banner */}
        {actionSuccessMessage && (
          <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>{actionSuccessMessage}</span>
          </div>
        )}
      </div>

      {/* Queue Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {displayList.map((item) => {
          const isSelected = item.id === currentDoc.id;
          return (
            <button
              key={item.id}
              onClick={() => setSelectedDocId(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-medium shrink-0 transition-all border ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-600 shadow-2xs font-semibold"
                  : "bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span className="truncate max-w-[140px]">{item.name}</span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.2 rounded-full ${
                  isSelected
                    ? "bg-blue-700 text-white"
                    : item.overallConfidence < 0.7
                    ? "bg-amber-100 text-amber-700"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                {Math.round(item.overallConfidence * 100)}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Main Review Workspace: Side-by-Side (Section 22) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[640px]">
        {/* LEFT: Document Preview (6/12) */}
        <div className="lg:col-span-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col overflow-hidden">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40">
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              Source Document: {currentDoc.name}
            </span>
            <span className="text-[11px] text-slate-400">
              {formatBytes(currentDoc.fileSizeBytes)}
            </span>
          </div>

          <div className="flex-1 p-6 bg-slate-100/70 dark:bg-slate-950 flex items-center justify-center overflow-auto">
            <div className="w-full max-w-md aspect-[1/1.3] bg-white text-slate-900 p-6 rounded-lg shadow-lg border border-slate-200 text-xs font-mono space-y-4">
              <div className="border-b pb-2 flex justify-between items-center text-[10px] text-slate-500">
                <span className="font-bold uppercase tracking-wider">{currentDoc.documentType}</span>
                <span>CONF: {(currentDoc.overallConfidence * 100).toFixed(0)}%</span>
              </div>
              <div className="p-3 bg-slate-50 rounded border border-slate-100 text-[11px] whitespace-pre-wrap leading-relaxed">
                {currentDoc.rawOcrText || "OCR text parsing extracted..."}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: AI Extracted Fields & Human Verification Panel (6/12) */}
        <div className="lg:col-span-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between overflow-hidden">
          <div>
            {/* Top Confidence Banner */}
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-amber-50/40 dark:bg-amber-950/20">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span className="text-xs font-bold text-amber-900 dark:text-amber-200">
                  {currentDoc.overallConfidence < 0.7
                    ? "Confidence below 70% threshold — Human verification required"
                    : "Extracted Entities Preview"}
                </span>
              </div>
              <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-400">
                Score: {(currentDoc.overallConfidence * 100).toFixed(1)}%
              </span>
            </div>

            {/* Extracted Fields List with In-Place Correction */}
            <div className="p-5 space-y-3 max-h-[420px] overflow-y-auto">
              {currentDoc.extractedFields?.map((field) => {
                const isEditing = field.id === editingFieldId;
                const isLowConfidence = field.confidence < 0.7;

                return (
                  <div
                    key={field.id}
                    className={`p-3.5 rounded-xl border transition-all ${
                      isLowConfidence
                        ? "border-amber-300 dark:border-amber-800/80 bg-amber-50/30 dark:bg-amber-950/10"
                        : "border-slate-200/80 dark:border-slate-800"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                            {field.fieldLabel}
                          </span>
                          {isLowConfidence && (
                            <span className="text-[10px] font-bold text-amber-600 bg-amber-100 dark:bg-amber-950/60 px-1.5 py-0.2 rounded">
                              Low Confidence
                            </span>
                          )}
                        </div>

                        {isEditing ? (
                          <div className="mt-2 space-y-2">
                            <input
                              type="text"
                              value={editValue}
                              onChange={(e) => setEditValue(e.target.value)}
                              className="w-full px-3 py-1.5 text-xs rounded-lg border border-blue-400 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                              placeholder="Correct value..."
                              autoFocus
                            />
                            <input
                              type="text"
                              value={editComment}
                              onChange={(e) => setEditComment(e.target.value)}
                              className="w-full px-3 py-1 text-[11px] rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 focus:outline-hidden"
                              placeholder="Optional reason for change (e.g. OCR blur)"
                            />
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleSaveFieldEdit(field.id)}
                                className="px-3 py-1 rounded-md text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white"
                              >
                                Save Correction
                              </button>
                              <button
                                onClick={() => setEditingFieldId(null)}
                                className="px-2 py-1 text-xs text-slate-400 hover:text-slate-600"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                            {field.extractedValue}
                          </p>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <span
                          className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                            field.confidence >= 0.9
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400"
                          }`}
                        >
                          {(field.confidence * 100).toFixed(0)}%
                        </span>

                        {!isEditing && (
                          <button
                            onClick={() => handleStartFieldEdit(field)}
                            className="p-1 rounded-md text-slate-400 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Edit Field"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>

                    {field.isCorrected && (
                      <div className="mt-2 text-[10px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Corrected by human verifier</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Review Action Bar (Section 22) */}
          <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 space-y-3">
            <input
              type="text"
              placeholder="Add verification note or rationale (optional)..."
              value={reviewDecisionNote}
              onChange={(e) => setReviewDecisionNote(e.target.value)}
              className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
            />

            <div className="flex items-center justify-between gap-3">
              <button
                onClick={handleRejectDocument}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors"
              >
                Reject Document
              </button>

              <button
                onClick={handleApproveExtraction}
                className="px-5 py-2 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 shadow-xs transition-colors flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Approve Extraction</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HumanReviewPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-slate-400">
          Loading human review queue...
        </div>
      }
    >
      <HumanReviewContent />
    </Suspense>
  );
}
