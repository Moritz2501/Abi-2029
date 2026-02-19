import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/schemas";

export async function GET() {
  const auth = await requireApiAuth();
  if (auth.response) {
    return auth.response;
  }

  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
  const auth = await requireApiAuth();
  if (auth.response) {
    return auth.response;
  }

  try {
    const payload = messageSchema.parse(await request.json());

    const message = await prisma.message.create({
      data: {
        text: payload.text,
        displayName: payload.displayName?.trim() || null,
      },
    });

    return NextResponse.json({ message }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Ungültige Nachricht." }, { status: 400 });
  }
}
