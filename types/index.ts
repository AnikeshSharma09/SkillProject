export type UserRole = 'ADMIN' | 'MANAGER' | 'APPROVER' | 'EMPLOYEE' | 'VIEWER';

export interface Organization {
  id: string;
  name: string;
  slug: string;
  industry: string;
  confidenceThreshold: number; // e.g., 0.70
  autoApprovalThreshold: number; // e.g., 0.90
  createdAt: string;
}

export interface UserProfile {
  id: string;
  organizationId: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  organizationName?: string;
}

export type DocumentStatus =
  | 'UPLOADED'
  | 'PROCESSING'
  | 'CLASSIFIED'
  | 'EXTRACTING'
  | 'REVIEW_REQUIRED'
  | 'READY'
  | 'WORKFLOW_RUNNING'
  | 'COMPLETED'
  | 'REJECTED'
  | 'ARCHIVED'
  | 'FAILED';

export type DocumentCategory =
  | 'Invoice'
  | 'Receipt'
  | 'Resume'
  | 'Purchase Order'
  | 'Leave Application'
  | 'Contract'
  | 'Report'
  | 'Medical Form'
  | 'Insurance Document'
  | 'Delivery Note'
  | 'Expense Claim'
  | 'Certificate'
  | 'Other';

export interface BoundingBox {
  page: number;
  x: number; // normalized 0-1
  y: number; // normalized 0-1
  w: number; // normalized 0-1
  h: number; // normalized 0-1
}

export interface FieldCorrectionHistory {
  previousValue: string;
  newValue: string;
  correctedBy: string;
  timestamp: string;
  comment?: string;
}

export interface ExtractedField {
  id: string;
  documentId: string;
  fieldName: string;
  fieldLabel: string;
  extractedValue: string;
  dataType: 'string' | 'number' | 'date' | 'currency' | 'boolean' | 'array';
  confidence: number; // 0.0 to 1.0
  sourceBbox?: BoundingBox;
  isCorrected?: boolean;
  correctedValue?: string;
  correctionHistory?: FieldCorrectionHistory[];
  validationStatus?: 'VALID' | 'WARNING' | 'ERROR' | string;
}

export interface DocumentItem {
  id: string;
  organizationId: string;
  name: string;
  filePath: string;
  fileSizeBytes: number;
  mimeType: string;
  fileHash: string;
  status: DocumentStatus;
  documentType: DocumentCategory;
  classificationConfidence: number;
  overallConfidence: number;
  rawOcrText?: string;
  pageCount: number;
  extractedFields?: ExtractedField[];
  previewUrl?: string;
  isArchived: boolean;
  uploadedAt: string;
  updatedAt: string;
  createdBy: {
    id: string;
    fullName: string;
    email: string;
  };
}

export type ApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'EXPIRED';

export interface ApprovalTask {
  id: string;
  organizationId: string;
  documentId: string;
  documentName: string;
  documentType: DocumentCategory;
  workflowRunId?: string;
  title: string;
  description: string;
  requiredRole: UserRole;
  assignedTo?: string;
  status: ApprovalStatus;
  amount?: number;
  currency?: string;
  vendorOrRequester?: string;
  confidence: number;
  createdAt: string;
  decidedAt?: string;
  decidedBy?: string;
  decisionComment?: string;
  expiresAt?: string;
}

export type WorkflowNodeType =
  | 'START'
  | 'DOCUMENT_UPLOAD'
  | 'OCR'
  | 'AI_EXTRACTION'
  | 'CLASSIFICATION'
  | 'CONDITION'
  | 'APPROVAL'
  | 'NOTIFICATION'
  | 'EMAIL'
  | 'API_CALL'
  | 'DATABASE_ACTION'
  | 'HUMAN_REVIEW'
  | 'ARCHIVE'
  | 'END';

export interface WorkflowNode {
  id: string;
  type: WorkflowNodeType;
  label: string;
  description?: string;
  position: { x: number; y: number };
  config: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  label?: string; // e.g. "Yes", "No", "> ₹50k"
  animated?: boolean;
}

export interface WorkflowDefinition {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  category: string;
  isActive: boolean;
  version: number;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  createdAt: string;
  updatedAt: string;
  runsCount?: number;
  successRate?: number;
}

export interface WorkflowRun {
  id: string;
  workflowId: string;
  workflowName: string;
  documentId?: string;
  documentName?: string;
  status: 'RUNNING' | 'COMPLETED' | 'FAILED' | 'WAITING_APPROVAL';
  startedAt: string;
  completedAt?: string;
  currentStep?: string;
  logs: Array<{
    timestamp: string;
    step: string;
    message: string;
    status: 'info' | 'success' | 'warning' | 'error';
  }>;
}

export interface RuleDefinition {
  id: string;
  name: string;
  description: string;
  targetDocumentType: DocumentCategory;
  condition: {
    field: string;
    operator: '>' | '<' | '>=' | '<=' | '==' | '!=' | 'contains' | 'in';
    value: string | number | boolean;
  };
  action: {
    type: 'REQUIRE_APPROVAL' | 'SEND_NOTIFICATION' | 'CALL_API' | 'ROUTE_HUMAN_REVIEW';
    targetRole?: UserRole;
    endpoint?: string;
    message?: string;
  };
  isActive: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'approval' | 'system' | 'review' | 'workflow' | 'error';
  isRead: boolean;
  documentId?: string;
  actionUrl?: string;
  createdAt: string;
}

export interface AuditLogItem {
  id: string;
  organizationId: string;
  timestamp: string;
  actor: {
    name: string;
    email: string;
    role: UserRole;
  };
  documentId?: string;
  documentName?: string;
  action: string;
  entityType: 'DOCUMENT' | 'WORKFLOW' | 'APPROVAL' | 'RULE' | 'USER' | 'INTEGRATION' | 'SYSTEM';
  detail: string;
  diff?: {
    oldValue?: unknown;
    newValue?: unknown;
  };
}

export interface RagSource {
  documentId: string;
  documentName: string;
  documentType: DocumentCategory;
  page: number;
  excerpt: string;
  confidence: number;
  boundingBox?: BoundingBox;
}

export interface RagResponse {
  answer: string;
  sources: RagSource[];
  latencyMs: number;
  tokensUsed: number;
}

export interface AIRequestTelemetry {
  id: string;
  timestamp: string;
  model: string;
  operation: 'classification' | 'extraction' | 'rag_query' | 'workflow_generation';
  tokens: { prompt: number; completion: number; total: number };
  latencyMs: number;
  costUsd: number;
  status: 'success' | 'failure';
}

export interface AIEvaluationItem {
  id: string;
  datasetName: string;
  documentType: DocumentCategory;
  fieldCount: number;
  precision: number;
  recall: number;
  f1Score: number;
  latencyMs: number;
  humanCorrectionRate: number;
  evaluatedAt: string;
  sampleDiff: Array<{
    field: string;
    expected: string;
    actual: string;
    match: boolean;
  }>;
}

export interface IntegrationCard {
  id: string;
  name: string;
  description: string;
  category: 'Communication' | 'Storage' | 'Productivity' | 'API';
  icon: string;
  status: 'connected' | 'disconnected' | 'configuring';
  config: Record<string, string>;
  lastSyncedAt?: string;
}
