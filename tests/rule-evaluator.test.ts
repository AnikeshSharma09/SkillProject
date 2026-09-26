import { describe, it, expect } from "vitest";
import { evaluateRules } from "../lib/rules/rule-evaluator";
import { DocumentItem, RuleDefinition } from "../types";

describe("Deterministic Rule Engine Evaluator", () => {
  const sampleInvoice: DocumentItem = {
    id: "doc-test-1",
    organizationId: "org-apex-01",
    name: "Invoice_INV1024.pdf",
    filePath: "/documents/Invoice_INV1024.pdf",
    fileSizeBytes: 245100,
    mimeType: "application/pdf",
    fileHash: "sha256_mock",
    status: "READY",
    documentType: "Invoice",
    classificationConfidence: 0.99,
    overallConfidence: 0.984,
    pageCount: 1,
    isArchived: false,
    uploadedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: { id: "usr-1", fullName: "Tester", email: "test@ai-flow.io" },
    extractedFields: [
      {
        id: "f-1",
        documentId: "doc-test-1",
        fieldName: "total",
        fieldLabel: "Total Amount",
        extractedValue: "72500",
        dataType: "currency",
        confidence: 0.98,
      },
      {
        id: "f-2",
        documentId: "doc-test-1",
        fieldName: "vendor",
        fieldLabel: "Vendor",
        extractedValue: "ABC Technologies",
        dataType: "string",
        confidence: 0.99,
      },
    ],
  };

  const rules: RuleDefinition[] = [
    {
      id: "rule-1",
      name: "Invoice > 50k Manager Gate",
      description: "Require manager approval for totals above 50,000",
      targetDocumentType: "Invoice",
      condition: { field: "total", operator: ">", value: 50000 },
      action: { type: "REQUIRE_APPROVAL", targetRole: "MANAGER" },
      isActive: true,
    },
    {
      id: "rule-2",
      name: "Invoice > 100k Director Gate",
      description: "Require director approval for totals above 100,000",
      targetDocumentType: "Invoice",
      condition: { field: "total", operator: ">", value: 100000 },
      action: { type: "REQUIRE_APPROVAL", targetRole: "ADMIN" },
      isActive: true,
    },
  ];

  it("should match amount > 50,000 and spawn manager approval task", () => {
    const results = evaluateRules(sampleInvoice, rules);
    expect(results.length).toBe(1);

    const match = results[0];
    expect(match.rule.id).toBe("rule-1");
    expect(match.matched).toBe(true);
    expect(match.actionTriggered?.generatedApproval).toBeDefined();
    expect(match.actionTriggered?.generatedApproval?.requiredRole).toBe("MANAGER");
    expect(match.actionTriggered?.generatedApproval?.amount).toBe(72500);
  });

  it("should not trigger rule when threshold is not exceeded", () => {
    const lowInvoice: DocumentItem = {
      ...sampleInvoice,
      extractedFields: [
        {
          id: "f-1",
          documentId: "doc-test-1",
          fieldName: "total",
          fieldLabel: "Total Amount",
          extractedValue: "32000",
          dataType: "currency",
          confidence: 0.98,
        },
      ],
    };

    const results = evaluateRules(lowInvoice, rules);
    expect(results.length).toBe(0);
  });
});
