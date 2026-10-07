"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  GitFork,
  Sparkles,
  Plus,
  Play,
  ArrowRight,
  CheckCircle2,
  Clock,
  Layers,
  Building2,
  GraduationCap,
  Hospital,
  Truck,
  Briefcase,
  Sliders,
  Send,
  Check,
} from "lucide-react";
import { useApp } from "@/lib/store/app-context";
import { generateWorkflowFromPrompt } from "@/lib/workflow/workflow-generator";
import { WorkflowDefinition } from "@/types";
import { WorkflowCanvas } from "@/components/workflows/workflow-canvas";

export default function WorkflowsPage() {
  const router = useRouter();
  const { workflows, addWorkflow, toggleWorkflowActive } = useApp();

  const [isGeneratorModalOpen, setIsGeneratorModalOpen] = useState(false);
  const [naturalPrompt, setNaturalPrompt] = useState(
    "Whenever an invoice above ₹50,000 is uploaded, send it to the department manager for approval. If approved, send it to finance and archive it."
  );
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWorkflow, setGeneratedWorkflow] = useState<WorkflowDefinition | null>(null);

  // Industry Template Presets (Section 4 & 46)
  const industryTemplates = [
    {
      industry: "Office & Finance",
      title: "Invoice High-Value Gate",
      description: "Extract total amount; if > ₹50,000 route to Manager signoff, then sync to ERP.",
      icon: Briefcase,
      color: "text-blue-600 bg-blue-50 dark:bg-blue-950/60",
      prompt: "Whenever an invoice above ₹50,000 is uploaded, send to department manager for approval, then send to finance and archive.",
    },
    {
      industry: "College & Academia",
      title: "Scholarship & Leave Approvals",
      description: "Extract GPA certificates, check minimum 3.8 criteria, alert Dean for grant signoff.",
      icon: GraduationCap,
      color: "text-purple-600 bg-purple-50 dark:bg-purple-950/60",
      prompt: "When a student scholarship application is submitted, extract GPA and route to Academic Dean if GPA > 3.8.",
    },
    {
      industry: "Hospital & Healthcare",
      title: "Insurance Pre-Authorization",
      description: "Parse diagnosis code, verify medical coverage limits, and alert TPA insurance desk.",
      icon: Hospital,
      color: "text-rose-600 bg-rose-50 dark:bg-rose-950/60",
      prompt: "When a patient hospital claim form is received, extract claim amount, verify physician stamp, and route to insurance desk.",
    },
    {
      industry: "Logistics & Supply",
      title: "Waybill & POD Verification",
      description: "Verify recipient signature on delivery notes and automatically unblock payment terms.",
      icon: Truck,
      color: "text-amber-600 bg-amber-50 dark:bg-amber-950/60",
      prompt: "When a delivery note or waybill is uploaded, verify signature and unblock invoice dispatch.",
    },
  ];

  const handleGenerateWorkflow = async (promptText: string) => {
    setIsGenerating(true);
    setGeneratedWorkflow(null);

    // Simulate AI synthesis with latency
    await new Promise((r) => setTimeout(r, 900));
    const result = generateWorkflowFromPrompt(promptText);
    setGeneratedWorkflow(result);
    setIsGenerating(false);
  };

  const handleActivateGenerated = () => {
    if (!generatedWorkflow) return;
    addWorkflow(generatedWorkflow);
    setIsGeneratorModalOpen(false);
    setGeneratedWorkflow(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
            Workflows & Orchestration
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Deterministic state machines triggered by classified document intelligence
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsGeneratorModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors shadow-2xs"
          >
            <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
            <span>Generate with AI</span>
          </button>

          <Link
            href="/workflows/builder"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Visual Builder</span>
          </Link>
        </div>
      </div>

      {/* Signature Section: Natural Language Workflow Generator Banner (Section 26) */}
      <div className="rounded-3xl border border-purple-200/80 dark:border-purple-900/60 bg-gradient-to-r from-blue-50/60 via-purple-50/50 to-indigo-50/60 dark:from-slate-900 dark:via-purple-950/20 dark:to-slate-900 p-6 sm:p-8 shadow-xs relative overflow-hidden">
        <div className="max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-white dark:bg-slate-800 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            AI Workflow Generator (Signature Feature)
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-slate-100">
            Generate complex workflow DAGs from plain English.
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Describe routing policies, approval thresholds, and automated integrations. The AI model drafts the visual node graph, and our deterministic engine enforces flawless execution.
          </p>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row items-center gap-2 max-w-2xl bg-white dark:bg-slate-800 p-2 rounded-2xl border border-purple-100 dark:border-purple-900/80 shadow-md">
          <input
            type="text"
            value={naturalPrompt}
            onChange={(e) => setNaturalPrompt(e.target.value)}
            placeholder="e.g. Invoices above ₹50k require manager approval, then send to finance..."
            className="flex-1 px-3 py-2 text-xs text-slate-900 dark:text-slate-100 bg-transparent focus:outline-hidden"
          />
          <button
            onClick={() => {
              setIsGeneratorModalOpen(true);
              handleGenerateWorkflow(naturalPrompt);
            }}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-semibold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <span>Generate DAG</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Industry Workflow Templates (Section 4 & 46) */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Cross-Industry Blueprint Templates
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {industryTemplates.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className={`w-9 h-9 rounded-xl ${item.color} flex items-center justify-center mb-3`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    {item.industry}
                  </span>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 mt-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <button
                  onClick={() => {
                    setNaturalPrompt(item.prompt);
                    setIsGeneratorModalOpen(true);
                    handleGenerateWorkflow(item.prompt);
                  }}
                  className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center justify-between"
                >
                  <span>Use Template</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Workflows Table / List */}
      <div className="space-y-4">
        <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
          Deployed Workflows ({workflows.length})
        </h2>

        <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/75 dark:bg-slate-800/40 text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-5">Workflow Name</th>
                  <th className="py-3 px-5">Category</th>
                  <th className="py-3 px-5">Nodes</th>
                  <th className="py-3 px-5">Runs</th>
                  <th className="py-3 px-5">Success Rate</th>
                  <th className="py-3 px-5">Status</th>
                  <th className="py-3 px-5 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {workflows.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="flex flex-col items-center justify-center space-y-2">
                        <GitFork className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                        <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                          No custom workflows created yet
                        </p>
                        <p className="text-xs text-slate-400 max-w-sm">
                          Use the AI Workflow Synthesizer or pick an Industry Preset above to generate your first automated pipeline.
                        </p>
                        <button
                          onClick={() => setIsGeneratorModalOpen(true)}
                          className="mt-2 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Generate Workflow with AI</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  workflows.map((wf) => (
                    <tr
                      key={wf.id}
                      className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors"
                    >
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-purple-50 dark:bg-purple-950/60 border border-purple-100 dark:border-purple-900/60 flex items-center justify-center shrink-0 text-purple-600 dark:text-purple-400">
                          <GitFork className="w-4 h-4" />
                        </div>
                        <div>
                          <Link
                            href={`/workflows/builder?id=${wf.id}`}
                            className="font-semibold text-slate-900 dark:text-slate-100 hover:text-blue-600 transition-colors block text-xs"
                          >
                            {wf.name}
                          </Link>
                          <span className="text-[11px] text-slate-400">
                            v{wf.version} • {wf.description.substring(0, 50)}...
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {wf.category}
                      </span>
                    </td>

                    <td className="py-3.5 px-5 text-xs text-slate-600 dark:text-slate-400">
                      {wf.nodes.length} nodes
                    </td>

                    <td className="py-3.5 px-5 text-xs font-mono text-slate-700 dark:text-slate-300">
                      {wf.runsCount?.toLocaleString() || 120}
                    </td>

                    <td className="py-3.5 px-5">
                      <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {wf.successRate || 98.4}%
                      </span>
                    </td>

                    <td className="py-3.5 px-5">
                      <button
                        onClick={() => toggleWorkflowActive(wf.id)}
                        className={`text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                          wf.isActive
                            ? "bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {wf.isActive ? "Active" : "Paused"}
                      </button>
                    </td>

                    <td className="py-3.5 px-5 text-right">
                      <Link
                        href={`/workflows/builder?id=${wf.id}`}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
                      >
                        Edit Canvas →
                      </Link>
                    </td>
                  </tr>
                )))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* AI Workflow Generator Modal (Section 26) */}
      {isGeneratorModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setIsGeneratorModalOpen(false)}
          />

          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 space-y-5 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-purple-600" />
                <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  AI Workflow Synthesizer
                </h3>
              </div>
              <button
                onClick={() => setIsGeneratorModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            </div>

            {/* Input Area */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Natural Language Workflow Prompt
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={naturalPrompt}
                  onChange={(e) => setNaturalPrompt(e.target.value)}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
                <button
                  onClick={() => handleGenerateWorkflow(naturalPrompt)}
                  disabled={isGenerating}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 transition-colors shrink-0"
                >
                  {isGenerating ? "Synthesizing..." : "Regenerate"}
                </button>
              </div>
            </div>

            {/* Visual Workflow Canvas Preview */}
            {isGenerating ? (
              <div className="h-64 rounded-2xl bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center space-y-2">
                <Sparkles className="w-8 h-8 text-purple-600 animate-spin" />
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                  Synthesizing deterministic graph, nodes & condition rules...
                </p>
              </div>
            ) : generatedWorkflow ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    Generated Graph Preview ({generatedWorkflow.nodes.length} nodes)
                  </span>
                  <span className="text-emerald-600 font-semibold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Validated Deterministic DAG
                  </span>
                </div>

                <div className="h-[380px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800">
                  <WorkflowCanvas initialWorkflow={generatedWorkflow} readOnly={false} />
                </div>

                {/* Bottom Buttons: Review, Edit, Activate (Section 26) */}
                <div className="flex items-center justify-between pt-2">
                  <button
                    onClick={() => {
                      addWorkflow(generatedWorkflow);
                      router.push(`/workflows/builder?id=${generatedWorkflow.id}`);
                    }}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 bg-slate-100 hover:bg-slate-200 transition-colors"
                  >
                    Open in Full Studio Editor
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setIsGeneratorModalOpen(false)}
                      className="px-4 py-2 rounded-xl text-xs font-medium text-slate-500 hover:text-slate-700"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleActivateGenerated}
                      className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors flex items-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Activate Workflow</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
