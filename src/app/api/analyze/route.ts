import { NextResponse } from "next/server";
import { generateJson } from "@/lib/openai";
import { fetchPageText } from "@/lib/scrape";
import { mockPremise } from "@/lib/mock";
import type { Premise } from "@/lib/types";

export const maxDuration = 60;

const SYSTEM = `You are a B2B go-to-market analyst. Given the text of a product's
website, identify the product and write a precise Ideal Customer Profile (ICP).
Return ONLY JSON with this exact shape:
{
  "productName": string,            // the product/brand name
  "keyFeature": string,             // one sentence: the core value proposition
  "icp": string[]                   // 10-14 concrete, specific ICP traits
}
ICP traits must be concrete and varied: cover company type & size, buyer roles/titles,
industry, geography (name real cities/regions), tooling they already use, budget signals,
buying triggers, and 1-2 sharp pain points. No vague filler.`;

// POST /api/analyze  { url } -> Premise
export async function POST(req: Request) {
  const { url } = await req.json().catch(() => ({ url: "" }));

  if (!url || typeof url !== "string") {
    return NextResponse.json({ error: "Missing url" }, { status: 400 });
  }

  try {
    const page = await fetchPageText(url);

    const premise = await generateJson<Premise>(
      SYSTEM,
      `Product URL: ${page.url}
Title: ${page.title}
Meta description: ${page.description}

Page text:
"""
${page.text}
"""`,
    );

    // Guard against a thin response so the UI always has a rich ICP.
    if (!premise?.productName || !Array.isArray(premise.icp) || premise.icp.length < 6) {
      return NextResponse.json(mockPremise(url));
    }

    return NextResponse.json(premise);
  } catch (err) {
    console.error("[analyze] falling back to mock:", err);
    return NextResponse.json(mockPremise(url));
  }
}
