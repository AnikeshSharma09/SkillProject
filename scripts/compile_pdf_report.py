"""
AI-FLOW: Production Report Compiler (DOCX -> High-Fidelity PDF)
Uses ReportLab to compile AI_FLOW_Project_Report_Final_Editable.docx into
AI_FLOW_Project_Report_Final.pdf adhering strictly to Symbiosis University of Applied Sciences guidelines:
- A4 Paper
- Left Margin: 1.5 inches (Binding side)
- Right, Top, Bottom Margins: 1.0 inch
- Body Text: Times New Roman, 12 pt, 1.5 line spacing (18 pt leading), Justified
- Subheadings: Times New Roman, 14 pt Bold
- Chapter Titles: Times New Roman, 14 pt Bold, ALL CAPS
- Lowercase Roman numerals for Front Matter (i, ii, iii...)
- Arabic numerals for Main Matter starting from Chapter 1 (1, 2, 3...)
- Figures centered with caption below
- Tables centered with caption above
"""

import os
import re
import io
from PIL import Image as PILImage
import docx
from docx.text.paragraph import Paragraph as DocxParagraph
from docx.table import Table as DocxTable

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_JUSTIFY, TA_LEFT, TA_CENTER, TA_RIGHT
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, Preformatted, Flowable, Image as RLImage
)
from reportlab.pdfgen import canvas

