import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { messageSchema } from "@/lib/schemas";

export async function GET() {
  const messages = await prisma.message.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ messages });
}

export async function POST(request: Request) {
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
