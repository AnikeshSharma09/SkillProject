"""
Chapter 4: SYSTEM ARCHITECTURE & DESIGN
Sections:
4.1 High-Level System Architecture / Block Diagram
4.2 Process Flow & Control Diagrams (Flowchart / Activity Diagram)
4.3 UML / Data Modeling Diagrams (Use Case, Class, Sequence, ER Diagrams)
4.4 Database / Storage Schema Design
4.5 User Interface (UI/UX) Wireframes & Screen Layouts
"""

def write_chapter4(doc, h):
    add_p = h['add_p']
    add_bullet_point = h['add_bullet_point']
    add_chapter_heading = h['add_chapter_heading']
    add_section_heading = h['add_section_heading']
    add_subsection_heading = h['add_subsection_heading']
    add_table_custom = h['add_table_custom']
    add_figure_box = h['add_figure_box']

    add_chapter_heading(4, "System Architecture & Design")

    # 4.1 High-Level System Architecture / Block Diagram
    add_section_heading("4.1", "High-Level System Architecture / Block Diagram")
    add_p(
        "The architectural design of AI-FLOW follows a cloud-native, five-tier modular architecture engineered for high concurrency, "
        "loose coupling, deterministic decision accuracy, and strict data sovereignty. Each architectural tier encapsulates discrete "
        "computational responsibilities, communicating via typed interfaces and asynchronous state event handlers."
    )
    add_bullet_point(
        "Tier 1 — Ingestion & Capture Layer:",
        "Provides cross-platform user interfaces for document acquisition. Includes drag-and-drop file ingestion, file system browsing, and "
        "live HTML5 MediaDevices camera capture. Upon ingestion, this layer immediately invokes the Web Crypto API to compute a 256-bit SHA-256 "
        "cryptographic hash digest of the binary payload to enforce tamper-evident tracking and duplicate suppression."
    )
    add_bullet_point(
        "Tier 2 — Preprocessing & Optical Recognition Layer:",
        "Executes multi-engine optical transcription. For native PDFs, it parses internal text stream objects directly with near-zero latency. "
        "For scanned raster images (PNG, JPEG, WebP), it instantiates a client-side WebAssembly worker executing compiled Tesseract binaries, "
        "or routes payloads to an internal server-side PaddleOCR microservice with an extended 15-second timeout window."
    )
    add_bullet_point(
        "Tier 3 — Spatial Entity Extraction & Validation Layer:",
        "Consists of domain-specific semantic parsers and heuristic regex engines. It dynamically evaluates two-column side-by-side header "
        "geometries (e.g., distinguishing Seller and Client columns), normalizes European comma decimal formats, extracts itemized tax and "
        "currency breakdowns, and calculates individual field confidence scores. Missing entities strictly evaluate to empty strings with zero "
        "confidence, feeding the Human-in-the-Loop confidence router."
    )
    add_bullet_point(
        "Tier 4 — Deterministic Rule & Workflow Orchestration Layer:",
        "Houses the condition-action rule evaluator and directed-acyclic-graph (DAG) workflow scheduling engine. It validates business constraints "
        "(such as checking budget caps, vendor legitimacy, and mandatory fields) and transitions document lifecycle states (e.g., READY, "
        "REVIEW_REQUIRED, WORKFLOW_RUNNING, APPROVED, PROCESSED)."
    )
    add_bullet_point(
        "Tier 5 — Presentation Studio, Multilingual & Audit Layer:",
        "Powers the interactive split-screen Document Studio, real-time natural language executive summary synthesis across six languages "
        "(English, Hindi, Spanish, German, French, Japanese), and immutable audit trail persistence."
    )

    # Figure 4.1
    f41_lines = [
        "+-------------------------------------------------------------------------------+",
        "|                    TIER 1: DOCUMENT INGESTION & CAPTURE LAYER                |",
        "|  [Drag & Drop UI]   |   [File Explorer]   |   [Live Camera Scanner]           |",
        "|  --> Web Crypto API SHA-256 Hash Computation (Immutable Document Fingerprint) |",
        "+-------------------------------------------------------------------------------+",
        "                                      | (Binary Payload + SHA-256 Hash)",
        "                                      v",
        "+-------------------------------------------------------------------------------+",
        "|             TIER 2: PREPROCESSING & OPTICAL RECOGNITION (OCR) LAYER           |",
        "|  +---------------------------+   +-----------------------------------------+  |",
        "|  | Client Tesseract.js (WASM)|   | Fallback Internal Server PaddleOCR / CV |  |",
        "|  | (15s Timeout, 0 API Cost) |   | (Zero Data Transit to External Clouds)  |  |",
        "|  +---------------------------+   +-----------------------------------------+  |",
        "+-------------------------------------------------------------------------------+",
        "                                      | (Raw Optical Text Stream)",
        "                                      v",
        "+-------------------------------------------------------------------------------+",
        "|          TIER 3: SPATIAL ENTITY EXTRACTION & CONFIDENCE ROUTING LAYER         |",
        "|  [Taxonomy Classifier] --> Invoices | POs | Receipts | Reports | Contracts    |",
        "|  [Spatial Regex Engine] -> Dynamic 2-Column Vendor/Client & EU Decimals       |",
        "|  [HITL Router] ---------> Missing Entities = \"\" (0% Conf) -> REVIEW_REQUIRED  |",
        "+-------------------------------------------------------------------------------+",
        "                                      | (Extracted Entities + Status)",
        "                                      v",
        "+-------------------------------------------------------------------------------+",
        "|           TIER 4: DETERMINISTIC RULE & AUTONOMOUS WORKFLOW DAG LAYER          |",
        "|  [Condition-Action Rule Engine] -> Budget Thresholds, Tax Validation, RBAC   |",
        "|  [Workflow DAG Scheduler] -------> Sequential Approvals, Webhooks, Payments   |",
        "+-------------------------------------------------------------------------------+",
        "                                      | (Verified Document State)",
        "                                      v",
        "+-------------------------------------------------------------------------------+",
        "|           TIER 5: DOCUMENT STUDIO, MULTILINGUAL & AUDIT LEDGER LAYER          |",
        "|  [Dual-Pane Studio]   |   [Multilingual Briefings]   |   [Immutable Audit Logs]|",
        "|  Canvas Zoom/Rotate   |   EN, HI, ES, DE, FR, JA     |   SHA-256 Tamper Ledger |",
        "+-------------------------------------------------------------------------------+"
    ]
    add_figure_box("4.1", "High-Level End-to-End System Architecture Block Diagram", f41_lines)

    # 4.2 Process Flow & Control Diagrams
    add_section_heading("4.2", "Process Flow & Control Diagrams")
    add_p(
        "The control flow of AI-FLOW coordinates synchronous user interactions with asynchronous background computational tasks. "
        "Figure 4.2 depicts the complete ingestion and extraction lifecycle flowchart from file selection to state finalization."
    )

    # Figure 4.2
    f42_lines = [
        "  [User Selects File / Captures Scan]",
        "                   |",
        "                   v",
        "  [Calculate SHA-256 Hash Digest] --------> (Check for Duplicate Ingestion)",
        "                   |",
        "                   v",
        "     < Is File Native Vector PDF? >",
        "          /                 \\",
        "       (Yes)                (No, Scanned Raster Image)",
        "        /                     \\",
        " [Decode PDF Stream]      [Spawn Tesseract.js WASM Worker]",
        "        \\                     /",
        "         v                   v",
        "        [Raw OCR Text Stream Produced]",
        "                   |",
        "                   v",
        "  [Extract Keywords & Classify Category]",
        "                   |",
        "                   v",
        "  [Execute Category-Specific Spatial Regex]",
        "  - Two-Column Header Separation (Seller vs Client)",
        "  - Decimal Normalization ($ 173,87 -> 173.87)",
        "  - Tax Breakdown (Subtotal + VAT/GST = Total)",
        "                   |",
        "                   v",
        "     < Are Critical Fields Missing? >",
        "     < (Vendor, Invoice No, Total)   >",
        "          /                 \\",
        "       (Yes)                (No, High Confidence >= 0.85)",
        "        /                     \\",
        " [Assign \"\" (0% Conf)]    [Assign High Conf (~98%)]",
        " [Status: REVIEW_REQ]     [Status: READY]",
        "        \\                     /",
        "         v                   v",
        "   [Route to Studio]       [Execute Rule & Workflow Engine]"
    ]
    add_figure_box("4.2", "Asynchronous Document Ingestion, OCR & Extraction Flowchart", f42_lines)

    add_p(
        "Figure 4.3 illustrates the Human-in-the-Loop (HITL) verification activity diagram. When a document contains unextracted fields "
        "or falls below composite confidence thresholds, it bypasses straight-through automated processing (STP) and prompts human review."
    )

    # Figure 4.3
    f43_lines = [
        "  (Start: Ingestion Complete)",
        "               |",
        "               v",
        "  [Calculate Field Confidences c_i]",
        "               |",
        "               v",
        "  [Compute Composite Confidence C_comp = 0.3*C_class + 0.7*C_fields]",
        "               |",
        "               v",
        "     < Critical Entities Present & C_comp >= 0.75? >",
        "              /                                \\",
        "           (No)                                (Yes)",
        "            /                                    \\",
        "  [Route to REVIEW_REQUIRED]             [Route to READY / STP]",
        "            |                                      |",
        "            v                                      v",
        "  [Display Amber 'Missing (0%)' Badge]   [Trigger Automated Rules]",
        "            |                                      |",
        "            v                                      |",
        "  [Human Operator Clicks Field Pencil]             |",
        "            |                                      |",
        "            v                                      |",
        "  [Operator Inputs Verified True Value]            |",
        "            |                                      |",
        "            v                                      |",
        "  [Field Marked isCorrected: true]                 |",
        "  [Recalculate Confidence -> 100%]                 |",
        "  [Log Audit Diff: DOCUMENT_UPDATE]                |",
        "            |                                      |",
        "            v                                      |",
        "  [Human Approves Document]                        |",
        "            \\                                     /",
        "             v                                   v",
        "        [Proceed to Autonomous DAG Workflow & Payment Execution]"
    ]
    add_figure_box("4.3", "Human-in-the-Loop (HITL) Validation & Confidence Routing Activity Diagram", f43_lines)

    # 4.3 UML / Data Modeling Diagrams
    add_section_heading("4.3", "UML / Data Modeling Diagrams")
    add_p(
        "To provide rigorous structural and behavioral formalization of the system, four standard Unified Modeling Language (UML) "
        "diagrams were engineered: Use Case Diagram, Class Diagram, Sequence Diagram, and Entity-Relationship Storage Diagram."
    )
    add_subsection_heading("4.3.1", "UML System Use Case Diagram")
    add_p(
        "Figure 4.4 details the actor-use case interactions across four enterprise role personas: System Administrator, Finance Reviewer, "
        "Management Approver, and Clerical Operator."
    )

    # Figure 4.4
    f44_lines = [
        "  +-------------------------------------------------------------------------+",
        "  |                   AI-FLOW PLATFORM USE CASE SUBSYSTEM                   |",
        "  |                                                                         |",
        "  |    (( Ingest PDF & Image Documents )) <----------- [Clerk Operator]     |",
        "  |                    |                                                    |",
        "  |                    v                                                    |",
        "  |    (( Review Missing & Low-Conf Fields )) <------- [Finance Reviewer]   |",
        "  |    (( In-Place Field Edit & Correction ))                               |",
        "  |                    |                                                    |",
        "  |                    v                                                    |",
        "  |    (( Evaluate Deterministic Policy Rules ))                            |",
        "  |    (( Authorize Financial Disbursement )) <------- [Management Approver]|",
        "  |    (( Reject / Escalate Approval Task ))                                |",
        "  |                    |                                                    |",
        "  |                    v                                                    |",
        "  |    (( Manage RBAC User Roles & Permissions )) <--- [System Admin]       |",
        "  |    (( Inspect SHA-256 Tamper Audit Logs ))                              |",
        "  |    (( Configure DAG Automated Workflows ))                              |",
        "  +-------------------------------------------------------------------------+"
    ]
    add_figure_box("4.4", "UML System Use Case Interaction Diagram", f44_lines)

    add_subsection_heading("4.3.2", "UML Core Domain Class Diagram")
    add_p(
        "Figure 4.5 specifies the structural entity relationships, encapsulated attributes, and methods of the domain data model."
    )

    # Figure 4.5
    f45_lines = [
        "+------------------------------------+       +------------------------------------+",
        "|            DocumentItem            | 1   * |           ExtractedField           |",
        "+------------------------------------+-------+------------------------------------+",
        "| - id: string                       |       | - id: string                       |",
        "| - organizationId: string           |       | - documentId: string               |",
        "| - name: string                     |       | - fieldName: string                |",
        "| - fileHash: string (SHA-256)       |       | - fieldLabel: string               |",
        "| - mimeType: string                 |       | - extractedValue: string           |",
        "| - fileSizeBytes: number            |       | - dataType: 'string'|'currency'|... |",
        "| - documentType: DocumentCategory   |       | - confidence: number [0.0 - 1.0]   |",
        "| - overallConfidence: number        |       | - isCorrected: boolean             |",
        "| - status: DocumentStatus           |       | - sourceBbox: BoundingBox          |",
        "| - summary: string                  |       +------------------------------------+",
        "| - dueDate: string                  |",
        "| - rawOcrText: string               |       +------------------------------------+",
        "+------------------------------------+ 1   * |            AuditLogItem            |",
        "| + processDocumentContent()         |-------+------------------------------------+",
        "| + updateField(fieldId, val)        |       | - id: string                       |",
        "| + approveDocument()                |       | - action: string                   |",
        "| + rejectDocument(reason)           |       | - entityType: string               |",
        "+------------------------------------+       | - user: UserProfile                |",
        "                                             | - timestamp: string                |",
        "                                             | - metadata: AuditDiff              |",
        "                                             +------------------------------------+"
    ]
    add_figure_box("4.5", "UML Core Domain Class Diagram", f45_lines)

    add_subsection_heading("4.3.3", "End-to-End Lifecycle Sequence Diagram")
    add_p(
        "Figure 4.6 delineates the chronological message exchanges between client UI, WebAssembly OCR, extraction engine, rule evaluator, "
        "and payment disbursement ledger."
    )

    # Figure 4.6
    f46_lines = [
        "  User/UI          UploadModal       TesseractWASM       ProcessorEngine      RuleEngine       AuditLog",
        "     |                  |                  |                    |                  |              |",
        "     |--- Upload(file)->|                  |                    |                  |              |",
        "     |                  |-- SHA256(file) ->|                    |                  |              |",
        "     |                  |-- recognize() -->|                    |                  |              |",
        "     |                  |<-- text stream --|                    |                  |              |",
        "     |                  |------------------ process(text) ----->|                  |              |",
        "     |                  |                                       |-- evaluateRules->|              |",
        "     |                  |                                       |<-- rulesPassed --|              |",
        "     |                  |                                       |-- logAudit() ------------------>|",
        "     |                  |<-- ProcessingResult (Doc + Fields) ---|                  |              |",
        "     |<-- Render Doc ---|                  |                    |                  |              |",
        "     |                  |                  |                    |                  |              |"
    ]
    add_figure_box("4.6", "End-to-End Document Lifecycle Sequence Diagram", f46_lines)

    # 4.4 Database / Storage Schema Design
    add_section_heading("4.4", "Database / Storage Schema Design")
    add_p(
        "The persistence layer of AI-FLOW utilizes structured relational and document storage schemas optimized for high read/write "
        "throughput, transactional consistency, and fast indexing over document metadata. Table 4.1 specifies the schema definitions."
    )

    t41_headers = ["Entity Table", "Field Name", "Data Type", "Constraints / Key", "Description & Usage"]
    t41_rows = [
        ["documents", "id", "VARCHAR(64)", "PRIMARY KEY", "Unique document identifier (e.g., doc-auto-...)"],
        ["documents", "organization_id", "VARCHAR(64)", "NOT NULL, INDEX", "Tenant isolation organization identifier"],
        ["documents", "file_hash", "CHAR(64)", "NOT NULL, UNIQUE", "SHA-256 cryptographic hash of binary payload"],
        ["documents", "document_type", "VARCHAR(32)", "NOT NULL", "Taxonomy: Invoice, PO, Receipt, Contract, Report..."],
        ["documents", "status", "VARCHAR(32)", "NOT NULL, INDEX", "Lifecycle: UPLOADED, READY, REVIEW_REQ, APPROVED..."],
        ["documents", "overall_confidence", "DECIMAL(5,4)", "NOT NULL", "Weighted composite reliability score (0.0000 - 1.0000)"],
        ["extracted_fields", "id", "VARCHAR(64)", "PRIMARY KEY", "Unique field entity record ID (e.g., f-vendor)"],
        ["extracted_fields", "document_id", "VARCHAR(64)", "FOREIGN KEY, INDEX", "References documents(id) with ON DELETE CASCADE"],
        ["extracted_fields", "field_name", "VARCHAR(64)", "NOT NULL", "Standardized schema key (vendor, total, tax, date)"],
        ["extracted_fields", "extracted_value", "TEXT", "DEFAULT ''", "Strictly blank if missing; extracted text value"],
        ["extracted_fields", "confidence", "DECIMAL(5,4)", "NOT NULL", "0.0000 if unextracted/missing; up to 1.0000"],
        ["audit_logs", "id", "VARCHAR(64)", "PRIMARY KEY", "Unique audit event log record identifier"],
        ["audit_logs", "action", "VARCHAR(64)", "NOT NULL, INDEX", "Action tag: DOCUMENT_INGEST, FIELD_UPDATE, RULE_EXEC"],
        ["payments", "id", "VARCHAR(64)", "PRIMARY KEY", "Payment transaction identifier (e.g., tx-9901)"],
        ["payments", "amount", "DECIMAL(12,2)", "NOT NULL", "Disbursement settlement amount in specified currency"],
    ]
    t41_widths = [1.1, 1.2, 1.1, 1.4, 1.7]
    add_table_custom("4.1", "Database Entity Attribute & Storage Schema Specification", t41_headers, t41_rows, t41_widths)

    add_p(
        "Figure 4.7 visualizes the Entity-Relationship (ER) design connecting documents, extracted entity fields, audit logs, and payments."
    )

    # Figure 4.7
    f47_lines = [
        "+----------------------+           1:N          +----------------------+",
        "|      DOCUMENTS       |----------------------< |   EXTRACTED_FIELDS   |",
        "+----------------------+                        +----------------------+",
        "| PK id                |                        | PK id                |",
        "|    organization_id   |                        | FK document_id       |",
        "|    file_hash         |                        |    field_name        |",
        "|    document_type     |                        |    extracted_value   |",
        "|    status            |                        |    confidence        |",
        "|    overall_confidence|                        |    is_corrected      |",
        "+----------------------+                        +----------------------+",
        "           | 1:N                                           |",
        "           |                                               |",
        "           v                                               v",
        "+----------------------+                        +----------------------+",
        "|      AUDIT_LOGS      |                        |       PAYMENTS       |",
        "+----------------------+                        +----------------------+",
        "| PK id                |                        | PK id                |",
        "| FK document_id       |                        | FK document_id       |",
        "|    action            |                        |    beneficiary_name  |",
        "|    user_id           |                        |    amount            |",
        "|    timestamp         |                        |    payment_status    |",
        "+----------------------+                        +----------------------+"
    ]
    add_figure_box("4.7", "Entity-Relationship (ER) Storage Schema Diagram", f47_lines)

    # 4.5 User Interface (UI/UX) Wireframes & Screen Layouts
    add_section_heading("4.5", "User Interface (UI/UX) Wireframes & Screen Layouts")
    add_p(
        "The user experience of AI-FLOW is centered on the Document Studio (`app/documents/[id]/page.tsx`). The interface employs a responsive "
        "split-screen grid: the left 7 columns render a high-performance visual document canvas with zoom (50%-150%) and 90-degree rotation "
        "controls. The right 5 columns host an interactive tabbed control panel housing the 4-to-5 line multilingual executive summary card, "
        "the field extraction editor with live confidence meters, the workflow DAG status timeline, and the audit trail inspector. "
        "Figure 4.8 illustrates this UI/UX wireframe architecture."
    )

    # Figure 4.8
    f48_lines = [
        "+-------------------------------------------------------------------------------+",
        "|  AI-FLOW Header | Breadcrumbs > Documents > INV-74980573.jpg | User: Admin    |",
        "+-----------------------------------------------+-------------------------------+",
        "| LEFT PANE (7 Cols): VISUAL DOCUMENT CANVAS    | RIGHT PANE (5 Cols): STUDIO   |",
        "| [Zoom -] [100%] [Zoom +] [Rotate 90] [Reset]  | [Executive Summary Briefing]  |",
        "| +-------------------------------------------+ | 'Official commercial invoice' |",
        "| |                                           | | [Translate: EN|HI|ES|DE|JA]   |",
        "| |  TAX INVOICE                              | +-------------------------------+",
        "| |  Seller: West Group                       | [TABS: Data | Workflow | Audit] |",
        "| |  Client: Zimmerman and Sons               | +-------------------------------+",
        "| |  Total: $191.26                           | | Vendor: West Group    [99% G] |",
        "| |                                           | | Inv #: 74980573       [99% G] |",
        "| |  [High-Resolution Scanned Document Pixels]| | Total: $191.26        [98% G] |",
        "| |                                           | | Tax: — (Missing)      [ 0% R] |",
        "| |                                           | | [Edit Pencil Icon to Correct] |",
        "| +-------------------------------------------+ +-------------------------------+",
        "| Page 1 of 1 | SHA-256: 8f12a9bc... Verified   | [Approve] [Reject] [Execute]  |",
        "+-----------------------------------------------+-------------------------------+"
    ]
    add_figure_box("4.8", "Document Studio Multi-Pane UI/UX Layout Wireframe", f48_lines)
