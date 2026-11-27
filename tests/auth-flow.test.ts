import { describe, it, expect } from "vitest";
import { DEMO_USERS } from "../lib/store/demo-data";

describe("Corporate Authentication & Registration Flow", () => {
  it("should have all 5 authorized company personnel configured with passwords and roles", () => {
    expect(DEMO_USERS.length).toBe(5);

    const anikesh = DEMO_USERS.find((u) => u.email === "anikesh.sharma@aiflow.company");
    expect(anikesh).toBeDefined();
    expect(anikesh?.role).toBe("ADMIN");
    expect(anikesh?.password).toBe("Admin@2026#Secure");
    expect(anikesh?.department).toContain("Leadership");

    const sarah = DEMO_USERS.find((u) => u.email === "sarah.chen@aiflow.company");
    expect(sarah).toBeDefined();
    expect(sarah?.role).toBe("ADMIN");
    expect(sarah?.password).toBe("Finance#Sarah2026");
    expect(sarah?.department).toContain("Finance");

    const vikram = DEMO_USERS.find((u) => u.email === "vikram.patel@aiflow.company");
    expect(vikram).toBeDefined();
    expect(vikram?.role).toBe("MANAGER");
    expect(vikram?.password).toBe("Ops@Vikram2026!");
    expect(vikram?.department).toContain("Operations");

    const elena = DEMO_USERS.find((u) => u.email === "elena.rostova@aiflow.company");
    expect(elena).toBeDefined();
    expect(elena?.role).toBe("APPROVER");
    expect(elena?.password).toBe("Audit@Elena2026");
    expect(elena?.department).toContain("Compliance");

    const rahul = DEMO_USERS.find((u) => u.email === "rahul.sharma@aiflow.company");
    expect(rahul).toBeDefined();
    expect(rahul?.role).toBe("EMPLOYEE");
    expect(rahul?.password).toBe("Rahul@Accounts2026");
    expect(rahul?.department).toContain("Accounts");
  });

  it("should validate passwords with case-sensitivity and character length", () => {
    const admin = DEMO_USERS.find((u) => u.role === "ADMIN");
    expect(admin?.password).toBeDefined();
    expect(admin?.password?.length).toBeGreaterThanOrEqual(8);

    // Ensure password check is exact
    expect(admin?.password === "admin@2026#secure").toBe(false);
    expect(admin?.password === "Admin@2026#Secure").toBe(true);
  });
});