def int_to_roman(n):
    val = [1000, 900, 500, 400, 100, 90, 50, 40, 10, 9, 5, 4, 1]
    syb = ["m", "cm", "d", "cd", "c", "xc", "l", "xl", "x", "ix", "v", "iv", "i"]
    roman_num = ''
    i = 0
    while n > 0:
        for _ in range(n // val[i]):
            roman_num += syb[i]
            n -= val[i]
        i += 1
    return roman_num

class NumberedCanvas(canvas.Canvas):
    ch1_start_page = None

    def __init__(self, *args, **kwargs):
        super(NumberedCanvas, self).__init__(*args, **kwargs)
        self._saved_page_states = []
        self.total_pages = 0

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        self.total_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations()
            super(NumberedCanvas, self).showPage()
        super(NumberedCanvas, self).save()

    def draw_page_decorations(self):
        page_num = self._pageNumber
        # Bottom page numbering centered at 0.5 inches from bottom
        y = 0.5 * inch
        x = A4[0] / 2.0  # Center of page

        self.saveState()
        self.setFont("Times-Roman", 11)

        # Main chapters start when chapter_1_page is reached
        ch1 = NumberedCanvas.ch1_start_page or 6
        if page_num < ch1:
            # Front matter: lowercase roman numerals
            roman = int_to_roman(page_num)
            self.drawCentredString(x, y, roman)
        else:
            # Main matter: Arabic numerals starting at 1
            arabic = str(page_num - ch1 + 1)
            self.drawCentredString(x, y, arabic)

        self.restoreState()


class HeadingTracker(Flowable):
    tracked_headings = {}

    def __init__(self, title):
        super().__init__()
        self.title = title
        self.width = 0
        self.height = 0

    def draw(self):
        page = self.canv._pageNumber
        HeadingTracker.tracked_headings[self.title] = page
        if "CHAPTER 1" in self.title.upper():
            if NumberedCanvas.ch1_start_page is None:
                NumberedCanvas.ch1_start_page = page
        print(f"TRACK: {self.title} -> Physical Page {page}")

def compile_pdf(docx_path, pdf_path):
    print(f"Reading source DOCX: {docx_path}...")
    doc = docx.Document(docx_path)

    # Printable dimensions
    # A4: 595.27 x 841.89 pt
    left_m = 1.5 * inch    # 108 pt
    right_m = 1.0 * inch   # 72 pt
    top_m = 1.0 * inch     # 72 pt
    bottom_m = 1.0 * inch  # 72 pt
    avail_w = A4[0] - left_m - right_m  # 415.27 pt

    styles = getSampleStyleSheet()

    # Custom styles
    style_body = ParagraphStyle(
        'ReportBody',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=12,
        leading=18,
        alignment=TA_JUSTIFY,
        spaceAfter=6,
        spaceBefore=0
    )

    style_bullet = ParagraphStyle(
        'ReportBullet',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=12,
        leading=18,
        alignment=TA_JUSTIFY,
        leftIndent=18,
        firstLineIndent=-10,
        spaceAfter=4,
        spaceBefore=0
    )

    style_ch_title = ParagraphStyle(
        'ReportChTitle',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=14,
        leading=20,
        alignment=TA_LEFT,
        spaceBefore=14,
        spaceAfter=12,
        keepWithNext=True
    )

    style_front_title = ParagraphStyle(
        'ReportFrontTitle',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=14,
        leading=20,
        alignment=TA_CENTER,
        spaceBefore=12,
        spaceAfter=14,
        keepWithNext=True
    )

    style_sec_title = ParagraphStyle(
        'ReportSecTitle',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=14,
        leading=18,
        alignment=TA_LEFT,
        spaceBefore=14,
        spaceAfter=6,
        keepWithNext=True
    )

    style_subsec_title = ParagraphStyle(
        'ReportSubSecTitle',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=12,
        leading=16,
        alignment=TA_LEFT,
        spaceBefore=10,
        spaceAfter=4,
        keepWithNext=True
    )

    style_subsubsec_title = ParagraphStyle(
        'ReportSubSubSecTitle',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=11,
        leading=15,
        alignment=TA_LEFT,
        spaceBefore=8,
        spaceAfter=3,
        keepWithNext=True
    )

    style_tbl_caption = ParagraphStyle(
        'ReportTblCap',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=11,
        leading=14,
        alignment=TA_CENTER,
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )

    style_fig_caption = ParagraphStyle(
        'ReportFigCap',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=11,
        leading=14,
        alignment=TA_CENTER,
        spaceBefore=5,
        spaceAfter=10,
        keepWithNext=False
    )

    style_tbl_cell = ParagraphStyle(
        'ReportTblCell',
        parent=styles['Normal'],
        fontName='Times-Roman',
        fontSize=9.5,
        leading=13,
        alignment=TA_LEFT,
        spaceBefore=0,
        spaceAfter=0
    )

    style_tbl_hdr = ParagraphStyle(
        'ReportTblHdr',
        parent=styles['Normal'],
        fontName='Times-Bold',
        fontSize=10,
        leading=13,
        alignment=TA_LEFT,
        textColor=colors.whitesmoke,
        spaceBefore=0,
        spaceAfter=0
    )

    style_code = ParagraphStyle(
        'ReportCode',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=8.5,
        leading=11.5,
        alignment=TA_LEFT,
        spaceBefore=0,
        spaceAfter=0
    )

    story = []

    # Map sequential body elements
    print("Processing document elements...")
    
    # We iterate through doc.element.body to preserve exact order of paragraphs and tables
    p_iter = iter(doc.paragraphs)
    t_iter = iter(doc.tables)

    for child in doc.element.body:
        tag = child.tag.split('}')[-1]

        if tag == 'p':
            try:
                p = next(p_iter)
            except StopIteration:
                continue

            # Check if this paragraph contains a page break (even if p.text is empty)
            has_page_break = 'w:type="page"' in p._p.xml or any(
                r._r.xpath('.//w:br[@w:type="page"]') for r in p.runs
            )
            if has_page_break:
                story.append(PageBreak())

            # Check for drawings / images in paragraph runs
            has_image = False
            for r in p.runs:
                blips = r._r.xpath('.//a:blip')
                if blips:
                    for blip in blips:
                        rId = blip.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}embed')
                        if rId and rId in doc.part.related_parts:
                            blob = doc.part.related_parts[rId].blob
                            try:
                                pil_img = PILImage.open(io.BytesIO(blob))
                                w, h = pil_img.size
                                scale = avail_w / float(w)
                                target_w = avail_w
                                target_h = min(h * scale, 310)
                                rl_img = RLImage(io.BytesIO(blob), width=target_w, height=target_h)
                                story.append(Spacer(1, 4))
                                story.append(rl_img)
                                story.append(Spacer(1, 4))
                                has_image = True
                            except Exception as e:
                                print(f"Error loading image: {e}")

            raw_text = p.text.strip()
            if not raw_text:
                continue

            # Detect heading types
            style_name = p.style.name if p.style else ''

            # Clean XML text for ReportLab
            clean_text = raw_text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')

            # Check if bold prefix exists
            if len(p.runs) > 1 and p.runs[0].bold and not p.runs[1].bold:
                prefix = p.runs[0].text.strip().replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                rest = raw_text[len(p.runs[0].text):].strip().replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                clean_text = f"<b>{prefix}</b> {rest}"

            # Check if this is a TOC row with tab separator
            if "\t" in raw_text:
                parts = raw_text.split("\t")
                if len(parts) >= 2:
                    left_part = parts[0].strip().replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                    right_part = parts[-1].strip()
                    # Dots leader
                    leader = ". " * max(5, int((avail_w - 180) / 10))
                    story.append(Paragraph(
                        f"<font name='Times-Roman'>{left_part}</font> <font color='#94a3b8'>{leader}</font> <b>{right_part}</b>",
                        style_body
                    ))
                else:
                    story.append(Paragraph(clean_text, style_body))
                continue

            # Format based on content and style
            if raw_text in ["SYMBIOSIS UNIVERSITY OF APPLIED SCIENCES", "INDORE", "ABSTRACT", "TABLE OF CONTENTS", "LIST OF TABLES", "LIST OF FIGURES"]:
                story.append(HeadingTracker(raw_text))
                story.append(Paragraph(clean_text, style_front_title))

            elif re.match(r'^CHAPTER\s+\d+:\s+', raw_text, re.IGNORECASE):
                story.append(HeadingTracker(raw_text[:40]))
                story.append(Paragraph(clean_text.upper(), style_ch_title))

            elif raw_text.upper().startswith("APPENDIX:") or raw_text.upper().startswith("BIBLIOGRAPHY AND REFERENCE"):
                story.append(HeadingTracker(raw_text[:40]))
                story.append(Paragraph(clean_text.upper(), style_ch_title))

            elif re.match(r'^\d+\.\d+\s+', raw_text):
                # Section heading e.g. "1.1 Background..."
                story.append(HeadingTracker(raw_text[:35]))
                story.append(Paragraph(clean_text, style_sec_title))

            elif re.match(r'^\d+\.\d+\.\d+\s+', clean_text):
                # Subsection heading e.g. "1.1.1 Optical..."
                story.append(Paragraph(clean_text, style_subsec_title))

            elif re.match(r'^(Appendix [A-C]|[A-C]\.\d+)\s+', clean_text):
                story.append(Paragraph(clean_text, style_sec_title))

            elif re.match(r'^Table\s+\d+\.\d+:\s+', clean_text):
                # Table Caption (centered, bold, caption above)
                story.append(HeadingTracker(clean_text[:45]))
                story.append(Paragraph(clean_text, style_tbl_caption))

            elif re.match(r'^Figure\s+\d+\.\d+:\s+', clean_text):
                # Figure Caption (centered, bold, caption below)
                story.append(HeadingTracker(clean_text[:45]))
                story.append(Paragraph(clean_text, style_fig_caption))

            elif clean_text.startswith("•") or clean_text.startswith("- ") or p.runs[0].text.startswith("•"):
                story.append(Paragraph(clean_text, style_bullet))

            elif raw_text.startswith("[") and re.match(r'^\[\d+\]', raw_text):
                # Reference entry e.g. [1] ...
                story.append(Paragraph(clean_text, style_bullet))

            elif "\t" in raw_text and ("..." in raw_text or any(k in raw_text for k in ["CHAPTER", "Chapter", "Table", "Figure"])):
                # TOC row
                parts = raw_text.split("\t")
                if len(parts) >= 2:
                    left_part = parts[0].strip().replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                    right_part = parts[-1].strip()
                    row_html = f"<table width='100%'><tr><td align='left'>{left_part}</td><td align='right'>{right_part}</td></tr></table>"
                    story.append(Paragraph(left_part + " " + "." * max(10, 60 - len(left_part)) + " " + right_part, style_body))
                else:
                    story.append(Paragraph(clean_text, style_body))

            else:
                story.append(Paragraph(clean_text, style_body))

        elif tag == 'tbl':
            try:
                tbl = next(t_iter)
            except StopIteration:
                continue

            # Convert docx table to reportlab table
            num_rows = len(tbl.rows)
            num_cols = len(tbl.columns)
            if num_rows == 0 or num_cols == 0:
                continue

            # Determine whether this is a Figure diagram box (1 row, 1 cell with Courier text)
            if num_rows == 1 and num_cols == 1:
                cell_text = tbl.cell(0, 0).text.strip()
                cell_clean = cell_text.replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                code_p = Paragraph(cell_clean.replace('\n', '<br/>'), style_code)
                fig_table = Table([[code_p]], colWidths=[avail_w])
                fig_table.setStyle(TableStyle([
                    ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#f8fafc')),
                    ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#94a3b8')),
                    ('TOPPADDING', (0,0), (-1,-1), 6),
                    ('BOTTOMPADDING', (0,0), (-1,-1), 6),
                    ('LEFTPADDING', (0,0), (-1,-1), 8),
                    ('RIGHTPADDING', (0,0), (-1,-1), 8),
                ]))
                story.append(fig_table)
                story.append(Spacer(1, 4))
                continue

            # Normal multi-column table
            table_data = []
            col_w = avail_w / float(num_cols)
            col_widths = [col_w] * num_cols

            for r_idx, row in enumerate(tbl.rows):
                row_data = []
                is_hdr = (r_idx == 0)
                for c_idx, cell in enumerate(row.cells):
                    ctext = cell.text.strip().replace('&', '&amp;').replace('<', '&lt;').replace('>', '&gt;')
                    if is_hdr:
                        p_cell = Paragraph(f"<b>{ctext}</b>", style_tbl_hdr)
                    else:
                        p_cell = Paragraph(ctext, style_tbl_cell)
                    row_data.append(p_cell)
                table_data.append(row_data)

            rl_table = Table(table_data, colWidths=col_widths, repeatRows=1)
            t_style = [
                ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1e3a8a')),
                ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
                ('GRID', (0,0), (-1,-1), 0.5, colors.HexColor('#cbd5e1')),
                ('TOPPADDING', (0,0), (-1,-1), 4),
                ('BOTTOMPADDING', (0,0), (-1,-1), 4),
                ('LEFTPADDING', (0,0), (-1,-1), 5),
                ('RIGHTPADDING', (0,0), (-1,-1), 5),
                ('ALIGN', (0,0), (-1,-1), 'LEFT'),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
            ]
            for r_i in range(1, len(table_data)):
                if r_i % 2 == 0:
                    t_style.append(('BACKGROUND', (0, r_i), (-1, r_i), colors.HexColor('#f1f5f9')))
            rl_table.setStyle(TableStyle(t_style))

            story.append(Spacer(1, 4))
            story.append(rl_table)
            story.append(Spacer(1, 8))

    print("Building PDF document with SimpleDocTemplate...")
    doc_template = SimpleDocTemplate(
        pdf_path,
        pagesize=A4,
        leftMargin=left_m,
        rightMargin=right_m,
        topMargin=top_m,
        bottomMargin=bottom_m
    )

    doc_template.build(story, canvasmaker=NumberedCanvas)
    print(f"PDF build complete: {pdf_path}")

if __name__ == '__main__':
    in_docx = r"d:\SkillProject\AI_FLOW_Project_Report_Final_Editable.docx"
    out_pdf = r"d:\SkillProject\AI_FLOW_Project_Report_Final.pdf"
    compile_pdf(in_docx, out_pdf)
