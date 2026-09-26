# AI-FLOW: AI-Powered Intelligent Document & Workflow Platform
> **"Smart Documents. Smart Workflows. Smarter Decisions."**

AI-FLOW is a production-quality SaaS platform that bridges the gap between unstructured documents, probabilistic AI reasoning, and deterministic business workflow automation.

---

## 1. Product Vision & Architecture Principle

AI-FLOW converts unstructured incoming enterprise files into structured, audited, and automated operational actions:

```
UNSTRUCTURED DOCUMENTS (PDF, DOCX, XLSX, Images)
        ↓
OCR / DOCUMENT PARSING
        ↓
AI DOCUMENT CLASSIFICATION
        ↓
STRUCTURED DATA EXTRACTION
        ↓
CONFIDENCE SCORING ENGINE (<70% Flagged | 70-89% Monitored | >=90% Auto)
        ↓
HUMAN-IN-THE-LOOP REVIEW QUEUE (When required)
        ↓
DETERMINISTIC RULE ENGINE
        ↓
VISUAL WORKFLOW ENGINE (DAG Orchestrator)
        ↓
APPROVAL GATES & AUTOMATED ACTIONS
        ↓
REALTIME NOTIFICATIONS
        ↓
IMMUTABLE AUDIT LOG
        ↓
SECURE ARCHIVE & SEMANTIC SEARCH (pgvector RAG)
```

### The Cardinal Principle: AI Reasoning vs. Deterministic Business Execution
AI is powerful for **probabilistic tasks**—classification, extraction, summarization, retrieval, and generating workflow drafts. However, **business-critical actions must always be executed by deterministic code**:
- **AI Model**: Extracts invoice total as `₹72,500` with `98.4%` confidence.
- **Rule Engine**: Evaluates `IF amount > ₹50,000 THEN manager_approval` deterministically.
- **Workflow Engine**: Spawns manager authorization task with RBAC verification.
- **Security Guarantee**: LLMs are never permitted to execute arbitrary system code or bypass configured thresholds.

---

## 2. Key Features

- **Document Ingestion Hub (`/documents`)**:
  - Drag-and-drop uploader supporting PDF, DOCX, XLSX, CSV, PNG, JPG, and TXT (up to 25MB).
  - Real-time animated extraction pipeline progress (`Upload` → `OCR` → `Classification` → `Extraction` → `Scoring` → `Rule Trigger`).
  - Search, sort, multi-status filters, and table/grid view toggles.

- **Document Intelligence Split-Screen View (`/documents/[id]`)**:
  - Interactive visual canvas with zoom and pan.
  - Hovering or clicking an extracted field dynamically highlights its source bounding box on the document sheet.
  - Tabs for Extracted Fields (with in-place human correction), Raw OCR text, and JSON schema payload.

- **Human-in-the-Loop Review Queue (`/review`)**:
  - Automatically isolates documents with extraction confidence `< 70%`.
  - In-place field editor with history logging; human verification automatically upgrades confidence to 100%.

- **Deterministic Rule Engine & Approval Hub (`/approvals`)**:
  - Role-Based Access Control (Admin, Manager, Approver, Employee, Viewer).
  - Pending, Approved, Rejected, and Expired categories.
  - Audit rationale comment capture and visual celebration confetti.

- **RAG Document Assistant (`/assistant`)**:
  - Semantic retrieval across unstructured documents using chunked embeddings and cosine similarity.
  - Enterprise query answering with expandable ground-truth source chips, confidence ratings, and page citations.
  - Zero hallucination guarantee.

- **AI Workflow Generator & Visual Studio (`/workflows`, `/workflows/builder`)**:
  - **Natural Language Generator**: Translates prompts (e.g. *"Invoices above ₹50,000 need manager signoff, then sync to ERP"*) into validated DAG graphs.
  - **Visual Studio**: Interactive canvas supporting 14 node types (`START`, `DOCUMENT_UPLOAD`, `OCR`, `AI_EXTRACTION`, `CLASSIFICATION`, `CONDITION`, `APPROVAL`, `NOTIFICATION`, `EMAIL`, `API_CALL`, `DATABASE_ACTION`, `HUMAN_REVIEW`, `ARCHIVE`, `END`) with SVG bezier connectors, animated flow, zoom/fit controls, test simulation, and configuration panel.

