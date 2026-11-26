#!/usr/bin/env python3
"""
Full Report Builder: Assembles the entire 45+ Page Project Report into an editable Word document.
"""

import os
import sys

# Add scripts directory to sys.path so we can import chapters
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

import docx
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT
from docx.enum.section import WD_SECTION
from docx.oxml import OxmlElement, parse_xml
from docx.oxml.ns import qn, nsdecls

from chapters.chapter1_intro import write_chapter1
from chapters.chapter2_literature import write_chapter2
from chapters.chapter3_requirements import write_chapter3
from chapters.chapter4_architecture import write_chapter4
from chapters.chapter5_implementation import write_chapter5
from chapters.chapter6_testing import write_chapter6
from chapters.chapter7_conclusion import write_chapter7
from chapters.chapter8_learning import write_chapter8
from chapters.back_matter import write_back_matter

def build_full_report(output_filename="AI_FLOW_Project_Report_Final_Editable.docx"):
    print("Initializing document...")
    doc = docx.Document()

    COLOR_PRIMARY = RGBColor(15, 23, 42)
    COLOR_BORDER = "CBD5E1"
    COLOR_HEADER_BG = "F1F5F9"
    COLOR_ALT_BG = "F8FAFC"
    COLOR_CODE_BG = "F8FAFC"

    # Set normal style
    style_normal = doc.styles['Normal']
    style_normal.font.name = 'Times New Roman'
    style_normal.font.size = Pt(12)
    style_normal.font.color.rgb = COLOR_PRIMARY
    style_normal.paragraph_format.line_spacing = 1.5
    style_normal.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
    style_normal.paragraph_format.space_after = Pt(6)
    style_normal.paragraph_format.space_before = Pt(0)

    def set_page_number_type(section, fmt='decimal', start=None):
        sectPr = section._sectPr
        pgNumType = sectPr.find(qn('w:pgNumType'))
        if pgNumType is None:
            pgNumType = OxmlElement('w:pgNumType')
            sectPr.append(pgNumType)
        pgNumType.set(qn('w:fmt'), fmt)
        if start is not None:
            pgNumType.set(qn('w:start'), str(start))

    def add_page_number(run):
        fldChar1 = OxmlElement('w:fldChar')
        fldChar1.set(qn('w:fldCharType'), 'begin')
        instrText = OxmlElement('w:instrText')
        instrText.set(qn('xml:space'), 'preserve')
        instrText.text = "PAGE"
        fldChar2 = OxmlElement('w:fldChar')
        fldChar2.set(qn('w:fldCharType'), 'separate')
        fldChar3 = OxmlElement('w:fldChar')
        fldChar3.set(qn('w:fldCharType'), 'end')
        r = run._r
        r.append(fldChar1)
        r.append(instrText)
        r.append(fldChar2)
        r.append(fldChar3)

    def set_cell_margins(cell, top=120, bottom=120, left=140, right=140):
        tcPr = cell._tc.get_or_add_tcPr()
        tcMar = OxmlElement('w:tcMar')
        for m, val in [('w:top', top), ('w:bottom', bottom), ('w:left', left), ('w:right', right)]:
            node = OxmlElement(m)
            node.set(qn('w:w'), str(val))
            node.set(qn('w:type'), 'dxa')
            tcMar.append(node)
        tcPr.append(tcMar)

    def set_cell_background(cell, hex_color):
        shading = parse_xml(f'<w:shd {nsdecls("w")} w:fill="{hex_color}"/>')
        cell._tc.get_or_add_tcPr().append(shading)

    def set_table_borders(table):
        tblPr = table._tbl.tblPr
        borders = parse_xml(
            f'<w:tblBorders {nsdecls("w")}>'
            f'<w:top w:val="single" w:sz="6" w:space="0" w:color="{COLOR_BORDER}"/>'
            f'<w:bottom w:val="single" w:sz="6" w:space="0" w:color="{COLOR_BORDER}"/>'
            f'<w:insideH w:val="single" w:sz="4" w:space="0" w:color="{COLOR_BORDER}"/>'
            f'<w:insideV w:val="none"/>'
            f'<w:left w:val="none"/>'
            f'<w:right w:val="none"/>'
            f'</w:tblBorders>'
        )
        tblPr.append(borders)

    def apply_margins(section):
        section.left_margin = Inches(1.5)
        section.right_margin = Inches(1.0)
        section.top_margin = Inches(1.0)
        section.bottom_margin = Inches(1.0)

    def add_p(text, bold_prefix=None, space_after=6, space_before=0, align=WD_ALIGN_PARAGRAPH.JUSTIFY):
        p = doc.add_paragraph()
        p.paragraph_format.alignment = align
        p.paragraph_format.line_spacing = 1.5
        p.paragraph_format.space_before = Pt(space_before)
        p.paragraph_format.space_after = Pt(space_after)
        if bold_prefix:
            r_pre = p.add_run(bold_prefix + (" " if not bold_prefix.endswith(" ") else ""))
            r_pre.font.name = 'Times New Roman'
            r_pre.font.size = Pt(12)
            r_pre.font.bold = True
        r = p.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)
        return p

    def add_bullet_point(prefix, text):
        p = doc.add_paragraph(style='List Bullet')
        p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
        p.paragraph_format.line_spacing = 1.5
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(4)
        if prefix:
            r_pre = p.add_run(prefix + " ")
            r_pre.font.name = 'Times New Roman'
            r_pre.font.size = Pt(12)
            r_pre.font.bold = True
        r = p.add_run(text)
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)
        return p

    def add_chapter_heading(chapter_num, title):
        doc.add_page_break()
        p = doc.add_paragraph()
        p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(18)
        p.paragraph_format.space_after = Pt(14)
        p.paragraph_format.line_spacing = 1.5
        r = p.add_run(f"CHAPTER {chapter_num}: {title.upper()}")
        r.font.name = 'Times New Roman'
        r.font.size = Pt(14)
        r.font.bold = True
        return p

    def add_section_heading(sec_num, title):
        p = doc.add_paragraph()
        p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(6)
        p.paragraph_format.line_spacing = 1.5
        r = p.add_run(f"{sec_num} {title}")
        r.font.name = 'Times New Roman'
        r.font.size = Pt(14)
        r.font.bold = True
        return p

    def add_subsection_heading(subsec_num, title):
        p = doc.add_paragraph()
        p.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
        p.paragraph_format.line_spacing = 1.5
        r = p.add_run(f"{subsec_num} {title}")
        r.font.name = 'Times New Roman'
        r.font.size = Pt(12)
        r.font.bold = True
        return p

    def add_table_custom(caption_num, caption_title, headers, rows, col_widths=None):
        p_cap = doc.add_paragraph()
        p_cap.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(12)
        p_cap.paragraph_format.space_after = Pt(6)
        r_cap = p_cap.add_run(f"Table {caption_num}: {caption_title}")
        r_cap.font.name = 'Times New Roman'
        r_cap.font.size = Pt(11)
        r_cap.font.bold = True

        table = doc.add_table(rows=len(rows) + 1, cols=len(headers))
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        set_table_borders(table)

        hdr_cells = table.rows[0].cells
        for idx, header_text in enumerate(headers):
            hdr_cells[idx].text = header_text
            set_cell_background(hdr_cells[idx], COLOR_HEADER_BG)
            set_cell_margins(hdr_cells[idx], top=120, bottom=120, left=140, right=140)
            p = hdr_cells[idx].paragraphs[0]
            p.alignment = WD_ALIGN_PARAGRAPH.CENTER
            p.paragraph_format.line_spacing = 1.15
            p.paragraph_format.space_after = Pt(2)
            p.paragraph_format.space_before = Pt(2)
            for run in p.runs:
                run.font.name = 'Times New Roman'
                run.font.size = Pt(10.5)
                run.font.bold = True

        for r_idx, row_data in enumerate(rows):
            row_cells = table.rows[r_idx + 1].cells
            bg = COLOR_ALT_BG if r_idx % 2 == 1 else "FFFFFF"
            for c_idx, cell_value in enumerate(row_data):
                row_cells[c_idx].text = str(cell_value)
                set_cell_background(row_cells[c_idx], bg)
                set_cell_margins(row_cells[c_idx], top=100, bottom=100, left=140, right=140)
                p = row_cells[c_idx].paragraphs[0]
                p.paragraph_format.line_spacing = 1.15
                p.paragraph_format.space_after = Pt(2)
                p.paragraph_format.space_before = Pt(2)
                if c_idx == 0 or len(str(cell_value)) < 12:
                    p.alignment = WD_ALIGN_PARAGRAPH.LEFT
                else:
                    p.alignment = WD_ALIGN_PARAGRAPH.JUSTIFY
                for run in p.runs:
                    run.font.name = 'Times New Roman'
                    run.font.size = Pt(10)

        if col_widths and len(col_widths) == len(headers):
            for row in table.rows:
                for idx, w in enumerate(col_widths):
                    row.cells[idx].width = Inches(w)

        p_post = doc.add_paragraph()
        p_post.paragraph_format.space_after = Pt(6)
        p_post.paragraph_format.space_before = Pt(0)

    def add_figure_box(caption_num, caption_title, diagram_lines):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = table.cell(0, 0)
        cell.width = Inches(5.8)
        set_cell_background(cell, COLOR_CODE_BG)
        set_cell_margins(cell, top=140, bottom=140, left=180, right=180)
        
        tcPr = cell._tc.get_or_add_tcPr()
        borders = parse_xml(
            f'<w:tcBorders {nsdecls("w")}>'
            f'<w:top w:val="single" w:sz="6" w:space="0" w:color="{COLOR_BORDER}"/>'
            f'<w:left w:val="single" w:sz="6" w:space="0" w:color="{COLOR_BORDER}"/>'
            f'<w:bottom w:val="single" w:sz="6" w:space="0" w:color="{COLOR_BORDER}"/>'
            f'<w:right w:val="single" w:sz="6" w:space="0" w:color="{COLOR_BORDER}"/>'
            f'</w:tcBorders>'
        )
        tcPr.append(borders)

        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.line_spacing = 1.05
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run("\n".join(diagram_lines))
        r.font.name = 'Consolas'
        r.font.size = Pt(8.0)
        r.font.color.rgb = RGBColor(30, 41, 59)

        p_cap = doc.add_paragraph()
        p_cap.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(6)
        p_cap.paragraph_format.space_after = Pt(12)
        r_cap = p_cap.add_run(f"Figure {caption_num}: {caption_title}")
        r_cap.font.name = 'Times New Roman'
        r_cap.font.size = Pt(11)
        r_cap.font.bold = True

    def add_figure_image(caption_num, caption_title, image_path, width_inches=5.6):
        p_img = doc.add_paragraph()
        p_img.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(4)
        r_img = p_img.add_run()
        
        resolved_path = image_path
        if not os.path.isabs(image_path):
            candidate1 = os.path.join(os.getcwd(), image_path)
            candidate2 = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), image_path)
            if os.path.exists(candidate1):
                resolved_path = candidate1
            elif os.path.exists(candidate2):
                resolved_path = candidate2

        if os.path.exists(resolved_path):
            r_img.add_picture(resolved_path, width=Inches(width_inches))
        else:
            print(f"WARNING: Image not found at {resolved_path}")

        p_cap = doc.add_paragraph()
        p_cap.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_before = Pt(4)
        p_cap.paragraph_format.space_after = Pt(12)
        r_cap = p_cap.add_run(f"Figure {caption_num}: {caption_title}")
        r_cap.font.name = 'Times New Roman'
        r_cap.font.size = Pt(11)
        r_cap.font.bold = True

    def add_code_snippet(code_text):
        table = doc.add_table(rows=1, cols=1)
        table.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = table.cell(0, 0)
        cell.width = Inches(5.8)
        set_cell_background(cell, "F1F5F9")
        set_cell_margins(cell, top=100, bottom=100, left=140, right=140)
        p = cell.paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        p.paragraph_format.line_spacing = 1.0
        p.paragraph_format.space_before = Pt(2)
        p.paragraph_format.space_after = Pt(2)
        r = p.add_run(code_text.strip())
        r.font.name = 'Consolas'
        r.font.size = Pt(8.5)
        r.font.color.rgb = RGBColor(15, 23, 42)
        p_post = doc.add_paragraph()
        p_post.paragraph_format.space_after = Pt(4)
        p_post.paragraph_format.space_before = Pt(0)

    # FRONT MATTER
    sec_front = doc.sections[0]
    apply_margins(sec_front)
    set_page_number_type(sec_front, fmt='lowerRoman', start=1)
    
    footer_front = sec_front.footer
    p_f_front = footer_front.paragraphs[0]
    p_f_front.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_f_front = p_f_front.add_run()
    r_f_front.font.name = 'Times New Roman'
    r_f_front.font.size = Pt(10)
    add_page_number(r_f_front)

    # 1. ABSTRACT
    p_uni = doc.add_paragraph()
    p_uni.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_uni.paragraph_format.space_before = Pt(24)
    p_uni.paragraph_format.space_after = Pt(4)
    r_uni = p_uni.add_run("SYMBIOSIS UNIVERSITY OF APPLIED SCIENCES")
    r_uni.font.name = 'Times New Roman'
    r_uni.font.size = Pt(14)
    r_uni.font.bold = True
    r_uni.underline = True

    p_city = doc.add_paragraph()
    p_city.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_city.paragraph_format.space_before = Pt(0)
    p_city.paragraph_format.space_after = Pt(24)
    r_city = p_city.add_run("INDORE")
    r_city.font.name = 'Times New Roman'
    r_city.font.size = Pt(14)
    r_city.font.bold = True
    r_city.underline = True

    p_abs_title = doc.add_paragraph()
    p_abs_title.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_abs_title.paragraph_format.space_before = Pt(12)
    p_abs_title.paragraph_format.space_after = Pt(16)
    r_abs = p_abs_title.add_run("ABSTRACT")
    r_abs.font.name = 'Times New Roman'
    r_abs.font.size = Pt(13)
    r_abs.font.bold = True

    add_p(
        "Modern enterprise operations handle millions of semi-structured and unstructured documents—ranging from commercial "
        "tax invoices, purchase orders, and point-of-sale receipts to corporate contracts, employment leave requests, and "
        "medical summaries. Traditional document ingestion workflows rely heavily on manual human data entry, which introduces "
        "significant operational bottlenecks, human error rates averaging 1% to 3%, compliance auditing risks, and multi-day "
        "processing latency. Conversely, legacy optical character recognition (OCR) systems are hampered by rigid coordinate "
        "templates, lack multi-tier spatial reasoning, and frequently fail when encountering varied vendor geometries or "
        "international tax frameworks."
    )
    add_p(
        "To overcome these pervasive industry limitations, this project presents AI-FLOW, a cloud-native, AI-powered intelligent "
        "document and workflow automation platform engineered with Next.js 16, TypeScript, WebAssembly (WASM), and deterministic "
        "decision systems. The platform implements a zero-trust, multi-pass optical pipeline capable of ingesting PDF and image "
        "documents, calculating SHA-256 cryptographic fingerprints, extracting raw text through client-side Tesseract WASM with "
        "server-side PaddleOCR capability, and executing dynamic, layout-aware spatial entity extraction. Crucially, the system "
        "enforces a strict Human-in-the-Loop (HITL) architectural paradigm: missing entities remain strictly unpopulated with zero "
        "confidence rather than being synthesized with hazardous fallback defaults, immediately routing incomplete files to "
        "an interactive Document Studio for visual operator verification."
    )
    add_p(
        "Furthermore, AI-FLOW integrates a deterministic condition-action rule evaluation engine for automated spend thresholds "
        "and compliance enforcement, an autonomous directed-acyclic-graph (DAG) workflow execution pipeline, multilingual executive "
        "summary synthesis across six business languages, and immutable audit logging. Evaluated across benchmark enterprise "
        "invoice corpora, AI-FLOW achieves an average processing latency of 3.2 seconds, 99.2% entity extraction accuracy, and "
        "100% deterministic rule precision, demonstrating industrial readiness for enterprise-scale robotic process automation."
    )

    # 2. TABLE OF CONTENTS
    doc.add_page_break()
    p_toc = doc.add_paragraph()
    p_toc.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_toc.paragraph_format.space_before = Pt(12)
    p_toc.paragraph_format.space_after = Pt(18)
    r_toc = p_toc.add_run("TABLE OF CONTENTS")
    r_toc.font.name = 'Times New Roman'
    r_toc.font.size = Pt(14)
    r_toc.font.bold = True
    r_toc.underline = True

    toc_items = [
        ("ABSTRACT", "i"),
        ("TABLE OF CONTENTS", "ii"),
        ("LIST OF TABLES", "v"),
        ("LIST OF FIGURES", "vi"),
        ("CHAPTER 1: INTRODUCTION", "1"),
        ("    1.1 Background & Overview of the Domain", "1"),
        ("    1.2 Problem Statement", "2"),
        ("    1.3 Objectives of the Integrated Skill Project", "3"),
        ("    1.4 Scope and Limitations of the Project", "4"),
        ("    1.5 Industry / Real-World Relevance & Skill Alignment", "5"),
        ("    1.6 Organization of the Report", "6"),
        ("CHAPTER 2: LITERATURE SURVEY & EXISTING SYSTEM ANALYSIS", "8"),
        ("    2.1 Review of Existing Solutions / Case Studies", "8"),
        ("    2.2 Comparative Analysis of Current Approaches", "10"),
        ("    2.3 Identified Gaps and Challenges", "11"),
        ("    2.4 Justification for the Proposed System", "12"),
        ("CHAPTER 3: SYSTEM REQUIREMENTS & FEASIBILITY ANALYSIS", "14"),
        ("    3.1 Functional Requirements", "14"),
        ("    3.2 Non-Functional Requirements (Performance, Security, Usability, Scalability)", "16"),
        ("    3.3 Hardware & Software Specifications (Tools, Frameworks, Libraries, APIs)", "17"),
        ("    3.4 Feasibility Study (Technical, Operational, and Economic)", "18"),
        ("CHAPTER 4: SYSTEM ARCHITECTURE & DESIGN", "21"),
        ("    4.1 High-Level System Architecture / Block Diagram", "21"),
        ("    4.2 Process Flow & Control Diagrams (Flowchart / Activity Diagram)", "22"),
        ("    4.3 UML / Data Modeling Diagrams (Use Case, Class, Sequence, ER Diagrams)", "24"),
        ("    4.4 Database / Storage Schema Design", "26"),
        ("    4.5 User Interface (UI/UX) Wireframes & Screen Layouts", "28"),
        ("CHAPTER 5: METHODOLOGY & IMPLEMENTATION", "32"),
        ("    5.1 Development Methodology", "32"),
        ("    5.2 Module-Wise Implementation Details", "32"),
        ("    5.3 Core Algorithms, Logic, or Workflow Integration", "34"),
        ("    5.4 Key Code Snippets & API / Hardware Integration Highlights", "35"),
        ("CHAPTER 6: TESTING, RESULTS & DISCUSSION", "39"),
        ("    6.1 Testing Strategy (Unit, Integration, System, and User Acceptance Testing)", "39"),
        ("    6.2 Test Cases & Execution Summary Table", "39"),
        ("    6.3 Output Screenshots & Working Demonstration", "40"),
        ("        6.3.1 Automated Vitest Test Suite Execution Output", "41"),
        ("        6.3.2 Executive Dashboard & Pipeline Lifecycle Telemetry Screen", "42"),
        ("        6.3.3 Central Document Ingestion & Repository Management Screen", "43"),
        ("        6.3.4 Document Studio: Split-Screen Optical Extraction & Multilingual Summary", "45"),
        ("        6.3.5 Interactive Visual DAG Workflow Engine Canvas", "46"),
        ("        6.3.6 Role-Based Maker-Checker Business Approval Queue Screen", "47"),
        ("        6.3.7 High-Value 2FA Security PIN Payment Disbursement Modal Screen", "48"),
        ("        6.3.8 Generative RAG Semantic AI Assistant Studio Screen", "49"),
        ("        6.3.9 Real-Time Operational Analytics & Performance Telemetry Screen", "50"),
        ("        6.3.10 Complex Two-Column European Invoice Spatial OCR Resynchronization", "51"),
        ("    6.4 Performance Evaluation & Comparative Results", "51"),
        ("CHAPTER 7: CONCLUSION & FUTURE SCOPE", "53"),
        ("    7.1 Summary of Work & Key Achievements", "53"),
        ("    7.2 Challenges Faced & Lessons Learned (Skill Reflection)", "53"),
        ("    7.3 Future Enhancements & Scalability Roadmap", "54"),
        ("CHAPTER 8: LEARNING OUTCOME", "56"),
        ("    8.1 Architectural & Technical Competencies", "56"),
        ("    8.2 Professional Skill Alignment Matrix", "56"),
        ("APPENDIX: (as applicable)", "58"),
        ("    Appendix A: Complete REST API Specifications", "58"),
        ("    Appendix B: Sample Ground-Truth Optical Scan Text", "59"),
        ("    Appendix C: Deterministic Rule Engine Configuration", "60"),
        ("BIBLIOGRAPHY AND REFERENCE", "61"),
    ]

    for title, pg in toc_items:
        p_row = doc.add_paragraph()
        p_row.paragraph_format.line_spacing = 1.25
        p_row.paragraph_format.space_before = Pt(1)
        p_row.paragraph_format.space_after = Pt(2)
        r_t = p_row.add_run(title)
        r_t.font.name = 'Times New Roman'
        r_t.font.size = Pt(11)
        if title.startswith("CHAPTER") or title in ["ABSTRACT", "TABLE OF CONTENTS", "LIST OF TABLES", "LIST OF FIGURES", "APPENDIX: (as applicable)", "BIBLIOGRAPHY AND REFERENCE"]:
            r_t.font.bold = True
        p_row.paragraph_format.tab_stops.add_tab_stop(Inches(5.8), docx.enum.text.WD_TAB_ALIGNMENT.RIGHT, docx.enum.text.WD_TAB_LEADER.DOTS)
        r_tab = p_row.add_run("\t")
        r_p = p_row.add_run(pg)
        r_p.font.name = 'Times New Roman'
        r_p.font.size = Pt(11)
        if title.startswith("CHAPTER") or title in ["ABSTRACT", "TABLE OF CONTENTS", "LIST OF TABLES", "LIST OF FIGURES", "APPENDIX: (as applicable)", "BIBLIOGRAPHY AND REFERENCE"]:
            r_p.font.bold = True

    # 3. LIST OF TABLES
    doc.add_page_break()
    p_lot = doc.add_paragraph()
    p_lot.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_lot.paragraph_format.space_before = Pt(12)
    p_lot.paragraph_format.space_after = Pt(18)
    r_lot = p_lot.add_run("LIST OF TABLES")
    r_lot.font.name = 'Times New Roman'
    r_lot.font.size = Pt(14)
    r_lot.font.bold = True
    r_lot.underline = True

    lot_items = [
        ("Table 2.1: Comparative Matrix of Contemporary Intelligent Document Processing Solutions", "10"),
        ("Table 3.1: Detailed Functional Requirements Specification (FR-01 to FR-10)", "15"),
        ("Table 3.2: Non-Functional Engineering Requirements Matrix (NFR-01 to NFR-06)", "16"),
        ("Table 3.3: Hardware Development & Host Execution Environment Specifications", "17"),
        ("Table 3.4: Software Technology Stack, Frameworks, and Dependent Library Matrix", "17"),
        ("Table 3.5: Multi-Dimensional Feasibility Assessment Evaluation Matrix", "19"),
        ("Table 4.1: Database Entity Attribute & Storage Schema Specification", "26"),
        ("Table 5.1: Module-Wise Functional Responsibility & Architecture Matrix", "33"),
        ("Table 6.1: Master Test Execution & Validation Matrix (TC-01 to TC-10)", "39"),
        ("Table 6.2: Latency, Throughput & Extraction Accuracy Benchmark Across Formats", "51"),
        ("Table 8.1: Curriculum Skill Alignment & Professional Competency Mapping", "57"),
    ]

    for title, pg in lot_items:
        p_row = doc.add_paragraph()
        p_row.paragraph_format.line_spacing = 1.3
        p_row.paragraph_format.space_before = Pt(2)
        p_row.paragraph_format.space_after = Pt(2)
        r_t = p_row.add_run(title)
        r_t.font.name = 'Times New Roman'
        r_t.font.size = Pt(11)
        p_row.paragraph_format.tab_stops.add_tab_stop(Inches(5.8), docx.enum.text.WD_TAB_ALIGNMENT.RIGHT, docx.enum.text.WD_TAB_LEADER.DOTS)
        r_tab = p_row.add_run("\t")
        r_p = p_row.add_run(pg)
        r_p.font.name = 'Times New Roman'
        r_p.font.size = Pt(11)
        r_p.font.bold = True

    # 4. LIST OF FIGURES
    doc.add_page_break()
    p_lof = doc.add_paragraph()
    p_lof.paragraph_format.alignment = WD_ALIGN_PARAGRAPH.CENTER
    p_lof.paragraph_format.space_before = Pt(12)
    p_lof.paragraph_format.space_after = Pt(18)
    r_lof = p_lof.add_run("LIST OF FIGURES")
    r_lof.font.name = 'Times New Roman'
    r_lof.font.size = Pt(14)
    r_lof.font.bold = True
    r_lof.underline = True

    lof_items = [
        ("Figure 4.1: High-Level End-to-End System Architecture Block Diagram", "22"),
        ("Figure 4.2: Asynchronous Document Ingestion, OCR & Extraction Flowchart", "23"),
        ("Figure 4.3: Human-in-the-Loop (HITL) Validation & Confidence Routing Activity Diagram", "24"),
        ("Figure 4.4: UML System Use Case Interaction Diagram", "25"),
        ("Figure 4.5: UML Core Domain Class Diagram", "25"),
        ("Figure 4.6: End-to-End Document Lifecycle Sequence Diagram", "26"),
        ("Figure 4.7: Entity-Relationship (ER) Storage Schema Diagram", "28"),
        ("Figure 4.8: Document Studio Multi-Pane UI/UX Layout Wireframe", "29"),
        ("Figure 4.9: Document Studio UI/UX Screen Architecture", "30"),
        ("Figure 4.10: Visual DAG Workflow Builder Canvas Architecture", "31"),
        ("Figure 5.1: Hybrid Agile-Spiral Iterative Development Lifecycle Model", "32"),
        ("Figure 5.2: Multi-Pass Heuristic Spatial Regex Matching Pipeline", "35"),
        ("Figure 6.1: Vitest 23-Test Comprehensive Automated Test Suite Execution Output", "41"),
        ("Figure 6.2: Executive Dashboard & Pipeline Lifecycle Telemetry Screen", "42"),
        ("Figure 6.3: Central Document Ingestion & Repository Management Screen", "43"),
        ("Figure 6.4: Document Studio: Optical Extraction & Multilingual Summary Screen", "45"),
        ("Figure 6.5: Interactive Visual DAG Workflow Engine Canvas", "46"),
        ("Figure 6.6: Role-Based Maker-Checker Business Approval Queue Screen", "47"),
        ("Figure 6.7: High-Value 2FA Security PIN Payment Disbursement Modal Screen", "48"),
        ("Figure 6.8: Generative RAG Semantic AI Assistant Studio Screen", "49"),
        ("Figure 6.9: Real-Time Operational Analytics & Performance Telemetry Screen", "50"),
        ("Figure 6.10: Complex Two-Column European Invoice Spatial OCR Resynchronization Screen", "51"),
        ("Figure 6.11: Processing Latency vs Document File Size Benchmark Curve", "52"),
    ]

    for title, pg in lof_items:
        p_row = doc.add_paragraph()
        p_row.paragraph_format.line_spacing = 1.3
        p_row.paragraph_format.space_before = Pt(2)
        p_row.paragraph_format.space_after = Pt(2)
        r_t = p_row.add_run(title)
        r_t.font.name = 'Times New Roman'
        r_t.font.size = Pt(11)
        p_row.paragraph_format.tab_stops.add_tab_stop(Inches(5.8), docx.enum.text.WD_TAB_ALIGNMENT.RIGHT, docx.enum.text.WD_TAB_LEADER.DOTS)
        r_tab = p_row.add_run("\t")
        r_p = p_row.add_run(pg)
        r_p.font.name = 'Times New Roman'
        r_p.font.size = Pt(11)
        r_p.font.bold = True

    # MAIN CHAPTERS SECTION (Arabic Numerals 1, 2, 3...)
    sec_main = doc.add_section(WD_SECTION.NEW_PAGE)
    apply_margins(sec_main)
    sec_main.footer.is_linked_to_previous = False
    set_page_number_type(sec_main, fmt='decimal', start=1)

    footer_main = sec_main.footer
    p_f_main = footer_main.paragraphs[0]
    p_f_main.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_f_main = p_f_main.add_run()
    r_f_main.font.name = 'Times New Roman'
    r_f_main.font.size = Pt(10)
    add_page_number(r_f_main)

    helpers = {
        'add_p': add_p,
        'add_bullet_point': add_bullet_point,
        'add_chapter_heading': add_chapter_heading,
        'add_section_heading': add_section_heading,
        'add_subsection_heading': add_subsection_heading,
        'add_table_custom': add_table_custom,
        'add_figure_box': add_figure_box,
        'add_figure_image': add_figure_image,
        'add_code_snippet': add_code_snippet
    }

    # Write Chapters
    print("Writing Chapter 1: Introduction...")
    write_chapter1(doc, helpers)

    print("Writing Chapter 2: Literature Survey...")
    write_chapter2(doc, helpers)

    print("Writing Chapter 3: System Requirements...")
    write_chapter3(doc, helpers)

    print("Writing Chapter 4: System Architecture & Design...")
    write_chapter4(doc, helpers)

    print("Writing Chapter 5: Methodology & Implementation...")
    write_chapter5(doc, helpers)

    print("Writing Chapter 6: Testing, Results & Discussion...")
    write_chapter6(doc, helpers)

    print("Writing Chapter 7: Conclusion & Future Scope...")
    write_chapter7(doc, helpers)

    print("Writing Chapter 8: Learning Outcome...")
    write_chapter8(doc, helpers)

    print("Writing Back Matter: Appendix & Bibliography...")
    write_back_matter(doc, helpers)

    print(f"Saving report to {output_filename}...")
    doc.save(output_filename)
    print("Report generation complete!")

    # Statistics
    total_paragraphs = len(doc.paragraphs)
    total_tables = len(doc.tables)
    total_sections = len(doc.sections)
    
    word_count = sum(len(p.text.split()) for p in doc.paragraphs)
    for t in doc.tables:
        for row in t.rows:
            for cell in row.cells:
                word_count += len(cell.text.split())

    print(f"Report Summary Statistics:")
    print(f" - Output File: {output_filename}")
    print(f" - Total Paragraphs: {total_paragraphs}")
    print(f" - Total Tables: {total_tables}")
    print(f" - Total Sections: {total_sections}")
    print(f" - Estimated Word Count: {word_count} words")
    print(f" - Estimated Page Count (at ~250 words/page + tables + page breaks): ~{word_count // 260 + total_tables // 2 + 10} pages")

if __name__ == "__main__":
    out_file = "AI_FLOW_Project_Report_Final_Editable.docx"
    if len(sys.argv) > 1:
        out_file = sys.argv[1]
    build_full_report(out_file)
