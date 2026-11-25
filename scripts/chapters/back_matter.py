"""
Back Matter: APPENDIX & BIBLIOGRAPHY AND REFERENCE
Sections:
APPENDIX: (as applicable)
  Appendix A: Complete REST API Specifications
  Appendix B: Extracted JSON Entity Payloads
  Appendix C: Deterministic Rule Set Configuration
BIBLIOGRAPHY AND REFERENCE
"""

from docx.shared import Pt

def write_back_matter(doc, h):
    add_p = h['add_p']
    add_bullet_point = h['add_bullet_point']
    add_section_heading = h['add_section_heading']
    add_subsection_heading = h['add_subsection_heading']
    add_code_snippet = h['add_code_snippet']

    # APPENDIX
    doc.add_page_break()
    p_app = doc.add_paragraph()
    p_app.paragraph_format.space_before = Pt(18)
    p_app.paragraph_format.space_after = Pt(14)
    r_app = p_app.add_run("APPENDIX: (as applicable)")
    r_app.font.name = 'Times New Roman'
    r_app.font.size = Pt(14)
    r_app.font.bold = True

    add_section_heading("Appendix A", "Complete REST API Endpoint Specifications")
    add_p(
        "The AI-FLOW platform provides a comprehensive set of RESTful JSON API endpoints supporting headless integration with external "
        "Enterprise Resource Planning (ERP) systems, mobile client applications, and background worker queues."
    )
    add_bullet_point("POST /api/documents:", "Uploads and registers a new document binary; computes SHA-256 hash digest.")
    add_bullet_point("GET /api/documents/[id]:", "Retrieves complete document metadata, lifecycle status, and extracted entity fields.")
    add_bullet_point("POST /api/documents/[id]/process:", "Executes asynchronous optical OCR transcription and heuristic entity extraction.")
    add_bullet_point("POST /api/documents/[id]/extract:", "Triggers server-side secondary validation and layout re-synchronization.")
    add_bullet_point("POST /api/workflows/[id]/execute:", "Triggers DAG workflow orchestration steps for approved documents.")
    add_bullet_point("GET /api/audit-logs:", "Fetches immutable cryptographic audit records filtered by document ID or user role.")

    add_subsection_heading("A.1", "Sample REST Extraction Endpoint Response Payload")
    add_code_snippet("""
{
  "documentId": "doc-auto-1795518715451",
  "documentType": "Invoice",
  "classificationConfidence": 0.985,
  "overallConfidence": 0.984,
  "status": "READY",
  "fileHash": "8f12a9bc41d2e8b7c4e5f6a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1",
  "extractedFields": [
    { "fieldName": "vendor", "extractedValue": "West Group", "confidence": 0.99 },
    { "fieldName": "client", "extractedValue": "Zimmerman and Sons", "confidence": 0.98 },
    { "fieldName": "invoice_number", "extractedValue": "74980573", "confidence": 0.995 },
    { "fieldName": "invoice_date", "extractedValue": "09/27/2015", "confidence": 0.97 },
    { "fieldName": "subtotal", "extractedValue": "173.87", "confidence": 0.98 },
    { "fieldName": "tax", "extractedValue": "17.39", "confidence": 0.98 },
    { "fieldName": "total", "extractedValue": "191.26", "confidence": 0.984 },
    { "fieldName": "currency", "extractedValue": "USD", "confidence": 0.999 }
  ],
  "summary": "Official commercial invoice (Ref: 74980573) issued by West Group to Zimmerman and Sons.\\nTotal balance payable is USD 191.26..."
}
""")

    add_section_heading("Appendix B", "Sample Ground-Truth Invoice Optical Scan Text")
    add_p(
        "Below is an authentic sample optical text stream representing a complex two-column invoice layout parsed by AI-FLOW:"
    )
    add_code_snippet("""
TAX INVOICE
Invoice no: 74980573
Date of issue: 09/27/2015

Seller:                             Client:
West Group                          Zimmerman and Sons
91959 Eric Pass                     2246 Landry Court
Wileyshire, SC 58295                Murillomouth, AZ 66593
Tax Id: 944-98-4907                 Tax Id: 901-84-6442
IBAN: GB02HMXX72577746298746

ITEMS
No. Description                     Qty  UM   Net price  Net worth  VAT [%]  Gross worth
1.  Teva Hurricane 1019390...       2.00 each     9.99     19.98      10%        21.98

SUMMARY
                                    VAT [%]      Net worth      VAT      Gross worth
                                      10%
                    Total                        $ 173,87     $ 17,39      $ 191,26
""")

    add_section_heading("Appendix C", "Deterministic Rule Engine JSON Configuration")
    add_p(
        "The following declarative JSON configuration specifies the spend threshold and tax compliance rules evaluated by AI-FLOW:"
    )
    add_code_snippet("""
[
  {
    "id": "rule-spend-threshold-01",
    "name": "Standard Accounts Payable Spend Cap",
    "description": "Invoices exceeding INR 50,000 require Secondary Manager Approval",
    "category": "SPEND_POLICY",
    "priority": 1,
    "isActive": true,
    "conditions": [
      {
        "field": "total",
        "operator": "GREATER_THAN",
        "value": 50000
      }
    ],
    "action": "REQUIRE_SECONDARY_APPROVAL",
    "escalateToRole": "APPROVER"
  },
  {
    "id": "rule-tax-id-verification-02",
    "name": "Mandatory Vendor Tax ID Compliance",
    "description": "Flags invoices missing a valid GSTIN / Tax ID for audit verification",
    "category": "COMPLIANCE",
    "priority": 2,
    "isActive": true,
    "conditions": [
      {
        "field": "tax_id",
        "operator": "IS_EMPTY",
        "value": null
      }
    ],
    "action": "FLAG_FOR_AUDIT_REVIEW",
    "escalateToRole": "REVIEWER"
  }
]
""")

    # BIBLIOGRAPHY AND REFERENCE
    doc.add_page_break()
    p_bib = doc.add_paragraph()
    p_bib.paragraph_format.space_before = Pt(18)
    p_bib.paragraph_format.space_after = Pt(14)
    r_bib = p_bib.add_run("BIBLIOGRAPHY AND REFERENCE (as applicable)")
    r_bib.font.name = 'Times New Roman'
    r_bib.font.size = Pt(14)
    r_bib.font.bold = True

    references = [
        "[1] R. Smith, \"An Overview of the Tesseract OCR Engine,\" in Proc. Ninth Int. Conf. on Document Analysis and Recognition (ICDAR), Curitiba, Brazil, 2007, pp. 629-633.",
        "[2] R. Smith, \"A simple and efficient approach to line finding and baseline fitting for character recognition,\" in Proc. 5th Int. Conf. on Document Analysis and Recognition, 1995, pp. 285-288.",
        "[3] Y. Du, Z. Chen, C. Jia, X. Yin, T. Zheng, C. Li, L. Du, and Y. Liu, \"PP-OCR: A practical ultra lightweight OCR system,\" arXiv preprint arXiv:2009.09941, 2020.",
        "[4] Y. Xu, M. Li, L. Cui, S. Huang, F. Wei, and M. Zhou, \"LayoutLM: Pre-training of Text and Layout for Document Image Understanding,\" in Proc. 26th ACM SIGKDD Int. Conf. on Knowledge Discovery & Data Mining, 2020, pp. 1192-1200.",
        "[5] Y. Xu, Y. Xu, T. Lv, L. Cui, F. Wei, G. Wang, Y. Lu, D. Florencio, C. Zhang, W. Che, and M. Zhou, \"LayoutLMv2: Multi-modal Pre-training for Visually-Rich Document Understanding,\" in Proc. 59th Annual Meeting of the Association for Computational Linguistics (ACL), 2021, pp. 2579-2591.",
        "[6] Y. Huang, T. Lv, L. Cui, Y. Lu, and F. Wei, \"LayoutLMv3: Pre-training for Document AI with Unified Text and Image Masking,\" in Proc. 30th ACM Int. Conf. on Multimedia (ACM MM), 2022, pp. 4083-4091.",
        "[7] G. Kim, T. Hong, M. Yim, J. Nam, J. Park, J. Yim, W. Hwang, S. Yun, D. Han, and S. Park, \"OCR-free Document Understanding Transformer,\" in Proc. European Conf. on Computer Vision (ECCV), Tel Aviv, Israel, 2022, pp. 498-517.",
        "[8] M. Liao, B. Shi, X. Bai, X. Wang, and W. Liu, \"Real-time Scene Text Detection with Differentiable Binarization,\" in Proc. AAAI Conf. on Artificial Intelligence, vol. 34, no. 7, 2020, pp. 11474-11481.",
        "[9] Gartner Inc., \"Magic Quadrant for Robotic Process Automation,\" Gartner Research Report G00770214, Stamford, CT, 2023.",
        "[10] International Data Corporation (IDC), \"Worldwide Intelligent Document Processing Forecast, 2023-2027: Market Opportunity Analysis,\" IDC Market Forecast Doc #US50672123, Framingham, MA, 2023.",
        "[11] Amazon Web Services, \"Amazon Textract Developer Guide: Automated Document Information Extraction,\" AWS Documentation, Amazon.com, Inc., Seattle, WA, 2024.",
        "[12] Google Cloud Platform, \"Google Cloud Document AI Documentation: Specialized Processors and Human-in-the-Loop Review,\" Google LLC, Mountain View, CA, 2024.",
        "[13] Microsoft Azure, \"Azure AI Document Intelligence Documentation (formerly Form Recognizer),\" Microsoft Corporation, Redmond, WA, 2024.",
        "[14] Mindee Corp., \"docTR: End-to-end Document Text Recognition with deep learning,\" GitHub Repository, https://github.com/mindee/doctr, 2023.",
        "[15] Vercel Inc., \"Next.js 16 App Router Architecture and Server Components Specification,\" Next.js Documentation, https://nextjs.org/docs, 2024.",
        "[16] Meta Platforms, \"React 19 Concurrent Features and Server Actions Reference Guide,\" React Documentation, https://react.dev, 2024.",
        "[17] Microsoft Corporation, \"TypeScript Language Specification Version 5.x,\" Microsoft Developer Network, https://www.typescriptlang.org, 2024.",
        "[18] Vitest Development Team, \"Vitest: Blazing Fast Unit Test Framework Powered by Vite,\" Vitest Documentation, https://vitest.dev, 2024.",
        "[19] World Wide Web Consortium (W3C), \"WebAssembly Core Specification, W3C Recommendation,\" W3C Technical Architecture Group, https://www.w3.org/TR/wasm-core-1/, 2019.",
        "[20] World Wide Web Consortium (W3C), \"Web Content Accessibility Guidelines (WCAG) 2.1,\" W3C Recommendation, 2018.",
        "[21] National Institute of Standards and Technology (NIST), \"Secure Hash Standard (SHS),\" Federal Information Processing Standards Publication (FIPS PUB 180-4), U.S. Department of Commerce, 2015.",
        "[22] Government of India, \"The Digital Personal Data Protection Act, 2023 (Act No. 22 of 2023),\" Ministry of Law and Justice, The Gazette of India, New Delhi, 2023.",
        "[23] European Union, \"Regulation (EU) 2016/679 of the European Parliament and of the Council (General Data Protection Regulation - GDPR),\" Official Journal of the European Union, 2016.",
        "[24] E. Gamma, R. Helm, R. Johnson, and J. Vlissides, Design Patterns: Elements of Reusable Object-Oriented Software. Reading, MA: Addison-Wesley, 1994.",
        "[25] M. Fowler, Patterns of Enterprise Application Architecture. Boston, MA: Addison-Wesley, 2002.",
        "[26] Symbiosis University of Applied Sciences, \"Guidelines for Integrated Skill Projects and Dissertation Documentation,\" School of Computer Science and Information Technology, Indore, India, 2024."
    ]

    for ref in references:
        add_p(ref, space_after=4, space_before=2)
