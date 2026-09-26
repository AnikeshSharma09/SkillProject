import { NextResponse } from "next/server";
import { generateWorkflowFromPrompt } from "@/lib/workflow/workflow-generator";

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json();
    if (!prompt) {
      return NextResponse.json({ success: false, error: "Prompt is required" }, { status: 400 });
    }

    const workflow = generateWorkflowFromPrompt(prompt);

    return NextResponse.json({
      success: true,
      data: workflow,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
