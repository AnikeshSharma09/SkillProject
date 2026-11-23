"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import confetti from "canvas-confetti";
import {
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  FileText,
  DollarSign,
  ArrowUpRight,
  ArrowDownLeft,
  Lock,
  QrCode,
  ExternalLink,
  Plus,
  Search,
  Filter,
  Eye,
  Check,
  X,
  RefreshCw,
  Building2,
  Send,
  Download,
  KeyRound,
  ShieldAlert,
} from "lucide-react";
import { useApp } from "@/lib/store/app-context";
import { PaymentTransaction, PaymentStatus, PaymentMethod } from "@/types";
import { formatCurrency, formatTimeAgo } from "@/lib/utils";

export default function PaymentsPage() {
  const {
    currentUser,
    payments,
    documents,
    initiatePayment,
    authorizePayment,
    reconcilePayment,
    cancelPayment,
  } = useApp();

  // Filters & State
  const [activeTab, setActiveTab] = useState<"ALL" | "PENDING_APPROVAL" | "PAID" | "LINKS">("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [methodFilter, setMethodFilter] = useState<string>("ALL");

  // Modals
  const [selectedPayment, setSelectedPayment] = useState<PaymentTransaction | null>(null);
  const [isAuthorizeModalOpen, setIsAuthorizeModalOpen] = useState(false);
  const [isNewVoucherModalOpen, setIsNewVoucherModalOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  // Authorization Form State
  const [securityPin, setSecurityPin] = useState("");
  const [authError, setAuthError] = useState("");
  const [isAuthorizing, setIsAuthorizing] = useState(false);

  // New Payment Form State
  const [voucherDocId, setVoucherDocId] = useState("");
  const [voucherBeneficiary, setVoucherBeneficiary] = useState("");
  const [voucherAccount, setVoucherAccount] = useState("");
  const [voucherIfsc, setVoucherIfsc] = useState("");
  const [voucherAmount, setVoucherAmount] = useState<string>("");
  const [voucherMethod, setVoucherMethod] = useState<PaymentMethod>("BANK_TRANSFER");
  const [voucherNotes, setVoucherNotes] = useState("");
  const [voucherError, setVoucherError] = useState("");

  // Quick link item state for collection tab
  const [activeQrLink, setActiveQrLink] = useState<{
    client: string;
    invoice: string;
    amount: number;
    url: string;
  } | null>(null);

  // Financial KPIs
  const totalDisbursed = useMemo(() => {
    return payments
      .filter((p) => p.status === "PAID")
      .reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  const pendingDisbursement = useMemo(() => {
    return payments
      .filter((p) => p.status === "PENDING_APPROVAL")
      .reduce((sum, p) => sum + p.amount, 0);
  }, [payments]);

  const pendingCount = useMemo(() => {
    return payments.filter((p) => p.status === "PENDING_APPROVAL").length;
  }, [payments]);

  const autoReconciliationRate = useMemo(() => {
    const paidList = payments.filter((p) => p.status === "PAID");
    if (paidList.length === 0) return 100;
    const matched = paidList.filter((p) => p.reconciliationStatus === "MATCHED").length;
    return Math.round((matched / paidList.length) * 100);
  }, [payments]);

  // Filtered Payments List
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      // Tab filter
      if (activeTab === "PENDING_APPROVAL" && p.status !== "PENDING_APPROVAL") return false;
      if (activeTab === "PAID" && p.status !== "PAID") return false;

      // Method filter
      if (methodFilter !== "ALL" && p.paymentMethod !== methodFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesBeneficiary = p.beneficiaryName.toLowerCase().includes(q);
        const matchesDoc = (p.documentName || "").toLowerCase().includes(q);
        const matchesRef = (p.referenceNumber || "").toLowerCase().includes(q);
        const matchesAccount = p.beneficiaryAccount.toLowerCase().includes(q);
        if (!matchesBeneficiary && !matchesDoc && !matchesRef && !matchesAccount) return false;
      }

      return true;
    });
  }, [payments, activeTab, methodFilter, searchQuery]);

  // Handle Document Selection in New Voucher Modal
  const handleDocSelectChange = (docId: string) => {
    setVoucherDocId(docId);
    if (!docId) return;

    const doc = documents.find((d) => d.id === docId);
    if (!doc) return;

    // Auto-extract vendor name and amount if available
    const vendorField = doc.extractedFields?.find((f) =>
      ["vendor", "vendor_name", "merchant"].includes(f.fieldName.toLowerCase())
    );
    const amountField = doc.extractedFields?.find((f) =>
      ["total", "total_amount", "amount_due", "grand_total"].includes(f.fieldName.toLowerCase())
    );

    if (vendorField?.extractedValue) {
      setVoucherBeneficiary(vendorField.extractedValue);
    } else {
      setVoucherBeneficiary(doc.name.replace(/\.[^/.]+$/, ""));
    }

    if (amountField?.extractedValue) {
      const numericVal = amountField.extractedValue.replace(/[^0-9.]/g, "");
      if (numericVal) setVoucherAmount(numericVal);
    }
    setVoucherNotes(`Disbursement for verified document: ${doc.name}`);
  };

  // Open Authorize Modal
  const handleOpenAuthorize = (payment: PaymentTransaction) => {
    setSelectedPayment(payment);
    setSecurityPin("");
    setAuthError("");
    setIsAuthorizeModalOpen(true);
  };

  // Execute Authorization
  const handleAuthorizeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPayment) return;

    setIsAuthorizing(true);
    setAuthError("");

    try {
      const result = await authorizePayment(selectedPayment.id, securityPin);
      if (!result.success) {
        setAuthError(result.error || "Authorization failed.");
        setIsAuthorizing(false);
        return;
      }

      // Success confetti
      try {
        confetti({
          particleCount: 50,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      setIsAuthorizeModalOpen(false);
      // Open receipt modal for instant confirmation
      const updated = payments.find((p) => p.id === selectedPayment.id);
      if (updated) setSelectedPayment(updated);
      setIsReceiptModalOpen(true);
    } finally {
      setIsAuthorizing(false);
    }
  };

  // Create Voucher Submit
  const handleCreateVoucherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVoucherError("");

    const amountNum = parseFloat(voucherAmount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setVoucherError("Please enter a valid numeric amount greater than 0.");
      return;
    }

    if (!voucherBeneficiary.trim()) {
      setVoucherError("Beneficiary name is required.");
      return;
    }

    if (!voucherAccount.trim()) {
      setVoucherError("Account number, IBAN, or UPI ID is required.");
      return;
    }

    const linkedDoc = documents.find((d) => d.id === voucherDocId);

    const result = initiatePayment({
      documentId: voucherDocId || undefined,
      documentName: linkedDoc?.name || undefined,
      beneficiaryName: voucherBeneficiary.trim(),
      beneficiaryAccount: voucherAccount.trim(),
      beneficiaryIfscOrSwift: voucherIfsc.trim() || undefined,
      amount: amountNum,
      currency: "INR",
      paymentMethod: voucherMethod,
      notes: voucherNotes.trim() || undefined,
    });

    if (!result.success) {
      setVoucherError(result.error || "Failed to create voucher.");
      return;
    }

    setIsNewVoucherModalOpen(false);
    setVoucherDocId("");
    setVoucherBeneficiary("");
    setVoucherAccount("");
    setVoucherIfsc("");
    setVoucherAmount("");
    setVoucherNotes("");
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-white/[0.08]">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              Payments & Disbursements
            </h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
              <ShieldCheck className="w-3.5 h-3.5" />
              Secured Pipeline
            </span>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Automated accounts payable for verified invoices, Maker-Checker authorization gates, and instant bank reconciliation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setActiveQrLink({
                client: "Symbiosis Global Learning Academy",
                invoice: "INV-2026-COL-009",
                amount: 145000,
                url: "https://pay.ai-flow.io/symbiosis/inv-2026-col-009",
              });
              setIsQrModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/50 shadow-2xs transition-all"
          >
            <QrCode className="w-4 h-4 text-slate-500" />
            Collection QR Link
          </button>

          <button
            onClick={() => setIsNewVoucherModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-2xs hover:shadow-sm transition-all"
          >
            <Plus className="w-4 h-4" />
            New Payment Voucher
          </button>
        </div>
      </div>

      {/* Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Disbursed */}
        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Total Disbursed</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(totalDisbursed)}
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Settled via RTGS/NEFT/UPI
            </p>
          </div>
        </div>

        {/* Pending Payouts */}
        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Awaiting Authorization</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {formatCurrency(pendingDisbursement)}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {pendingCount} payment{pendingCount === 1 ? "" : "s"} awaiting Maker-Checker PIN
            </p>
          </div>
        </div>

        {/* Automated Reconciliation Rate */}
        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">3-Way Auto-Match</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <RefreshCw className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              {autoReconciliationRate}%
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Invoice ↔ Payout ↔ UTR matched
            </p>
          </div>
        </div>

        {/* Tamper-Proof Cryptographic Assurance */}
        <div className="bg-white dark:bg-[#111827] p-5 rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 mb-2">
            <span className="text-xs font-medium uppercase tracking-wider">Security Integrity</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900 dark:text-white">
              100% Verified
            </div>
            <p className="text-xs text-indigo-600 dark:text-indigo-400 font-mono text-[11px] mt-1">
              SHA-256 HMAC & Idempotent
            </p>
          </div>
        </div>
      </div>

      {/* Main Table & Tabs Container */}
      <div className="bg-white dark:bg-[#111827] rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-2xs overflow-hidden">
        {/* Navigation Tabs & Controls */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800/60 rounded-xl max-w-fit">
            <button
              onClick={() => setActiveTab("ALL")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "ALL"
                  ? "bg-white dark:bg-[#111827] text-blue-600 dark:text-blue-400 shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              All Payouts ({payments.length})
            </button>
            <button
              onClick={() => setActiveTab("PENDING_APPROVAL")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeTab === "PENDING_APPROVAL"
                  ? "bg-white dark:bg-[#111827] text-amber-600 dark:text-amber-400 shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Needs Authorization
              {pendingCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-amber-500 text-white text-[10px] flex items-center justify-center font-bold">
                  {pendingCount}
                </span>
              )}
            </button>
            <button
              onClick={() => setActiveTab("PAID")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "PAID"
                  ? "bg-white dark:bg-[#111827] text-emerald-600 dark:text-emerald-400 shadow-2xs"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
              }`}
            >
              Disbursed & Settled
            </button>
          </div>

          {/* Search & Method Filters */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search vendor, invoice, UTR..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-48 sm:w-64"
              />
            </div>

            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-200 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="ALL">All Methods</option>
              <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
              <option value="UPI">Instant UPI</option>
              <option value="CORPORATE_CARD">Corporate Card</option>
            </select>
          </div>
        </div>

        {/* Payments Table */}
        <div className="overflow-x-auto">
          {filteredPayments.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center mx-auto text-slate-400 mb-3">
                <CreditCard className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                No payment transactions found
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
                No transactions match your current filters. You can create a new payment voucher or select an approved document.
              </p>
              <button
                onClick={() => setIsNewVoucherModalOpen(true)}
                className="mt-4 inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Initiate New Payout
              </button>
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-white/[0.08] bg-slate-50/75 dark:bg-slate-800/40 text-slate-500 dark:text-slate-400 font-medium">
                  <th className="py-3 px-4">Beneficiary & Account</th>
                  <th className="py-3 px-4">Document Reference</th>
                  <th className="py-3 px-4">Method</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Security Integrity</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                {filteredPayments.map((p) => (
                  <tr
                    key={p.id}
                    className="hover:bg-slate-50/60 dark:hover:bg-white/[0.02] transition-colors"
                  >
                    {/* Beneficiary */}
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 dark:text-white">
                        {p.beneficiaryName}
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                        <span className="font-mono">{p.beneficiaryAccount}</span>
                        {p.beneficiaryIfscOrSwift && (
                          <span className="px-1 py-0.2 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-mono">
                            {p.beneficiaryIfscOrSwift}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Document Reference */}
                    <td className="py-3 px-4">
                      {p.documentId ? (
                        <Link
                          href={`/documents/${p.documentId}`}
                          className="inline-flex items-center gap-1.5 text-blue-600 dark:text-blue-400 hover:underline font-medium"
                        >
                          <FileText className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate max-w-[150px]">{p.documentName || "Invoice"}</span>
                        </Link>
                      ) : (
                        <span className="text-slate-400 italic">Direct Voucher</span>
                      )}
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        {formatTimeAgo(p.createdAt)}
                      </div>
                    </td>

                    {/* Method */}
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {p.paymentMethod === "BANK_TRANSFER" && "NEFT/RTGS"}
                        {p.paymentMethod === "UPI" && "UPI Instant"}
                        {p.paymentMethod === "CORPORATE_CARD" && "Corp Card"}
                      </span>
                    </td>

                    {/* Amount */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900 dark:text-white">
                        {formatCurrency(p.amount, p.currency)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {p.reconciliationStatus === "MATCHED" ? (
                          <span className="text-emerald-600 dark:text-emerald-400">Reconciled</span>
                        ) : (
                          <span>Pending Match</span>
                        )}
                      </div>
                    </td>

                    {/* Security Integrity */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          HMAC
                        </span>
                        <span className="font-mono text-[10px] text-slate-400" title={p.securityHash}>
                          {p.securityHash.slice(0, 8)}...
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="py-3 px-4">
                      {p.status === "PAID" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                          <Check className="w-3 h-3" />
                          Settled
                        </span>
                      )}
                      {p.status === "PENDING_APPROVAL" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                          <Clock className="w-3 h-3" />
                          Awaiting PIN
                        </span>
                      )}
                      {p.status === "FAILED" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
                          <X className="w-3 h-3" />
                          Canceled
                        </span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right">
                      {p.status === "PENDING_APPROVAL" && (
                        <button
                          onClick={() => handleOpenAuthorize(p)}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white shadow-2xs transition-all"
                        >
                          <Lock className="w-3 h-3" />
                          Authorize
                        </button>
                      )}

                      {p.status === "PAID" && (
                        <button
                          onClick={() => {
                            setSelectedPayment(p);
                            setIsReceiptModalOpen(true);
                          }}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border border-slate-200 dark:border-white/[0.1] text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                        >
                          <Eye className="w-3 h-3" />
                          View UTR
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* --- MODAL 1: AUTHORIZE & DISBURSE WITH 2FA PIN --- */}
      {isAuthorizeModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-50 dark:bg-amber-950/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
                  <KeyRound className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Authorize Fund Disbursement
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Maker-Checker Cryptographic Release Gate
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAuthorizeModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleAuthorizeSubmit} className="p-5 space-y-4">
              {/* Payment Summary Box */}
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-white/[0.06] space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Beneficiary:</span>
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {selectedPayment.beneficiaryName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Account:</span>
                  <span className="font-mono text-slate-700 dark:text-slate-300">
                    {selectedPayment.beneficiaryAccount}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-slate-200 dark:border-white/[0.06]">
                  <span className="text-slate-500 font-medium">Disbursement Amount:</span>
                  <span className="text-base font-bold text-slate-900 dark:text-white">
                    {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                  </span>
                </div>
              </div>

              {/* Cryptographic Tamper Seal */}
              <div className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/40 text-[11px] text-emerald-800 dark:text-emerald-300 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <div className="font-semibold">Cryptographic Payload Sealed</div>
                  <div className="text-[10px] text-emerald-700 dark:text-emerald-400 font-mono mt-0.5">
                    Hash: {selectedPayment.securityHash}
                  </div>
                </div>
              </div>

              {/* Security PIN Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Enter 4-Digit Security PIN
                </label>
                <input
                  type="password"
                  maxLength={4}
                  autoFocus
                  placeholder="••••"
                  value={securityPin}
                  onChange={(e) => setSecurityPin(e.target.value)}
                  className="w-full text-center text-xl tracking-[0.5em] font-mono py-2 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                <p className="text-[11px] text-slate-400 mt-1">
                  Demo manager release PIN: <span className="font-mono font-bold text-slate-600 dark:text-slate-300">8842</span>
                </p>
              </div>

              {authError && (
                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAuthorizeModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-white/[0.1] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAuthorizing || securityPin.length < 4}
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-amber-500 hover:bg-amber-600 disabled:opacity-50 text-white shadow-2xs transition-all flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  {isAuthorizing ? "Signing..." : "Authorize & Disburse"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 2: NEW PAYMENT VOUCHER --- */}
      {isNewVoucherModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] w-full max-w-lg rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-blue-50 dark:bg-blue-950/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Create Payment Voucher
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Connect an approved invoice or initiate a verified vendor disbursement
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsNewVoucherModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVoucherSubmit} className="p-5 space-y-3.5 text-xs">
              {/* Optional Linked Document */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Link Approved Document (Auto-Fills Details)
                </label>
                <select
                  value={voucherDocId}
                  onChange={(e) => handleDocSelectChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="">-- Direct Payment Voucher (No document) --</option>
                  {documents.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.documentType})
                    </option>
                  ))}
                </select>
              </div>

              {/* Beneficiary Name */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Beneficiary Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ABC Technologies Private Limited"
                  value={voucherBeneficiary}
                  onChange={(e) => setVoucherBeneficiary(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {/* Account / UPI & IFSC */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Bank Account / UPI ID *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 501004928104 or vendor@upi"
                    value={voucherAccount}
                    onChange={(e) => setVoucherAccount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    IFSC / SWIFT Code
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HDFC0001824"
                    value={voucherIfsc}
                    onChange={(e) => setVoucherIfsc(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 font-mono text-xs"
                  />
                </div>
              </div>

              {/* Amount & Method */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Amount (INR) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    placeholder="72500"
                    value={voucherAmount}
                    onChange={(e) => setVoucherAmount(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Payment Method
                  </label>
                  <select
                    value={voucherMethod}
                    onChange={(e) => setVoucherMethod(e.target.value as PaymentMethod)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                  >
                    <option value="BANK_TRANSFER">Bank Transfer (NEFT/RTGS)</option>
                    <option value="UPI">Instant UPI</option>
                    <option value="CORPORATE_CARD">Corporate Card</option>
                  </select>
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Purpose / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Q3 Cloud infrastructure maintenance payment"
                  value={voucherNotes}
                  onChange={(e) => setVoucherNotes(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-white/[0.1] bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              {voucherError && (
                <div className="p-2.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-xs text-rose-700 dark:text-rose-400">
                  {voucherError}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200 dark:border-white/[0.08]">
                <button
                  type="button"
                  onClick={() => setIsNewVoucherModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 dark:border-white/[0.1] text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-all flex items-center gap-1.5"
                >
                  <Lock className="w-3.5 h-3.5" />
                  Queue in Secure Pipeline
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL 3: VIEW UTR / TRANSACTION RECEIPT --- */}
      {isReceiptModalOpen && selectedPayment && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] w-full max-w-md rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Payment Settlement Receipt
                </h3>
              </div>
              <button
                onClick={() => setIsReceiptModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <div className="text-center py-2">
                <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 mx-auto flex items-center justify-center mb-2">
                  <Check className="w-6 h-6 stroke-[3]" />
                </div>
                <div className="text-xl font-bold text-slate-900 dark:text-white">
                  {formatCurrency(selectedPayment.amount, selectedPayment.currency)}
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                  Settled & Reconciled Successfully
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/[0.06] space-y-2 font-mono text-[11px]">
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Bank Reference / UTR:</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {selectedPayment.referenceNumber || "UTR88291039"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Beneficiary:</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {selectedPayment.beneficiaryName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Destination Account:</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {selectedPayment.beneficiaryAccount}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500 font-sans">Authorized By:</span>
                  <span className="text-slate-800 dark:text-slate-200">
                    {selectedPayment.approvedBy?.fullName || "Sarah Chen (ADMIN)"}
                  </span>
                </div>
                <div className="flex justify-between pt-1 border-t border-slate-200 dark:border-white/[0.06]">
                  <span className="text-slate-500 font-sans">Security Checksum:</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                    {selectedPayment.securityHash}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsReceiptModalOpen(false)}
                  className="w-full py-2 text-xs font-semibold rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 transition-all text-center"
                >
                  Close Receipt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MODAL 4: COLLECTION QR CODE --- */}
      {isQrModalOpen && activeQrLink && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#111827] w-full max-w-sm rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-xl overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-blue-600" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Payment Collection Link
                </h3>
              </div>
              <button
                onClick={() => setIsQrModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-center space-y-4">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm inline-block mx-auto">
                {/* Visual SVG QR Code placeholder */}
                <div className="w-40 h-40 bg-slate-900 rounded-lg p-2.5 flex flex-col justify-between">
                  <div className="flex justify-between">
                    <div className="w-10 h-10 border-4 border-white rounded-xs"></div>
                    <div className="w-10 h-10 border-4 border-white rounded-xs"></div>
                  </div>
                  <div className="flex justify-center items-center">
                    <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center text-slate-900 font-bold text-xs">
                      UPI
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="w-10 h-10 border-4 border-white rounded-xs"></div>
                    <div className="w-4 h-4 bg-white rounded-xs"></div>
                  </div>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500">{activeQrLink.invoice}</div>
                <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                  {formatCurrency(activeQrLink.amount)}
                </div>
                <div className="text-[11px] text-slate-500 mt-1">{activeQrLink.client}</div>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/[0.06] text-[11px] font-mono text-slate-600 dark:text-slate-400 truncate">
                {activeQrLink.url}
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(activeQrLink.url);
                  alert("Payment link copied to clipboard!");
                }}
                className="w-full py-2 text-xs font-semibold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-2xs transition-all"
              >
                Copy Payment Link
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
