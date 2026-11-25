"""
Chapter 5: METHODOLOGY & IMPLEMENTATION
Sections:
5.1 Development Methodology
5.2 Module-Wise Implementation Details
5.3 Core Algorithms, Logic, or Workflow Integration
5.4 Key Code Snippets & API / Hardware Integration Highlights
"""

from docx.enum.text import WD_ALIGN_PARAGRAPH

def write_chapter5(doc, h):
    add_p = h['add_p']
    add_bullet_point = h['add_bullet_point']
    add_chapter_heading = h['add_chapter_heading']
    add_section_heading = h['add_section_heading']
    add_subsection_heading = h['add_subsection_heading']
    add_table_custom = h['add_table_custom']
    add_figure_box = h['add_figure_box']
    add_code_snippet = h['add_code_snippet']

    add_chapter_heading(5, "Methodology & Implementation")

    # 5.1 Development Methodology
    add_section_heading("5.1", "Development Methodology")
    add_p(
        "To balance rapid architectural prototyping with rigorous enterprise quality assurance, AI-FLOW was developed utilizing a "
        "Hybrid Agile-Spiral Lifecycle Model. The development lifecycle combined the iterative, milestone-driven velocity of Agile Scrum "
        "with the systematic risk assessment and verification loops of the Spiral model. The project was executed across four intensive "
        "two-week sprints, depicted in Figure 5.1."
    )
    add_bullet_point(
        "Sprint 1 — Architectural Core & Secure Ingestion:",
        "Designed Next.js 16 App Router foundation, Web Crypto SHA-256 fingerprinting, drag-and-drop file ingestion, and initial TypeScript schemas."
    )
    add_bullet_point(
        "Sprint 2 — Multi-Engine Optical OCR & Spatial Heuristics:",
        "Integrated client Tesseract.js WebAssembly, extended timeout to 15 seconds, and engineered dynamic two-column vendor/client parsing."
    )
    add_bullet_point(
        "Sprint 3 — Elimination of Mock Fallbacks & HITL Document Studio:",
        "Completely eliminated mock text synthesis and default values; enforced blank assignments for missing fields; built dual-pane studio."
    )
    add_bullet_point(
        "Sprint 4 — Deterministic Rule Engine, Workflows & Automated Testing:",
        "Implemented condition-action rule evaluator, DAG workflow scheduler, multilingual translator, and authored 23 automated Vitest unit tests."
    )

    # Figure 5.1
    f51_lines = [
        "  +-------------------------------------------------------------------------+",
        "  |          HYBRID AGILE-SPIRAL ITERATIVE ENGINEERING LIFECYCLE MODEL      |",
        "  |                                                                         |",
        "  |   [ Sprint 1: Foundation ] ---> [ Risk Analysis: WASM vs Cloud APIs ]   |",
        "  |              |                                     |                    |",
        "  |              v                                     v                    |",
        "  |   [ Sprint 2: Optical OCR] ---> [ Empirical Layout Calibration ]        |",
        "  |              |                  (Two-column & European decimals)        |",
        "  |              v                                     |                    |",
        "  |   [ Sprint 3: Zero-Mock  ] ---> [ HITL Validation Studio Testing ]      |",
        "  |   (Strict Blank Entities)       (Elimination of default assignments)    |",
        "  |              |                                     |                    |",
        "  |              v                                     v                    |",
        "  |   [ Sprint 4: Rules & DAG] ---> [ Automated CI Testing: 23/23 Vitest ]  |",
        "  |   (Production Finalization)     (Next.js Production Build --webpack)    |",
        "  +-------------------------------------------------------------------------+"
    ]
    add_figure_box("5.1", "Hybrid Agile-Spiral Iterative Development Lifecycle Model", f51_lines)

    # 5.2 Module-Wise Implementation Details
    add_section_heading("5.2", "Module-Wise Implementation Details")
    add_p(
        "The codebase of AI-FLOW is organized into eight highly cohesive, loosely coupled functional modules, each residing in "
        "dedicated architectural directories. Table 5.1 details the functional responsibilities and file mappings."
    )

    t51_headers = ["Module Name", "Primary Source Files", "Key Exported Entities", "Core Responsibility"]
    t51_rows = [
        ["Ingestion & Capture", "components/documents/document-upload-modal.tsx", "DocumentUploadModal, processPipeline", "File drag/drop, camera snapshot, SHA-256 hash"],
        ["Optical Recognition", "components/documents/document-upload-modal.tsx", "Tesseract.recognize(file, 'eng')", "Client WASM OCR execution with 15s timeout window"],
        ["Document Processor", "lib/ai/document-processor.ts", "processDocumentContentSync", "Taxonomy classification, spatial regex, entity extraction"],
        ["Rule Evaluator", "lib/rules/rule-evaluator.ts", "evaluateDocumentRules, evaluateCondition", "Deterministic policy checking against spend/vendor rules"],
        ["Workflow Engine", "lib/workflows/workflow-generator.ts", "generateWorkflowForDocument, executeDAG", "DAG step scheduling, approvals, webhook dispatch"],
        ["Document Studio", "app/documents/[id]/page.tsx", "DocumentDetailPage, handleSaveEdit", "Split-screen canvas, in-place edit, confidence badges"],
        ["Multilingual Briefs", "lib/ai/translator.ts", "generateDocumentSummary, translateSummary", "4-5 line natural language briefing in 6 languages"],
        ["State & Persistence", "lib/store/app-context.tsx", "AppProvider, useApp, healDocumentItem", "Global React state, audit logging, auto-healing"],
    ]
    t51_widths = [1.2, 1.8, 1.4, 1.5]
    add_table_custom("5.1", "Module-Wise Functional Responsibility & Architecture Matrix", t51_headers, t51_rows, t51_widths)

    add_subsection_heading("5.2.1", "Elimination of Synthetic Text Simulation & Fallback Defaults")
    add_p(
        "A critical engineering milestone in the development of AI-FLOW was the total elimination of synthetic OCR text simulation and "
        "hardcoded entity fallbacks. In early prototype builds, `lib/ai/document-processor.ts` incorporated fallback blocks where, if `!text` "
        "occurred, the system injected synthetic strings (e.g., `text = 'TAX INVOICE...'`). Furthermore, if individual entities were missing "
        "from the OCR text, code routines defaulted to hardcoded placeholders (e.g., `seller = fbSeller ? fbSeller[0] : 'West Group'`, "
        "`if (!total) total = 191.26`, `if (!subtotal) subtotal = 173.87`, `invoiceNumber = ... || 'INV-74980573'`)."
    )
    add_p(
        "In production enterprise systems, defaulting missing entities is an unacceptable anti-pattern: it fabricates financial commitments, "
        "obscures optical recognition failures, and deceives human reviewers. We completely refactored the processor so that: (1) if OCR fails "
        "to extract text, `rawOcrText` remains strictly empty (\"\"); (2) if an entity is omitted from the scan, `extractedValue` evaluates "
        "strictly to `\"\"` with a confidence of `0.0`; and (3) missing critical entities (Vendor, Invoice Number, Total) automatically trip "
        "the `hasCriticalMissing` flag, dropping overall confidence and routing the document status to `REVIEW_REQUIRED` for human intervention."
    )

    # 5.3 Core Algorithms, Logic, or Workflow Integration
    add_section_heading("5.3", "Core Algorithms, Logic, or Workflow Integration")
    add_p(
        "The cognitive intelligence of AI-FLOW relies upon four formal algorithms governing confidence calculation, spatial entity extraction, "
        "deterministic rule evaluation, and workflow scheduling."
    )

    add_subsection_heading("5.3.1", "Algorithm 1: Composite Confidence Calculation & HITL Routing")
    add_p(
        "The overall confidence score of a processed document, $C_{comp}$, is mathematically formulated as a weighted convex combination "
        "of the classification confidence $C_{class}$ and the mean confidence of all extracted schema fields $\\bar{C}_{field}$:"
    )
    add_p(
        "$$\\bar{C}_{field} = \\frac{1}{N} \\sum_{i=1}^{N} c_i, \\quad \\text{where } c_i \\in [0.0, 1.0]$$",
        align=WD_ALIGN_PARAGRAPH.CENTER
    )
    add_p(
        "$$C_{comp} = 0.30 \\cdot C_{class} + 0.70 \\cdot \\bar{C}_{field}$$",
        align=WD_ALIGN_PARAGRAPH.CENTER
    )
    add_p(
        "If any field $i$ is missing from the optical text, its confidence is explicitly set to $c_i = 0.0$, penalizing $\\bar{C}_{field}$. "
        "The document status routing function $S(doc)$ is governed by:"
    )
    add_p(
        "$$S(doc) = \\begin{cases} \\text{REVIEW\\_REQUIRED}, & \\text{if } \\exists \\, k \\in \\text{CriticalFields} \\text{ such that } v_k = \"\" \\\\ \\text{REVIEW\\_REQUIRED}, & \\text{if } C_{comp} < 0.75 \\\\ \\text{READY}, & \\text{if } C_{comp} \\ge 0.85 \\text{ and } \\forall k \\in \\text{CriticalFields}, v_k \\ne \"\" \\end{cases}$$",
        align=WD_ALIGN_PARAGRAPH.CENTER
    )

    add_subsection_heading("5.3.2", "Algorithm 2: Dynamic Two-Column Layout-Aware Spatial Entity Extraction")
    add_p(
        "When processing commercial invoices with side-by-side vendor and client headers, standard regex fails because horizontal lines "
        "mix vendor and client tokens. Algorithm 2 scans line tuples, detects multi-column header anchors (`Seller: Client:`), splits the "
        "following line by whitespace intervals exceeding two spaces (`\\s{2,}|\\t`), and correctly attributes tokens to `seller` and `client`."
    )

    # Figure 5.2
    f52_lines = [
        "  RAW INVOICE TEXT LINE: 'Seller:                             Client:'",
        "                         |                                   |",
        "                         v                                   v",
        "  SUBSEQUENT LINE:       'West Group                         Zimmerman and Sons'",
        "                         +------------+                      +------------------+",
        "  REGEX PARSER:          | Token Part 1 (Seller) | \\s{2,}|\\t | Token Part 2 (Client)  |",
        "                         +-----------------------+-----------+--------------------+",
        "                                    |                                  |",
        "                                    v                                  v",
        "                         seller = 'West Group'               client = 'Zimmerman and Sons'",
        "                         conf = 0.99                         conf = 0.98"
    ]
    add_figure_box("5.2", "Multi-Pass Heuristic Spatial Regex Matching Pipeline", f52_lines)

    add_subsection_heading("5.3.3", "Algorithm 3: European Comma & Anglo-American Number Parsing")
    add_p(
        "The numerical parsing engine normalizes currency amounts across global conventions. If a cleaned numeric string terminates "
        "with a comma followed by two digits (`/[,]\\d{2}$/`), commas are normalized to dots and existing dots are stripped. If it contains "
        "a comma without a dot and terminates with three digits (`/[,]\\d{3}$/`), the comma is recognized as a thousands separator and stripped."
    )

    # 5.4 Key Code Snippets & API / Hardware Integration Highlights
    add_section_heading("5.4", "Key Code Snippets & API / Hardware Integration Highlights")
    add_p(
        "Below are production TypeScript implementations demonstrating core architectural mechanisms:"
    )

    add_subsection_heading("5.4.1", "Tesseract WASM Client Optical Execution with 15s Guard")
    add_code_snippet("""
// components/documents/document-upload-modal.tsx
} else if (file.type.startsWith("image/")) {
  try {
    const { recognize } = await import("tesseract.js");
    // Allow up to 15s for client-side WASM OCR and language model caching
    const ocrPromise = recognize(file, "eng");
    const timeoutPromise = new Promise<{ data?: { text?: string } }>((_, reject) =>
      setTimeout(() => reject(new Error("OCR timeout")), 15000)
    );
    const ocrData = await Promise.race([ocrPromise, timeoutPromise]);
    if (ocrData?.data?.text && ocrData.data.text.trim().length > 0) {
      extractedText = ocrData.data.text;
    }
  } catch (ocrErr) {
    console.warn("Client optical OCR notice:", ocrErr);
  }
}
""")

    add_subsection_heading("5.4.2", "Strict Blank Missing Entity & HITL Routing Implementation")
    add_code_snippet("""
// lib/ai/document-processor.ts
extractedFields.push(
  {
    id: `f-1`,
    documentId: docId,
    fieldName: "vendor",
    fieldLabel: "Vendor Name",
    extractedValue: seller, // Strictly "" if unextracted
    dataType: "string",
    confidence: seller ? 0.99 : 0.0,
    sourceBbox: seller ? { page: 1, x: 0.1, y: 0.08, w: 0.5, h: 0.04 } : undefined,
  },
  {
    id: `f-2`,
    documentId: docId,
    fieldName: "invoice_number",
    fieldLabel: "Invoice Number",
    extractedValue: invoiceNumber, // Strictly "" if unextracted
    dataType: "string",
    confidence: invoiceNumber ? 0.995 : 0.0,
  },
  {
    id: `f-7`,
    documentId: docId,
    fieldName: "total",
    fieldLabel: "Total Amount",
    extractedValue: total > 0 ? String(total) : "", // Strictly "" if 0
    dataType: "currency",
    confidence: total > 0 ? 0.984 : 0.0,
  }
);

// Confidence & Completeness Routing Rules
const hasCriticalMissing =
  detectedType === "Invoice"
    ? !extractedFields.find((f) => f.fieldName === "vendor")?.extractedValue ||
      !extractedFields.find((f) => f.fieldName === "total")?.extractedValue ||
      !extractedFields.find((f) => f.fieldName === "invoice_number")?.extractedValue
    : avgFieldConf < 0.6;

let suggestedStatus: DocumentStatus = "READY";
if (hasCriticalMissing || compositeConfidence < 0.75) {
  suggestedStatus = "REVIEW_REQUIRED"; // Automated STP bypass -> human verification
}
""")

    add_subsection_heading("5.4.3", "Document Studio UI In-Place Field Correction & Missing Badge")
    add_code_snippet("""
// app/documents/[id]/page.tsx
<div className="text-xs font-bold text-slate-900 dark:text-white truncate mt-0.5">
  {field.extractedValue ? (
    field.dataType === "currency"
      ? formatCurrency(field.extractedValue, documentCurrency)
      : field.extractedValue
  ) : (
    <span className="text-amber-600 dark:text-amber-400 font-normal italic text-[11px]">
      — (Missing / Click pencil to edit)
    </span>
  )}
</div>

{/* Confidence Badge */}
<span className={`text-[10px] font-bold tabular-nums font-mono ${
  percentage === 0 ? "text-red-500" : isHigh ? "text-emerald-600" : "text-amber-600"
}`}>
  {percentage === 0 ? "Missing (0%)" : `${percentage}%`}
</span>
""")
