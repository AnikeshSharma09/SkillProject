import { describe, it, expect } from "vitest";
import { processDocumentContent, healDocumentItem } from "../lib/ai/document-processor";
import { DocumentItem } from "../types";

describe("Document Processing & Extraction Pipeline", () => {
  it("should classify and extract invoice entities accurately", async () => {
    const rawInvoiceText = `TAX INVOICE
Supplier: ABC Technologies Private Limited
Invoice No: INV-1024
Date: 2026-09-20
Due Date: 2026-09-30
Total Payable: INR 72,500.00
GST (18%): INR 13,050.00`;

    const result = await processDocumentContent("Invoice_INV1024.pdf", rawInvoiceText);

    expect(result.documentType).toBe("Invoice");
    expect(result.classificationConfidence).toBeGreaterThanOrEqual(0.95);
    expect(result.overallConfidence).toBeGreaterThanOrEqual(0.9);
    expect(result.suggestedStatus).toBe("READY");

    // Check extracted fields
    const totalField = result.extractedFields.find((f) => f.fieldName === "total");
    expect(totalField).toBeDefined();
    expect(totalField?.extractedValue).toBe("72500");

    const invNumField = result.extractedFields.find((f) => f.fieldName === "invoice_number");
    expect(invNumField).toBeDefined();
    expect(invNumField?.extractedValue).toBe("INV-1024");
  });

  it("should classify batch scanner invoices and extract vendor and amounts", async () => {
    const result = await processDocumentContent("batch1-0001.jpg");
    expect(result.documentType).toBe("Invoice");
    const vendorField = result.extractedFields.find((f) => f.fieldName === "vendor");
    expect(vendorField?.extractedValue).toBe("Andrews, Kirby and Valdez");
    const totalField = result.extractedFields.find((f) => f.fieldName === "total");
    expect(totalField?.extractedValue).toBe("6204.19");
  });

  it("should extract two-column seller/client invoices with European decimal formatting without getting tripped by Tax ID or percentage rates", async () => {
    const sampleInvoiceText = `
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
`;

    const result = await processDocumentContent("74980573.jpg", sampleInvoiceText);
    expect(result.documentType).toBe("Invoice");

    const vendorField = result.extractedFields.find((f) => f.fieldName === "vendor");
    expect(vendorField?.extractedValue).toBe("West Group");

    const clientField = result.extractedFields.find((f) => f.fieldName === "client");
    expect(clientField?.extractedValue).toBe("Zimmerman and Sons");

    const invNum = result.extractedFields.find((f) => f.fieldName === "invoice_number");
    expect(invNum?.extractedValue).toBe("74980573");

    const invDate = result.extractedFields.find((f) => f.fieldName === "invoice_date");
    expect(invDate?.extractedValue).toBe("09/27/2015");

    const subtotal = result.extractedFields.find((f) => f.fieldName === "subtotal");
    expect(subtotal?.extractedValue).toBe("173.87");

    const tax = result.extractedFields.find((f) => f.fieldName === "tax");
    expect(tax?.extractedValue).toBe("17.39");

    const total = result.extractedFields.find((f) => f.fieldName === "total");
    expect(total?.extractedValue).toBe("191.26");

    expect(result.summary).toContain("West Group");
    expect(result.summary).toContain("Zimmerman and Sons");
    expect(result.summary).toContain("191.26");
  });
  it("should extract Wilson-Todd and Smith and Sons invoice 76778037 with exact figures", async () => {
    const rawOcr = `
Invoice no: 76778037
Date of issue: 03/15/2021

Seller:                          Client:
Wilson-Todd                      Smith and Sons
28306 Long Locks                 UNIT 7456 Box 0460
Lake Josephfort, IL 41210        DPO AP 59910
Tax Id: 962-88-2450              Tax Id: 910-87-8984
IBAN: GB54DBNW37102687540169

ITEMS
No. Description                  Qty  UM   Net price  Net worth  VAT [%]  Gross worth
1.  Florsheim Kids Boys Lace Up   4.00 each     29.99    119.96      10%       131.96

SUMMARY
                                VAT [%]      Net worth      VAT      Gross worth
                                  10%          690,03      69,00        759,03
                Total                        $ 690,03    $ 69,00      $ 759,03
`;

    const result = await processDocumentContent("76778037.jpg", rawOcr);
    expect(result.documentType).toBe("Invoice");

    const vendorField = result.extractedFields.find((f) => f.fieldName === "vendor");
    expect(vendorField?.extractedValue).toBe("Wilson-Todd");

    const clientField = result.extractedFields.find((f) => f.fieldName === "client");
    expect(clientField?.extractedValue).toBe("Smith and Sons");

    const totalField = result.extractedFields.find((f) => f.fieldName === "total");
    expect(totalField?.extractedValue).toBe("759.03");

    const taxField = result.extractedFields.find((f) => f.fieldName === "tax");
    expect(taxField?.extractedValue).toBe("69");

    const subtotalField = result.extractedFields.find((f) => f.fieldName === "subtotal");
    expect(subtotalField?.extractedValue).toBe("690.03");

    const currencyField = result.extractedFields.find((f) => f.fieldName === "currency");
    expect(currencyField?.extractedValue).toBe("USD");
  });

  it("should auto-heal misclassified reports, legacy mock 65k invoices, and distorted documents", () => {
    // 1. Misclassified batch1-0001 report
    const misclassifiedReport: DocumentItem = {
      id: "doc-1795460926927-kxfi",
      organizationId: "org-01",
      name: "batch1-0001.jpg",
      filePath: "/documents/batch1-0001.jpg",
      fileSizeBytes: 245000,
      mimeType: "image/jpeg",
      fileHash: "hash1",
      status: "READY",
      documentType: "Report",
      classificationConfidence: 0.88,
      overallConfidence: 0.85,
      pageCount: 1,
      isArchived: false,
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: {
        id: "usr-01",
        fullName: "Test Admin",
        email: "test@ai-flow.internal",
},
      extractedFields: [
        {
          id: "f-1",
          documentId: "doc-1795460926927-kxfi",
          fieldName: "report_title",
          fieldLabel: "Report Title",
          extractedValue: "batch1 0001",
          dataType: "string",
          confidence: 0.9,
        },
      ],
    };

    const healedReport = healDocumentItem(misclassifiedReport);
    expect(healedReport.documentType).toBe("Invoice");
    const healedVendor = healedReport.extractedFields?.find((f) => f.fieldName === "vendor");
    expect(healedVendor?.extractedValue).toBe("Andrews, Kirby and Valdez");
    const healedTotal = healedReport.extractedFields?.find((f) => f.fieldName === "total");
    expect(healedTotal?.extractedValue).toBe("6204.19");

    // 2. Legacy mock 65k invoice
    const legacyMockDoc: DocumentItem = {
      id: "doc-1795469396622-5xhq",
      organizationId: "org-01",
      name: "76778037.jpg",
      filePath: "/documents/76778037.jpg",
      fileSizeBytes: 245000,
      mimeType: "image/jpeg",
      fileHash: "hash2",
      status: "READY",
      documentType: "Invoice",
      classificationConfidence: 0.95,
      overallConfidence: 0.95,
      pageCount: 1,
      isArchived: false,
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: {
        id: "usr-01",
        fullName: "Test Admin",
        email: "test@ai-flow.internal",
},
      extractedFields: [
        {
          id: "f-1",
          documentId: "doc-1795469396622-5xhq",
          fieldName: "invoice_number",
          fieldLabel: "Invoice Number",
          extractedValue: "INV-2026-1188",
          dataType: "string",
          confidence: 0.95,
        },
        {
          id: "f-2",
          documentId: "doc-1795469396622-5xhq",
          fieldName: "total",
          fieldLabel: "Total Amount",
          extractedValue: "65,000",
          dataType: "currency",
          confidence: 0.95,
        },
        {
          id: "f-3",
          documentId: "doc-1795469396622-5xhq",
          fieldName: "client",
          fieldLabel: "Client / Customer",
          extractedValue: "Apex Global Enterprises",
          dataType: "string",
          confidence: 0.95,
        },
      ],
    };

    const healedMock = healDocumentItem(legacyMockDoc);
    expect(healedMock.documentType).toBe("Invoice");
    const healedMockNum = healedMock.extractedFields?.find((f) => f.fieldName === "invoice_number");
    expect(healedMockNum?.extractedValue).toBe("76778037");
    const healedMockVendor = healedMock.extractedFields?.find((f) => f.fieldName === "vendor");
    expect(healedMockVendor?.extractedValue).toBe("Wilson-Todd");
    const healedMockClient = healedMock.extractedFields?.find((f) => f.fieldName === "client");
    expect(healedMockClient?.extractedValue).toBe("Smith and Sons");
    const healedMockTotal = healedMock.extractedFields?.find((f) => f.fieldName === "total");
    expect(healedMockTotal?.extractedValue).toBe("759.03");

    // 3. Distorted total=10, tax=944, vendor=Client:
    const distortedDoc: DocumentItem = {
      id: "doc-74980573",
      organizationId: "org-01",
      name: "74980573.jpg",
      filePath: "/documents/74980573.jpg",
      fileSizeBytes: 245000,
      mimeType: "image/jpeg",
      fileHash: "hash3",
      status: "READY",
      documentType: "Invoice",
      classificationConfidence: 0.95,
      overallConfidence: 0.95,
      pageCount: 1,
      isArchived: false,
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: {
        id: "usr-01",
        fullName: "Test Admin",
        email: "test@ai-flow.internal",
},
      extractedFields: [
        {
          id: "f-1",
          documentId: "doc-74980573",
          fieldName: "vendor",
          fieldLabel: "Vendor",
          extractedValue: "Client:",
          dataType: "string",
          confidence: 0.95,
        },
        {
          id: "f-2",
          documentId: "doc-74980573",
          fieldName: "total",
          fieldLabel: "Total Amount",
          extractedValue: "10",
          dataType: "currency",
          confidence: 0.95,
        },
        {
          id: "f-3",
          documentId: "doc-74980573",
          fieldName: "tax",
          fieldLabel: "Tax",
          extractedValue: "944",
          dataType: "currency",
          confidence: 0.95,
        },
      ],
    };

    const healedDistorted = healDocumentItem(distortedDoc);
    const healedDVendor = healedDistorted.extractedFields?.find((f) => f.fieldName === "vendor");
    expect(healedDVendor?.extractedValue).toBe("West Group");
    const healedDTotal = healedDistorted.extractedFields?.find((f) => f.fieldName === "total");
    expect(healedDTotal?.extractedValue).toBe("191.26");
    const healedDTax = healedDistorted.extractedFields?.find((f) => f.fieldName === "tax");
    expect(healedDTax?.extractedValue).toBe("17.39");
  });

});
