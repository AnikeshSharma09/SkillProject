import { describe, it, expect } from "vitest";
import { queryDocumentRAG } from "../lib/rag/semantic-search";
import { DocumentItem } from "../types";

const TEST_DOCUMENTS: DocumentItem[] = [
  {
    id: "doc-inv-1024",
    organizationId: "org-symbiosis-01",
    name: "Invoice_INV1024.pdf",
    filePath: "/documents/Invoice_INV1024.pdf",
    fileSizeBytes: 245100,
    mimeType: "application/pdf",
    fileHash: "sha256_8f12a9bc41d2e8",
    status: "READY",
    documentType: "Invoice",
    classificationConfidence: 0.992,
    overallConfidence: 0.984,
    pageCount: 1,
    isArchived: false,
    uploadedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: { id: "usr-1", fullName: "Test User", email: "test@symbiosis.edu" },
    rawOcrText: "TAX INVOICE ABC Technologies Private Limited Invoice Total: INR 72,500 Payment Due Date: 2026-09-30",
    extractedFields: [
      { id: "f-1", documentId: "doc-inv-1024", fieldName: "total", fieldLabel: "Total Amount", extractedValue: "₹72,500", dataType: "currency", confidence: 0.99 },
      { id: "f-2", documentId: "doc-inv-1024", fieldName: "vendor", fieldLabel: "Vendor", extractedValue: "ABC Technologies", dataType: "string", confidence: 0.98 },
      { id: "f-3", documentId: "doc-inv-1024", fieldName: "due_date", fieldLabel: "Due Date", extractedValue: "2026-09-30", dataType: "date", confidence: 0.95 },
    ],
  },
];

describe("RAG Document Semantic Search", () => {
  it("should answer high-value invoice queries with inline citations", async () => {
    const query = "Which invoices exceed ₹50,000?";
    const response = await queryDocumentRAG(query, TEST_DOCUMENTS);

    expect(response.answer).toBeDefined();
    expect(response.answer).toContain("₹50,000");
    expect(response.sources.length).toBeGreaterThan(0);

    const firstSource = response.sources[0];
    expect(firstSource.documentName).toBeDefined();
    expect(firstSource.page).toBe(1);
    expect(firstSource.confidence).toBeGreaterThan(0.7);
  });

  it("should answer vendor and payment deadline queries", async () => {
    const query = "What is the payment deadline for ABC Technologies?";
    const response = await queryDocumentRAG(query, TEST_DOCUMENTS);

    expect(response.answer).toBeDefined();
    expect(response.sources.length).toBeGreaterThan(0);
  });
});
