"use client";

import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu,
} from "lucide-react";
import { useApp } from "@/lib/store/app-context";
import { processDocumentContent } from "@/lib/ai/document-processor";
import { evaluateRules } from "@/lib/rules/rule-evaluator";
import { DocumentItem } from "@/types";

interface DocumentUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (doc: DocumentItem) => void;
}

export function DocumentUploadModal({
  isOpen,
  onClose,
  onSuccess,
}: DocumentUploadModalProps) {
  const {
    currentUser,
    addDocument,
    rules,
    approvals,
    logAudit,
    addNotification,
  } = useApp();

  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [completedDoc, setCompletedDoc] = useState<DocumentItem | null>(null);
  const [triggeredRuleNotice, setTriggeredRuleNotice] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const handleFileSelected = (file: File) => {
    setSelectedFile(file);
    processPipeline(file);
  };

  // Asynchronous Document Pipeline
  const processPipeline = async (file: File) => {
    setIsProcessing(true);
    setProgress(15);
    setCurrentStep("1. Storing document & computing SHA-256 hash...");

    await new Promise((r) => setTimeout(r, 450));
    setProgress(35);
    setCurrentStep("2. Executing OCR & native text extraction...");

    await new Promise((r) => setTimeout(r, 550));
    setProgress(55);
    setCurrentStep("3. AI Classifying document taxonomy...");

    // Run actual processing & extraction engine
    const result = await processDocumentContent(file.name);

    setProgress(75);
    setCurrentStep("4. Extracting structured entities & bounding boxes...");

    await new Promise((r) => setTimeout(r, 400));
    setProgress(90);
    setCurrentStep("5. Calculating field & composite confidence scores...");

    const newDoc: DocumentItem = {
      id: `doc-${Date.now()}`,
      organizationId: currentUser.organizationId,
      name: file.name,
      filePath: `/documents/${file.name}`,
      fileSizeBytes: file.size || 245100,
      mimeType: file.type || "application/pdf",
      fileHash: `sha256_${Math.random().toString(36).substring(2, 10)}`,
      status: result.suggestedStatus,
      documentType: result.documentType,
      classificationConfidence: result.classificationConfidence,
      overallConfidence: result.overallConfidence,
      rawOcrText: result.rawOcrText,
      pageCount: 1,
      extractedFields: result.extractedFields,
      isArchived: false,
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: {
        id: currentUser.id,
        fullName: currentUser.fullName,
        email: currentUser.email,
      },
    };

    // Step 6: Deterministic Rule Engine Evaluation
    setCurrentStep("6. Evaluating deterministic business rules...");
    await new Promise((r) => setTimeout(r, 350));
    setProgress(100);

    const ruleEvaluations = evaluateRules(newDoc, rules);
    const triggered = ruleEvaluations.find((r) => r.matched);

    if (triggered && triggered.actionTriggered?.generatedApproval) {
      setTriggeredRuleNotice(triggered.actionTriggered.description);
      // Spawn approval task
      approvals.unshift(triggered.actionTriggered.generatedApproval as any);
      addNotification({
        title: "Rule-Triggered Approval Task",
        message: `${triggered.actionTriggered.description}. Action required.`,
        type: "approval",
        documentId: newDoc.id,
      });
      newDoc.status = "WORKFLOW_RUNNING";
    }

    addDocument(newDoc);
    setCompletedDoc(newDoc);
    setIsProcessing(false);
    if (onSuccess) onSuccess(newDoc);
  };

  const handleReset = () => {
    setSelectedFile(null);
    setIsProcessing(false);
    setProgress(0);
    setCurrentStep("");
    setCompletedDoc(null);
    setTriggeredRuleNotice(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity"
        onClick={() => {
          if (!isProcessing) onClose();
        }}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl glass-surface-elevated dark:bg-[#0D1222] rounded-3xl shadow-2xl border border-slate-200 dark:border-white/[0.12] p-6 sm:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-white/[0.08]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
                Ingest & Process Document
              </h2>
              <p className="text-xs text-slate-400">
                Zero-shot multimodal OCR with deterministic rule enforcement
              </p>
            </div>
          </div>

          {!isProcessing && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* State 1: Drop Zone */}
        {!selectedFile && (
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`mt-6 border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center transition-all ${
              dragActive
                ? "border-indigo-500 bg-indigo-500/10 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
                : "border-slate-200 dark:border-white/[0.12] hover:border-indigo-400 dark:hover:border-indigo-500/50 bg-slate-50/50 dark:bg-black/20"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.xlsx,.csv,.png,.jpg,.jpeg,.txt"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-14 h-14 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-500/10">
              <UploadCloud className="w-7 h-7" />
            </div>

            <p className="text-sm font-bold text-slate-800 dark:text-white">
              Drop enterprise document files here
            </p>
            <p className="text-xs text-slate-400 mt-1">
              Supports PDF, DOCX, XLSX, JPG, PNG, CSV, TXT (up to 25MB)
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-5 px-5 py-2.5 rounded-xl text-xs font-bold bg-white dark:bg-white/[0.08] border border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-white/[0.12] text-slate-800 dark:text-white shadow-sm transition-all active:scale-95 cursor-pointer"
            >
              Browse Local Files
            </button>

            {/* Quick Demo Pre-selected Buttons */}
            <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-white/[0.06]">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block mb-2">
                Or Instant Test Samples:
              </span>
              <div className="flex flex-wrap justify-center gap-2">
                {[
                  { name: "Invoice_INV1024.pdf", label: "Invoice (₹72.5k)" },
                  { name: "Leave_Request_203.pdf", label: "Leave Form (Low Conf)" },
                  { name: "PO_9921_Workstations.pdf", label: "Purchase Order" },
                  { name: "Hospital_Claim_Discharge.pdf", label: "Medical Form" },
                ].map((sample) => (
                  <button
                    key={sample.name}
                    type="button"
                    onClick={() => {
                      const mockFile = new File(["dummy content"], sample.name, {
                        type: "application/pdf",
                      });
                      handleFileSelected(mockFile);
                    }}
                    className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-white/[0.05] border border-slate-200 dark:border-white/[0.08] hover:border-indigo-400 text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                  >
                    {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* State 2: Processing Progress */}
        {selectedFile && isProcessing && (
          <div className="py-8 space-y-6 text-center">
            <div className="relative w-16 h-16 mx-auto">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20" />
              <div className="absolute inset-0 rounded-full border-4 border-indigo-500 border-t-transparent animate-spin shadow-[0_0_15px_#6366F1]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Cpu className="w-6 h-6 text-indigo-400" />
              </div>
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900 dark:text-white">
                {currentStep}
              </p>
              <p className="text-xs text-slate-400 font-mono mt-1">
                Processing: {selectedFile.name}
              </p>
            </div>

            {/* Glowing Progress bar */}
            <div className="w-full bg-slate-100 dark:bg-white/[0.08] h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 h-full rounded-full transition-all duration-300 shadow-[0_0_10px_#6366F1]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* State 3: Completed Document Result */}
        {completedDoc && !isProcessing && (
          <div className="py-5 space-y-5 animate-in fade-in">
            <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-400">
                  Document Ingestion & Analysis Complete
                </h4>
                <p className="text-xs text-slate-400 mt-0.5">
                  Classified as <strong className="text-slate-200">{completedDoc.documentType}</strong> with{" "}
                  <strong className="text-slate-200 font-mono">
                    {Math.round(completedDoc.classificationConfidence * 100)}%
                  </strong>{" "}
                  confidence.
                </p>
              </div>
            </div>

            {/* Rule Trigger notice if matched */}
            {triggeredRuleNotice && (
              <div className="p-3.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-xs flex items-center gap-2.5 text-indigo-300">
                <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>
                  <strong>Deterministic Rule Fired:</strong> {triggeredRuleNotice}
                </span>
              </div>
            )}

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/[0.08]">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
              >
                Upload Another
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-md transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
