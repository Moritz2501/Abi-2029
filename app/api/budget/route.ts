import { NextResponse } from "next/server";
import { getBudgetSummary } from "@/lib/budget";

export const dynamic = "force-dynamic";

export async function GET() {
  const summary = await getBudgetSummary();

  return NextResponse.json({
    balanceCents: summary.totalCents,
    totalCents: summary.totalCents,
    deposits: summary.deposits,
  });
}
