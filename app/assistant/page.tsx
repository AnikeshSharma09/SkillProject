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
      text: "Welcome to AI-FLOW Document Assistant. You can query any structured entities, compliance rules, payment deadlines, and cross-document relationships across your enterprise repository.",
      timestamp: "Just now",
    },
  ]);

  const suggestedQuestions = [
    "Which invoices exceed ₹50,000?",
    "What invoices are pending approval?",
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
      // Default expand sources
      setExpandedSources((prev) => ({ ...prev, [aiMsgId]: true }));
    } catch (e) {
      setMessages((prev) => [
        ...prev,
        {
          id: aiMsgId,
          sender: "ai",
          text: "I encountered an error querying the vector index. Please try again.",
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
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="text-center space-y-1.5 pt-2 pb-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
          <span>Retrieval-Augmented Generation (pgvector RAG)</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          AI Document Assistant
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Ask anything about your organization&apos;s documents, amounts, contracts, and workflows.
        </p>
      </div>

      {/* Suggested Questions Chips */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {suggestedQuestions.map((q) => (
          <button
            key={q}
            onClick={() => handleSendMessage(q)}
            className="text-xs font-medium px-3 py-1.5 rounded-xl bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:border-blue-400 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 shadow-2xs transition-all hover:scale-[1.01]"
          >
            ✦ {q}
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
              <div className="max-w-xl p-4 rounded-2xl rounded-tr-xs bg-blue-600 text-white text-sm shadow-xs font-medium">
                {msg.text}
              </div>
            ) : (
              <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
                {/* AI Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
                      <Sparkles className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      AI-FLOW Intelligence
                    </span>
                    {msg.latencyMs && (
                      <span className="text-[11px] font-mono text-slate-400">
                        • {msg.latencyMs}ms
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleCopy(msg.id, msg.text)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Copy response"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                    <button
                      onClick={() => handleSendMessage(messages[messages.length - 2]?.text)}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                      title="Regenerate"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Markdown / Text Body */}
                <div className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap">
                  {msg.text}
                </div>

                {/* Source Citations Box */}
                {msg.sources && msg.sources.length > 0 && (
                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
                    <button
                      onClick={() => toggleSources(msg.id)}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Layers className="w-3.5 h-3.5 text-blue-500" />
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
                            className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-xs space-y-1.5"
                          >
                            <div className="flex items-center justify-between">
                              <Link
                                href={`/documents/${src.documentId}`}
                                className="font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 truncate max-w-[200px]"
                              >
                                <FileText className="w-3 h-3 shrink-0" />
                                <span className="truncate">{src.documentName}</span>
                              </Link>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                                Pg {src.page} • {(src.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-300 italic line-clamp-2">
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
            <div className="w-full rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-3 animate-pulse">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-purple-600 animate-spin" />
                <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                  Retrieving vector chunks and synthesizing answer...
                </span>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded w-1/2" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Large Input Box (Section 25) */}
      <div className="sticky bottom-4 pt-2">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="relative flex items-center shadow-xl rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 p-2"
        >
          <div className="pl-3 pr-2 text-purple-600 dark:text-purple-400">
            <Sparkles className="w-5 h-5" />
          </div>
          <input
            type="text"
            placeholder="Ask AI anything about your organization's documents, invoices, and workflows..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            disabled={isLoading}
            className="flex-1 bg-transparent py-2 px-1 text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 focus:outline-hidden"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-40 text-white shadow-xs transition-colors shrink-0"
            title="Send query"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-2">
          Grounded directly in your verified document repository. Zero hallucination guarantee.
        </p>
      </div>
    </div>
  );
}
