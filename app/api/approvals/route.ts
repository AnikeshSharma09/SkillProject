import { NextResponse } from "next/server";
import { INITIAL_APPROVALS } from "@/lib/store/demo-data";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");

  let list = [...INITIAL_APPROVALS];
  if (status && status !== "ALL") {
    list = list.filter((a) => a.status === status);
  }

  return NextResponse.json({
    success: true,
    data: list,
  });
}
