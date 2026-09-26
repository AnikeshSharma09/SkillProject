# AI-FLOW: Database Schema & Migration Specification

AI-FLOW utilizes **PostgreSQL** with the **pgvector** extension on **Supabase**, featuring full multi-tenancy enforced through **Row Level Security (RLS)**.

---

## 1. Schema Overview & Extension Setup

```sql
-- Enable necessary PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "vector";

-- Enum Definitions
CREATE TYPE user_role AS ENUM ('ADMIN', 'MANAGER', 'APPROVER', 'EMPLOYEE', 'VIEWER');
CREATE TYPE document_status AS ENUM (
    'UPLOADED',
    'PROCESSING',
    'CLASSIFIED',
    'EXTRACTING',
    'REVIEW_REQUIRED',
    'READY',
    'WORKFLOW_RUNNING',
    'COMPLETED',
    'REJECTED',
    'ARCHIVED',
    'FAILED'
);
CREATE TYPE document_category AS ENUM (
    'Invoice',
    'Receipt',
    'Resume',
    'Purchase Order',
    'Leave Application',
    'Contract',
    'Report',
    'Medical Form',
    'Insurance Document',
    'Delivery Note',
    'Expense Claim',
    'Certificate',
    'Other'
);
CREATE TYPE approval_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'EXPIRED');
CREATE TYPE node_type AS ENUM (
    'START',
    'DOCUMENT_UPLOAD',
    'OCR',
    'AI_EXTRACTION',
    'CLASSIFICATION',
    'CONDITION',
    'APPROVAL',
    'NOTIFICATION',
    'EMAIL',
    'API_CALL',
    'DATABASE_ACTION',
    'HUMAN_REVIEW',
    'ARCHIVE',
    'END'
);
```

---

## 2. Core Entities

### 2.1 Organizations (Tenants)
```sql
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    industry VARCHAR(100) DEFAULT 'General',
    confidence_threshold NUMERIC(4, 2) DEFAULT 0.70,
    auto_approval_threshold NUMERIC(4, 2) DEFAULT 0.90,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.2 Profiles (Users)
```sql
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role user_role DEFAULT 'EMPLOYEE',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.3 Documents
```sql
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    created_by UUID REFERENCES profiles(id),
    name VARCHAR(255) NOT NULL,
    file_path TEXT NOT NULL,
    file_size_bytes BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_hash VARCHAR(64) NOT NULL,
    status document_status DEFAULT 'UPLOADED',
    document_type document_category DEFAULT 'Other',
    classification_confidence NUMERIC(5, 4),
    overall_confidence NUMERIC(5, 4),
    raw_ocr_text TEXT,
    page_count INT DEFAULT 1,
    metadata JSONB DEFAULT '{}'::jsonb,
    is_archived BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_documents_org_status ON documents(organization_id, status);
CREATE INDEX idx_documents_type ON documents(organization_id, document_type);
```

### 2.4 Document Extracted Fields
```sql
CREATE TABLE document_fields (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    field_name VARCHAR(100) NOT NULL,
    field_label VARCHAR(150),
    extracted_value TEXT,
    data_type VARCHAR(50) DEFAULT 'string',
    confidence NUMERIC(5, 4) NOT NULL,
    source_bbox JSONB, -- { "page": 1, "x": 0.1, "y": 0.2, "w": 0.3, "h": 0.05 }
    is_corrected BOOLEAN DEFAULT FALSE,
    corrected_value TEXT,
    corrected_by UUID REFERENCES profiles(id),
    correction_history JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_doc_fields_doc_id ON document_fields(document_id);
```

### 2.5 Document Chunks & Embeddings (RAG)
```sql
CREATE TABLE document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    chunk_index INT NOT NULL,
    chunk_text TEXT NOT NULL,
    token_count INT NOT NULL,
    page_number INT DEFAULT 1,
    embedding vector(1536), -- Compatible with text-embedding-3 or Gemini embeddings
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_chunks_org ON document_chunks(organization_id);
CREATE INDEX idx_chunks_embedding ON document_chunks USING hnsw (embedding vector_cosine_ops);
```

