# AI-FLOW: System Architecture Document

## 1. High-Level Architecture

AI-FLOW is built as a cloud-native, multi-tenant AI document intelligence and automated execution SaaS platform.

```
┌────────────────────────────────────────────────────────────────────────┐
│                              FRONTEND                                  │
│  Next.js 15 (App Router) • React 19 • Tailwind CSS • Lucide • Recharts │
│  - Command Palette (Ctrl+K)       - Document Split-Screen Intelligence │
│  - Visual Node Workflow Canvas    - RAG Document Assistant             │
│  - Multi-File Queue Uploader      - Realtime Notifications & Approvals │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        API & ORCHESTRATION LAYER                       │
│  Next.js Server Actions & API Routes                                   │
│  - Authentication & RBAC Guards (Admin, Manager, Approver, Employee)   │
│  - Ingestion & Validation Gateway (MIME, Hash, Virus/Prompt Sanitizer) │
│  - Asynchronous Document Pipeline Manager                              │
│  - Deterministic Rule Engine (Condition evaluation & decision trees)   │
│  - Visual DAG Workflow Runner (Deterministic step execution)           │
│  - RAG Semantic Query Synthesizer (Embeddings + Pgvector + Citations)  │
└───────────────────┬───────────────────────────────┬────────────────────┘
                    │                               │
                    ▼                               ▼
┌─────────────────────────────────────┐   ┌──────────────────────────────┐
│        AI & PARSING PIPELINE        │   │       PERSISTENCE LAYER      │
│ - Tesseract/PaddleOCR Text Parser   │   │ - PostgreSQL (Supabase)      │
│ - PDF, DOCX, XLSX, Image Parsers    │   │ - Row Level Security (RLS)   │
│ - AI Document Classifier            │   │ - pgvector (1536 dim HNSW)   │
│ - Schema-Aware Field Extractor      │   │ - Supabase Storage Buckets   │
│ - Field Confidence Scoring Engine   │   │ - Immutable Audit Trail      │
│ - Chunking & Vector Embeddings      │   │ - AI Request Observability   │
└─────────────────────────────────────┘   └──────────────────────────────┘
```

---

## 2. Component Subsystems

### 2.1 Ingestion & Parsing Subsystem
- **Supported Formats**: PDF (vector and scanned), PNG, JPG, WEBP, DOCX, XLSX, CSV, TXT.
- **Security Check**: MIME validation, file signature verification, SHA-256 deduplication, maximum 25MB file size constraint.
- **Pipeline Stages**:
  1. Upload -> Raw Storage.
  2. Text & Metadata Extraction: Direct text extraction for native digital documents, high-fidelity OCR for scans and images.
  3. Chunking & Vectorization: Recursive character splitting (500-token chunks with 50-token overlap) stored in `document_chunks` with `vector` embeddings.

### 2.2 AI Reasoning Engine
- **Document Classification**: Evaluates initial document pages against multi-class taxonomy (Invoices, Receipts, Resumes, Purchase Orders, Leave Requests, Medical Forms, Delivery Notes, Contracts, etc.) with classification confidence score.
- **Structured Field Extraction**: Extracts domain-specific JSON schemas based on classified type.
- **Confidence Scoring**: Each extracted field receives an individual confidence metric $[0.0, 1.0]$. The overall document confidence is a weighted composite score.
  - $\ge 90\%$: Automatic approval eligibility.
  - $70\% - 89\%$: Warning badge / soft review based on tenant configuration.
  - $< 70\%$: Human-in-the-Loop review queue.

### 2.3 Deterministic Rule Engine
- Evaluates logical expressions against extracted document data.
- **Grammar**: Supports numerical comparisons (`>`, `<`, `>=`, `<=`, `==`), string matching (`contains`, `startsWith`, `in`), and array checks.
- **Zero-LLM Execution**: The rule engine strictly relies on deterministic code execution. LLMs cannot modify rule outcomes or trigger unauthorized external actions.

### 2.4 Workflow Engine (DAG Orchestrator)
- Directed Acyclic Graph (DAG) state machine.
- **Node Types**:
  - `START`: Triggered on document upload or manual event.
  - `DOCUMENT_UPLOAD`: Source ingestion.
  - `OCR`: Optical character recognition.
  - `CLASSIFICATION`: Categorize document type.
  - `AI_EXTRACTION`: Structured JSON generation.
  - `CONDITION`: Deterministic branch evaluation.
  - `APPROVAL`: Human sign-off required (with role-based access).
  - `NOTIFICATION`: User in-app / push alert.
  - `EMAIL`: Automated outbound email via SMTP/Resend.
  - `API_CALL`: Outbound REST/Webhook payload dispatch.
  - `HUMAN_REVIEW`: Low confidence correction queue.
  - `ARCHIVE`: Secure cold-storage retention.
  - `END`: Terminal status.

### 2.5 RAG Document Assistant
- **Retrieval**: Cosine similarity query on `document_chunks` table utilizing pgvector index.
- **Context Assembly**: Top-$k$ chunks injected with strict system instructions prohibiting hallucination.
- **Citations**: Inlines exact source document IDs, pages, and excerpt snippets.
- **Anti-Prompt-Injection**: Untrusted document text is sanitized and quarantined in delimited XML tags within prompt templates.

---

## 3. Security & Multi-Tenancy Architecture
1. **Tenant Isolation**: Every database query filters by `organization_id`. Enforced by Supabase Row Level Security (RLS) policies.
2. **RBAC**:
   - `ADMIN`: Full tenant configuration, user management, billing, workflow creation, system logs.
   - `MANAGER`: Workflow activation, approval routing, team analytics.
   - `APPROVER`: Reviewing and deciding pending approval tasks.
   - `EMPLOYEE`: Submitting documents, tracking own submissions.
   - `VIEWER`: Read-only access to approved documents and public dashboards.
3. **Audit Immutability**: All approvals, corrections, rule evaluations, and workflow steps write to `audit_logs` with timestamps, actor IDs, IP addresses, and before/after payloads.
