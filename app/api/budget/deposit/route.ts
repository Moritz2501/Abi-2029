import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { depositSchema } from "@/lib/schemas";
import { verifyBudgetPassword } from "@/lib/budget";

export async function POST(request: Request) {
  const auth = await requireApiAuth();
  if (auth.response) {
    return auth.response;
  }

  try {
    const payload = depositSchema.parse(await request.json());

    const validBudgetPassword = await verifyBudgetPassword(payload.budgetPassword);
    if (!validBudgetPassword) {
      return NextResponse.json(
        { error: "Budget-Passwort ist falsch." },
        { status: 401 },
      );
    }

    const amountCents = Math.round(payload.amount * 100);

    const deposit = await prisma.deposit.create({
      data: {
        amountCents,
        note: payload.note?.trim() || null,
      },
    });

    return NextResponse.json({ deposit }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Ungültige Einzahlungsdaten." }, { status: 400 });
  }
}
