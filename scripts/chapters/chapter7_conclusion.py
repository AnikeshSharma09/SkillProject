"""
Chapter 7: CONCLUSION & FUTURE SCOPE
Sections:
7.1 Summary of Work & Key Achievements
7.2 Challenges Faced & Lessons Learned (Skill Reflection)
7.3 Future Enhancements & Scalability Roadmap
"""

def write_chapter7(doc, h):
    add_p = h['add_p']
    add_bullet_point = h['add_bullet_point']
    add_chapter_heading = h['add_chapter_heading']
    add_section_heading = h['add_section_heading']
    add_subsection_heading = h['add_subsection_heading']

    add_chapter_heading(7, "Conclusion & Future Scope")

    # 7.1 Summary of Work & Key Achievements
    add_section_heading("7.1", "Summary of Work & Key Achievements")
    add_p(
        "This project successfully designed, engineered, benchmarked, and validated AI-FLOW, a production-grade, cloud-native Intelligent "
        "Document and Workflow Automation Platform. Developed using Next.js 16, TypeScript, React 19, and WebAssembly, the platform provides "
        "an end-to-end operational bridge between physical and digital unstructured enterprise documentation. The key technical and practical "
        "achievements realized throughout the project lifecycle include:"
    )
    add_bullet_point(
        "Zero-Cost, Privacy-Preserving Optical Architecture:",
        "Successfully integrated client-side Tesseract WebAssembly optical character recognition and native PDF stream parsing, eliminating "
        "recurring per-page hyperscaler API licensing fees while ensuring complete data sovereignty and regulatory compliance."
    )
    add_bullet_point(
        "Dynamic Layout-Aware Spatial Extraction:",
        "Engineered multi-pass heuristic algorithms capable of resolving dynamic two-column side-by-side vendor-client arrangements and "
        "normalizing conflicting European comma decimal conventions without coordinate drift."
    )
    add_bullet_point(
        "Total Elimination of Synthetic Text & Default Fallbacks:",
        "Enforced an uncompromising enterprise data integrity standard. All early prototype text simulation and mock defaults (e.g., defaulting "
        "missing vendors to 'West Group' or totals to 191.26) were eradicated. Missing entities strictly evaluate to empty strings with 0% "
        "confidence, routing files to Human-in-the-Loop review."
    )
    add_bullet_point(
        "Integrated Deterministic Rules & Autonomous DAG Workflows:",
        "Bridged optical extraction with business execution, incorporating condition-action policy rule evaluation, DAG workflow orchestration, "
        "and simulated financial payment disbursements."
    )
    add_bullet_point(
        "Empirical Benchmark Excellence:",
        "Achieved an average processing latency of 3.2 seconds per document, 99.2% extraction accuracy on commercial invoices, 100% deterministic "
        "rule precision, and a 100% automated test pass rate across 23 Vitest suites."
    )

    # 7.2 Challenges Faced & Lessons Learned (Skill Reflection)
    add_section_heading("7.2", "Challenges Faced & Lessons Learned (Skill Reflection)")
    add_p(
        "The engineering journey of developing an enterprise-grade document automation platform presented substantial algorithmic, "
        "architectural, and systems challenges. Overcoming these hurdles provided profound insights into professional software engineering:"
    )
    add_subsection_heading("7.2.1", "Challenge 1: WebAssembly Initialization Latency & CDN Timeouts")
    add_p(
        "Early implementations of client-side Tesseract.js suffered from premature timeout exceptions in constrained network environments. "
        "A strict 3.5-second timeout frequently terminated optical recognition before the browser could download and compile language model "
        "assets (~15 MB). This was solved by extending the timeout guard to 15 seconds, pre-warming WebAssembly worker threads during modal "
        "display, and implementing graceful fallback error logging."
    )
    add_subsection_heading("7.2.2", "Challenge 2: React Infinite Re-Render Loops in Document Studio")
    add_p(
        "During Document Studio development, an acute bug manifested where `DocumentDetailPage.useEffect` triggered a runtime exception: "
        "'Maximum update depth exceeded'. Investigation revealed that the document auto-healing routine generated dynamic field identifiers "
        "using `Date.now()`, creating distinct object references on every render cycle and triggering endless state updates. The issue was "
        "resolved by making field IDs deterministic (e.g., `f-vendor`, `f-total`), introducing a `healedDocIdRef` guard to restrict healing "
        "to a single execution per document load, and adding conditional guards in `healDocumentItem`."
    )
    add_subsection_heading("7.2.3", "Challenge 3: The Hazard of Synthetic Defaults vs Financial Integrity")
    add_p(
        "A critical conceptual challenge involved recognizing the profound architectural distinction between prototype demonstration "
        "convenience and enterprise financial compliance. Early code synthesized default entities to ensure visual UI cards looked filled. "
        "Conducting red-team audits revealed that fabricating financial transactions is a catastrophic compliance violation. Refactoring "
        "the architecture to strictly enforce blank states, zero confidence, and Human-in-the-Loop escalation reinforced the paramount "
        "importance of data truth in enterprise software design."
    )

    # 7.3 Future Enhancements & Scalability Roadmap
    add_section_heading("7.3", "Future Enhancements & Scalability Roadmap")
    add_p(
        "The modular architecture of AI-FLOW provides a solid foundation for future technological enhancements and enterprise scaling:"
    )
    add_bullet_point(
        "Server-Side Microservice PaddleOCR Integration:",
        "Deploying dedicated containerized PaddleOCR and PyTorch inference workers on internal server clusters to process massive batch "
        "document queues (>1,000 files simultaneously) with sub-second parallel throughput."
    )
    add_bullet_point(
        "Large Language Model (LLM) Zero-Shot Fallback:",
        "Integrating localized, quantized small language models (such as LLaMA 3 8B or Mistral 7B) running on internal hardware to perform "
        "zero-shot semantic extraction on highly irregular, unconstrained legal contracts and multi-lingual medical records."
    )
    add_bullet_point(
        "Native Enterprise ERP & Accounting Connectors:",
        "Engineering bi-directional native connectors for SAP S/4HANA, Oracle Cloud ERP, and Tally Prime, enabling automated three-way matching "
        "between purchase orders, physical receiving logs, and invoice payment vouchers."
    )
    add_bullet_point(
        "Edge Mobile Scanner with Real-Time Perspective Correction:",
        "Extending the capture layer to progressive web application (PWA) mobile clients, incorporating WebGL shader algorithms for real-time "
        "document edge detection, perspective de-skewing, and shadow removal prior to optical recognition."
    )
