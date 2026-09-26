import { describe, it, expect } from "vitest";
import { generateWorkflowFromPrompt } from "../lib/workflow/workflow-generator";

describe("AI Workflow Generator", () => {
  it("should generate a valid DAG from natural language prompt", () => {
    const prompt =
      "Whenever an invoice above ₹50,000 is uploaded, send it to the department manager for approval. If approved, send it to finance and archive it.";

    const workflow = generateWorkflowFromPrompt(prompt);

    expect(workflow).toBeDefined();
    expect(workflow.name).toContain("AI:");
    expect(workflow.nodes.length).toBeGreaterThanOrEqual(7);
    expect(workflow.edges.length).toBeGreaterThanOrEqual(6);

    // Verify key nodes exist
    const nodeTypes = workflow.nodes.map((n) => n.type);
    expect(nodeTypes).toContain("START");
    expect(nodeTypes).toContain("AI_EXTRACTION");
    expect(nodeTypes).toContain("CONDITION");
    expect(nodeTypes).toContain("APPROVAL");
    expect(nodeTypes).toContain("API_CALL");
    expect(nodeTypes).toContain("ARCHIVE");
    expect(nodeTypes).toContain("END");

    // Verify condition node configuration
    const condNode = workflow.nodes.find((n) => n.type === "CONDITION");
    expect(condNode?.config.field).toBe("total");
    expect(condNode?.config.operator).toBe(">");
    expect(condNode?.config.value).toBe(50000);
  });
});
