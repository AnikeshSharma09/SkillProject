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
    approveTask,
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

  // Asynchronous Document Pipeline (Section 18)
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

    // Step 6: Deterministic Rule Engine Evaluation (Section 28)
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
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
        onClick={() => {
          if (!isProcessing) onClose();
        }}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 md:p-8 z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <UploadCloud className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                Upload & Process Document
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                AI pipeline extracts fields, scores confidence, and applies rules
              </p>
            </div>
          </div>

          {!isProcessing && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
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
                ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                : "border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 bg-slate-50/50 dark:bg-slate-800/20"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.xlsx,.csv,.png,.jpg,.jpeg,.txt"
              onChange={handleFileChange}
              className="hidden"
            />

            <div className="w-14 h-14 rounded-2xl bg-blue-100/70 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-4">
              <UploadCloud className="w-7 h-7" />
            </div>

            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
              Drop your documents here
            </p>
            <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
              Supports PDF, DOCX, XLSX, JPG, PNG, CSV, TXT (up to 25MB)
            </p>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="mt-5 px-5 py-2.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80 text-slate-800 dark:text-slate-200 shadow-2xs transition-all active:scale-95"
            >
              Browse files
            </button>

            {/* Quick Demo Pre-selected Buttons */}
            <div className="mt-6 pt-5 border-t border-slate-200/60 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
                Or Try Sample Documents:
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
                      const sampleFile = new File(["sample content"], sample.name, {
                        type: "application/pdf",
                      });
                      handleFileSelected(sampleFile);
                    }}
                    className="text-[11px] font-medium px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900 hover:bg-blue-100 transition-colors"
                  >
                    ✦ {sample.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* State 2: Processing in progress */}
        {selectedFile && isProcessing && (
          <div className="mt-6 py-6 space-y-5">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-[11px] text-slate-400">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                {progress}%
              </span>
            </div>

            {/* Animated Progress Bar */}
            <div className="space-y-2">
              <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-spin" />
                  {currentStep}
                </span>
                <span className="tabular-nums font-mono text-[11px]">
                  {progress}/100
                </span>
              </div>
            </div>
          </div>
        )}

        {/* State 3: Completed Pipeline */}
        {completedDoc && !isProcessing && (
          <div className="mt-6 space-y-5 animate-in fade-in duration-200">
            <div className="p-4 rounded-2xl bg-emerald-50/80 dark:bg-emerald-950/40 border border-emerald-200/80 dark:border-emerald-900/60 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
                  Document Intelligence Pipeline Succeeded
                </p>
                <p className="text-xs text-emerald-700 dark:text-emerald-300">
                  Classified as{" "}
                  <strong className="underline decoration-emerald-400">
                    {completedDoc.documentType}
                  </strong>{" "}
                  with{" "}
                  <strong>{(completedDoc.overallConfidence * 100).toFixed(1)}%</strong>{" "}
                  confidence.
                </p>
              </div>
            </div>

            {/* Rule Engine Alert if applicable */}
            {triggeredRuleNotice && (
              <div className="p-3.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900/60 flex items-center gap-2.5 text-xs text-amber-800 dark:text-amber-300">
                <Zap className="w-4 h-4 text-amber-600 shrink-0" />
                <span>{triggeredRuleNotice}</span>
              </div>
            )}

            {/* Extracted Fields Summary Box */}
            <div className="rounded-xl border border-slate-200/80 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800/80 max-h-48 overflow-y-auto">
              {completedDoc.extractedFields?.map((field) => (
                <div
                  key={field.id}
                  className="px-4 py-2.5 flex items-center justify-between text-xs"
                >
                  <span className="font-medium text-slate-500 dark:text-slate-400">
                    {field.fieldLabel}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {field.extractedValue}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                        field.confidence >= 0.9
                          ? "bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400"
                          : "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400"
                      }`}
                    >
                      {(field.confidence * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2 rounded-xl text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Upload Another
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors flex items-center gap-1.5"
              >
                <span>Done</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
