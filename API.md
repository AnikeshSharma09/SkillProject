# AI-FLOW: API Specification

Base URL: `/api`

All endpoints return JSON responses in a standardized format:
```json
{
  "success": true,
  "data": { ... },
  "error": null,
  "meta": {
    "timestamp": "2026-09-27T00:59:00Z",
    "requestId": "req_abc123"
  }
}
```

---

## 1. Document Management APIs

### 1.1 Upload Document
- **Endpoint**: `POST /api/documents/upload`
- **Content-Type**: `multipart/form-data`
- **Request Body**:
  - `file`: Binary file (PDF, PNG, JPG, DOCX, XLSX, CSV, TXT, max 25MB).
  - `organizationId`: UUID of tenant.
- **Response**:
```json
{
  "success": true,
  "data": {
    "id": "doc_8f12a",
    "name": "Invoice_INV1024.pdf",
    "mimeType": "application/pdf",
    "fileSizeBytes": 245100,
    "status": "UPLOADED",
    "createdAt": "2026-09-27T00:59:00Z"
  }
}
```

### 1.2 List Documents
- **Endpoint**: `GET /api/documents`
- **Query Params**:
  - `status`: Optional filter (`UPLOADED`, `PROCESSING`, `CLASSIFIED`, `EXTRACTING`, `REVIEW_REQUIRED`, `READY`, `COMPLETED`, `ARCHIVED`, `FAILED`).
  - `type`: Optional document type (`Invoice`, `Receipt`, `Resume`, etc.).
  - `search`: Keyword string.
  - `page`: Page index (default: 1).
  - `limit`: Items per page (default: 20).

### 1.3 Get Document Detail
- **Endpoint**: `GET /api/documents/:id`
- **Response**: Full document object including raw OCR, extracted fields with bounding boxes and confidence scores, and workflow execution state.

### 1.4 Process Document (Run OCR & Classification)
- **Endpoint**: `POST /api/documents/:id/process`
- **Description**: Triggers text extraction and classification stage.

### 1.5 Extract Document Fields
- **Endpoint**: `POST /api/documents/:id/extract`
- **Description**: Runs schema-aware structured extraction and assigns confidence scores.

### 1.6 Update / Correct Field (Human in the Loop)
- **Endpoint**: `PATCH /api/documents/:id/fields/:fieldId`
- **Request Body**:
```json
{
  "correctedValue": "₹72,500",
  "comment": "Adjusted OCR decimal separator"
}
```

---

## 2. Workflow Automation APIs

### 2.1 List Workflows
- **Endpoint**: `GET /api/workflows`
- **Response**: List of workflows with category, active status, node counts, and run statistics.

### 2.2 Create / Save Workflow Graph
- **Endpoint**: `POST /api/workflows`
- **Request Body**:
```json
{
  "name": "Invoice High-Value Approval",
  "category": "Finance",
  "nodes": [...],
  "edges": [...],
  "isActive": true
}
```

### 2.3 Generate Workflow with AI
- **Endpoint**: `POST /api/workflows/generate`
- **Request Body**:
```json
{
  "prompt": "Whenever an invoice above ₹50,000 is uploaded, send it to the department manager for approval. If approved, send it to finance and archive it."
}
```
- **Response**: Synthesized DAG with validated nodes, connections, and conditions.

### 2.4 Execute Workflow
- **Endpoint**: `POST /api/workflows/:id/execute`
- **Request Body**:
```json
{
  "documentId": "doc_8f12a"
}
```
- **Response**: Workflow run instance ID and execution step status.

---

## 3. Approvals APIs

### 3.1 List Approvals
- **Endpoint**: `GET /api/approvals`
- **Query Params**: `status=PENDING|APPROVED|REJECTED`

### 3.2 Approve Task
- **Endpoint**: `POST /api/approvals/:id/approve`
- **Request Body**:
```json
{
  "comment": "Verified against purchase order. Approved."
}
```

### 3.3 Reject Task
- **Endpoint**: `POST /api/approvals/:id/reject`
- **Request Body**:
```json
{
  "comment": "Price discrepancy on item #3."
}
```

---

## 4. RAG Assistant APIs

### 4.1 Natural Language Query
- **Endpoint**: `POST /api/assistant/query`
- **Request Body**:
```json
{
  "query": "Which invoices exceed ₹50,000?",
  "filters": {
    "documentType": "Invoice",
    "dateRange": "last_30_days"
  }
}
```
- **Response**:
```json
{
  "success": true,
  "data": {
    "answer": "There are 3 invoices exceeding ₹50,000 pending approval: INV-1024 (₹72,500), INV-1031 (₹1,15,000), and INV-1048 (₹68,200).",
    "sources": [
      {
        "documentId": "doc_1024",
        "documentName": "Invoice_INV1024.pdf",
        "excerpt": "Total Amount Payable: INR 72,500.00",
        "page": 1,
        "confidence": 0.984
      }
    ]
  }
}
```

---

## 5. Analytics & Observability APIs

### 5.1 Overview Analytics
- **Endpoint**: `GET /api/analytics`
- **Response**: Aggregate KPIs, throughput timeseries, classification distribution, and automation ratios.

### 5.2 AI Observability & Evaluations
- **Endpoint**: `GET /api/analytics/ai`
- **Response**: Ground truth evaluations, precision/recall, model latency histograms, and token costs.

---

## 6. Audit Trail API

### 6.1 List Audit Events
- **Endpoint**: `GET /api/audit-logs`
- **Query Params**: `documentId`, `userId`, `action`, `limit`, `page`.
