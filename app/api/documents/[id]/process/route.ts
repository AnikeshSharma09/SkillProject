import { NextResponse } from "next/server";
import { INITIAL_DOCUMENTS } from "@/lib/store/demo-data";
import { processDocumentContent } from "@/lib/ai/document-processor";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const resolved = await params;
  const doc = INITIAL_DOCUMENTS.find((d) => d.id === resolved.id);

  if (!doc) {
    return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 });
  }

  const result = await processDocumentContent(doc.name, doc.rawOcrText);

  return NextResponse.json({
    success: true,
    data: {
      documentId: doc.id,
      status: "PROCESSING_COMPLETE",
      extractedFields: result.extractedFields,
      overallConfidence: result.overallConfidence,
      classificationConfidence: result.classificationConfidence,
    },
  });
}
