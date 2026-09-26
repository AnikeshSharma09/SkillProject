import { NextResponse } from "next/server";
import { INITIAL_APPROVALS } from "@/lib/store/demo-data";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolved = await params;
  const body = await request.json().catch(() => ({}));
  const task = INITIAL_APPROVALS.find((a) => a.id === resolved.id);

  if (!task) {
    return NextResponse.json({ success: false, error: "Task not found" }, { status: 404 });
  }

  return NextResponse.json({
    success: true,
    data: {
      id: task.id,
      status: "REJECTED",
      decidedAt: new Date().toISOString(),
      decidedBy: "API Approver",
      comment: body.comment || "Rejected via API",
    },
  });
}
