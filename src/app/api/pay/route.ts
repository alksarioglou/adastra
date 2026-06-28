import { NextResponse } from "next/server";
import type { PaymentResult } from "@/lib/types";

// POST /api/pay -> PaymentResult  (mock — no real charge)
export async function POST(req: Request) {
  await req.json().catch(() => ({}));

  await new Promise((r) => setTimeout(r, 1600));

  const result: PaymentResult = {
    success: true,
    txId: "ADA-" + Math.random().toString(36).slice(2, 10).toUpperCase(),
    amount: "$2,400.00",
  };

  return NextResponse.json(result);
}
