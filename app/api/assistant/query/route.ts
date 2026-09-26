import { NextResponse } from "next/server";
import { queryDocumentRAG } from "@/lib/rag/semantic-search";
import { INITIAL_DOCUMENTS } from "@/lib/store/demo-data";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    if (!query) {
      return NextResponse.json({ success: false, error: "Query is required" }, { status: 400 });
    }

    const result = await queryDocumentRAG(query, INITIAL_DOCUMENTS);

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
