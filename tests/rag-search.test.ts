import { describe, it, expect } from "vitest";
import { queryDocumentRAG } from "../lib/rag/semantic-search";
import { INITIAL_DOCUMENTS } from "../lib/store/demo-data";

describe("RAG Document Semantic Search", () => {
  it("should answer high-value invoice queries with inline citations", async () => {
    const query = "Which invoices exceed ₹50,000?";
    const response = await queryDocumentRAG(query, INITIAL_DOCUMENTS);

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
    const response = await queryDocumentRAG(query, INITIAL_DOCUMENTS);

    expect(response.answer).toBeDefined();
    expect(response.sources.length).toBeGreaterThan(0);
  });
});
