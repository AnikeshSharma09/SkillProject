"""
Chapter 3: SYSTEM REQUIREMENTS & FEASIBILITY ANALYSIS
Sections:
3.1 Functional Requirements
3.2 Non-Functional Requirements (Performance, Security, Usability, Scalability)
3.3 Hardware & Software Specifications (Tools, Frameworks, Libraries, APIs)
3.4 Feasibility Study (Technical, Operational, and Economic)
"""

def write_chapter3(doc, h):
    add_p = h['add_p']
    add_bullet_point = h['add_bullet_point']
    add_chapter_heading = h['add_chapter_heading']
    add_section_heading = h['add_section_heading']
    add_subsection_heading = h['add_subsection_heading']
    add_table_custom = h['add_table_custom']

    add_chapter_heading(3, "System Requirements & Feasibility Analysis")

    # 3.1 Functional Requirements
    add_section_heading("3.1", "Functional Requirements")
    add_p(
        "Functional requirements delineate the precise operational capabilities, behavioral responses, data transformations, and system "
        "interactions that the AI-FLOW platform must deliver to satisfy enterprise operational objectives. The functional architecture "
        "is structured into ten modular, cohesive requirement specifications (FR-01 through FR-10), outlined below and summarized in Table 3.1."
    )
    add_bullet_point(
        "FR-01: Multi-Format Document Ingestion & Acquisition:",
        "The system must provide an intuitive ingestion interface supporting drag-and-drop file upload, file explorer selection, and live camera "
        "snapshot acquisition for PDF documents and high-resolution raster images (JPEG, PNG, WebP). The system must support single-file and "
        "batch multi-file queues."
    )
    add_bullet_point(
        "FR-02: Cryptographic Document Fingerprinting:",
        "Upon file selection, the platform must immediately compute a 256-bit SHA-256 cryptographic hash of the raw binary payload. This hash "
        "serves as an immutable document identifier, ensuring non-repudiation, duplicate file detection, and tamper-evident audit trail verification."
    )
    add_bullet_point(
        "FR-03: Multi-Engine Optical Text Extraction:",
        "The platform must execute optical character recognition utilizing client-side Tesseract WebAssembly (WASM) for zero-latency local "
        "processing, native PDF text stream decoding for digital documents, and fallback server-side OCR microservices, allowing an extended "
        "timeout window of up to 15 seconds to prevent premature failure during language model caching."
    )
    add_bullet_point(
        "FR-04: Automated Taxonomy Classification:",
        "The system must analyze extracted text streams and file naming metadata to automatically classify documents into seven standardized "
        "enterprise categories: Invoices, Purchase Orders, Receipts, Reports, Contracts, Bank Statements, and Medical Forms, calculating an explicit "
        "classification confidence score."
    )
    add_bullet_point(
        "FR-05: Layout-Aware Spatial Entity Extraction:",
        "The system must execute category-specific extraction schemas. For invoices, it must extract vendor name, client name, invoice number, "
        "invoice date, due date, subtotal, tax amount, total payable, and currency denomination, resolving dynamic two-column layouts and European "
        "comma decimal formatting."
    )
    add_bullet_point(
        "FR-06: Zero-Hallucination & HITL Confidence Routing:",
        "The platform must strictly enforce that any entity omitted or unreadable from the scan remains blank (\"\") with 0.0 confidence. If "
        "essential entities are missing or overall composite confidence falls below 0.75, the document status must automatically route to "
        "REVIEW_REQUIRED for human intervention."
    )
    add_bullet_point(
        "FR-07: Interactive Split-Screen Document Studio:",
        "The system must render a dual-pane verification studio featuring a zoomable, rotatable visual document canvas in the left pane and an "
        "editable structured entity table in the right pane, allowing operators to click any unextracted or low-confidence field, enter corrections, "
        "and persist updates with full audit tracking."
    )
    add_bullet_point(
        "FR-08: Deterministic Business Rule Evaluation:",
        "The system must evaluate extracted financial data against an active corporate rule catalog (e.g., verifying spend under $10,000, checking "
        "valid tax IDs, requiring multi-level approvals for capital expenditures) with 100% deterministic precision, logging rule outcomes."
    )
    add_bullet_point(
        "FR-09: Autonomous Workflow DAG Orchestration:",
        "Upon rule validation, the system must trigger a directed-acyclic-graph (DAG) workflow pipeline that sequentially handles managerial "
        "approval routing, payment ledger disbursement simulation, external webhook triggers, and audit finalization."
    )
    add_bullet_point(
        "FR-10: Multilingual Executive Summary Synthesis:",
        "The system must automatically synthesize a structured 4-to-5 line executive operational summary of the document and provide on-demand, "
        "real-time translation across six major business languages (English, Spanish, French, German, Hindi, Japanese)."
    )

    # Table 3.1
    t31_headers = ["Req ID", "Requirement Description", "Input Data", "Expected Output", "Priority"]
    t31_rows = [
        ["FR-01", "Document Ingestion & Capture", "PDF / Image File, Camera Feed", "Normalized File Object in Memory", "Critical"],
        ["FR-02", "SHA-256 Cryptographic Hash", "Binary File Stream", "Hex-encoded 64-char Hash Digest", "High"],
        ["FR-03", "Optical Character Recognition", "File Object, Language Models", "Raw Extracted OCR Text String", "Critical"],
        ["FR-04", "Taxonomy Classification", "OCR Text, File Name Metadata", "DocumentCategory, Confidence Score", "Critical"],
        ["FR-05", "Layout Entity Extraction", "OCR Text, Category Schema", "Structured ExtractedField Array", "Critical"],
        ["FR-06", "HITL Confidence Routing", "Field Confidences, Missing Checks", "DocumentStatus (READY / REVIEW)", "Critical"],
        ["FR-07", "Document Studio Editor", "Document ID, User Edits", "Updated Fields, Audit Diff Record", "High"],
        ["FR-08", "Deterministic Rule Engine", "Extracted Fields, Rule Catalog", "Passed/Failed Rules, Action Triggers", "High"],
        ["FR-09", "Workflow DAG Execution", "Document Object, Workflow ID", "Step Execution Timeline & Logs", "High"],
        ["FR-10", "Multilingual Executive Summary", "Document Fields, Target Language", "4-5 Line Translated Synthesis", "Medium"],
    ]
    t31_widths = [0.8, 1.8, 1.4, 1.3, 0.7]
    add_table_custom("3.1", "Detailed Functional Requirements Specification (FR-01 to FR-10)", t31_headers, t31_rows, t31_widths)

    # 3.2 Non-Functional Requirements
    add_section_heading("3.2", "Non-Functional Requirements")
    add_p(
        "Non-functional requirements (NFRs) specify the qualitative engineering criteria, architectural constraints, security boundaries, "
        "and operational performance benchmarks that govern the platform's behavior under real-world enterprise workloads. Table 3.2 details "
        "these specifications across six core engineering categories."
    )

    t32_headers = ["Category", "Requirement ID", "Engineering Specification Rule", "Target Metric"]
    t32_rows = [
        ["Performance", "NFR-01", "End-to-end ingestion, OCR, extraction, and rule evaluation latency", "< 5.0 seconds per page"],
        ["Performance", "NFR-02", "Client-side bundle initialization and initial paint time", "< 1.5 seconds on 4G connection"],
        ["Security", "NFR-03", "Role-Based Access Control (RBAC) enforcing Admin, Reviewer, Approver permissions", "Zero unauthorized route access"],
        ["Security", "NFR-04", "Data sovereignty and document confidentiality (no external cloud leakage)", "100% local or private transit"],
        ["Reliability", "NFR-05", "System uptime, graceful error boundaries, and zero unhandled exceptions", "99.9% uptime during operation"],
        ["Maintainability", "NFR-06", "Full static typing with TypeScript and automated test coverage pass rate", "100% build passing, 23/23 tests"],
    ]
    t32_widths = [1.1, 1.0, 2.5, 1.4]
    add_table_custom("3.2", "Non-Functional Engineering Requirements Matrix (NFR-01 to NFR-06)", t32_headers, t32_rows, t32_widths)

    # 3.3 Hardware & Software Specifications
    add_section_heading("3.3", "Hardware & Software Specifications")
    add_p(
        "To ensure reproducible deployment across development workstations, continuous integration (CI) runners, and enterprise server "
        "environments, the hardware and software technology prerequisites are exhaustively detailed in Tables 3.3 and 3.4."
    )

    t33_headers = ["Environment Layer", "Hardware Component", "Minimum Requirement", "Recommended Development Spec"]
    t33_rows = [
        ["Client Machine", "Processor (CPU)", "Dual-Core 2.0 GHz x86/ARM", "Intel Core i7 / AMD Ryzen 7 / Apple M-Series"],
        ["Client Machine", "System Memory (RAM)", "4 GB DDR4", "16 GB DDR4/DDR5"],
        ["Client Machine", "Display Resolution", "1280 x 720 (HD)", "1920 x 1080 (FHD) or higher (Dual-pane)"],
        ["Server / Host", "Processor (CPU)", "Quad-Core 2.5 GHz x86-64", "8 Cores / 16 Threads 3.2 GHz"],
        ["Server / Host", "System Memory (RAM)", "8 GB ECC RAM", "32 GB ECC RAM"],
        ["Server / Host", "Storage (Disk)", "20 GB Available SSD", "100 GB NVMe PCIe 4.0 SSD"],
        ["Network", "Bandwidth", "10 Mbps Broadband", "100 Mbps Low-Latency Fiber"],
    ]
    t33_widths = [1.2, 1.4, 1.6, 1.8]
    add_table_custom("3.3", "Hardware Development & Host Execution Environment Specifications", t33_headers, t33_rows, t33_widths)

    t34_headers = ["Technology Domain", "Software / Framework", "Version", "Role & Justification in Architecture"]
    t34_rows = [
        ["Frontend Framework", "Next.js (App Router)", "16.3.6", "Full-stack React framework with SSR, Turbopack, and API routes"],
        ["UI Component Engine", "React", "19.0.0", "Core view library utilizing hooks, concurrent rendering, and context"],
        ["Type Safety", "TypeScript", "5.x", "Static type verification enforcing schema fidelity across all modules"],
        ["Styling & Design", "Tailwind CSS", "4.x", "Utility-first modern styling with custom glassmorphic cards and badges"],
        ["Client Optical OCR", "Tesseract.js (WASM)", "5.x", "Client-side WebAssembly optical character recognition engine"],
        ["Iconography", "Lucide React", "0.4x", "Modern, lightweight, scalable SVG vector iconography for UI studio"],
        ["Automated Testing", "Vitest", "5.0.2", "Ultra-fast Vite-native unit testing runner with instant HMR"],
        ["Runtime Environment", "Node.js", ">= 20.x LTS", "Underlying JavaScript runtime supporting server-side compilation"],
    ]
    t34_widths = [1.3, 1.4, 0.8, 2.5]
    add_table_custom("3.4", "Software Technology Stack, Frameworks, and Dependent Library Matrix", t34_headers, t34_rows, t34_widths)

    # 3.4 Feasibility Study
    add_section_heading("3.4", "Feasibility Study")
    add_p(
        "A rigorous multi-dimensional feasibility study was performed prior to system implementation to evaluate technical viability, "
        "operational adoptability, and economic return on investment (ROI). The findings are synthesized across three core domains and "
        "summarized in Table 3.5."
    )
    add_subsection_heading("3.4.1", "Technical Feasibility")
    add_p(
        "The technical feasibility assessment examined whether client-side WebAssembly and modern React state architecture could handle "
        "complex optical extraction without crashing browser runtimes. By compiling Tesseract binaries to WebAssembly with SIMD acceleration "
        "and utilizing worker threads, optical recognition executes asynchronously without freezing the browser UI main thread. Furthermore, "
        "Next.js 16 provides optimized bundle code-splitting and Turbopack compilation, allowing the application to load within 1.5 seconds. "
        "The automated test suite (Vitest) executes 23 unit tests across 7 suites in just 501 milliseconds, confirming robust technical stability."
    )
    add_subsection_heading("3.4.2", "Operational Feasibility")
    add_p(
        "The operational feasibility assessment evaluated whether enterprise accounts payable clerks and auditors could seamlessly adopt "
        "the platform without extensive retraining. The split-screen Document Studio was modeled directly upon familiar manual review "
        "paradigms: original document on the left, extracted data on the right. Missing or low-confidence fields are highlighted with amber "
        "warning badges (e.g., 'Missing (0%)'), guiding operators immediately to unverified data points. Role-Based Access Control (RBAC) ensures "
        "that clerk operators can correct data, managers can approve financial spend, and auditors can inspect immutable system logs."
    )
    add_subsection_heading("3.4.3", "Economic Feasibility & ROI Analysis")
    add_p(
        "The economic feasibility analysis compared the Total Cost of Ownership (TCO) of AI-FLOW against conventional manual entry and "
        "commercial SaaS cloud document AI platforms over a 3-year projection for an enterprise processing 20,000 documents per month. "
        "Manual data entry costs approximately $480,000 over 3 years in direct clerical labor. Commercial cloud APIs incur approximately "
        "$72,000 in recurring page licensing fees plus internal IT maintenance. In contrast, AI-FLOW operates with zero recurring per-page "
        "API fees, requiring only standard web hosting infrastructure (~$2,400 over 3 years). This delivers a net cost reduction exceeding "
        "90% compared to manual operations and 85% compared to commercial SaaS alternatives, validating compelling economic feasibility."
    )

    t35_headers = ["Feasibility Dimension", "Core Evaluation Criteria", "Empirical Findings", "Feasibility Outcome"]
    t35_rows = [
        ["Technical", "WASM execution, TypeScript safety, Turbopack build", "Runs client/server cleanly; 23 tests pass in 501ms", "Highly Feasible"],
        ["Operational", "User adoption curve, UI clarity, HITL workflow", "Intuitive dual-pane studio; clear amber missing badges", "Highly Feasible"],
        ["Economic", "TCO comparison vs manual entry and SaaS APIs", "Saves >85% costs; zero marginal recurring API expense", "Highly Feasible"],
        ["Legal & Compliance", "Data privacy, Indian DPDPA & GDPR sovereignty", "Zero external data transit; tamper-evident SHA-256", "Fully Compliant"],
        ["Schedule & Timeline", "Project delivery within semester skill timeline", "Delivered in 4 agile sprints with full CI verification", "Achieved on Schedule"],
    ]
    t35_widths = [1.3, 1.6, 1.8, 1.3]
    add_table_custom("3.5", "Multi-Dimensional Feasibility Assessment Evaluation Matrix", t35_headers, t35_rows, t35_widths)
