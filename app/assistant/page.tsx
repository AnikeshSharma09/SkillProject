"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowUp,
  FileText,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Search,
  Zap,
  BarChart2,
  FileSpreadsheet,
  ArrowRight,
} from "lucide-react";
import { useApp } from "@/lib/store/app-context";
import { queryDocumentRAG } from "@/lib/rag/semantic-search";
import { RagSource } from "@/types";

interface MessageItem {
  id: string;
  sender: "user" | "ai";
  text: string;
  sources?: { name: string; amount: string; id: string }[];
  summaryStats?: { label: string; value: string }[];
  timestamp: string;
}

export default function AssistantPage() {
  const { documents } = useApp();

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");

  const categories = [
    "All",
    "Invoices",
    "Contracts",
    "Leave Applications",
    "Procurement",
    "HR",
    "Analytics",
  ];

  const suggestedQuestions = [
    "What invoices are pending approval?",
    "Summarize this month's procurement activity",
    "Find contracts expiring in October",
    "Which vendors have unpaid invoices?",
  ];

  // Pre-seed conversation with the exact QA exchange from the mockup
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "msg-1",
      sender: "user",
      text: "Which invoices are above ₹50,000?",
      timestamp: "10:42 AM",
    },
    {
      id: "msg-2",
      sender: "ai",
      text: "There are 18 invoices above ₹50,000 awaiting approval.",
      summaryStats: [
        { label: "Total value", value: "₹32,40,000" },
        { label: "Average amount", value: "₹1,80,000" },
        { label: "Latest invoice", value: "INV-1048 (₹88,500)" },
      ],
      sources: [
        { name: "INV-1024.pdf", amount: "₹72,500", id: "doc-inv-1024" },
        { name: "INV-1031.pdf", amount: "₹1,25,000", id: "doc-inv-1031" },
        { name: "INV-1048.pdf", amount: "₹88,500", id: "doc-inv-1048" },
      ],
      timestamp: "10:42 AM",
    },
  ]);

  const handleSendMessage = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsgId = `usr-${Date.now()}`;
    const aiMsgId = `ai-${Date.now()}`;

    setMessages((prev) => [
      ...prev,
      {
        id: userMsgId,
        sender: "user",
        text: query,
        timestamp: "Just now",
      },
    ]);

    setInputQuery("");
    setIsLoading(true);

    try {
      const ragResult = await queryDocumentRAG(query, documents);
      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: "ai",
          text: ragResult.answer,
          sources: [
            { name: "INV-1024.pdf", amount: "₹72,500", id: "doc-inv-1024" },
            { name: "INV-1031.pdf", amount: "₹1,25,000", id: "doc-inv-1031" },
            { name: "INV-1048.pdf", amount: "₹88,500", id: "doc-inv-1048" },
          ],
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16 animate-in fade-in duration-200">
      {/* Header Info matching mockup */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
          AI Assistant
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Ask anything about your organization&apos;s documents and workflows.
        </p>
      </div>

      {/* Filter Tabs matching mockup: All, Invoices, Contracts, Leave Applications, Procurement, HR, Analytics */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              activeCategory === cat
                ? "bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 border border-blue-200 dark:border-blue-800"
                : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 hover:bg-slate-50"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 4 Prompt Cards Grid matching mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="clean-card p-3 text-left hover:border-blue-400 dark:hover:border-blue-500 transition-all cursor-pointer text-xs font-medium text-slate-700 dark:text-slate-300 flex items-center justify-between group"
          >
            <span className="line-clamp-2">{q}</span>
          </button>
        ))}
      </div>

      {/* Conversation Thread matching mockup */}
      <div className="space-y-5 pt-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            {msg.sender === "user" ? (
              <div className="max-w-md p-3.5 rounded-2xl rounded-tr-xs bg-blue-600 text-white text-xs sm:text-sm font-semibold shadow-xs">
                {msg.text}
              </div>
            ) : (
              <div className="w-full clean-card p-6 space-y-4">
                <div className="flex items-center gap-2 border-b pb-3 border-slate-100 dark:border-slate-800">
                  <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
                    <Sparkles className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-xs font-bold text-slate-900 dark:text-white">
                    AI-FLOW Intelligence
                  </span>
                </div>

                {/* Text Body */}
                <p className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200">
                  {msg.text}
                </p>

                {/* Summary Bullet Points */}
                {msg.summaryStats && (
                  <ul className="space-y-1 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                    {msg.summaryStats.map((s, idx) => (
                      <li key={idx}>
                        <strong className="text-slate-800 dark:text-white">{s.label}:</strong> {s.value}
                      </li>
                    ))}
                  </ul>
                )}

                {/* Source Documents Section matching mockup */}
                {msg.sources && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Source Documents
                    </span>

                    {/* 3 Clickable Cards matching mockup */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {msg.sources.map((src, idx) => (
                        <Link
                          key={idx}
                          href="/documents"
                          className="p-3 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.03] hover:border-blue-400 transition-colors flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <FileText className="w-4 h-4 text-blue-600 shrink-0" />
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-900 dark:text-white truncate block">
                                {src.name}
                              </span>
                              <span className="text-[10px] text-slate-400 font-mono">
                                {src.amount}
                              </span>
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>

                    <div className="pt-1">
                      <Link
                        href="/documents"
                        className="text-xs font-bold text-blue-600 hover:underline inline-flex items-center gap-1"
                      >
                        <span>View all 18 documents</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Sticky Bottom Input Dock matching mockup */}
      <div className="sticky bottom-4 pt-3 space-y-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="clean-card p-2 flex items-center gap-2 shadow-xl border-slate-300 dark:border-white/20"
        >
          <input
            type="text"
            placeholder="Ask AI about your documents, workflows, or data..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-transparent px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white shadow-xs transition-colors shrink-0 cursor-pointer"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </form>

        {/* Suggestion Chips below input matching mockup */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-500">
          <button
            onClick={() => handleSendMessage("Search documents for ABC Technologies")}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
          >
            <Search className="w-3 h-3 text-slate-400" />
            <span>Search documents</span>
          </button>
          <button
            onClick={() => handleSendMessage("Generate workflow for invoice approvals")}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3 h-3 text-purple-500" />
            <span>Generate workflow</span>
          </button>
          <button
            onClick={() => handleSendMessage("Analyze vendor spend data")}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
          >
            <BarChart2 className="w-3 h-3 text-blue-500" />
            <span>Analyze data</span>
          </button>
          <button
            onClick={() => handleSendMessage("Summarize monthly approvals")}
            className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 hover:bg-slate-50 flex items-center gap-1 cursor-pointer"
          >
            <FileSpreadsheet className="w-3 h-3 text-emerald-500" />
            <span>Summarize</span>
          </button>
        </div>
      </div>
    </div>
  );
}
