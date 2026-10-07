"use client";

import React, { useState } from "react";
import {
  Play,
  FileText,
  Upload,
  Cpu,
  Sliders,
  CheckCircle2,
  Bell,
  Globe,
  Archive,
  Sparkles,
  Save,
  Check,
  Plus,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Send,
  UserCheck,
} from "lucide-react";
import { WorkflowDefinition } from "@/types";

export function WorkflowCanvas({
  initialWorkflow,
  onSave,
  readOnly = false,
}: {
  initialWorkflow?: WorkflowDefinition;
  onSave?: (wf: any) => void;
  readOnly?: boolean;
}) {
  const [activeTab, setActiveTab] = useState<"builder" | "ai" | "executions" | "settings">("builder");
  const [zoom, setZoom] = useState(100);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simStep, setSimStep] = useState(0);

  const handleTest = () => {
    setIsSimulating(true);
    setSimStep(1);
    setTimeout(() => setSimStep(2), 700);
    setTimeout(() => setSimStep(3), 1400);
    setTimeout(() => setSimStep(4), 2100);
    setTimeout(() => setSimStep(5), 2800);
    setTimeout(() => {
      setIsSimulating(false);
      setSimStep(0);
    }, 3500);
  };

  const handleSave = () => {
    setSavedSuccess(true);
    if (onSave) onSave({ name: "Invoice Approval Workflow", status: "ACTIVE" });
    setTimeout(() => setSavedSuccess(false), 2000);
  };

  return (
    <div className="clean-card flex flex-col h-[750px] overflow-hidden">
      {/* Top Bar matching mockup: Title, Draft badge, + Test, Save, Activate */}
      <div className="h-16 px-6 border-b border-slate-200 dark:border-white/[0.08] flex items-center justify-between bg-white dark:bg-[#111827]">
        <div className="flex items-center gap-3">
          <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
            {initialWorkflow?.name || "New Visual Workflow"}
          </h2>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-slate-300">
            Draft
          </span>
        </div>

        {/* Action Buttons matching mockup */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTest}
            disabled={isSimulating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            <Play className="w-3 h-3 text-blue-600" />
            <span>{isSimulating ? "Testing..." : "+ Test"}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 text-slate-700 dark:text-slate-200 shadow-2xs transition-colors cursor-pointer"
          >
            {savedSuccess ? <Check className="w-3 h-3 text-emerald-500" /> : <Save className="w-3 h-3" />}
            <span>{savedSuccess ? "Saved" : "Save"}</span>
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white btn-purple-gradient transition-all cursor-pointer shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Activate</span>
          </button>
        </div>
      </div>

      {/* Tabs Row matching mockup: Builder, AI Generate, Executions, Settings */}
      <div className="px-6 border-b border-slate-200 dark:border-white/[0.08] flex items-center gap-6 text-xs font-semibold bg-[#F8FAFC] dark:bg-[#13192B]">
        {[
          { id: "builder", label: "Builder" },
          { id: "ai", label: "AI Generate" },
          { id: "executions", label: "Executions" },
          { id: "settings", label: "Settings" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`py-3 transition-colors cursor-pointer ${
              activeTab === tab.id
                ? "border-b-2 border-blue-600 text-blue-600 dark:text-blue-400 font-bold"
                : "text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Studio Area: Left Node Palette + Center Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Palette matching mockup: Add Node */}
        <div className="w-52 shrink-0 border-r border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#111827] p-4 flex flex-col justify-between">
          <div>
            <span className="text-xs font-bold text-slate-800 dark:text-white block mb-3">
              Add Node
            </span>

            {/* Node Items matching mockup */}
            <div className="space-y-2">
              {[
                { label: "Document Upload", icon: Upload, color: "text-blue-600 bg-blue-50" },
                { label: "AI Extract", icon: Cpu, color: "text-purple-600 bg-purple-50" },
                { label: "Condition", icon: Sliders, color: "text-orange-600 bg-orange-50" },
                { label: "Approval", icon: UserCheck, color: "text-blue-600 bg-blue-50" },
                { label: "Notification", icon: Bell, color: "text-cyan-600 bg-cyan-50" },
                { label: "API Call", icon: Globe, color: "text-indigo-600 bg-indigo-50" },
                { label: "Archive", icon: Archive, color: "text-emerald-600 bg-emerald-50" },
              ].map((n) => {
                const Icon = n.icon;
                return (
                  <div
                    key={n.label}
                    className="p-2 rounded-xl border border-slate-200 dark:border-white/10 hover:border-blue-400 hover:bg-slate-50 dark:hover:bg-white/[0.03] transition-all flex items-center gap-2.5 cursor-grab text-xs font-medium text-slate-700 dark:text-slate-300"
                  >
                    <div className={`p-1.5 rounded-lg ${n.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span>{n.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Minimap Box in bottom left matching mockup */}
          <div className="p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/[0.02]">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              Minimap
            </span>
            <div className="w-full h-16 bg-slate-200/60 dark:bg-slate-800 rounded relative">
              <div className="w-8 h-4 border border-blue-500 bg-blue-500/20 absolute top-4 left-6 rounded" />
            </div>
          </div>
        </div>

        {/* Canvas Area matching exact flowchart in mockup */}
        <div className="flex-1 dot-grid-bg relative overflow-auto p-8 flex items-center justify-center bg-[#FAFAFC] dark:bg-[#0B0F19]">
          {/* Zoom controls floating in top-right */}
          <div className="absolute top-4 right-4 flex items-center gap-1 p-1 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 shadow-xs z-20 text-xs">
            <button
              onClick={() => setZoom((z) => Math.max(50, z - 10))}
              className="p-1 hover:bg-slate-100 rounded text-slate-600 dark:text-slate-300"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] font-bold">{zoom}%</span>
            <button
              onClick={() => setZoom((z) => Math.min(150, z + 10))}
              className="p-1 hover:bg-slate-100 rounded text-slate-600 dark:text-slate-300"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button className="p-1 hover:bg-slate-100 rounded text-slate-600 dark:text-slate-300 ml-1">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Flowchart Diagram matching mockup */}
          <div
            style={{ transform: `scale(${zoom / 100})`, transformOrigin: "center center" }}
            className="relative w-[880px] h-[340px] select-none transition-transform"
          >
            {/* SVG Connecting Bezier lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              {/* Node 1 to Node 2 */}
              <line x1="120" y1="120" x2="160" y2="120" stroke="#94A3B8" strokeWidth="2" />
              {/* Node 2 to Diamond */}
              <line x1="260" y1="120" x2="310" y2="120" stroke="#94A3B8" strokeWidth="2" />

              {/* Diamond to Manager Approval (YES branch) */}
              <path d="M 370 120 L 440 120" stroke="#10B981" strokeWidth="2" fill="none" />
              {/* Manager Approval to Send to Finance */}
              <line x1="535" y1="120" x2="570" y2="120" stroke="#94A3B8" strokeWidth="2" />
              {/* Send to Finance to Archive */}
              <line x1="660" y1="120" x2="700" y2="120" stroke="#94A3B8" strokeWidth="2" />
              {/* Archive to End */}
              <line x1="790" y1="120" x2="830" y2="120" stroke="#94A3B8" strokeWidth="2" />

              {/* Diamond to Auto Process (NO branch) */}
              <path d="M 340 150 L 340 230 L 440 230" stroke="#EF4444" strokeWidth="2" fill="none" />
            </svg>

            {/* Node 1: Document Uploaded (green icon) */}
            <div
              className={`absolute top-[90px] left-[20px] z-20 clean-card p-3 w-28 text-center border-emerald-300 shadow-md ${
                simStep === 1 ? "ring-4 ring-emerald-400" : ""
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-1">
                <Upload className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 dark:text-white block">
                Document Uploaded
              </span>
              <span className="text-[9px] text-slate-400">Invoice</span>
            </div>

            {/* Node 2: AI Extract (purple icon) */}
            <div
              className={`absolute top-[90px] left-[160px] z-20 clean-card p-3 w-28 text-center border-purple-300 shadow-md ${
                simStep === 2 ? "ring-4 ring-purple-400" : ""
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-purple-50 text-purple-600 flex items-center justify-center mx-auto mb-1">
                <Cpu className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 dark:text-white block">
                AI Extract
              </span>
              <span className="text-[9px] text-slate-400">Invoice Data</span>
            </div>

            {/* Node 3: Condition Diamond Amount > ₹50,000? */}
            <div
              className={`absolute top-[80px] left-[295px] z-20 w-24 h-24 rotate-45 clean-card border-orange-400 flex items-center justify-center shadow-md bg-orange-50/50 ${
                simStep === 3 ? "ring-4 ring-orange-400" : ""
              }`}
            >
              <div className="-rotate-45 text-center p-1">
                <span className="text-[9px] font-black text-orange-700 leading-tight block">
                  Amount &gt; ₹50,000?
                </span>
              </div>
            </div>

            {/* YES Branch Badge */}
            <span className="absolute top-[108px] left-[390px] z-20 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700">
              Yes
            </span>

            {/* NO Branch Badge */}
            <span className="absolute top-[180px] left-[315px] z-20 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700">
              No
            </span>

            {/* Node 4 (Top Branch): Manager Approval (blue icon) */}
            <div
              className={`absolute top-[90px] left-[440px] z-20 clean-card p-3 w-28 text-center border-blue-300 shadow-md ${
                simStep === 4 ? "ring-4 ring-blue-400" : ""
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-1">
                <UserCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 dark:text-white block">
                Manager Approval
              </span>
              <span className="text-[9px] text-slate-400">Department</span>
            </div>

            {/* Node 5 (Top Branch): Send to Finance (cyan icon) */}
            <div
              className={`absolute top-[90px] left-[570px] z-20 clean-card p-3 w-24 text-center border-cyan-300 shadow-md ${
                simStep === 5 ? "ring-4 ring-cyan-400" : ""
              }`}
            >
              <div className="w-6 h-6 rounded-md bg-cyan-50 text-cyan-600 flex items-center justify-center mx-auto mb-1">
                <Send className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 dark:text-white block">
                Send to Finance
              </span>
            </div>

            {/* Node 6 (Top Branch): Archive Document (gray icon) */}
            <div className="absolute top-[90px] left-[700px] z-20 clean-card p-3 w-24 text-center border-slate-300 shadow-md">
              <div className="w-6 h-6 rounded-md bg-slate-100 text-slate-600 flex items-center justify-center mx-auto mb-1">
                <Archive className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 dark:text-white block">
                Archive Document
              </span>
            </div>

            {/* Node 7 (Top Branch): End (red circle) */}
            <div className="absolute top-[105px] left-[830px] z-20 w-8 h-8 rounded-full bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center shadow-md">
              End
            </div>

            {/* Node 8 (Bottom Branch): Auto Process (red icon) */}
            <div className="absolute top-[205px] left-[440px] z-20 clean-card p-3 w-28 text-center border-rose-300 shadow-md">
              <div className="w-6 h-6 rounded-md bg-rose-50 text-rose-600 flex items-center justify-center mx-auto mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-slate-800 dark:text-white block">
                Auto Process
              </span>
              <span className="text-[9px] text-slate-400">Direct ERP</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
