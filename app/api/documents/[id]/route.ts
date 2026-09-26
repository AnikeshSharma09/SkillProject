import { NextResponse } from "next/server";
import { INITIAL_DOCUMENTS } from "@/lib/store/demo-data";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolved = await params;
  const doc = INITIAL_DOCUMENTS.find((d) => d.id === resolved.id);

  if (!doc) {
    return NextResponse.json(
      { success: false, error: "Document not found" },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    data: doc,
  });
}
