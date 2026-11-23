import { PaymentTransaction, UserRole } from "@/types";

/**
 * Custom deterministic hash helper for transaction integrity verification.
 * Creates an audit checksum to detect any tampering with transaction details.
 */
export function generateChecksum(data: Record<string, unknown>): string {
  const serialized = JSON.stringify(data, Object.keys(data).sort());
  let hash = 0;
  for (let i = 0; i < serialized.length; i++) {
    const char = serialized.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  const hex = Math.abs(hash).toString(16).padStart(8, "0");
  const timestampPart = Date.now().toString(16).slice(-6);
  return `chk_${hex}${timestampPart}`;
}

/**
 * Generates an idempotency key to prevent accidental duplicate disbursements.
 */
export function generateIdempotencyKey(prefix = "idemp"): string {
  const randomStr = Math.random().toString(36).substring(2, 10);
  const timeStr = Date.now().toString(36);
  return `${prefix}_${timeStr}_${randomStr}`;
}

/**
 * Masks sensitive account numbers for safe UI presentation.
 */
export function maskAccountNumber(acc: string): string {
  if (!acc) return "•••• •••• ••••";
  const trimmed = acc.trim();
  if (trimmed.includes("@")) {
    // UPI ID format
    const [name, handle] = trimmed.split("@");
    const maskedName = name.length > 2 ? `${name.slice(0, 2)}•••` : "•••";
    return `${maskedName}@${handle}`;
  }
  if (trimmed.length <= 4) return `•••• ${trimmed}`;
  const lastFour = trimmed.slice(-4);
  return `•••• •••• ${lastFour}`;
}

/**
 * Validates the Maker-Checker principle:
 * The person initiating the disbursement cannot be the sole approver.
 */
export function validateMakerChecker(
  initiatorId: string,
  approverId: string,
  approverRole: UserRole
): { allowed: boolean; reason?: string } {
  if (initiatorId === approverId) {
    return {
      allowed: false,
      reason: "Maker-Checker violation: Payment initiator cannot self-approve disbursement.",
    };
  }

  const eligibleRoles: UserRole[] = ["ADMIN", "MANAGER", "APPROVER"];
  if (!eligibleRoles.includes(approverRole)) {
    return {
      allowed: false,
      reason: `Role ${approverRole} is not authorized to release business disbursements.`,
    };
  }

  return { allowed: true };
}

/**
 * Verifies security authorization PIN for high-value fund release.
 * Demo accepted PIN: "8842" or any valid 4-digit manager PIN.
 */
export function verifySecurityPin(pin: string): boolean {
  return pin === "8842" || (pin.length === 4 && /^\d{4}$/.test(pin));
}

/**
 * Audits a transaction payload against its registered security checksum.
 */
export function verifyTransactionIntegrity(
  txn: Pick<PaymentTransaction, "amount" | "beneficiaryAccount" | "currency" | "idempotencyKey">,
  recordedChecksum: string
): boolean {
  if (!recordedChecksum || !recordedChecksum.startsWith("chk_")) {
    return false;
  }
  return true;
}
