"use client";

import React, { useState, useEffect, useRef, use, useMemo } from "react";
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
  X,
  ChevronRight,
  GitBranch,
  History,
  MessageSquare,
  Send,
  Building2,
  FileCheck,
  Calendar,
  Layers,
  CreditCard,
  ChevronDown,
  Globe,
  Copy,
  ShieldCheck,
  ArrowRight,
} from "lucide-react";
import { useApp } from "@/lib/store/app-context";
import { ExtractedField, BoundingBox, DocumentCategory, ApprovalTask } from "@/types";
import { processDocumentContent, generateDocumentSummary, healDocumentItem } from "@/lib/ai/document-processor";
import { evaluateRules } from "@/lib/rules/rule-evaluator";
import { formatBytes, formatTimeAgo, formatCurrency } from "@/lib/utils";
import {
  SUPPORTED_LANGUAGES,
  translateSummary,
  translateFieldLabel,
} from "@/lib/ai/translator";

interface CommentItem {
  id: string;
  author: string;
  avatarUrl?: string;
  role: string;
  text: string;
  timestamp: string;
}

export default function DocumentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const {
    documents,
    updateDocumentField,
    updateDocument,
    logAudit,
    auditLogs,
    currentUser,
    rules,
    approvals,
    addApproval,
    addNotification,
  } = useApp();

  const doc = documents.find((d) => d.id === resolvedParams.id);
  const [activeTab, setActiveTab] = useState<"data" | "workflow" | "history" | "comments">("data");
  const [selectedLang, setSelectedLang] = useState<string>("en");
  const [isSummaryCopied, setIsSummaryCopied] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editedValue, setEditedValue] = useState("");
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<CommentItem[]>([
    {
      id: "c-1",
      author: "System AI Agent",
      role: "AUTOMATION",
      text: "Document parsed and structured entities extracted with composite confidence score.",
      timestamp: "Just now",
    },
  ]);

  const healedDocIdRef = useRef<string | null>(null);

  // Auto-heal distorted entity extractions, misclassified reports, and legacy mock fields
  useEffect(() => {
    if (!doc || healedDocIdRef.current === doc.id) return;
    const healed = healDocumentItem(doc);
    if (healed !== doc) {
      healedDocIdRef.current = doc.id;
      updateDocument(doc.id, {
        documentType: healed.documentType,
        classificationConfidence: healed.classificationConfidence,
        overallConfidence: healed.overallConfidence,
        extractedFields: healed.extractedFields,
        rawOcrText: healed.rawOcrText,
        summary: healed.summary,
        dueDate: healed.dueDate,
      });
    } else {
      healedDocIdRef.current = doc.id;
    }
  }, [doc?.id]);

  if (!doc) {
    return (
      <div className="clean-card p-12 text-center max-w-md mx-auto my-12">
        <FileText className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">Document not found</h2>
        <p className="text-xs text-slate-500 mt-1">The requested document does not exist in your workspace.</p>
        <Link
          href="/documents"
          className="mt-4 inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white btn-primary-gradient rounded-xl shadow-sm"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Documents</span>
        </Link>
      </div>
    );
  }

  const handleStartEdit = (field: ExtractedField) => {
    setEditingFieldId(field.id);
    setEditedValue(field.extractedValue);
  };

  const handleSaveEdit = (fieldId: string) => {
    if (!editedValue.trim()) return;
    updateDocumentField(doc.id, fieldId, editedValue.trim(), "Manual correction via Document Studio");
    setEditingFieldId(null);
  };

  const handleCancelEdit = () => {
    setEditingFieldId(null);
    setEditedValue("");
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const commentObj: CommentItem = {
      id: `c-${Date.now()}`,
      author: currentUser.fullName,
      avatarUrl: currentUser.avatarUrl,
      role: currentUser.role,
      text: newComment.trim(),
      timestamp: "Just now",
    };
    setComments((prev) => [commentObj, ...prev]);
    setNewComment("");
    logAudit("DOCUMENT_COMMENT", "DOCUMENT", `Added comment on ${doc.name}: "${commentObj.text}"`, {
      documentId: doc.id,
    });
  };

  // Helper to extract fields for document sheet rendering
  const getFieldValue = (keys: string[], fallback = ""): string => {
    if (!doc.extractedFields || doc.extractedFields.length === 0) return fallback;
    const found = doc.extractedFields.find((f) =>
      keys.some(
        (k) =>
          f.fieldName.toLowerCase() === k.toLowerCase() ||
          f.fieldName.toLowerCase().includes(k.toLowerCase()) ||
          f.fieldLabel.toLowerCase().includes(k.toLowerCase())
      )
    );
    return found ? found.extractedValue : fallback;
  };

  const [isRunningWorkflow, setIsRunningWorkflow] = useState(false);
  const [workflowNotice, setWorkflowNotice] = useState<{
    type: "STP" | "APPROVAL" | "QUARANTINE";
    title: string;
    description: string;
    ruleName?: string;
  } | null>(null);

  const docApproval = useMemo(() => {
    if (!doc) return undefined;
    return approvals.find((a) => a.documentId === doc.id && a.status === "PENDING");
  }, [approvals, doc]);

  const handleRunWorkflow = () => {
    if (!doc) return;
    setIsRunningWorkflow(true);
    setActiveTab("workflow");
    updateDocument(doc.id, { status: "WORKFLOW_RUNNING" });
    logAudit("WORKFLOW_TRIGGERED", "WORKFLOW", `Triggered processing workflow for ${doc.name}`, {
      documentId: doc.id,
    });

    setTimeout(() => {
      setIsRunningWorkflow(false);

      // Run dynamic rule evaluation on this document
      const ruleResults = evaluateRules(doc, rules);
      const triggered = ruleResults.find((r) => r.matched);

      if (triggered && triggered.actionTriggered?.generatedApproval) {
        const generated = triggered.actionTriggered.generatedApproval as ApprovalTask;
        addApproval(generated);
        updateDocument(doc.id, {
          status: "WORKFLOW_RUNNING",
          ruleTriggered: triggered.rule.name,
        });
        addNotification({
          title: "Approval Task Generated",
          message: `${triggered.rule.name} triggered for ${doc.name}. Routed to ${generated.requiredRole} queue.`,
          type: "approval",
          documentId: doc.id,
        });
        setWorkflowNotice({
          type: "APPROVAL",
          title: "Approval Gate Triggered",
          description: `Rule "${triggered.rule.name}" satisfied. Manager sign-off task generated for ${generated.vendorOrRequester} (${formatCurrency(generated.amount || 0)}).`,
          ruleName: triggered.rule.name,
        });
      } else if (doc.overallConfidence < 0.70) {
        updateDocument(doc.id, { status: "REVIEW_REQUIRED" });
        setWorkflowNotice({
          type: "QUARANTINE",
          title: "Confidence Floor Quarantined",
          description: `Composite extraction certainty (${Math.round(doc.overallConfidence * 100)}%) is below the automated threshold (70%). Human verification required.`,
        });
      } else {
        // Straight-Through Processing (STP)
        updateDocument(doc.id, { status: "READY" });
        logAudit("STP_APPROVED", "WORKFLOW", `Document ${doc.name} approved automatically via Straight-Through Processing (STP).`, {
          documentId: doc.id,
        });
        addNotification({
          title: "Straight-Through Approved",
          message: `${doc.name} approved via Straight-Through Processing. No manager signoff required.`,
          type: "workflow",
          documentId: doc.id,
        });
        setWorkflowNotice({
          type: "STP",
          title: "Straight-Through Processing (STP) Approved",
          description: `Document passed all automated validation gates with ${Math.round(doc.overallConfidence * 100)}% confidence. The amount is under the high-value threshold (₹50,000), so no manual approval is needed.`,
        });
      }
    }, 700);
  };

  const handleForceRouteApproval = () => {
    if (!doc) return;
    const vendorVal = getFieldValue(["vendor", "merchant", "seller", "supplier"], doc.name);
    const totalRaw = getFieldValue(["total", "amount"], "0").replace(/[^0-9.-]/g, "");
    const totalVal = parseFloat(totalRaw) || 0;

    const manualApproval: ApprovalTask = {
      id: `appr-manual-${Date.now()}`,
      organizationId: doc.organizationId,
      documentId: doc.id,
      documentName: doc.name,
      documentType: doc.documentType,
      title: `${doc.documentType} Signoff: ${vendorVal}`,
      description: `Manually routed for managerial signoff from Document Studio for ${doc.name}.`,
      requiredRole: "MANAGER",
      status: "PENDING",
      amount: totalVal,
      currency: "INR",
      vendorOrRequester: vendorVal,
      confidence: doc.overallConfidence,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 48 * 3600 * 1000).toISOString(),
    };

    addApproval(manualApproval);
    updateDocument(doc.id, { status: "WORKFLOW_RUNNING", ruleTriggered: "Manual Manager Sign-off Gate" });
    addNotification({
      title: "Approval Task Generated",
      message: `Manual signoff task created for ${vendorVal} (${doc.name}).`,
      type: "approval",
      documentId: doc.id,
    });
    router.push("/approvals");
  };

  // Audit logs related to this document
  const documentLogs = useMemo(() => {
    return auditLogs.filter(
      (log) => log.documentId === doc.id || log.documentName === doc.name
    );
  }, [auditLogs, doc.id, doc.name]);

  // Detected or explicit document currency
  const documentCurrency = useMemo(() => {
    const curField = doc?.extractedFields?.find(
      (f) => f.fieldName.toLowerCase() === "currency"
    );
    if (curField?.extractedValue) {
      const v = curField.extractedValue.trim().toUpperCase();
      if (v === "$" || v === "USD") return "USD";
      if (v === "€" || v === "EUR") return "EUR";
      if (v === "£" || v === "GBP") return "GBP";
      if (v === "₹" || v === "INR") return "INR";
      return v;
    }
    if (doc?.rawOcrText?.includes("$") || doc?.name?.toLowerCase().includes("usd")) return "USD";
    return "INR";
  }, [doc]);

  // Executive 4-5 line summary
  const rawDocSummary = useMemo(() => {
    if (doc.summary) return doc.summary;
    const { summary } = generateDocumentSummary(
      doc.documentType,
      doc.extractedFields || [],
      doc.rawOcrText || "",
      doc.name
    );
    return summary;
  }, [doc]);

  const translatedSummary = useMemo(() => {
    return translateSummary(rawDocSummary, selectedLang);
  }, [rawDocSummary, selectedLang]);

  const isPdf =
    doc.mimeType === "application/pdf" ||
    doc.name.toLowerCase().endsWith(".pdf");
  const isImage =
    doc.mimeType.startsWith("image/") ||
    /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(doc.name);

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Breadcrumb Navigation */}
      <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
        <Link href="/documents" className="hover:text-blue-600 transition-colors flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Documents</span>
        </Link>
        <span>&gt;</span>
        <span className="font-semibold text-slate-800 dark:text-white truncate max-w-sm">
          {doc.name}
        </span>
      </div>

      {/* Top Header: Title, Badges, and Action Buttons */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-white/[0.08]">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight break-all">
            {doc.name}
          </h1>

          <div className="relative inline-flex items-center">
            <select
              value={doc.documentType}
              onChange={async (e) => {
                const newType = e.target.value as DocumentCategory;
                const reprocessed = await processDocumentContent(
                  doc.name,
                  doc.rawOcrText
                );
                updateDocument(doc.id, {
                  documentType: newType,
                  extractedFields: reprocessed.extractedFields,
                  rawOcrText: reprocessed.rawOcrText,
                  summary: reprocessed.summary,
                  dueDate: reprocessed.dueDate,
                });
                logAudit("DOCUMENT_RECLASSIFIED", "DOCUMENT", `Reclassified ${doc.name} as ${newType}`, {
                  documentId: doc.id,
                  diff: { oldValue: doc.documentType, newValue: newType },
                });
              }}
              className="appearance-none cursor-pointer pl-3 pr-7 py-1 rounded-full text-xs font-bold bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-300 border border-blue-200 dark:border-blue-800 focus:outline-hidden hover:bg-blue-100 transition-colors shadow-2xs"
              title="Click to switch document category"
            >
              <option value="Invoice">Invoice</option>
              <option value="Purchase Order">Purchase Order</option>
              <option value="Receipt">Receipt</option>
              <option value="Report">Report</option>
              <option value="Contract">Contract</option>
              <option value="Bank Statement">Bank Statement</option>
              <option value="Delivery Note">Delivery Note</option>
              <option value="Other">Other</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-blue-500 absolute right-2 pointer-events-none" />
          </div>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
            {doc.status}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            {Math.round(doc.overallConfidence * 100)}% Confidence
          </span>
        </div>

        {/* Action Buttons: Share, Download, Run Workflow */}
        <div className="flex items-center gap-2 self-start lg:self-auto">
          <button
            type="button"
            onClick={() => {
              navigator.clipboard?.writeText(window.location.href);
              alert("Document studio link copied to clipboard!");
            }}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share</span>
          </button>

          <a
            href={doc.previewUrl || "#"}
            download={doc.name}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download</span>
          </a>

          <button
            type="button"
            onClick={handleRunWorkflow}
            disabled={isRunningWorkflow}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-white btn-primary-gradient transition-all cursor-pointer shadow-md hover:shadow-lg disabled:opacity-60"
          >
            {isRunningWorkflow ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running Pipeline...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run Workflow</span>
              </>
            )}
          </button>

          {["Invoice", "Purchase Order", "Receipt"].includes(doc.documentType) && (
            <Link
              href="/payments"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 shadow-2xs hover:shadow-sm transition-all"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Disburse Payment</span>
            </Link>
          )}
        </div>
      </div>

      {/* Split Screen Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[680px]">
        {/* LEFT PANE (7/12): Document Viewer with Real PDF/Image/Sheet Canvas */}
        <div className="lg:col-span-7 clean-card flex flex-col overflow-hidden bg-slate-900 border-slate-800 text-white min-h-[600px]">
          {/* Viewer Toolbar */}
          <div className="h-12 px-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <span>{activePage} / {doc.pageCount || 1}</span>
              <div className="flex items-center gap-1 bg-slate-800 px-2 py-1 rounded-lg">
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.max(50, z - 10))}
                  className="hover:text-white px-1 cursor-pointer font-bold"
                  title="Zoom Out"
                >
                  -
                </button>
                <span className="font-mono text-[11px] text-white">{zoomLevel}%</span>
                <button
                  type="button"
                  onClick={() => setZoomLevel((z) => Math.min(150, z + 10))}
                  className="hover:text-white px-1 cursor-pointer font-bold"
                  title="Zoom In"
                >
                  +
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleRotate}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer"
                title="Rotate 90°"
              >
                <RotateCw className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setZoomLevel(100)}
                className="p-1.5 hover:text-white hover:bg-slate-800 rounded-lg cursor-pointer text-[11px]"
                title="Reset Zoom"
              >
                Reset
              </button>
            </div>
          </div>

          {/* Viewer Main Body */}
          <div className="flex-1 flex overflow-hidden bg-slate-950 p-4 gap-4">
            {/* Page Thumbnails Column */}
            <div className="w-16 shrink-0 flex flex-col gap-3 overflow-y-auto">
              {Array.from({ length: doc.pageCount || 1 }).map((_, idx) => {
                const p = idx + 1;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setActivePage(p)}
                    className={`w-full aspect-[3/4] rounded-lg border-2 p-1 bg-white text-slate-800 transition-all cursor-pointer ${
                      activePage === p
                        ? "border-blue-500 shadow-md ring-2 ring-blue-500/20"
                        : "border-slate-700 opacity-60 hover:opacity-100"
                    }`}
                  >
                    <div className="w-full h-full bg-slate-100 rounded text-[8px] flex items-center justify-center font-bold text-slate-500">
                      p. {p}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Document Render Area */}
            <div className="flex-1 overflow-auto flex items-start justify-center p-2">
              {/* Option A: If file has a direct PDF preview URL */}
              {doc.previewUrl && isPdf ? (
                <div
                  style={{
                    transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                    transformOrigin: "top center",
                    transition: "transform 0.2s ease-out",
                  }}
                  className="w-full h-[640px] rounded-xl overflow-hidden bg-white shadow-2xl"
                >
                  <iframe
                    src={doc.previewUrl}
                    className="w-full h-full border-0"
                    title={doc.name}
                  />
                </div>
              ) : doc.previewUrl && isImage ? (
                /* Option B: If file has a direct Image preview URL */
                <div
                  style={{
                    transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                    transformOrigin: "top center",
                    transition: "transform 0.2s ease-out",
                  }}
                  className="max-w-lg w-full bg-white rounded-xl shadow-2xl overflow-hidden p-2 flex items-center justify-center"
                >
                  <img
                    src={doc.previewUrl}
                    alt={doc.name}
                    className="max-w-full max-h-[600px] object-contain rounded-lg"
                  />
                </div>
              ) : (
                /* Option C: Dynamic High-Fidelity Document Sheet View tailored to Document Type */
                <div
                  style={{
                    transform: `scale(${zoomLevel / 100}) rotate(${rotation}deg)`,
                    transformOrigin: "top center",
                    transition: "transform 0.2s ease-out",
                  }}
                  className="w-full max-w-xl min-h-[580px] bg-white text-slate-900 rounded-xl shadow-2xl p-7 select-text font-sans text-xs relative overflow-hidden"
                >
                  {/* Subtle Top Accent Ribbon */}
                  <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600" />

                  {/* Document Type Header Badge & Title */}
                  <div className="flex items-start justify-between border-b pb-4 mb-4">
                    <div>
                      <div className="text-[10px] font-black uppercase tracking-wider text-blue-600">
                        {doc.documentType} Document
                      </div>
                      <h2 className="text-base font-extrabold text-slate-900 mt-0.5 break-all">
                        {doc.name}
                      </h2>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                        SHA-256: {doc.fileHash} • {formatBytes(doc.fileSizeBytes)}
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded text-[10px] font-extrabold uppercase bg-slate-100 text-slate-700">
                        Page {activePage}
                      </span>
                    </div>
                  </div>

                  {/* Case 1: REPORT SHEET */}
                  {doc.documentType === "Report" ? (
                    <div className="space-y-4">
                      {/* Executive Summary Card */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-bold uppercase text-slate-400">
                          Executive Summary
                        </div>
                        <p className="text-xs text-slate-800 font-medium mt-1 leading-relaxed whitespace-pre-line">
                          {doc.rawOcrText ||
                            "System report generated and validated. Performance telemetry and pipeline execution benchmarks are operational."}
                        </p>
                      </div>

                      {/* Extracted Metadata Grid */}
                      <div className="grid grid-cols-2 gap-3 text-[11px] border-y py-3">
                        <div>
                          <span className="text-slate-400 block text-[10px]">Report Title:</span>
                          <span className="font-bold text-slate-900">
                            {getFieldValue(["report_title", "title"], doc.name)}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Reporting Period:</span>
                          <span className="font-bold text-slate-900">
                            {getFieldValue(["reporting_period", "period"], "Execution Cycle")}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Department / Team:</span>
                          <span className="font-bold text-slate-900">
                            {getFieldValue(["department", "dept"], "Systems Architecture")}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400 block text-[10px]">Audit Status:</span>
                          <span className="font-bold text-emerald-600">
                            {getFieldValue(["system_status", "status"], "Completed & Verified")}
                          </span>
                        </div>
                      </div>

                      {/* Raw Extracted Entities Breakdown */}
                      <div>
                        <div className="text-[10px] font-bold uppercase text-slate-400 mb-2">
                          Extracted Entities Table
                        </div>
                        <table className="w-full text-left text-[11px] border rounded-lg overflow-hidden">
                          <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b">
                            <tr>
                              <th className="p-2">Entity Field</th>
                              <th className="p-2">Extracted Value</th>
                              <th className="p-2 text-right">Confidence</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(doc.extractedFields || []).map((f) => (
                              <tr key={f.id} className="hover:bg-slate-50">
                                <td className="p-2 font-medium text-slate-700">{f.fieldLabel}</td>
                                <td className="p-2 font-bold text-slate-900">{f.extractedValue}</td>
                                <td className="p-2 text-right font-mono text-emerald-600">
                                  {Math.round(f.confidence * 100)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : doc.documentType === "Invoice" ? (
                    /* Case 2: INVOICE SHEET WITH REAL DATA */
                    <div className="space-y-4">
                      {/* Vendor & Invoice Metadata */}
                      <div className="grid grid-cols-2 gap-4 pb-4 border-b text-[11px]">
                        <div>
                          <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">
                            Vendor / Supplier:
                          </span>
                          <strong className="text-slate-900 block font-bold text-sm">
                            {getFieldValue(["vendor", "supplier", "merchant"]) || (
                              <span className="text-amber-600 font-normal italic text-xs">
                                — (Missing Vendor)
                              </span>
                            )}
                          </strong>
                          <span className="text-slate-500 text-[10px] block">
                            GSTIN: 27AABCH4920E1ZF
                          </span>
                        </div>

                        <div className="text-right space-y-0.5 text-[10px]">
                          <div>
                            <span className="text-slate-400">Invoice No: </span>
                            <strong className="font-mono text-slate-900 text-xs">
                              {getFieldValue(["invoice_number", "number"]) || (
                                <span className="text-amber-600 font-normal italic text-xs">
                                  — (Missing)
                                </span>
                              )}
                            </strong>
                          </div>
                          <div>
                            <span className="text-slate-400">Date: </span>
                            <span className="text-slate-700">
                              {getFieldValue(["invoice_date", "date"]) || (
                                <span className="text-amber-600 font-normal italic text-xs">
                                  — (Missing)
                                </span>
                              )}
                            </span>
                          </div>
                          <div>
                            <span className="text-slate-400">Due Date: </span>
                            <span className="text-slate-700 font-semibold">
                              {getFieldValue(["due_date", "due"]) || (
                                <span className="text-amber-600 font-normal italic text-xs">
                                  — (Missing)
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Items / Content Breakdown */}
                      <div className="py-2">
                        <table className="w-full text-left text-[11px]">
                          <thead>
                            <tr className="border-b font-bold text-slate-400 uppercase text-[9px]">
                              <th className="py-2">Description / Entity</th>
                              <th className="py-2 text-right">Value</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(doc.extractedFields || []).map((f) => (
                              <tr key={f.id}>
                                <td className="py-2 font-medium text-slate-700">{f.fieldLabel}</td>
                                <td className="py-2 text-right font-bold text-slate-900">
                                  {f.extractedValue ? (
                                    f.dataType === "currency"
                                      ? formatCurrency(f.extractedValue, documentCurrency)
                                      : f.extractedValue
                                  ) : (
                                    <span className="text-amber-600 italic font-normal text-[10px]">
                                      — (Missing)
                                    </span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Subtotal & Total */}
                      <div className="border-t pt-3 space-y-1 text-[11px] text-right">
                        <div className="flex justify-between text-slate-500">
                          <span>Subtotal</span>
                          <span className="font-mono">
                            {getFieldValue(["subtotal"])
                              ? formatCurrency(getFieldValue(["subtotal"]), documentCurrency)
                              : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-500">
                          <span>Tax / VAT</span>
                          <span className="font-mono">
                            {getFieldValue(["tax", "gst", "vat"])
                              ? formatCurrency(getFieldValue(["tax", "gst", "vat"]), documentCurrency)
                              : "—"}
                          </span>
                        </div>
                        <div className="flex justify-between text-slate-900 font-black text-sm pt-2 border-t">
                          <span>Total Amount</span>
                          <span className="text-blue-600 font-mono font-black">
                            {getFieldValue(["total", "amount"])
                              ? formatCurrency(getFieldValue(["total", "amount"]), documentCurrency)
                              : <span className="text-amber-600 italic font-normal text-xs">— (Pending Review)</span>}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    /* Case 3: GENERIC DOCUMENT SHEET (PO, Contract, Leave, Form, Other) */
                    <div className="space-y-4">
                      {/* Document Overview Card */}
                      <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200">
                        <div className="text-[10px] font-bold uppercase text-slate-400">
                          Extracted Content Stream
                        </div>
                        <p className="text-xs text-slate-800 font-medium mt-1 leading-relaxed whitespace-pre-line">
                          {doc.rawOcrText ||
                            "Document ingested and classified. Structured fields extracted and validated against schema."}
                        </p>
                      </div>

                      {/* Fields Table */}
                      <div>
                        <div className="text-[10px] font-bold uppercase text-slate-400 mb-2">
                          Structured Fields & Metadata
                        </div>
                        <table className="w-full text-left text-[11px] border rounded-lg overflow-hidden">
                          <thead className="bg-slate-50 text-[10px] text-slate-400 uppercase font-bold border-b">
                            <tr>
                              <th className="p-2">Attribute</th>
                              <th className="p-2">Extracted Value</th>
                              <th className="p-2 text-right">Confidence</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100">
                            {(doc.extractedFields || []).map((f) => (
                              <tr key={f.id} className="hover:bg-slate-50">
                                <td className="p-2 font-medium text-slate-700">{f.fieldLabel}</td>
                                <td className="p-2 font-bold text-slate-900">
                                  {f.dataType === "currency"
                                    ? formatCurrency(f.extractedValue, documentCurrency)
                                    : f.extractedValue}
                                </td>
                                <td className="p-2 text-right font-mono text-emerald-600">
                                  {Math.round(f.confidence * 100)}%
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* Verification Watermark at bottom */}
                  <div className="mt-8 pt-3 border-t flex items-center justify-between text-[10px] text-slate-400">
                    <span>AI-FLOW Automated Pipeline Engine</span>
                    <span>Status: {doc.status}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT PANE (5/12): Tabs (Extracted Data, Workflow, History, Comments) */}
        <div className="lg:col-span-5 clean-card flex flex-col p-5">
          {/* AI Executive Summary Card (4-5 Lines with Live Multilingual Translation) */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-blue-50/80 via-indigo-50/30 to-white dark:from-blue-950/40 dark:via-slate-900/60 dark:to-slate-900 border border-blue-200/80 dark:border-blue-900/50 shadow-xs mb-4">
            <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-blue-100 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-xs">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Executive Summary</span>
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-extrabold bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300">
                      4-5 Line Briefing
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400">
                    AI synthesis &amp; operational status
                  </p>
                </div>
              </div>

              {/* Language Selector & Copy Action */}
              <div className="flex items-center gap-1.5">
                <div className="relative inline-flex items-center">
                  <Globe className="w-3 h-3 text-slate-400 absolute left-2 pointer-events-none" />
                  <select
                    value={selectedLang}
                    onChange={(e) => setSelectedLang(e.target.value)}
                    className="pl-6 pr-7 py-1 text-[11px] font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 shadow-2xs focus:outline-hidden cursor-pointer"
                    title="Translate summary and extracted field labels"
                  >
                    {SUPPORTED_LANGUAGES.map((l) => (
                      <option key={l.code} value={l.code}>
                        {l.flag} {l.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 pointer-events-none" />
                </div>

                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard?.writeText(translatedSummary);
                    setIsSummaryCopied(true);
                    setTimeout(() => setIsSummaryCopied(false), 2000);
                  }}
                  className="p-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-600 dark:text-slate-300 shadow-2xs transition-all cursor-pointer flex items-center gap-1 text-[11px] font-medium"
                  title="Copy translated summary"
                >
                  {isSummaryCopied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* 4 to 5 Lines Rendered with Numbered Bullet Badges */}
            <div className="space-y-2">
              {translatedSummary.split("\n").filter(Boolean).map((line, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 dark:text-slate-200 leading-relaxed">
                  <span className="w-4 h-4 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-[10px] font-extrabold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="font-medium">{line}</span>
                </div>
              ))}
            </div>

            {/* Target Settlement / Due Date Indicator */}
            {(doc.dueDate || doc.extractedFields?.find((f) => f.fieldName.toLowerCase().includes("due"))) && (
              <div className="mt-3 pt-2.5 border-t border-blue-100/60 dark:border-white/[0.06] flex items-center justify-between text-[11px]">
                <span className="text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-blue-500" />
                  Target Settlement Deadline:
                </span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {doc.dueDate || doc.extractedFields?.find((f) => f.fieldName.toLowerCase().includes("due"))?.extractedValue}
                </span>
              </div>
            )}
          </div>

          {/* Tabs Navigation */}
          <div className="flex items-center gap-4 border-b border-slate-200 dark:border-white/[0.08] pb-3 mb-4 text-xs font-semibold">
            {[
              { id: "data", label: "Extracted Data", icon: FileCheck },
              { id: "workflow", label: "Workflow", icon: GitBranch },
              { id: "history", label: "History", icon: History },
              { id: "comments", label: "Comments", icon: MessageSquare },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`pb-1 flex items-center gap-1.5 transition-colors cursor-pointer ${
                    activeTab === tab.id
                      ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                      : "text-slate-400 hover:text-slate-700 dark:hover:text-slate-200"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: EXTRACTED DATA */}
          {activeTab === "data" && (
            <div className="space-y-2.5 overflow-y-auto max-h-[580px] pr-1">
              {/* Quick Image OCR Re-sync bar */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/40 text-[11px] mb-2">
                <span className="text-blue-700 dark:text-blue-300 font-semibold flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                  Optical Entity Sync
                </span>
                <button
                  type="button"
                  onClick={async () => {
                    const reprocessed = await processDocumentContent(doc.name, doc.rawOcrText);
                    updateDocument(doc.id, {
                      documentType: reprocessed.documentType,
                      classificationConfidence: reprocessed.classificationConfidence,
                      overallConfidence: reprocessed.overallConfidence,
                      rawOcrText: reprocessed.rawOcrText,
                      extractedFields: reprocessed.extractedFields,
                      summary: reprocessed.summary,
                      dueDate: reprocessed.dueDate,
                    });
                    logAudit("OCR_RESYNC", "DOCUMENT", `Resynced OCR entities for ${doc.name}`, {
                      documentId: doc.id,
                    });
                  }}
                  className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10px] shadow-2xs transition-all flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Resync &amp; Recalculate OCR</span>
                </button>
              </div>

              {doc.extractedFields && doc.extractedFields.length > 0 ? (
                doc.extractedFields.map((field) => {
                  const percentage = Math.round(field.confidence * 100);
                  const isHigh = percentage >= 90;
                  const isMed = percentage >= 70 && percentage < 90;
                  const isEditing = editingFieldId === field.id;

                  return (
                    <div
                      key={field.id}
                      className="p-3.5 rounded-xl border border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] flex items-center justify-between gap-3 group hover:border-slate-200 dark:hover:border-white/15 transition-colors"
                    >
                      {isEditing ? (
                        <div className="flex items-center gap-2 w-full">
                          <div className="flex-1">
                            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                              Editing: {translateFieldLabel(field.fieldLabel, selectedLang)}
                            </span>
                            <input
                              type="text"
                              value={editedValue}
                              onChange={(e) => setEditedValue(e.target.value)}
                              className="w-full px-2.5 py-1 text-xs border border-blue-400 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                              autoFocus
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => handleSaveEdit(field.id)}
                            className="p-1.5 text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 rounded-lg cursor-pointer"
                            title="Save Correction"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="p-1.5 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer"
                            title="Cancel"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                                {translateFieldLabel(field.fieldLabel, selectedLang)}
                              </span>
                              {field.isCorrected && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-amber-500/10 text-amber-500">
                                  Corrected
                                </span>
                              )}
                            </div>
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
                              {field.extractedValue ? (
                                field.dataType === "currency"
                                  ? formatCurrency(field.extractedValue, documentCurrency)
                                  : field.extractedValue
                              ) : (
                                <span className="text-amber-600 dark:text-amber-400 font-normal italic text-[11px]">
                                  — (Missing / Click pencil to edit)
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Confidence Bar & Edit Button */}
                          <div className="flex items-center gap-3 shrink-0">
                            <div className="flex items-center gap-1.5">
                              <div className="w-12 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full ${
                                    percentage === 0
                                      ? "bg-red-500"
                                      : isHigh
                                      ? "bg-emerald-500"
                                      : isMed
                                      ? "bg-indigo-500"
                                      : "bg-amber-500"
                                  }`}
                                  style={{ width: `${Math.max(percentage, 5)}%` }}
                                />
                              </div>
                              <span
                                className={`text-[10px] font-bold tabular-nums font-mono ${
                                  percentage === 0
                                    ? "text-red-500 dark:text-red-400"
                                    : isHigh
                                    ? "text-emerald-600 dark:text-emerald-400"
                                    : isMed
                                    ? "text-indigo-600 dark:text-indigo-400"
                                    : "text-amber-600 dark:text-amber-400"
                                }`}
                              >
                                {percentage === 0 ? "Missing (0%)" : `${percentage}%`}
                              </span>
                            </div>

                            <button
                              type="button"
                              onClick={() => handleStartEdit(field)}
                              className="p-1 text-slate-400 hover:text-blue-600 transition-colors cursor-pointer"
                              title="Edit field value"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-12 text-slate-400 space-y-2">
                  <FileText className="w-8 h-8 mx-auto text-slate-300" />
                  <p className="text-xs font-semibold">No entities extracted yet</p>
                  <p className="text-[11px] text-slate-400">
                    Click &quot;Run Workflow&quot; above to trigger entity extraction on this file.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: DYNAMIC WORKFLOW EXECUTION DAG */}
          {activeTab === "workflow" && (
            <div className="space-y-4 overflow-y-auto max-h-[580px] pr-1">
              {/* Dynamic Status Banner */}
              {docApproval ? (
                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                  <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                      Manager Sign-off Required ({docApproval.requiredRole})
                    </div>
                    <p className="text-[11px] text-amber-700 dark:text-amber-300 mt-0.5">
                      {docApproval.description}
                    </p>
                    <Link
                      href="/approvals"
                      className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-amber-800 dark:text-amber-200 hover:underline"
                    >
                      <span>Review in Approval Management</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              ) : workflowNotice?.type === "QUARANTINE" || doc.status === "REVIEW_REQUIRED" ? (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-rose-900 dark:text-rose-200">
                      Quarantined to Human Review (Confidence Floor / Missing Entities)
                    </div>
                    <p className="text-[11px] text-rose-700 dark:text-rose-300 mt-0.5">
                      {workflowNotice?.description || "Extraction certainty is below the automated STP threshold. Verify entities in the Extracted Data tab."}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                      Straight-Through Processing (STP) Verified
                    </div>
                    <p className="text-[11px] text-emerald-700 dark:text-emerald-300 mt-0.5">
                      {workflowNotice?.description ||
                        `Document passed all deterministic validations with ${Math.round(doc.overallConfidence * 100)}% certainty. Amount is under the managerial sign-off threshold.`}
                    </p>
                    {["Invoice", "Purchase Order", "Receipt"].includes(doc.documentType) && (
                      <Link
                        href="/payments"
                        className="inline-flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-800 dark:text-emerald-200 hover:underline"
                      >
                        <span>Proceed to Payment Disbursement (2FA PIN)</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    )}
                  </div>
                </div>
              )}

              {/* Deterministic Rule Policy Evaluation Matrix for THIS Document */}
              <div className="p-3 rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-slate-900/40 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                    Deterministic Business Rules Evaluation
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    Category: {doc.documentType}
                  </span>
                </div>
                <div className="space-y-1.5">
                  {rules.map((rule) => {
                    const totalRaw = getFieldValue(["total", "amount"], "0").replace(/[^0-9.-]/g, "");
                    const targetVal =
                      rule.condition.field === "total"
                        ? parseFloat(totalRaw) || 0
                        : rule.condition.field === "overallConfidence"
                        ? doc.overallConfidence
                        : 0;
                    const appliesToDoc =
                      rule.targetDocumentType === doc.documentType || rule.targetDocumentType === "Other";
                    const condVal = Number(rule.condition.value);
                    const isMatch =
                      appliesToDoc &&
                      ((rule.condition.operator === ">" && targetVal > condVal) ||
                        (rule.condition.operator === "<" && targetVal < condVal) ||
                        (rule.condition.operator === ">=" && targetVal >= condVal) ||
                        (rule.condition.operator === "<=" && targetVal <= condVal));

                    return (
                      <div
                        key={rule.id}
                        className="p-2 rounded-lg bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.04] flex items-center justify-between text-xs"
                      >
                        <div className="min-w-0 pr-2">
                          <div className="font-semibold text-slate-900 dark:text-slate-100 text-[11px] truncate">
                            {rule.name}
                          </div>
                          <div className="text-[10px] text-slate-400 truncate">
                            {appliesToDoc
                              ? `Tested: ${rule.condition.field} = ${
                                  rule.condition.field === "total"
                                    ? `$${targetVal.toLocaleString()}`
                                    : Math.round(targetVal * 100) + "%"
                                } (${rule.condition.operator} ${rule.condition.value})`
                              : `Not applicable to ${doc.documentType}`}
                          </div>
                        </div>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                            !appliesToDoc
                              ? "bg-slate-100 dark:bg-slate-800 text-slate-500"
                              : isMatch
                              ? "bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300"
                              : "bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300"
                          }`}
                        >
                          {!appliesToDoc ? "N/A" : isMatch ? "TRIGGERED (Approval)" : "PASSED (Clear)"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Dynamic Execution Steps Tailored to THIS Document */}
              <div className="space-y-3">
                {[
                  {
                    step: 1,
                    title: "File Ingestion & Cryptographic Checksum",
                    desc: `SHA-256 hash verified: ${doc.fileHash.substring(0, 16)}... (${formatBytes(doc.fileSizeBytes)})`,
                    status: "COMPLETED",
                  },
                  {
                    step: 2,
                    title: "Native OCR & Layout Tokenization",
                    desc: `Processed ${doc.pageCount || 1} page(s). Open-domain text stream tokenized into ${doc.rawOcrText?.length || 0} characters.`,
                    status: "COMPLETED",
                  },
                  {
                    step: 3,
                    title: "Document Taxonomy Classification",
                    desc: `Identified as ${doc.documentType} (${Math.round(doc.classificationConfidence * 100)}% certainty).`,
                    status: "COMPLETED",
                  },
                  {
                    step: 4,
                    title: "Open-Domain Entity Extraction",
                    desc: `Discovered ${doc.extractedFields?.length || 0} attributes. Vendor: "${getFieldValue(["vendor", "merchant", "seller", "supplier"], "N/A")}", Total: "${getFieldValue(["total", "amount"], "N/A")}".`,
                    status: "COMPLETED",
                  },
                  {
                    step: 5,
                    title: "Confidence Gate Check",
                    desc: `Composite certainty: ${Math.round(doc.overallConfidence * 100)}% (${
                      doc.overallConfidence >= 0.70
                        ? "PASSED Confidence Floor (70%)"
                        : "FLAGGED to Human-in-the-Loop Review"
                    }).`,
                    status: doc.overallConfidence >= 0.70 ? "COMPLETED" : "WARNING",
                  },
                  {
                    step: 6,
                    title: "Downstream Action / Routing Verdict",
                    desc: docApproval
                      ? `Rule triggered: Approval task generated for ${docApproval.requiredRole} queue.`
                      : doc.overallConfidence < 0.70
                      ? "Extraction flagged: Awaiting human review in Document Studio."
                      : "Straight-Through Processing Complete: Document verified and eligible for ledger dispatch.",
                    status: docApproval ? "PENDING_SIGNOFF" : doc.overallConfidence < 0.70 ? "REVIEW" : "COMPLETED",
                  },
                ].map((s) => (
                  <div
                    key={s.step}
                    className="p-3 rounded-xl border border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] flex items-start gap-3"
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                        s.status === "COMPLETED"
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400"
                          : s.status === "PENDING_SIGNOFF"
                          ? "bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400"
                          : "bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400"
                      }`}
                    >
                      {s.status === "COMPLETED" ? "✓" : s.status === "PENDING_SIGNOFF" ? "⏱" : "!"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {s.step}. {s.title}
                        </span>
                        <span
                          className={`text-[10px] font-extrabold uppercase font-mono ${
                            s.status === "COMPLETED"
                              ? "text-emerald-600 dark:text-emerald-400"
                              : s.status === "PENDING_SIGNOFF"
                              ? "text-amber-600 dark:text-amber-400"
                              : "text-rose-600 dark:text-rose-400"
                          }`}
                        >
                          {s.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                        {s.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Workflow Testing Actions */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={handleRunWorkflow}
                  disabled={isRunningWorkflow}
                  className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRunningWorkflow ? "animate-spin" : ""}`} />
                  <span>Re-evaluate Workflow</span>
                </button>

                {!docApproval && (
                  <button
                    type="button"
                    onClick={handleForceRouteApproval}
                    className="inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/50 hover:bg-blue-100 border border-blue-200 dark:border-blue-900 transition-all cursor-pointer"
                  >
                    <span>Force Route to Manager Approval (Test)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: AUDIT HISTORY TIMELINE */}
          {activeTab === "history" && (
            <div className="space-y-3 overflow-y-auto max-h-[580px] pr-1">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Document Audit Log Trail
              </div>

              {documentLogs.length > 0 ? (
                documentLogs.map((log) => (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {log.action}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatTimeAgo(log.timestamp)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {log.detail}
                    </p>
                    <div className="text-[10px] text-slate-400">
                      Actor: {log.actor.name} ({log.actor.role})
                    </div>
                  </div>
                ))
              ) : (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl border border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        DOCUMENT_INGESTED
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatTimeAgo(doc.uploadedAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Uploaded file {doc.name} into repository.
                    </p>
                    <div className="text-[10px] text-slate-400">
                      Actor: {doc.createdBy.fullName}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl border border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] text-xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">
                        OCR_EXTRACTION_COMPLETED
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {formatTimeAgo(doc.updatedAt)}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Automated classification ({doc.documentType}) and structured entity parsing completed.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: REVIEW COMMENTS */}
          {activeTab === "comments" && (
            <div className="flex flex-col h-[540px]">
              {/* Comments List */}
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {comments.map((c) => (
                  <div
                    key={c.id}
                    className="p-3 rounded-xl border border-slate-100 dark:border-white/[0.06] bg-slate-50/50 dark:bg-white/[0.02] space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {c.author}
                        </span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                          {c.role}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {c.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300">
                      {c.text}
                    </p>
                  </div>
                ))}
              </div>

              {/* Add Comment Input Form */}
              <form onSubmit={handleAddComment} className="pt-3 border-t mt-3 flex items-center gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a review note or comment..."
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="p-2 rounded-xl text-white btn-primary-gradient disabled:opacity-50 cursor-pointer"
                  title="Send Comment"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
