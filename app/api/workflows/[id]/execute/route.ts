import { NextResponse } from "next/server";
import { INITIAL_WORKFLOWS, INITIAL_DOCUMENTS } from "@/lib/store/demo-data";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolved = await params;
  const workflow = INITIAL_WORKFLOWS.find((w) => w.id === resolved.id);

  if (!workflow) {
    return NextResponse.json({ success: false, error: "Workflow not found" }, { status: 404 });
  }

  const runId = `run-${Date.now()}`;
  return NextResponse.json({
    success: true,
    data: {
      runId,
      workflowId: workflow.id,
      status: "COMPLETED",
      stepsExecuted: workflow.nodes.length,
      startedAt: new Date().toISOString(),
      completedAt: new Date().toISOString(),
      executionLog: workflow.nodes.map((node) => ({
        step: node.label,
        type: node.type,
        status: "SUCCESS",
      })),
    },
  });
}
