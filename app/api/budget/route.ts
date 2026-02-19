import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { getBudgetSummary } from "@/lib/budget";

export async function GET() {
  const auth = await requireApiAuth();
  if (auth.response) {
    return auth.response;
  }

  const summary = await getBudgetSummary();

  return NextResponse.json({
    balanceCents: summary.totalCents,
    totalCents: summary.totalCents,
    deposits: summary.deposits,
  });
}
