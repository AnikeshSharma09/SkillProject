import { describe, it, expect } from "vitest";
import {
  processDocumentContent,
  healDocumentItem,
  inferDataType,
  labelToFieldName,
  extractDynamicKeyValuePairs,
} from "../lib/ai/document-processor";
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
    const batchOcrText = `TAX INVOICE\nInvoice no: 51109338\nDate of issue: 04/13/2013\nSeller: Andrews, Kirby and Valdez\nClient: Becker Ltd\nTax id: 945-82-2137\nIBAN: GB75MCKL06811367619257\nNet worth: $5,640.17\nVAT (10%): $564.02\nTotal: $6,204.19\nTotal Payable: USD 6204.19`;
    const result = await processDocumentContent("batch1-0001.jpg", batchOcrText);
    expect(result.documentType).toBe("Invoice");
    const vendorField = result.extractedFields.find((f) => f.fieldName === "vendor");
    expect(vendorField?.extractedValue).toBe("Andrews, Kirby and Valdez");
    const totalField = result.extractedFields.find((f) => f.fieldName === "total");
    expect(totalField?.extractedValue).toBe("6204.19");
  });

  it("should keep missing entities blank with 0 confidence and route to REVIEW_REQUIRED without injecting fake fallback values", async () => {
    // Blank scan with no recognized text
    const blankResult = await processDocumentContent("scan_empty.png", "");
    expect(blankResult.documentType).toBe("Invoice");
    expect(blankResult.suggestedStatus).toBe("REVIEW_REQUIRED");
    expect(blankResult.rawOcrText).toBe("");

    const vendorF = blankResult.extractedFields.find((f) => f.fieldName === "vendor");
    expect(vendorF?.extractedValue).toBe("");
    expect(vendorF?.confidence).toBe(0);

    const totalF = blankResult.extractedFields.find((f) => f.fieldName === "total");
    expect(totalF?.extractedValue).toBe("");
    expect(totalF?.confidence).toBe(0);

    const invNumF = blankResult.extractedFields.find((f) => f.fieldName === "invoice_number");
    expect(invNumF?.extractedValue).toBe("");
    expect(invNumF?.confidence).toBe(0);

    // Partial invoice with only vendor and total, missing invoice number and tax
    const partialOcr = "TAX INVOICE\nSeller: Delta Systems\nTotal: $450.00";
    const partialResult = await processDocumentContent("partial_invoice.pdf", partialOcr);
    expect(partialResult.suggestedStatus).toBe("REVIEW_REQUIRED");

    const partialVendor = partialResult.extractedFields.find((f) => f.fieldName === "vendor");
    expect(partialVendor?.extractedValue).toBe("Delta Systems");
    expect(partialVendor?.confidence).toBeGreaterThan(0.9);

    const partialTotal = partialResult.extractedFields.find((f) => f.fieldName === "total");
    expect(partialTotal?.extractedValue).toBe("450");

    const partialInvNum = partialResult.extractedFields.find((f) => f.fieldName === "invoice_number");
    expect(partialInvNum?.extractedValue).toBe("");
    expect(partialInvNum?.confidence).toBe(0);
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

  describe("Open-Domain Dynamic Key-Value Pair Extraction Engine", () => {
    it("should infer data types accurately for dynamic values", () => {
      expect(inferDataType("$1,450.00")).toBe("currency");
      expect(inferDataType("INR 75,000")).toBe("currency");
      expect(inferDataType("2026-10-14")).toBe("date");
      expect(inferDataType("14/10/2026")).toBe("date");
      expect(inferDataType("Oct 14, 2026")).toBe("date");
      expect(inferDataType("42")).toBe("number");
      expect(inferDataType("-10.5")).toBe("number");
      expect(inferDataType("true")).toBe("boolean");
      expect(inferDataType("No")).toBe("boolean");
      expect(inferDataType("Acute Bronchitis")).toBe("string");
      expect(inferDataType("Rajesh Sharma")).toBe("string");
    });

    it("should convert arbitrary human-readable labels into normalized snake_case identifiers", () => {
      expect(labelToFieldName("Patient Name")).toBe("patient_name");
      expect(labelToFieldName("Blood Group / Rh")).toBe("blood_group_rh");
      expect(labelToFieldName("GSTIN / Tax ID")).toBe("gstin_tax_id");
      expect(labelToFieldName("Waybill No.")).toBe("waybill_no");
      expect(labelToFieldName("Container #")).toBe("container");
    });

    it("should dynamically extract open-domain entities from non-templated documents (e.g. Medical Report)", async () => {
      const medicalReportText = `APOLLO HOSPITALS DISCHARGE SUMMARY
Patient Name: Rajesh Sharma
Patient ID: PID-99214
Age: 42
Admission Date: 2026-10-14
Blood Group: B+
Diagnosis: Acute Coronary Syndrome
Consultant: Dr. Arvind Mehra (Cardiology)
Room No: 402-B
Estimated Bill: INR 1,45,000.00`;

      const result = await processDocumentContent("patient_discharge_summary.pdf", medicalReportText);

      expect(result.extractedFields.length).toBeGreaterThanOrEqual(8);

      const patientName = result.extractedFields.find((f) => f.fieldName === "patient_name");
      expect(patientName).toBeDefined();
      expect(patientName?.extractedValue).toBe("Rajesh Sharma");
      expect(patientName?.confidence).toBeGreaterThanOrEqual(0.95);

      const patientId = result.extractedFields.find((f) => f.fieldName === "patient_id");
      expect(patientId?.extractedValue).toBe("PID-99214");

      const age = result.extractedFields.find((f) => f.fieldName === "age");
      expect(age?.extractedValue).toBe("42");
      expect(age?.dataType).toBe("number");

      const bloodGroup = result.extractedFields.find((f) => f.fieldName === "blood_group");
      expect(bloodGroup?.extractedValue).toBe("B+");

      const diagnosis = result.extractedFields.find((f) => f.fieldName === "diagnosis");
      expect(diagnosis?.extractedValue).toBe("Acute Coronary Syndrome");

      const estBill = result.extractedFields.find((f) => f.fieldName === "estimated_bill");
      expect(estBill?.extractedValue).toBe("INR 1,45,000.00");
      expect(estBill?.dataType).toBe("currency");
    });

    it("should dynamically extract open-domain entities from shipping waybills without pre-planned schema", async () => {
      const shippingWaybillText = `MAERSK LOGISTICS INTERNATIONAL
Waybill Number: MAEU-9812489
Vessel Name: Maersk Sentosa
Port of Loading: Mumbai Port (INBOM)
Port of Discharge: Rotterdam (NLRTM)
Container No: MSCU-4910293
Container Type: 40ft High Cube
Gross Weight: 18450 kg
Seal Number: SL-992014
Customs Status: Cleared`;

      const result = await processDocumentContent("waybill_delivery_pod.pdf", shippingWaybillText);

      const waybill = result.extractedFields.find((f) => f.fieldName === "waybill_number");
      expect(waybill?.extractedValue).toBe("MAEU-9812489");

      const vessel = result.extractedFields.find((f) => f.fieldName === "vessel_name");
      expect(vessel?.extractedValue).toBe("Maersk Sentosa");

      const portLoading = result.extractedFields.find((f) => f.fieldName === "port_of_loading");
      expect(portLoading?.extractedValue).toBe("Mumbai Port (INBOM)");

      const container = result.extractedFields.find((f) => f.fieldName === "container_no");
      expect(container?.extractedValue).toBe("MSCU-4910293");

      const seal = result.extractedFields.find((f) => f.fieldName === "seal_number");
      expect(seal?.extractedValue).toBe("SL-992014");
    });

    it("should discover and append custom dynamic attributes on invoices alongside canonical fields", async () => {
      const invoiceWithExtras = `TAX INVOICE
Supplier: Apex Global Tech Ltd
Client: Vertex Solutions
Invoice No: INV-2026-88
Date: 2026-10-01
Total Payable: USD 9,250.00
PO Reference: PO-2026-991
GSTIN / Tax ID: 27AABCA1234F1Z9
Payment Terms: Net 30 Days
Ship Via: FedEx Priority Freight
Tracking No: 789214791024`;

      const result = await processDocumentContent("Invoice_CustomExtras.pdf", invoiceWithExtras);

      // Standard canonical fields
      expect(result.extractedFields.find((f) => f.fieldName === "vendor")?.extractedValue).toBe("Apex Global Tech Ltd");
      expect(result.extractedFields.find((f) => f.fieldName === "total")?.extractedValue).toBe("9250");
      expect(result.extractedFields.find((f) => f.fieldName === "invoice_number")?.extractedValue).toBe("INV-2026-88");

      // Dynamically discovered un-preplanned fields
      const poRef = result.extractedFields.find((f) => f.fieldName === "po_reference");
      expect(poRef).toBeDefined();
      expect(poRef?.extractedValue).toBe("PO-2026-991");

      const gstin = result.extractedFields.find((f) => f.fieldName === "gstin_tax_id");
      expect(gstin).toBeDefined();
      expect(gstin?.extractedValue).toBe("27AABCA1234F1Z9");

      const paymentTerms = result.extractedFields.find((f) => f.fieldName === "payment_terms");
      expect(paymentTerms).toBeDefined();
      expect(paymentTerms?.extractedValue).toBe("Net 30 Days");

      const shipVia = result.extractedFields.find((f) => f.fieldName === "ship_via");
      expect(shipVia).toBeDefined();
      expect(shipVia?.extractedValue).toBe("FedEx Priority Freight");

      const tracking = result.extractedFields.find((f) => f.fieldName === "tracking_no");
      expect(tracking).toBeDefined();
      expect(tracking?.extractedValue).toBe("789214791024");
    });
  });
});
