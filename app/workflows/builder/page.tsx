"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Sparkles, GitFork } from "lucide-react";
import { useApp } from "@/lib/store/app-context";
import { WorkflowCanvas } from "@/components/workflows/workflow-canvas";

function WorkflowBuilderContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const wfId = searchParams.get("id");
  const { workflows, addWorkflow, updateWorkflow } = useApp();

  const existingWf = wfId ? workflows.find((w) => w.id === wfId) : undefined;

  const handleSave = (updated: any) => {
    if (existingWf) {
      updateWorkflow(existingWf.id, updated);
    } else {
      addWorkflow(updated);
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <Link
            href="/workflows"
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
              {existingWf ? existingWf.name : "Visual Workflow Studio"}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Drag nodes, configure conditions, and orchestrate automated decisions
            </p>
          </div>
        </div>

        <Link
          href="/workflows"
          className="px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Close Studio
        </Link>
      </div>

      {/* Main Canvas Container */}
      <WorkflowCanvas initialWorkflow={existingWf} onSave={handleSave} />
    </div>
  );
}

export default function WorkflowBuilderPage() {
  return (
    <Suspense
      fallback={
        <div className="p-12 text-center text-xs text-slate-400">
          Loading workflow canvas...
        </div>
      }
    >
      <WorkflowBuilderContent />
    </Suspense>
  );
}
