"use client";

import React, { useState, useRef } from "react";
import {
  Play,
  FileText,
  Scan,
  Sparkles,
  GitFork,
  CheckCircle2,
  Bell,
  Mail,
  Webhook,
  Database,
  Eye,
  Archive,
  Square,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Save,
  Check,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  WorkflowDefinition,
  WorkflowNode,
  WorkflowEdge,
  WorkflowNodeType,
} from "@/types";

interface WorkflowCanvasProps {
  initialWorkflow?: WorkflowDefinition;
  onSave?: (wf: WorkflowDefinition) => void;
  readOnly?: boolean;
}

export function WorkflowCanvas({
  initialWorkflow,
  onSave,
  readOnly = false,
}: WorkflowCanvasProps) {
  const [nodes, setNodes] = useState<WorkflowNode[]>(
    initialWorkflow?.nodes || [
      { id: "node-1", type: "START", label: "Start Event", position: { x: 50, y: 150 }, config: {} },
      { id: "node-2", type: "DOCUMENT_UPLOAD", label: "Document Ingest", position: { x: 260, y: 150 }, config: {} },
      { id: "node-3", type: "AI_EXTRACTION", label: "Extract Entities", position: { x: 470, y: 150 }, config: {} },
      { id: "node-4", type: "END", label: "End Flow", position: { x: 680, y: 150 }, config: {} },
    ]
  );

  const [edges, setEdges] = useState<WorkflowEdge[]>(
    initialWorkflow?.edges || [
      { id: "e1", source: "node-1", target: "node-2" },
      { id: "e2", source: "node-2", target: "node-3" },
      { id: "e3", source: "node-3", target: "node-4" },
    ]
  );

  const [workflowName, setWorkflowName] = useState(
    initialWorkflow?.name || "New Autonomous Workflow"
  );
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);
  const [isSimulating, setIsSimulating] = useState(false);
  const [activeSimNodeId, setActiveSimNodeId] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);

  const getNodeColor = (type: WorkflowNodeType) => {
    switch (type) {
      case "START":
        return "border-l-emerald-500 text-emerald-600";
      case "DOCUMENT_UPLOAD":
      case "OCR":
        return "border-l-blue-500 text-blue-600";
      case "AI_EXTRACTION":
      case "CLASSIFICATION":
        return "border-l-purple-500 text-purple-600";
      case "CONDITION":
        return "border-l-amber-500 text-amber-600";
      case "APPROVAL":
      case "HUMAN_REVIEW":
        return "border-l-indigo-500 text-indigo-600";
      case "NOTIFICATION":
      case "EMAIL":
      case "API_CALL":
        return "border-l-sky-500 text-sky-600";
      case "ARCHIVE":
      case "DATABASE_ACTION":
        return "border-l-teal-500 text-teal-600";
      case "END":
        return "border-l-rose-500 text-rose-600";
      default:
        return "border-l-slate-500 text-slate-600";
    }
  };

  const getNodeIcon = (type: WorkflowNodeType) => {
    switch (type) {
      case "START":
        return Play;
      case "DOCUMENT_UPLOAD":
        return FileText;
      case "OCR":
        return Scan;
      case "AI_EXTRACTION":
        return Sparkles;
      case "CLASSIFICATION":
        return LayersIcon;
      case "CONDITION":
        return GitFork;
      case "APPROVAL":
        return CheckCircle2;
      case "NOTIFICATION":
        return Bell;
      case "EMAIL":
        return Mail;
      case "API_CALL":
        return Webhook;
      case "DATABASE_ACTION":
        return Database;
      case "HUMAN_REVIEW":
        return Eye;
      case "ARCHIVE":
        return Archive;
      case "END":
        return Square;
      default:
        return Sparkles;
    }
  };

  function LayersIcon(props: any) {
    return <Sparkles {...props} />;
  }

  // Simulator step-through
  const handleTestSimulate = async () => {
    setIsSimulating(true);
    for (const node of nodes) {
      setActiveSimNodeId(node.id);
      await new Promise((r) => setTimeout(r, 600));
    }
    setActiveSimNodeId(null);
    setIsSimulating(false);
  };

  const handleSave = () => {
    const updated: WorkflowDefinition = {
      id: initialWorkflow?.id || `wf-${Date.now()}`,
      organizationId: "org-apex-01",
      name: workflowName,
      description: initialWorkflow?.description || "Visual canvas defined workflow",
      category: initialWorkflow?.category || "Operations",
      isActive: true,
      version: (initialWorkflow?.version || 0) + 1,
      nodes,
      edges,
      createdAt: initialWorkflow?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (onSave) onSave(updated);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleAddNode = (type: WorkflowNodeType) => {
    const id = `node-${Date.now()}`;
    const newNode: WorkflowNode = {
      id,
      type,
      label: type.replace("_", " "),
      description: "Configured step",
      position: { x: 300 + (nodes.length % 4) * 80, y: 180 + (nodes.length % 3) * 60 },
      config: {},
    };

    setNodes((prev) => [...prev, newNode]);

    // Connect automatically from last node if possible
    if (nodes.length > 0) {
      const lastNode = nodes[nodes.length - 1];
      setEdges((prev) => [
        ...prev,
        { id: `e-${lastNode.id}-${id}`, source: lastNode.id, target: id },
      ]);
    }

    setSelectedNodeId(id);
  };

  const handleDeleteNode = (id: string) => {
    setNodes((prev) => prev.filter((n) => n.id !== id));
    setEdges((prev) => prev.filter((e) => e.source !== id && e.target !== id));
    if (selectedNodeId === id) setSelectedNodeId(null);
  };

  return (
    <div className="relative w-full h-[700px] rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xl overflow-hidden flex flex-col select-none">
      {/* Top Toolbar (Section 27) */}
      <div className="h-14 px-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-white/80 dark:bg-slate-900/80 backdrop-blur-md z-20">
        <div className="flex items-center gap-3">
          <input
            type="text"
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            disabled={readOnly}
            className="text-sm font-bold text-slate-900 dark:text-slate-100 bg-transparent border-b border-transparent hover:border-slate-300 dark:hover:border-slate-700 focus:border-blue-500 focus:outline-hidden px-1 py-0.5"
          />
          <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            {nodes.length} Nodes • {edges.length} Edges
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Zoom */}
          <div className="flex items-center border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-slate-800 text-xs">
            <button
              onClick={() => setZoom((z) => Math.max(z - 0.1, 0.6))}
              className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-700 text-slate-500"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 font-mono text-[11px] text-slate-500">
              {Math.round(zoom * 100)}%
            </span>
            <button
              onClick={() => setZoom((z) => Math.min(z + 0.1, 1.4))}
              className="p-1.5 hover:bg-slate-200/60 dark:hover:bg-slate-700 text-slate-500"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Test simulation */}
          <button
            onClick={handleTestSimulate}
            disabled={isSimulating}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800 hover:bg-purple-100 transition-colors"
          >
            <Play className={`w-3.5 h-3.5 ${isSimulating ? "animate-spin" : ""}`} />
            <span>{isSimulating ? "Simulating..." : "Test Run"}</span>
          </button>

          {!readOnly && (
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-xs transition-colors"
            >
              {savedSuccess ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Workflow</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* Main Canvas Space & Right Config Panel */}
      <div className="flex-1 relative flex overflow-hidden">
        {/* Left Pallette: Add Node (collapsible or floating) */}
        {!readOnly && (
          <div className="absolute top-4 left-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-200/80 dark:border-slate-800 p-2 shadow-lg space-y-1 w-44">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-1 block">
              Add Node
            </span>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {[
                { type: "CONDITION", label: "Condition Gate" },
                { type: "APPROVAL", label: "Manager Approval" },
                { type: "API_CALL", label: "REST / Webhook" },
                { type: "NOTIFICATION", label: "Send Alert" },
                { type: "EMAIL", label: "Send Email" },
                { type: "HUMAN_REVIEW", label: "Human Review" },
                { type: "ARCHIVE", label: "Archive Document" },
              ].map((n) => (
                <button
                  key={n.type}
                  onClick={() => handleAddNode(n.type as any)}
                  className="w-full flex items-center gap-2 p-1.5 rounded-lg text-xs text-left hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 transition-colors"
                >
                  <Plus className="w-3 h-3 text-blue-500" />
                  <span>{n.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Background Grid Canvas */}
        <div
          className="flex-1 relative overflow-auto p-12 transition-transform bg-[#F8FAFC] dark:bg-[#0B1120]"
          style={{
            backgroundImage: `radial-gradient(circle, #CBD5E1 1px, transparent 1px)`,
            backgroundSize: "24px 24px",
          }}
        >
          {/* SVG Connection Lines with Bezier Curves & Animated Flow (Section 27) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
            <defs>
              <marker
                id="arrowhead"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#94A3B8" />
              </marker>
              <marker
                id="arrowhead-active"
                markerWidth="8"
                markerHeight="8"
                refX="7"
                refY="4"
                orient="auto"
              >
                <polygon points="0 0, 8 4, 0 8" fill="#2563EB" />
              </marker>
            </defs>

            {edges.map((edge) => {
              const srcNode = nodes.find((n) => n.id === edge.source);
              const tgtNode = nodes.find((n) => n.id === edge.target);
              if (!srcNode || !tgtNode) return null;

              // Node dimensions approx 180w x 70h
              const x1 = srcNode.position.x + 180;
              const y1 = srcNode.position.y + 35;
              const x2 = tgtNode.position.x;
              const y2 = tgtNode.position.y + 35;

              const dx = (x2 - x1) / 2;
              const pathD = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

              const isActive = activeSimNodeId === srcNode.id || activeSimNodeId === tgtNode.id;

              return (
                <g key={edge.id}>
                  <path
                    d={pathD}
                    fill="none"
                    stroke={isActive ? "#2563EB" : "#94A3B8"}
                    strokeWidth={isActive ? "2.5" : "1.8"}
                    strokeDasharray={isActive ? "4 4" : undefined}
                    className={isActive ? "animate-pulse" : ""}
                    markerEnd={isActive ? "url(#arrowhead-active)" : "url(#arrowhead)"}
                  />
                  {edge.label && (
                    <text
                      x={(x1 + x2) / 2}
                      y={(y1 + y2) / 2 - 8}
                      fill="#64748B"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="middle"
                      className="bg-white dark:bg-slate-900 px-1 py-0.5"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Interactive Nodes */}
          {nodes.map((node) => {
            const Icon = getNodeIcon(node.type);
            const isSelected = selectedNodeId === node.id;
            const isSimulatingActive = activeSimNodeId === node.id;

            return (
              <div
                key={node.id}
                onClick={() => setSelectedNodeId(node.id)}
                className={`absolute w-44 rounded-2xl bg-white dark:bg-slate-800/95 p-3.5 shadow-md border-l-4 border transition-all cursor-pointer z-10 ${getNodeColor(
                  node.type
                )} ${
                  isSimulatingActive
                    ? "ring-4 ring-blue-500 scale-105 shadow-xl"
                    : isSelected
                    ? "ring-2 ring-blue-500/80 border-blue-400 shadow-lg"
                    : "border-slate-200/80 dark:border-slate-700 hover:shadow-lg hover:border-slate-300"
                }`}
                style={{
                  left: `${node.position.x}px`,
                  top: `${node.position.y}px`,
                  transform: `scale(${zoom})`,
                  transformOrigin: "top left",
                }}
              >
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-slate-50 dark:bg-slate-700/60 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate">
                      {node.label}
                    </h4>
                    <p className="text-[10px] text-slate-400 truncate">
                      {node.type}
                    </p>
                  </div>
                </div>

                {node.description && (
                  <p className="mt-2 text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 border-t border-slate-100 dark:border-slate-700/50 pt-1.5">
                    {node.description}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Right Configuration Inspector Panel (Section 27) */}
        {selectedNode && (
          <div className="w-80 border-l border-slate-100 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-5 z-20 flex flex-col justify-between overflow-y-auto">
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  Node Settings
                </span>
                <button
                  onClick={() => setSelectedNodeId(null)}
                  className="p-1 rounded-md text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Node Title
                </label>
                <input
                  type="text"
                  value={selectedNode.label}
                  onChange={(e) => {
                    const nextVal = e.target.value;
                    setNodes((prev) =>
                      prev.map((n) =>
                        n.id === selectedNode.id ? { ...n, label: nextVal } : n
                      )
                    );
                  }}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={selectedNode.description || ""}
                  onChange={(e) => {
                    const nextVal = e.target.value;
                    setNodes((prev) =>
                      prev.map((n) =>
                        n.id === selectedNode.id ? { ...n, description: nextVal } : n
                      )
                    );
                  }}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  Node Type
                </label>
                <span className="inline-block text-xs font-semibold px-2 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300">
                  {selectedNode.type}
                </span>
              </div>

              {selectedNode.type === "CONDITION" && (
                <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Rule Expression
                  </span>
                  <div className="text-[11px] font-mono text-purple-600 dark:text-purple-400">
                    IF invoice.total &gt; 50000 THEN approve
                  </div>
                </div>
              )}

              {selectedNode.type === "APPROVAL" && (
                <div className="space-y-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Required Role
                  </span>
                  <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
                    MANAGER Signoff Gate
                  </div>
                </div>
              )}
            </div>

            {!readOnly && (
              <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                <button
                  onClick={() => handleDeleteNode(selectedNode.id)}
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-rose-200 dark:border-rose-900 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Node</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
