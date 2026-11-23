import { describe, it, expect } from "vitest";
import { processDocumentContent } from "../lib/ai/document-processor";

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
});