- **Enterprise Analytics & AI Observability (`/analytics`, `/analytics/ai`)**:
  - Interactive Recharts timeseries for throughput, automation percentage, taxonomy distribution, and stage latencies.
  - Ground-truth evaluation benchmarks comparing Expected vs AI Output with precision, recall, and F1 scoring.
  - Observability telemetry tracking request count, latency, failure rate, and token expenditure.

- **Immutable Audit Trail (`/audit-logs`)**:
  - Chronological timeline tracking every upload, OCR extraction, rule evaluation, approval decision, and archival event with state diffs.

---

## 3. Technology Stack

- **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Lucide React, Recharts, Canvas Confetti.
- **Design System**: Linear/Vercel-inspired calm enterprise UI with dark mode tokens (`#0B1120`), 260px sidebar, and ⌘K Command Palette.
- **Backend**: Next.js API Routes / Server Actions, Zod schema validation.
- **Persistence & Vector DB**: PostgreSQL, Supabase, pgvector (HNSW cosine similarity), Supabase Storage.
- **Testing**: Vitest unit and integration test suite.

---

## 4. Getting Started Locally

### 4.1 Prerequisites
- Node.js 18+ (Node 20+ or 22 LTS recommended)
- npm or pnpm

### 4.2 Installation
```bash
# Clone the repository
git clone https://github.com/organization/ai-flow.git
cd ai-flow

# Install dependencies
npm install

# Setup environment configuration
cp .env.example .env.local
```

### 4.3 Running the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

### 4.4 Running Automated Tests
```bash
npm test
```
All unit and integration tests run via Vitest:
```
✓ tests/rule-evaluator.test.ts (2 tests)
✓ tests/workflow-generator.test.ts (1 test)
✓ tests/document-processor.test.ts (2 tests)
✓ tests/rbac-security.test.ts (2 tests)
✓ tests/rag-search.test.ts (2 tests)
Test Files  5 passed (5)
Tests       9 passed (9)
```

### 4.5 Production Build
```bash
npm run build
npm run start
```

---

## 5. Primary Demo Workflows

### Demo 1: End-to-End Invoice Automation
1. Navigate to `/documents` and click **Upload Document**.
2. Select or click sample `Invoice_INV1024.pdf` (Total: ₹72,500).
3. Watch the animated multi-stage AI pipeline:
   - OCR text extraction → Classification as `Invoice` (98.5% confidence) → Field extraction.
   - Deterministic rule evaluates: `IF total > ₹50,000 THEN manager_approval`.
   - Spawns a Manager Approval task.
4. Navigate to `/approvals` and inspect `Invoice INV-1024`.
5. Enter verification note and click **Approve** (triggers celebration).
6. Inspect the `/audit-logs` timeline to see the complete immutable audit trail.

### Demo 2: RAG Document Assistant
1. Navigate to `/assistant`.
2. Click the suggested chip: *"Which invoices exceed ₹50,000?"*
3. The engine performs cosine similarity retrieval over pgvector embeddings and synthesizes a structured breakdown with inline document citations and confidence chips.

### Demo 3: Natural Language AI Workflow Generator
1. Navigate to `/workflows`.
2. In the AI Workflow Generator banner, input:
   *"Whenever an invoice above ₹50,000 is uploaded, send it to the department manager for approval. If approved, send it to finance and archive it."*
3. Click **Generate DAG**.
4. The system synthesizes the full node graph with condition gates and connectors.
5. Click **Open in Full Studio Editor** to visually inspect, test-run, or modify nodes.

---

## 6. Project Documentation Index

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) - Subsystems, data flow, and architectural principles.
- [`DATABASE.md`](./DATABASE.md) - Full PostgreSQL schema, pgvector setup, and Row Level Security (RLS) policies.
- [`API.md`](./API.md) - REST API specification for all 13 backend endpoints.
- [`AI_PIPELINE.md`](./AI_PIPELINE.md) - Document parsing, OCR, confidence algorithms, and prompt injection defense.
- [`SECURITY.md`](./SECURITY.md) - Multi-tenant isolation, RBAC matrix, and compliance standards.
- [`DEPLOYMENT.md`](./DEPLOYMENT.md) - Vercel and Supabase production deployment guide.
