"""
Chapter 1: INTRODUCTION
Sections:
1.1 Background & Overview of the Domain
1.2 Problem Statement
1.3 Objectives of the Integrated Skill Project
1.4 Scope and Limitations of the Project
1.5 Industry / Real-World Relevance & Skill Alignment
1.6 Organization of the Report
"""

def write_chapter1(doc, h):
    add_p = h['add_p']
    add_bullet_point = h['add_bullet_point']
    add_chapter_heading = h['add_chapter_heading']
    add_section_heading = h['add_section_heading']
    add_subsection_heading = h['add_subsection_heading']

    add_chapter_heading(1, "Introduction")

    # 1.1 Background & Overview of the Domain
    add_section_heading("1.1", "Background & Overview of the Domain")
    add_p(
        "In the modern digital economy, enterprise organizations generate, exchange, and archive colossal volumes of documents "
        "on a continuous daily basis. According to industry analyses conducted by Gartner and the International Data Corporation (IDC), "
        "over 80% of all organizational data resides in unstructured or semi-structured formats. These documents encompass "
        "commercial tax invoices, corporate purchase orders (POs), warehouse delivery notes, point-of-sale expense receipts, "
        "employment contracts, non-disclosure agreements (NDAs), human resource leave applications, and clinical medical summaries. "
        "Despite extensive investments in Enterprise Resource Planning (ERP) databases, Customer Relationship Management (CRM) "
        "suites, and cloud accounting software, the interface between real-world physical paperwork and digital system records "
        "remains predominantly manual and fundamentally fragmented."
    )
    add_p(
        "The operational lifecycle of traditional business documents relies heavily on manual administrative labor. Human operators "
        "must manually open mail, scan physical paper, inspect PDF attachments, transcribe vendor names, decipher invoice numbers, "
        "verify dates, parse complex line-item tables, and calculate applicable tax breakdown totals such as Goods and Services Tax "
        "(GST) or Value Added Tax (VAT). Subsequently, these values must be keyed into back-office software suites like SAP, Oracle "
        "NetSuite, Microsoft Dynamics, or Tally. This manual transcription paradigm represents an acute operational bottleneck. "
        "Industry surveys indicate that processing a single paper-based or scanned commercial invoice costs organizations between "
        "$12 and $30 in direct labor, requiring an average fulfillment latency of 8 to 15 business days."
    )
    add_p(
        "To alleviate this operational overhead, the field of Intelligent Document Processing (IDP) has emerged at the intersection "
        "of Optical Character Recognition (OCR), Computer Vision (CV), Natural Language Processing (NLP), and Robotic Process "
        "Automation (RPA). Early OCR platforms originated in the 1970s and 1980s, focusing on matrix-matching and geometric stroke "
        "analysis for uniform machine-printed characters. While effective for standardized forms with rigid coordinate bounding boxes, "
        "these legacy systems break down completely when presented with real-world business invoices. In commercial practice, each "
        "vendor adopts an individualized graphical layout: some print vendor and client metadata side-by-side in two-column arrangements, "
        "others position summary figures at the bottom right, and international suppliers employ varying decimal conventions, such as "
        "the European comma separator (e.g., $ 173,87 rather than $173.87)."
    )
    add_p(
        "Modern enterprise IDP platforms demand a sophisticated hybrid architecture combining multi-engine optical scanning, "
        "layout-aware heuristic parsing, deterministic policy rules, and Human-in-the-Loop (HITL) exception handling. By automating "
        "the end-to-end pipeline—from binary document ingestion and cryptographic integrity hashing to automated entity extraction, "
        "confidence-routed human verification, and ledger payment execution—organizations can achieve straight-through processing (STP) "
        "rates exceeding 85%, reducing transaction costs to under $2 per invoice while compressing multi-day processing cycles into "
        "mere seconds."
    )

    # 1.2 Problem Statement
    add_section_heading("1.2", "Problem Statement")
    add_p(
        "Despite the availability of optical recognition libraries, current enterprise document processing systems exhibit severe "
        "systemic vulnerabilities and architectural limitations that prevent widespread autonomous adoption:"
    )
    add_bullet_point(
        "Pervasive Manual Data Entry Bottlenecks:",
        "Human data entry is inherently labor-intensive, slow, and expensive. Operator fatigue during repetitive transcription "
        "leads to pervasive human error rates between 1% and 3%, causing duplicated payments, incorrect ledger debits, and lost "
        "vendor early-settlement discounts."
    )
    add_bullet_point(
        "Brittleness of Rigid Template-Based Parsing:",
        "Legacy IDP tools depend on hardcoded pixel coordinates and static layout bounding boxes. A slight shift in page margin, "
        "scanner skew, resolution difference, or vendor formatting update completely invalidates coordinate extraction anchors, "
        "requiring constant manual template maintenance by expensive technical consultants."
    )
    add_bullet_point(
        "The Dangerous Anti-Pattern of Default Value Assignment:",
        "Many commercial and academic prototype systems incorporate fallback assignments when optical text is degraded or fields "
        "are omitted from the scan. For instance, if an invoice lacks an explicit vendor name or total amount, naïve algorithms "
        "inject mock default values (such as defaulting to a placeholder supplier or standard total). In financial and enterprise "
        "auditing, synthesizing fictitious data is a critical compliance hazard that creates fraudulent accounting records and "
        "masks systemic optical scanning failures."
    )
    add_bullet_point(
        "Prohibitive Cloud API Costs & Sovereign Privacy Risks:",
        "Modern cloud-hosted document AI services (e.g., AWS Textract, Google Cloud Document AI, Azure Form Recognizer) impose "
        "recurring per-page licensing fees ($0.05 to $0.15 per page) and require transmitting sensitive corporate financial data, "
        "trade secrets, and employee personally identifiable information (PII) over external public networks, conflicting with "
        "strict data localization laws (such as GDPR, HIPAA, and the Indian Digital Personal Data Protection Act)."
    )
    add_bullet_point(
        "Disconnection Between Extraction & Downstream Workflows:",
        "Most standalone OCR tools operate as isolated utilities. They output raw unstructured text or disorganized JSON blobs "
        "without integrating into deterministic organizational policy rules, multi-stage approval hierarchies, or cryptographic "
        "audit registers."
    )
    add_p(
        "Therefore, there exists an urgent requirement for an integrated, cloud-native Intelligent Document and Workflow Automation "
        "Platform that executes client-side and server-side optical extraction without recurring API fees, intelligently handles "
        "varied layouts through layout-aware spatial reasoning, strictly leaves unextracted entities blank with 0% confidence to "
        "trigger Human-in-the-Loop review, and automates multi-stage policy workflows through deterministic rule validation."
    )

    # 1.3 Objectives of the Integrated Skill Project
    add_section_heading("1.3", "Objectives of the Integrated Skill Project")
    add_p(
        "The overarching aim of this project is to architect, develop, and benchmark AI-FLOW, a robust, production-grade enterprise "
        "intelligent document automation platform. The specific engineering objectives are formulated as follows:"
    )
    add_bullet_point(
        "Objective 1 — Multi-Engine Optical Ingestion Pipeline:",
        "To develop an asynchronous document ingestion framework supporting PDF and multi-format image files (JPEG, PNG, WebP), "
        "incorporating client-side Tesseract WebAssembly (WASM) optical extraction, native PDF text stream decoding, and server-side "
        "microservice OCR capability without relying on costly external proprietary APIs."
    )
    add_bullet_point(
        "Objective 2 — Document Classification & Taxonomy Engine:",
        "To implement a multi-class document classification model capable of accurately categorizing incoming unstructured files into "
        "distinct enterprise operational taxonomies (Invoices, Purchase Orders, Receipts, Reports, Contracts, Bank Statements, "
        "and Medical Summaries) with classification confidence exceeding 95%."
    )
    add_bullet_point(
        "Objective 3 — Layout-Aware Spatial Entity Extraction:",
        "To engineer deterministic, layout-aware entity extraction algorithms capable of resolving dynamic two-column side-by-side "
        "vendor-client arrangements, multi-tier tax and subtotal breakdowns, and multi-national decimal and currency conventions."
    )
    add_bullet_point(
        "Objective 4 — Human-in-the-Loop (HITL) Confidence Routing:",
        "To design a zero-hallucination validation architecture where missing entities strictly evaluate to empty strings with 0% "
        "confidence, automatically calculating composite document reliability and routing unverified or incomplete files to a "
        "split-screen Document Studio for visual human correction."
    )
    add_bullet_point(
        "Objective 5 — Deterministic Business Rule Evaluator:",
        "To create a condition-action rule evaluation engine that evaluates multi-variable business constraints (e.g., spend "
        "thresholds, department budgets, mandatory tax registration verification) and determines automated approval or escalation."
    )
    add_bullet_point(
        "Objective 6 — Autonomous Workflow & Payment Automation:",
        "To build a directed-acyclic-graph (DAG) execution engine that triggers automated sequential approval steps, external "
        "webhook integrations, audit logging, and simulated banking payment disbursements upon verified document reconciliation."
    )
    add_bullet_point(
        "Objective 7 — Multilingual Synthesis & Executive Briefings:",
        "To formulate an automated natural-language executive summary generator producing concise 4-to-5 line briefing overviews "
        "with dynamic multilingual translation across six major business languages (English, Hindi, Spanish, German, French, Japanese)."
    )

    # 1.4 Scope and Limitations of the Project
    add_section_heading("1.4", "Scope and Limitations of the Project")
    add_p(
        "The functional scope of the AI-FLOW platform encompasses enterprise administrative document processing with specific "
        "boundaries defined below:"
    )
    add_subsection_heading("1.4.1", "In-Scope Capabilities")
    add_bullet_point(
        "File Format Support:",
        "Ingestion of standard PDF documents (vector text streams and rasterized scans) and high-resolution raster images (PNG, "
        "JPEG, TIFF, WebP) with client-side drag-and-drop and live camera snapshot capture."
    )
    add_bullet_point(
        "Document Taxonomies:",
        "Full schema-aware parsing for seven core business categories: Invoices, Purchase Orders, Expense Receipts, Corporate "
        "Reports, Commercial Contracts, Bank Statements, and Medical Forms."
    )
    add_bullet_point(
        "Cryptographic Hashing:",
        "Generation of SHA-256 digital document hashes upon file selection to ensure tamper-evident immutability and duplicate "
        "detection across the audit trail."
    )
    add_bullet_point(
        "Document Studio Workspace:",
        "Interactive split-screen interface featuring zoomable, rotatable canvas rendering, confidence score badges, in-place entity "
        "correction, multilingual translation toggles, and contextual audit logging."
    )

    add_subsection_heading("1.4.2", "System Limitations")
    add_bullet_point(
        "Handwritten Cursive Text (ICR):",
        "The optical engine is optimized for printed, typed, and structured digital typography. Unconstrained handwritten cursive "
        "scripts (Intelligent Character Recognition - ICR) exhibit degraded extraction accuracy compared to printed characters."
    )
    add_bullet_point(
        "Client Browser Hardware Constraints:",
        "Client-side WASM OCR performance is dependent on host CPU and memory availability. Highly complex multi-page documents "
        "(>50 pages) are optimally offloaded to background server workers rather than single-threaded browser tabs."
    )
    add_bullet_point(
        "Proprietary Legacy ERP Connectors:",
        "The current implementation features RESTful JSON webhook connectors. Direct proprietary binary RPC connections to legacy "
        "on-premise mainframe SAP R/3 systems require intermediary API gateways."
    )

    # 1.5 Industry / Real-World Relevance & Skill Alignment
    add_section_heading("1.5", "Industry / Real-World Relevance & Skill Alignment")
    add_p(
        "The enterprise relevance of AI-FLOW directly intersects with digital transformation initiatives underway across global "
        "shared service centers, multinational banking organizations, healthcare institutions, and supply chain logistics providers. "
        "Modern CFOs and Chief Information Officers prioritize accounts payable automation as a top-three digital modernization goal, "
        "recognizing that reducing invoice cycle time directly improves cash flow forecasting, optimizes working capital, and eliminates "
        "fraudulent vendor billings."
    )
    add_p(
        "From an educational and skill development perspective, this project embodies the core learning objectives of the Bachelor of "
        "Technology in Computer Science and Engineering curriculum at Symbiosis University of Applied Sciences, Indore. The engineering "
        "of AI-FLOW required practical mastery across multiple computing disciplines:"
    )
    add_bullet_point(
        "Modern Full-Stack Cloud Architecture:",
        "Implementing enterprise-scale Next.js 16 App Router architectures, React 19 concurrent features, TypeScript static type safety, "
        "and Tailwind CSS responsive component design."
    )
    add_bullet_point(
        "Applied Computer Vision & WebAssembly:",
        "Compiling and orchestrating native C/C++ optical recognition binaries in browser environments using Emscripten and WebAssembly (WASM)."
    )
    add_bullet_point(
        "Algorithmic System Design:",
        "Developing deterministic condition-action rule engines, directed-acyclic-graph (DAG) workflow scheduling state machines, and "
        "spatial pattern-matching regex pipelines."
    )
    add_bullet_point(
        "Quality Assurance & Test-Driven Development (TDD):",
        "Authoring comprehensive automated test suites using Vitest, validating edge cases, regression tolerance, and 100% build pass rates."
    )

    # 1.6 Organization of the Report
    add_section_heading("1.6", "Organization of the Report")
    add_p(
        "This project report is systematically organized into eight comprehensive chapters, followed by supplementary appendices and "
        "academic references, formatted in strict compliance with university documentation guidelines:"
    )
    add_bullet_point(
        "Chapter 1 — Introduction:",
        "Establishes the problem domain, technical background, core objectives, project scope, industry relevance, and organizational structure."
    )
    add_bullet_point(
        "Chapter 2 — Literature Survey & Existing System Analysis:",
        "Surveys contemporary OCR models, cloud IDP services, comparative engineering matrices, identified research gaps, and system justifications."
    )
    add_bullet_point(
        "Chapter 3 — System Requirements & Feasibility Analysis:",
        "Details functional and non-functional requirements, development environment hardware/software stacks, and multi-dimensional feasibility evaluations."
    )
    add_bullet_point(
        "Chapter 4 — System Architecture & Design:",
        "Presents high-level 5-tier architecture block diagrams, process flowcharts, UML use case, class, and sequence diagrams, database schemas, and UI wireframes."
    )
    add_bullet_point(
        "Chapter 5 — Methodology & Implementation:",
        "Elaborates on the Agile-Spiral development methodology, module-level engineering details, core mathematical and algorithmic pseudocode, and key code highlights."
    )
    add_bullet_point(
        "Chapter 6 — Testing, Results & Discussion:",
        "Documents unit and integration testing strategies, master test execution matrices (TC-01 to TC-10), visual output demonstrations, and performance benchmarks."
    )
    add_bullet_point(
        "Chapter 7 — Conclusion & Future Scope:",
        "Synthesizes project accomplishments, architectural reflections, lessons learned, and technological roadmaps for future production scaling."
    )
    add_bullet_point(
        "Chapter 8 — Learning Outcome:",
        "Reflects on practical competencies acquired during the project lifecycle, mapping academic theory to professional software engineering practices."
    )
    add_bullet_point(
        "Appendices & References:",
        "Provides REST API specifications, extracted JSON entity schemas, deterministic rule definitions, and complete formal bibliography citations."
    )
