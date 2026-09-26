import { NextResponse } from "next/server";
import { INITIAL_WORKFLOWS } from "@/lib/store/demo-data";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: INITIAL_WORKFLOWS,
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newWorkflow = {
      id: `wf-${Date.now()}`,
      organizationId: "org-symbiosis-01",
      name: body.name || "Untitled Workflow",
      description: body.description || "Created via API",
      category: body.category || "Operations",
      isActive: body.isActive ?? true,
      version: 1,
      nodes: body.nodes || [],
      edges: body.edges || [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      runsCount: 0,
      successRate: 100,
    };

    return NextResponse.json({
      success: true,
      data: newWorkflow,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
