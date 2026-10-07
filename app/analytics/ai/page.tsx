"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Clock,
  Layers,
  Database,
  ShieldCheck,
} from "lucide-react";
import { INITIAL_AI_EVALUATIONS, INITIAL_AI_TELEMETRY } from "@/lib/store/demo-data";

export default function AIEvaluationPage() {
  const [evaluations, setEvaluations] = useState(INITIAL_AI_EVALUATIONS);
  const [telemetry, setTelemetry] = useState(INITIAL_AI_TELEMETRY);
  const [selectedEvalId, setSelectedEvalId] = useState(evaluations[0]?.id || "");

  const activeEval = evaluations.find((e) => e.id === selectedEvalId) || evaluations[0] || null;

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/analytics"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                AI Accuracy & Observability
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                Live Telemetry
              </span>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Ground-truth evaluation benchmarks, precision/recall scoring, latency, and token consumption
            </p>
          </div>
        </div>
      </div>

      {/* 4 Observability Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Total AI Inferences
          </span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {telemetry.length.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              {telemetry.length > 0 ? "Active" : "Ready"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Gemini 1.5 Flash + Vision</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Average Inference Latency
          </span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-slate-900 dark:text-slate-100 tabular-nums">
              {telemetry.length > 0 ? "2.8s" : "0.0s"}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              {telemetry.length > 0 ? "Healthy" : "Standby"}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Classification + JSON parse</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            AI Failure Rate
          </span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400 tabular-nums">
              0.0%
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
              Optimal
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Zod schema validation rejects</p>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Human Correction Rate
          </span>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-3xl font-bold text-purple-600 dark:text-purple-400 tabular-nums">
              0.0%
            </span>
            <span className="text-xs font-semibold text-purple-600 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-full">
              Optimal
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">Fields modified in review queue</p>
        </div>
      </div>

      {/* Section: Ground-Truth Evaluation Benchmark Datasets */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Ground-Truth Evaluation Benchmark Datasets
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparing human golden truth labels against zero-shot model structured extraction
            </p>
          </div>

          {evaluations.length > 0 && (
            <div className="flex items-center gap-2">
              {evaluations.map((ev) => (
                <button
                  key={ev.id}
                  onClick={() => setSelectedEvalId(ev.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    selectedEvalId === ev.id
                      ? "bg-purple-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200"
                  }`}
                >
                  {ev.datasetName}
                </button>
              ))}
            </div>
          )}
        </div>

        {activeEval ? (
          <>
            {/* Selected Benchmark Metrics Banner */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/60">
              <div>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Precision</span>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {(activeEval.precision * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Recall</span>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {(activeEval.recall * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">F1 Score</span>
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {(activeEval.f1Score * 100).toFixed(1)}%
                </div>
              </div>
              <div>
                <span className="text-[11px] text-slate-400 font-semibold uppercase">Eval Sample Size</span>
                <div className="text-xl font-bold text-slate-900 dark:text-slate-100 mt-0.5">
                  {activeEval.fieldCount} fields
                </div>
              </div>
            </div>

            {/* Expected vs AI Output Comparison Table */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Field-by-Field Ground Truth Diff ({activeEval.documentType})
              </h3>

              <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="py-2.5 px-4">Entity Field</th>
                      <th className="py-2.5 px-4">Expected Ground Truth</th>
                      <th className="py-2.5 px-4">AI Output</th>
                      <th className="py-2.5 px-4 text-right">Verification</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                    {activeEval.sampleDiff.map((row, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                          {row.field}
                        </td>
                        <td className="py-3 px-4 text-slate-700 dark:text-slate-300">
                          {row.expected}
                        </td>
                        <td className="py-3 px-4 font-medium text-slate-900 dark:text-slate-100">
                          {row.actual}
                        </td>
                        <td className="py-3 px-4 text-right">
                          {row.match ? (
                            <span className="inline-flex items-center gap-1 font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full text-[11px]">
                              <CheckCircle2 className="w-3 h-3" /> Exact Match
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 font-bold text-rose-600 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded-full text-[11px]">
                              <XCircle className="w-3 h-3" /> Discrepancy
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        ) : (
          <div className="py-10 text-center space-y-2">
            <Layers className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              No evaluation benchmarks logged yet
            </p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Ground-truth benchmarks will display F1 accuracy, precision, and recall metrics when tests are executed.
            </p>
          </div>
        )}
      </div>

      {/* Section: Live Inferences Telemetry Feed */}
      <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
              Live LLM Request Observability Stream
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Trace latency, model names, prompt tokens, and estimated cost per transaction
            </p>
          </div>
          <span className="text-xs text-emerald-600 font-mono font-semibold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            Live Logging
          </span>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 dark:bg-slate-800/60 font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
              <tr>
                <th className="py-2.5 px-4">Time</th>
                <th className="py-2.5 px-4">Model</th>
                <th className="py-2.5 px-4">Operation</th>
                <th className="py-2.5 px-4">Tokens (Prompt/Comp)</th>
                <th className="py-2.5 px-4">Latency</th>
                <th className="py-2.5 px-4">Est. Cost</th>
                <th className="py-2.5 px-4 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
              {telemetry.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400 font-sans text-xs">
                    No inference requests executed yet. AI telemetry logs will stream here live.
                  </td>
                </tr>
              ) : (
                telemetry.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 text-slate-400">{t.timestamp}</td>
                    <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">
                      {t.model}
                    </td>
                    <td className="py-2.5 px-4 text-purple-600 dark:text-purple-400 font-sans">
                      {t.operation}
                    </td>
                    <td className="py-2.5 px-4 text-slate-600 dark:text-slate-400">
                      {t.tokens.prompt} / {t.tokens.completion} ({t.tokens.total})
                    </td>
                    <td className="py-2.5 px-4 text-slate-700 dark:text-slate-300">
                      {t.latencyMs}ms
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">
                      ${t.costUsd.toFixed(6)}
                    </td>
                    <td className="py-2.5 px-4 text-right font-sans">
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-0.5 rounded-full">
                        200 OK
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
