import { NextResponse } from "next/server";
import { INITIAL_DOCUMENTS } from "@/lib/store/demo-data";
import { processDocumentContent } from "@/lib/ai/document-processor";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const type = searchParams.get("type");

  let docs = [...INITIAL_DOCUMENTS];

  if (status && status !== "ALL") {
    docs = docs.filter((d) => d.status === status);
  }

  if (type && type !== "ALL") {
    docs = docs.filter((d) => d.documentType === type);
  }

  return NextResponse.json({
    success: true,
    data: docs,
    total: docs.length,
  });
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const fileName = file ? file.name : "Uploaded_Document.pdf";

    const result = await processDocumentContent(fileName);

    const newDoc = {
      id: `doc-${Date.now()}`,
      organizationId: "org-symbiosis-01",
      name: fileName,
      filePath: `/documents/${fileName}`,
      fileSizeBytes: file?.size || 245100,
      mimeType: file?.type || "application/pdf",
      fileHash: `sha256_${Math.random().toString(36).substring(2, 10)}`,
      status: result.suggestedStatus,
      documentType: result.documentType,
      classificationConfidence: result.classificationConfidence,
      overallConfidence: result.overallConfidence,
      rawOcrText: result.rawOcrText,
      pageCount: 1,
      extractedFields: result.extractedFields,
      isArchived: false,
      uploadedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: {
        id: "usr-admin-01",
        fullName: "API Uploader",
        email: "system@ai-flow.internal",
      },
    };

    return NextResponse.json({
      success: true,
      data: newDoc,
      meta: {
        latencyMs: result.latencyMs,
        tokensUsed: result.tokensUsed,
      },
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process document" },
      { status: 500 }
    );
  }
}