### 2.6 Workflows & Graph Definitions
```sql
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) DEFAULT 'General',
    is_active BOOLEAN DEFAULT TRUE,
    version INT DEFAULT 1,
    created_by UUID REFERENCES profiles(id),
    canvas_state JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workflow_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    node_id VARCHAR(100) NOT NULL,
    type node_type NOT NULL,
    label VARCHAR(255) NOT NULL,
    config JSONB DEFAULT '{}'::jsonb,
    position_x NUMERIC NOT NULL DEFAULT 0,
    position_y NUMERIC NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE workflow_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    source_node_id VARCHAR(100) NOT NULL,
    target_node_id VARCHAR(100) NOT NULL,
    condition_label VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.7 Workflow Runs & Step Tasks
```sql
CREATE TABLE workflow_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    status VARCHAR(50) DEFAULT 'RUNNING',
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    execution_context JSONB DEFAULT '{}'::jsonb,
    error_message TEXT
);

CREATE TABLE workflow_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_run_id UUID NOT NULL REFERENCES workflow_runs(id) ON DELETE CASCADE,
    node_id VARCHAR(100) NOT NULL,
    task_type node_type NOT NULL,
    status VARCHAR(50) DEFAULT 'PENDING',
    input_payload JSONB DEFAULT '{}'::jsonb,
    output_payload JSONB DEFAULT '{}'::jsonb,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);
```

### 2.8 Approvals
```sql
CREATE TABLE approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
    workflow_run_id UUID REFERENCES workflow_runs(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    required_role user_role DEFAULT 'MANAGER',
    assigned_to UUID REFERENCES profiles(id),
    status approval_status DEFAULT 'PENDING',
    decided_by UUID REFERENCES profiles(id),
    decided_at TIMESTAMPTZ,
    decision_comment TEXT,
    amount NUMERIC(14, 2),
    currency VARCHAR(10) DEFAULT 'INR',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ
);

CREATE INDEX idx_approvals_org_status ON approvals(organization_id, status);
```

### 2.9 Deterministic Rules
```sql
CREATE TABLE rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    target_document_type document_category NOT NULL,
    condition_expression JSONB NOT NULL, 
    -- e.g. {"field": "total", "operator": ">", "value": 50000}
    action_type VARCHAR(100) NOT NULL,
    -- e.g. "REQUIRE_APPROVAL", "NOTIFY_FINANCE", "ROUTING_TAG"
    action_config JSONB DEFAULT '{}'::jsonb,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### 2.10 Audit Logs (Immutable Append-Only)
```sql
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    workflow_id UUID REFERENCES workflows(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    old_value JSONB,
    new_value JSONB,
    metadata JSONB DEFAULT '{}'::jsonb,
    ip_address VARCHAR(50),
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_org_time ON audit_logs(organization_id, created_at DESC);
```

### 2.11 AI Observability & Evaluations
```sql
CREATE TABLE ai_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    document_id UUID REFERENCES documents(id) ON DELETE SET NULL,
    model_name VARCHAR(100) NOT NULL,
    operation_type VARCHAR(100) NOT NULL, -- "classification", "extraction", "rag_query", "workflow_generation"
    prompt_tokens INT DEFAULT 0,
    completion_tokens INT DEFAULT 0,
    latency_ms INT NOT NULL,
    status_code INT DEFAULT 200,
    estimated_cost_usd NUMERIC(8, 6) DEFAULT 0,
    prompt_version VARCHAR(50) DEFAULT 'v1.0',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE ai_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    dataset_name VARCHAR(100) NOT NULL,
    document_type document_category NOT NULL,
    expected_payload JSONB NOT NULL,
    actual_payload JSONB NOT NULL,
    precision_score NUMERIC(5, 4) NOT NULL,
    recall_score NUMERIC(5, 4) NOT NULL,
    f1_score NUMERIC(5, 4) NOT NULL,
    latency_ms INT NOT NULL,
    evaluated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 3. Row Level Security (RLS) Policy Blueprint

Every table has RLS enabled with tenant isolation:
```sql
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_fields ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_chunks ENABLE ROW LEVEL SECURITY;
ALTER TABLE workflows ENABLE ROW LEVEL SECURITY;
ALTER TABLE approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Base Tenant Isolation Policy
CREATE POLICY tenant_isolation_policy ON documents
    FOR ALL
    USING (organization_id = (SELECT organization_id FROM profiles WHERE id = auth.uid()));
```
