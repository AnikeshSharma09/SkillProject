"use client";

import React, { useState, useMemo, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  FileText,
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Download,
  Trash2,
  Archive,
  RefreshCw,
  Eye,
  CheckCircle2,
  AlertTriangle,
  Clock,
  XCircle,
  LayoutGrid,
  List,
  Sparkles,
} from "lucide-react";
import { useApp } from "@/lib/store/app-context";
import { DocumentUploadModal } from "@/components/documents/document-upload-modal";
import { DocumentItem, DocumentCategory, DocumentStatus } from "@/types";
import { formatBytes, formatTimeAgo } from "@/lib/utils";

function DocumentsContent() {
  const searchParams = useSearchParams();
  const initialUploadOpen = searchParams.get("action") === "upload";

  const {
    documents,
    deleteDocument,
    archiveDocument,
    updateDocument,
    logAudit,
  } = useApp();

  const [isUploadOpen, setIsUploadOpen] = useState(initialUploadOpen);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [sortBy, setSortBy] = useState<"date" | "name" | "confidence" | "size">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");

  // Filter & Sort
  const filteredDocuments = useMemo(() => {
    return documents
      .filter((doc) => {
        const matchesSearch =
          doc.name.toLowerCase().includes(search.toLowerCase()) ||
          doc.documentType.toLowerCase().includes(search.toLowerCase());

        const matchesStatus =
          selectedStatus === "ALL" ||
          (selectedStatus === "ARCHIVED" && doc.isArchived) ||
          (!doc.isArchived && doc.status === selectedStatus);

        const matchesType =
          selectedType === "ALL" || doc.documentType === selectedType;

        return matchesSearch && matchesStatus && matchesType;
      })
      .sort((a, b) => {
        let comp = 0;
        if (sortBy === "date") {
          comp = new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
        } else if (sortBy === "name") {
          comp = a.name.localeCompare(b.name);
        } else if (sortBy === "confidence") {
          comp = (b.overallConfidence || 0) - (a.overallConfidence || 0);
        } else if (sortBy === "size") {
          comp = b.fileSizeBytes - a.fileSizeBytes;
        }
        return sortOrder === "asc" ? -comp : comp;
      });
  }, [documents, search, selectedStatus, selectedType, sortBy, sortOrder]);

  const handleReprocess = (doc: DocumentItem) => {
    updateDocument(doc.id, { status: "PROCESSING" });
    logAudit("DOCUMENT_REPROCESSED", "DOCUMENT", `Triggered re-processing for ${doc.name}`, {
      documentId: doc.id,
      documentName: doc.name,
    });

    setTimeout(() => {
      updateDocument(doc.id, {
        status: doc.overallConfidence < 0.7 ? "REVIEW_REQUIRED" : "READY",
      });
    }, 1500);
  };

  const getStatusBadge = (status: DocumentStatus, isArchived: boolean) => {
    if (isArchived) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
          <Archive className="w-3 h-3" />
          Archived
        </span>
      );
    }

    switch (status) {
      case "COMPLETED":
      case "READY":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200/60 dark:border-emerald-800">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Processed
          </span>
        );
      case "REVIEW_REQUIRED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200/60 dark:border-amber-800">
            <AlertTriangle className="w-3 h-3 text-amber-500" />
            Review Required
          </span>
        );
      case "PROCESSING":
      case "CLASSIFIED":
      case "EXTRACTING":
      case "WORKFLOW_RUNNING":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 border border-blue-200/60 dark:border-blue-800 animate-pulse">
            <Clock className="w-3 h-3 text-blue-500" />
            Processing
          </span>
        );
      case "FAILED":
      case "REJECTED":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400 border border-rose-200/60 dark:border-rose-800">
            <XCircle className="w-3 h-3 text-rose-500" />
            Failed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
            {status}
          </span>
        );
    }
  };

  const documentTypes: DocumentCategory[] = [
    "Invoice",
    "Receipt",
    "Resume",
    "Purchase Order",
    "Leave Application",
    "Contract",
    "Report",
    "Medical Form",
    "Delivery Note",
    "Expense Claim",
    "Certificate",
    "Other",
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Document Repository
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Secure, encrypted multi-tenant storage with AI classification & OCR extraction
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs hover:shadow-md transition-all active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Control Bar: Search, Filters, View Modes */}
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by file name or document type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Filter */}
          <select
            aria-label="Filter by Status"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="ALL">All Statuses</option>
            <option value="READY">Processed / Ready</option>
            <option value="REVIEW_REQUIRED">Review Required</option>
            <option value="PROCESSING">Processing</option>
            <option value="COMPLETED">Completed</option>
            <option value="ARCHIVED">Archived</option>
          </select>

          {/* Type Filter */}
          <select
            aria-label="Filter by Document Type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 focus:outline-hidden"
          >
            <option value="ALL">All Document Types</option>
            {documentTypes.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>

          {/* Sort By */}
          <button
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-slate-700 dark:text-slate-300 hover:bg-slate-100 transition-colors"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <span>Sort: {sortBy} ({sortOrder})</span>
          </button>

          {/* View Mode Toggle */}
          <div className="flex items-center p-1 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60">
            <button
              onClick={() => setViewMode("table")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === "table"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1.5 rounded-lg text-xs transition-colors ${
                viewMode === "grid"
                  ? "bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-2xs font-semibold"
                  : "text-slate-500 hover:text-slate-800 dark:text-slate-400"
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Content: Table or Grid */}
      {filteredDocuments.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">
            No documents found
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search filters or upload a new invoice, receipt, or agreement.
          </p>
          <button
            onClick={() => setIsUploadOpen(true)}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Upload Now
          </button>
        </div>
      ) : viewMode === "table" ? (
        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-5">Document</th>
                  <th className="py-3 px-5">Category</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5">Confidence</th>
                  <th className="py-3 px-5">Uploaded By</th>
                  <th className="py-3 px-5">Date</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {filteredDocuments.map((doc) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors group"
                  >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center shrink-0">
                          <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            href={`/documents/${doc.id}`}
                            className="font-medium text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors block truncate max-w-[200px] sm:max-w-xs"
                          >
                            {doc.name}
                          </Link>
                          <div className="text-[11px] text-slate-400">
                            {formatBytes(doc.fileSizeBytes)} • {doc.pageCount} pg
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="text-xs font-medium text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800">
                        {doc.documentType}
                      </span>
                    </td>

                    <td className="py-3.5 px-5">
                      {getStatusBadge(doc.status, doc.isArchived)}
                    </td>

                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold tabular-nums text-slate-800 dark:text-slate-200">
                          {Math.round(doc.overallConfidence * 100)}%
                        </span>
                        <div className="w-14 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              doc.overallConfidence >= 0.9
                                ? "bg-emerald-500"
                                : doc.overallConfidence >= 0.7
                                ? "bg-blue-500"
                                : "bg-amber-500"
                            }`}
                            style={{ width: `${Math.round(doc.overallConfidence * 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5 text-xs text-slate-600 dark:text-slate-400">
                      {doc.createdBy?.fullName || "System"}
                    </td>

                    <td className="py-3.5 px-5 text-xs text-slate-500 dark:text-slate-400">
                      {formatTimeAgo(doc.uploadedAt)}
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-90 group-hover:opacity-100">
                        {doc.status === "REVIEW_REQUIRED" && (
                          <Link
                            href={`/review?id=${doc.id}`}
                            className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors"
                          >
                            Review
                          </Link>
                        )}

                        <Link
                          href={`/documents/${doc.id}`}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="View Intelligence"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>

                        <button
                          onClick={() => handleReprocess(doc)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-purple-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="Reprocess Pipeline"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>

                        {!doc.isArchived && (
                          <button
                            onClick={() => archiveDocument(doc.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                            title="Archive"
                          >
                            <Archive className="w-4 h-4" />
                          </button>
                        )}

                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Grid View */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocuments.map((doc) => (
            <div
              key={doc.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-100 dark:border-blue-900/60 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  {getStatusBadge(doc.status, doc.isArchived)}
                </div>

                <div className="mt-4">
                  <Link
                    href={`/documents/${doc.id}`}
                    className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 dark:hover:text-blue-400 transition-colors line-clamp-1 text-sm"
                  >
                    {doc.name}
                  </Link>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {doc.documentType} • {formatBytes(doc.fileSizeBytes)}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Confidence</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">
                    {Math.round(doc.overallConfidence * 100)}%
                  </span>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {formatTimeAgo(doc.uploadedAt)}
                </span>
                <Link
                  href={`/documents/${doc.id}`}
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-blue-50 dark:hover:bg-blue-950/60 text-slate-700 dark:text-slate-300 hover:text-blue-600 transition-colors"
                >
                  Inspect →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Modal */}
      <DocumentUploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
      />
    </div>
  );
}

export default function DocumentsPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-slate-400">
          Loading document repository...
        </div>
      }
    >
      <DocumentsContent />
    </Suspense>
  );
}
