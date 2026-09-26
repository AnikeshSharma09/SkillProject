import { WorkflowDefinition, WorkflowNode, WorkflowEdge } from "@/types";

export function generateWorkflowFromPrompt(prompt: string): WorkflowDefinition {
  const p = prompt.toLowerCase();
  const wfId = `wf-ai-${Date.now()}`;

  // Analyze prompt characteristics
  const isInvoice = p.includes("invoice") || p.includes("bill") || p.includes("amount") || p.includes("50,000") || p.includes("50k");
  const isLeave = p.includes("leave") || p.includes("vacation") || p.includes("employee") || p.includes("pto");
  const isPO = p.includes("po") || p.includes("purchase") || p.includes("order");
  const isMedical = p.includes("hospital") || p.includes("medical") || p.includes("claim") || p.includes("patient");

  const nodes: WorkflowNode[] = [];
  const edges: WorkflowEdge[] = [];

  if (isInvoice) {
    // 1. Start
    nodes.push({
      id: "node-1",
      type: "START",
      label: "Start Trigger",
      description: "Listens for uploaded documents",
      position: { x: 60, y: 160 },
      config: { trigger: "DOCUMENT_UPLOAD" },
    });
    // 2. Upload
    nodes.push({
      id: "node-2",
      type: "DOCUMENT_UPLOAD",
      label: "Invoice Ingestion",
      description: "Accepts PDF, JPG, PNG",
      position: { x: 260, y: 160 },
      config: { acceptedMimes: ["application/pdf", "image/png"] },
    });
    // 3. Classify
    nodes.push({
      id: "node-3",
      type: "CLASSIFICATION",
      label: "Classify Document",
      description: "Confirms invoice category",
      position: { x: 460, y: 160 },
      config: { targetType: "Invoice" },
    });
    // 4. Extract
    nodes.push({
      id: "node-4",
      type: "AI_EXTRACTION",
      label: "Extract Line Items & Total",
      description: "Zod Schema: InvoiceSchema",
      position: { x: 660, y: 160 },
      config: { schema: "InvoiceSchema", minConfidence: 0.7 },
    });
    // 5. Condition (> ₹50k)
    nodes.push({
      id: "node-5",
      type: "CONDITION",
      label: "Amount > ₹50,000?",
      description: "Deterministic comparison",
      position: { x: 880, y: 160 },
      config: { field: "total", operator: ">", value: 50000 },
    });
    // 6. Approval
    nodes.push({
      id: "node-6",
      type: "APPROVAL",
      label: "Manager Sign-off Gate",
      description: "Routes to department lead",
      position: { x: 1100, y: 70 },
      config: { requiredRole: "MANAGER", timeoutHours: 48 },
    });
    // 7. Finance API
    nodes.push({
      id: "node-7",
      type: "API_CALL",
      label: "Finance ERP Reconcile",
      description: "REST POST /invoices/post",
      position: { x: 1320, y: 70 },
      config: { endpoint: "https://api.erp.internal/invoices", method: "POST" },
    });
    // 8. Archive
    nodes.push({
      id: "node-8",
      type: "ARCHIVE",
      label: "Encrypted Archive",
      description: "7-year statutory retention",
      position: { x: 1540, y: 160 },
      config: { retentionYears: 7 },
    });
    // 9. End
    nodes.push({
      id: "node-9",
      type: "END",
      label: "Complete & Log",
      description: "Audit trail finalized",
      position: { x: 1740, y: 160 },
      config: {},
    });

    edges.push(
      { id: "e1-2", source: "node-1", target: "node-2" },
      { id: "e2-3", source: "node-2", target: "node-3" },
      { id: "e3-4", source: "node-3", target: "node-4" },
      { id: "e4-5", source: "node-4", target: "node-5" },
      { id: "e5-6", source: "node-5", target: "node-6", label: "Yes (> 50k)" },
      { id: "e5-8", source: "node-5", target: "node-8", label: "No (<= 50k Auto)" },
      { id: "e6-7", source: "node-6", target: "node-7", label: "Approved" },
      { id: "e7-8", source: "node-7", target: "node-8" },
      { id: "e8-9", source: "node-8", target: "node-9" }
    );
  } else if (isLeave) {
    // Leave Application Workflow
    nodes.push(
      { id: "n-1", type: "START", label: "Leave Submitted", position: { x: 60, y: 140 }, config: {} },
      { id: "n-2", type: "AI_EXTRACTION", label: "Parse Leave Dates", position: { x: 260, y: 140 }, config: {} },
      { id: "n-3", type: "CONDITION", label: "Duration > 3 Days?", position: { x: 460, y: 140 }, config: { field: "days", operator: ">", value: 3 } },
      { id: "n-4", type: "APPROVAL", label: "Manager Approval", position: { x: 680, y: 70 }, config: { role: "MANAGER" } },
      { id: "n-5", type: "NOTIFICATION", label: "HR Calendar Sync", position: { x: 900, y: 140 }, config: {} },
      { id: "n-6", type: "END", label: "Leave Registered", position: { x: 1100, y: 140 }, config: {} }
    );

    edges.push(
      { id: "e-1", source: "n-1", target: "n-2" },
      { id: "e-2", source: "n-2", target: "n-3" },
      { id: "e-3", source: "n-3", target: "n-4", label: "Yes" },
      { id: "e-4", source: "n-3", target: "n-5", label: "No (Auto)" },
      { id: "e-5", source: "n-4", target: "n-5", label: "Approved" },
      { id: "e-6", source: "n-5", target: "n-6" }
    );
  } else {
    // Standard Multi-Step Operational Workflow
    nodes.push(
      { id: "n-1", type: "START", label: "Document Ingested", position: { x: 60, y: 140 }, config: {} },
      { id: "n-2", type: "OCR", label: "High-Res OCR Parser", position: { x: 260, y: 140 }, config: {} },
      { id: "n-3", type: "AI_EXTRACTION", label: "Entity Extraction", position: { x: 460, y: 140 }, config: {} },
      { id: "n-4", type: "APPROVAL", label: "Authorized Signoff", position: { x: 680, y: 140 }, config: { role: "APPROVER" } },
      { id: "n-5", type: "API_CALL", label: "Webhook Dispatch", position: { x: 900, y: 140 }, config: {} },
      { id: "n-6", type: "END", label: "Archived & Logged", position: { x: 1100, y: 140 }, config: {} }
    );

    edges.push(
      { id: "e-1", source: "n-1", target: "n-2" },
      { id: "e-2", source: "n-2", target: "n-3" },
      { id: "e-3", source: "n-3", target: "n-4" },
      { id: "e-4", source: "n-4", target: "n-5", label: "Signed" },
      { id: "e-5", source: "n-5", target: "n-6" }
    );
  }

  return {
    id: wfId,
    organizationId: "org-symbiosis-01",
    name: `AI: ${prompt.substring(0, 48)}...`,
    description: `Synthesized from prompt: "${prompt}"`,
    category: isInvoice ? "Finance" : isLeave ? "Human Resources" : "Operations",
    isActive: true,
    version: 1,
    nodes,
    edges,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    runsCount: 0,
    successRate: 100,
  };
}
