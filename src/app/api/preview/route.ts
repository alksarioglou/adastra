import { NextResponse } from "next/server";
import { mockPreview } from "@/lib/mock";

// POST /api/preview  { premise, leads } -> PreviewResult
// TODO: trigger the partner's 3D campaign render and return the asset URL.
export async function POST(req: Request) {
  await req.json().catch(() => ({}));

  await new Promise((r) => setTimeout(r, 2200));

  return NextResponse.json(mockPreview);
}
