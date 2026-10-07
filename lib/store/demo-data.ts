import {
  DocumentItem,
  ApprovalTask,
  WorkflowDefinition,
  AuditLogItem,
  UserProfile,
  Organization,
  AIEvaluationItem,
  AIRequestTelemetry,
  IntegrationCard,
  RuleDefinition,
} from "@/types";

export const DEMO_ORGANIZATION: Organization = {
  id: "org-symbiosis-01",
  name: "Symbiosis University",
  slug: "symbiosis-university",
  industry: "Educational Institution",
  confidenceThreshold: 0.70,
  autoApprovalThreshold: 0.90,
  createdAt: "2026-01-15T08:00:00Z",
};

export const DEMO_USERS: UserProfile[] = [
  {
    id: "usr-anikesh-01",
    organizationId: "org-symbiosis-01",
    email: "anikesh.sharma@symbiosis.edu",
    fullName: "Anikesh Sharma",
    role: "ADMIN",
    organizationName: "Symbiosis University",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-admin-01",
    organizationId: "org-symbiosis-01",
    email: "sarah.chen@symbiosis.edu",
    fullName: "Sarah Chen",
    role: "ADMIN",
    organizationName: "Symbiosis University",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-manager-02",
    organizationId: "org-symbiosis-01",
    email: "vikram.patel@symbiosis.edu",
    fullName: "Vikram Patel",
    role: "MANAGER",
    organizationName: "Symbiosis University",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-approver-03",
    organizationId: "org-symbiosis-01",
    email: "elena.rostova@symbiosis.edu",
    fullName: "Elena Rostova",
    role: "APPROVER",
    organizationName: "Symbiosis University",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
  },
  {
    id: "usr-emp-04",
    organizationId: "org-symbiosis-01",
    email: "rahul.sharma@symbiosis.edu",
    fullName: "Rahul Sharma",
    role: "EMPLOYEE",
    organizationName: "Symbiosis University",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
  },
];

export const INITIAL_DOCUMENTS: DocumentItem[] = [];

export const INITIAL_APPROVALS: ApprovalTask[] = [];

export const INITIAL_WORKFLOWS: WorkflowDefinition[] = [];

export const INITIAL_AUDIT_LOGS: AuditLogItem[] = [];

export const INITIAL_RULES: RuleDefinition[] = [
  {
    id: "rule-inv-50k",
    name: "Invoice High-Value Gate (> ₹50,000)",
    description: "All invoices above ₹50,000 strictly require manager signoff before accounting dispatch.",
    targetDocumentType: "Invoice",
    condition: { field: "total", operator: ">", value: 50000 },
    action: { type: "REQUIRE_APPROVAL", targetRole: "MANAGER" },
    isActive: true,
  },
  {
    id: "rule-inv-1lakh",
    name: "Director Gate (> ₹1,00,000)",
    description: "Invoices exceeding ₹1 Lakh require executive administrative approval.",
    targetDocumentType: "Invoice",
    condition: { field: "total", operator: ">", value: 100000 },
    action: { type: "REQUIRE_APPROVAL", targetRole: "ADMIN" },
    isActive: true,
  },
  {
    id: "rule-conf-70",
    name: "Extraction Confidence Floor (< 70%)",
    description: "Any document with field extraction certainty below 70% is quarantined to human review.",
    targetDocumentType: "Other",
    condition: { field: "overallConfidence", operator: "<", value: 0.70 },
    action: { type: "ROUTE_HUMAN_REVIEW" },
    isActive: true,
  },
];

export const INITIAL_INTEGRATIONS: IntegrationCard[] = [
  {
    id: "int-email",
    name: "Outbound Email (SMTP / Resend)",
    description: "Dispatches automated notification emails for approvals, workflow completions, and audit reports.",
    category: "Communication",
    icon: "Mail",
    status: "connected",
    config: { host: "smtp.mailtrap.io", port: "587", sender: "notifications@ai-flow.io" },
    lastSyncedAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: "int-rest",
    name: "Outgoing Webhook & REST API",
    description: "Direct POST integration for Enterprise ERP, SAP, Oracle, and internal microservices.",
    category: "API",
    icon: "Webhook",
    status: "connected",
    config: { endpoint: "https://api.internal.enterprise/v1/invoices", method: "POST", authHeader: "Bearer eyJhbGci..." },
    lastSyncedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
  },
  {
    id: "int-slack",
    name: "Slack Workflow Notifications",
    description: "Sends interactive Slack channel messages with one-click approval buttons.",
    category: "Communication",
    icon: "MessageSquare",
    status: "connected",
    config: { channel: "#finance-approvals", botName: "AI-FLOW Bot" },
    lastSyncedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
  },
  {
    id: "int-gdrive",
    name: "Google Drive Enterprise Sync",
    description: "Automatically pulls scanned documents from watched folders and saves archives.",
    category: "Storage",
    icon: "FolderSync",
    status: "disconnected",
    config: {},
  },
];

export const INITIAL_AI_EVALUATIONS: AIEvaluationItem[] = [];

export const INITIAL_AI_TELEMETRY: AIRequestTelemetry[] = [];
