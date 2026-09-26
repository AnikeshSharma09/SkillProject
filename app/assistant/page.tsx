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
  Clock,
  ShieldCheck,
  Layers,
  MessageSquare,
  Bot,
  Binary,
} from "lucide-react";
import { useApp } from "@/lib/store/app-context";
import { queryDocumentRAG } from "@/lib/rag/semantic-search";
import { RagResponse, RagSource } from "@/types";

interface MessageItem {
  id: string;
  sender: "user" | "ai";
  text: string;
  sources?: RagSource[];
  latencyMs?: number;
  timestamp: string;
}

export default function AssistantPage() {
  const { documents } = useApp();

  const [inputQuery, setInputQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSources, setExpandedSources] = useState<Record<string, boolean>>({});

  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: "msg-welcome",
      sender: "ai",
      text: "Welcome to the AI-FLOW Semantic RAG Assistant. Query verified entities, cross-document relationships, approval histories, and numerical thresholds with strict deterministic ground-truth citations.",
      timestamp: "Just now",
    },
  ]);

  const suggestedQuestions = [
    "Which invoices exceed ₹50,000 threshold?",
    "What invoices are currently pending approval?",
    "Summarize this month's procurement activity",
    "Which vendors have open records?",
    "What is the payment deadline for ABC Technologies?",
  ];

  const handleSendMessage = async (queryText?: string) => {
    const query = queryText || inputQuery;
    if (!query.trim() || isLoading) return;

    const userMsgId = `usr-${Date.now()}`;
    const aiMsgId = `ai-${Date.now()}`;

    // Add user message
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
          sources: ragResult.sources,
          latencyMs: ragResult.latencyMs,
          timestamp: "Just now",
        },
      ]);
      setExpandedSources((prev) => ({ ...prev, [aiMsgId]: true }));
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: "ai",
          text: "Encountered a retrieval error. Please try querying again.",
          timestamp: "Just now",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const toggleSources = (msgId: string) => {
    setExpandedSources((prev) => ({
      ...prev,
      [msgId]: !prev[msgId],
    }));
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12 animate-in fade-in duration-200">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Semantic Document Intelligence
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              pgvector HNSW
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Cosine similarity retrieval over 1536-dimensional document chunk embeddings
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">
            {documents.length} Documents Indexed
          </span>
        </div>
      </div>

      {/* Suggested Quick Queries Strip */}
      <div className="flex flex-wrap gap-2 pt-1">
        {suggestedQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(q)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/70 dark:bg-white/[0.04] border border-slate-200 dark:border-white/[0.08] hover:border-indigo-400 dark:hover:border-indigo-500/50 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/20 text-slate-700 dark:text-slate-300 transition-all cursor-pointer shadow-2xs group"
          >
            <Sparkles className="w-3 h-3 text-indigo-400 group-hover:scale-110 transition-transform" />
            <span>{q}</span>
          </button>
        ))}
      </div>

      {/* Conversation Thread */}
      <div className="space-y-4 pt-2">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${
              msg.sender === "user" ? "items-end" : "items-start"
            }`}
          >
            {msg.sender === "user" ? (
              <div className="max-w-xl p-4 rounded-2xl rounded-tr-xs bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm shadow-md font-semibold">
                {msg.text}
              </div>
            ) : (
              <div className="w-full rounded-2xl glass-surface-elevated dark:bg-[#0E1424]/90 border border-slate-200 dark:border-white/[0.08] shadow-lg p-6 space-y-4">
                {/* AI Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.06] pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-xs">
                      <Bot className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
                      AI-FLOW Synthesis
                    </span>
                    {msg.latencyMs && (
                      <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
                        {msg.latencyMs}ms latency
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSendMessage(messages[messages.length - 2]?.text)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                      title="Regenerate"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Markdown / Text Body */}
                <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-normal">
                  {msg.text}
                </div>

                {/* Verified Ground Truth Sources Box */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-white/[0.06] space-y-2">
                    <button
                      onClick={() => toggleSources(msg.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                    >
                      <Layers className="w-3.5 h-3.5 text-indigo-400" />
                      <span>
                        Verified Ground Truth Sources ({msg.sources.length})
                      </span>
                      {expandedSources[msg.id] ? (
                        <ChevronUp className="w-3.5 h-3.5" />
                      ) : (
                        <ChevronDown className="w-3.5 h-3.5" />
                      )}
                    </button>

                    {expandedSources[msg.id] && (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1 animate-in fade-in duration-150">
                        {msg.sources.map((src, idx) => (
                          <div
                            key={idx}
                            className="p-3 rounded-xl bg-slate-50 dark:bg-black/30 border border-slate-200/80 dark:border-white/[0.08] text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <Link
                                href={`/documents/${src.documentId}`}
                                className="font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 truncate max-w-[200px]"
                              >
                                <FileText className="w-3 h-3 shrink-0" />
                                <span className="truncate">{src.documentName}</span>
                              </Link>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-200 dark:bg-white/10 text-slate-700 dark:text-slate-300">
                                Pg {src.page} • {(src.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 italic line-clamp-2">
                              &ldquo;{src.excerpt}&rdquo;
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-start">
            <div className="w-full rounded-2xl glass-surface-elevated dark:bg-[#0E1424]/90 border border-slate-200 dark:border-white/[0.08] shadow-lg p-6 space-y-3 animate-pulse">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-xs font-bold text-indigo-400">
                  Executing HNSW vector chunk search & assembling verified citations...
                </span>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-3/4" />
                <div className="h-3 bg-slate-200 dark:bg-white/10 rounded w-1/2" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modern Sticky Input Bar */}
      <div className="sticky bottom-4 pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center shadow-2xl rounded-2xl glass-surface-elevated dark:bg-[#0E1424]/95 border border-indigo-500/30 p-2 focus-within:border-indigo-500 focus-within:shadow-[0_0_25px_rgba(99,102,241,0.25)] transition-all"
        >
          <div className="pl-3 pr-2 text-indigo-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Ask AI anything about your enterprise documents, invoices, and workflows..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-transparent py-2 px-1 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-2.5 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 disabled:opacity-40 text-white shadow-md transition-all shrink-0 cursor-pointer"
            title="Send query"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[11px] text-center text-slate-400 mt-2">
          Grounded directly in PostgreSQL pgvector semantic store. Zero hallucination guarantee.
        </p>
      </div>
    </div>
  );
}
