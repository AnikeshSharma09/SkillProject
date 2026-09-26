import { NextResponse } from "next/server";
import { INITIAL_AUDIT_LOGS } from "@/lib/store/demo-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const entityType = searchParams.get("entityType");

  let logs = [...INITIAL_AUDIT_LOGS];
  if (entityType && entityType !== "ALL") {
    logs = logs.filter((l) => l.entityType === entityType);
  }

  return NextResponse.json({
    success: true,
    data: logs,
    total: logs.length,
  });
}
