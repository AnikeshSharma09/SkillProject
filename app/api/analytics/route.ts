import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    data: {
      documentsProcessed: 2481,
      automationRate: 0.914,
      humanReviewRate: 0.086,
      averageProcessingTimeSeconds: 3.8,
      workflowSuccessRate: 0.984,
      pendingApprovals: 27,
      aiAccuracy: 0.982,
    },
  });
}
