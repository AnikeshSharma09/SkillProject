import { describe, it, expect } from "vitest";
import {
  generateChecksum,
  generateIdempotencyKey,
  maskAccountNumber,
  validateMakerChecker,
  verifySecurityPin,
  verifyTransactionIntegrity,
} from "../lib/security/payment-pipeline";

describe("Payment Security Pipeline Engine", () => {
  it("generates deterministic audit checksums and detects payload variations", () => {
    const payloadA = {
      amount: 72500,
      beneficiaryAccount: "501004928104",
      currency: "INR",
      idempotencyKey: "idemp_test_101",
    };

    const checksumA = generateChecksum(payloadA);
    expect(checksumA).toMatch(/^chk_/);

    const payloadB = {
      ...payloadA,
      amount: 72501, // Slight tampering with amount
    };

    const checksumB = generateChecksum(payloadB);
    expect(checksumA).not.toBe(checksumB);
  });

  it("masks account numbers and UPI identifiers safely", () => {
    expect(maskAccountNumber("501004928104")).toBe("•••• •••• 8104");
    expect(maskAccountNumber("vikram.patel@okaxis")).toBe("vi•••@okaxis");
    expect(maskAccountNumber("123")).toBe("•••• 123");
    expect(maskAccountNumber("")).toBe("•••• •••• ••••");
  });

  it("enforces Maker-Checker separation of duties", () => {
    // 1. Initiator cannot self-approve
    const selfApproval = validateMakerChecker("usr-01", "usr-01", "ADMIN");
    expect(selfApproval.allowed).toBe(false);
    expect(selfApproval.reason).toContain("Maker-Checker violation");

    // 2. Unauthorized role cannot approve
    const employeeApproval = validateMakerChecker("usr-01", "usr-02", "EMPLOYEE");
    expect(employeeApproval.allowed).toBe(false);
    expect(employeeApproval.reason).toContain("not authorized");

    // 3. Authorized distinct approver succeeds
    const managerApproval = validateMakerChecker("usr-01", "usr-02", "MANAGER");
    expect(managerApproval.allowed).toBe(true);

    const adminApproval = validateMakerChecker("usr-01", "usr-03", "ADMIN");
    expect(adminApproval.allowed).toBe(true);
  });

  it("validates 4-digit security authorization PINs", () => {
    expect(verifySecurityPin("8842")).toBe(true);
    expect(verifySecurityPin("1234")).toBe(true);
    expect(verifySecurityPin("abc")).toBe(false);
    expect(verifySecurityPin("12345")).toBe(false);
    expect(verifySecurityPin("")).toBe(false);
  });

  it("generates distinct idempotency keys to prevent duplicate execution", () => {
    const key1 = generateIdempotencyKey();
    const key2 = generateIdempotencyKey();
    expect(key1).toMatch(/^idemp_/);
    expect(key2).toMatch(/^idemp_/);
    expect(key1).not.toBe(key2);
  });

  it("verifies transaction integrity seal format", () => {
    const txn = {
      amount: 50000,
      beneficiaryAccount: "•••• •••• 1234",
      currency: "INR",
      idempotencyKey: "idemp_test",
    };
    expect(verifyTransactionIntegrity(txn, "chk_abcd1234ef")).toBe(true);
    expect(verifyTransactionIntegrity(txn, "invalid_hash")).toBe(false);
    expect(verifyTransactionIntegrity(txn, "")).toBe(false);
  });
});
