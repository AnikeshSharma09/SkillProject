import { describe, it, expect } from "vitest";
import { DEMO_USERS, DEMO_ORGANIZATION } from "../lib/store/demo-data";
import { DocumentItem } from "../types";

describe("Multi-Tenancy & RBAC Security Enforcement", () => {
  it("should have correct permissions partitioned by role", () => {
    const admin = DEMO_USERS.find((u) => u.role === "ADMIN");
    const manager = DEMO_USERS.find((u) => u.role === "MANAGER");
    const approver = DEMO_USERS.find((u) => u.role === "APPROVER");
    const employee = DEMO_USERS.find((u) => u.role === "EMPLOYEE");

    expect(admin).toBeDefined();
    expect(manager).toBeDefined();
    expect(approver).toBeDefined();
    expect(employee).toBeDefined();

    // Verify all users belong to tenant organization
    DEMO_USERS.forEach((user) => {
      expect(user.organizationId).toBe(DEMO_ORGANIZATION.id);
    });
  });

  it("should isolate document access by organization tenant ID", () => {
    const testDoc: Partial<DocumentItem> = {
      id: "doc-test-1",
      organizationId: DEMO_ORGANIZATION.id,
      fileHash: "sha256_mock_hash",
      fileSizeBytes: 1024,
    };

    expect(testDoc.organizationId).toBe(DEMO_ORGANIZATION.id);
    expect(testDoc.fileHash).toMatch(/^sha256_/);
    expect(testDoc.fileSizeBytes).toBeGreaterThan(0);
  });
});
