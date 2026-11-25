"""
Chapter 8: LEARNING OUTCOME
Sections:
Chapter 8: Learning Outcome
Table 8.1: Curriculum Skill Alignment & Professional Competency Mapping
"""

def write_chapter8(doc, h):
    add_p = h['add_p']
    add_bullet_point = h['add_bullet_point']
    add_chapter_heading = h['add_chapter_heading']
    add_section_heading = h['add_section_heading']
    add_table_custom = h['add_table_custom']

    add_chapter_heading(8, "Learning Outcome")

    add_p(
        "The completion of the AI-FLOW Integrated Skill Project represents a transformative milestone in the academic and professional "
        "development of the student within the Bachelor of Technology in Computer Science and Engineering curriculum at Symbiosis University "
        "of Applied Sciences, Indore. The project bridged theoretical computing concepts with industrial software engineering standards, "
        "fostering profound mastery across five core competency domains:"
    )

    add_section_heading("8.1", "Architectural & Technical Competencies Acquired")
    add_bullet_point(
        "Advanced Full-Stack TypeScript & React Architecture:",
        "Developed deep expertise in Next.js 16 App Router paradigms, server-side rendering (SSR), dynamic route handlers, React 19 concurrent "
        "features, and static TypeScript typing. Learned to manage complex distributed state using React Context, avoiding common anti-patterns "
        "such as infinite re-render loops and non-deterministic object keys."
    )
    add_bullet_point(
        "Applied Computer Vision & WebAssembly (WASM):",
        "Gained practical proficiency in compiling and orchestrating native C/C++ computer vision libraries in browser environments via WebAssembly. "
        "Mastered the complexities of asynchronous worker thread management, memory allocation limits, and language data caching over CDNs."
    )
    add_bullet_point(
        "Complex Spatial Algorithms & Heuristic Engineering:",
        "Engineered robust algorithms for multi-column text tokenization, horizontal alignment grouping, dynamic regular expression pattern matching, "
        "and international currency and decimal normalization across diverse global accounting formats."
    )
    add_bullet_point(
        "Enterprise System Security & Audit Compliance:",
        "Acquired thorough understanding of enterprise data governance, Role-Based Access Control (RBAC), data sovereignty regulations (GDPR, DPDPA), "
        "and the application of SHA-256 cryptographic hashing to establish tamper-evident, non-repudiable audit logs."
    )
    add_bullet_point(
        "Test-Driven Development (TDD) & Quality Assurance:",
        "Mastered professional testing methodologies with Vitest, authoring 23 automated unit and integration test suites validating optical "
        "extraction accuracy, deterministic rule evaluation, payment ledger state machines, and edge-case regression tolerance."
    )

    add_section_heading("8.2", "Professional Skill Alignment Matrix")
    add_p(
        "Table 8.1 maps the specific technical modules and deliverables of the AI-FLOW platform to the institutional skill development "
        "outcomes prescribed by Symbiosis University of Applied Sciences."
    )

    t81_headers = ["Curriculum Skill Domain", "AI-FLOW Technical Implementation", "Practical Tools & Methodologies", "Demonstrated Competency"]
    t81_rows = [
        ["Cloud-Native Web Development", "Next.js 16 App Router, React 19 Context", "TypeScript, Tailwind CSS, Turbopack", "Production-grade scalable web architecture"],
        ["Applied Computer Vision / OCR", "Client WASM Tesseract, PDF text stream", "WebAssembly, Tesseract.js, Emscripten", "Client-side optical text recognition"],
        ["Algorithmic Systems Design", "Layout-aware 2-column spatial parsing", "Regular Expressions, State Machines, DAG", "Complex semi-structured data extraction"],
        ["Enterprise Rule Engines", "Deterministic condition-action evaluator", "JSON Rule Schemas, Typed AST Parsing", "Automated compliance & spend policy checks"],
        ["Information Security & Audit", "SHA-256 fingerprinting, RBAC guards", "Web Crypto API, Immutable Audit Trail", "Zero-trust enterprise security compliance"],
        ["Automated Software Testing", "23 automated unit & integration suites", "Vitest Runner, CI Automated Builds", "Test-driven development & regression control"],
    ]
    t81_widths = [1.4, 1.6, 1.4, 1.4]
    add_table_custom("8.1", "Curriculum Skill Alignment & Professional Competency Mapping", t81_headers, t81_rows, t81_widths)

    add_p(
        "In conclusion, the engineering of the AI-FLOW platform has cultivated the analytical rigor, technical depth, and architectural "
        "discipline required to design, deliver, and maintain enterprise-grade software systems in the global technology sector."
    )
