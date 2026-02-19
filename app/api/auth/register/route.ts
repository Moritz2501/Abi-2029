import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/schemas";

export async function POST(request: Request) {
  try {
    const payload = registerSchema.parse(await request.json());

    const existing = await prisma.user.findUnique({
      where: { username: payload.username },
    });

    if (existing) {
      return NextResponse.json({ error: "Benutzername bereits vergeben." }, { status: 409 });
    }

    const passwordHash = await hashPassword(payload.password);

    const user = await prisma.user.create({
      data: {
        username: payload.username,
        passwordHash,
      },
      select: {
        id: true,
        username: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Ungültige Registrierungsdaten." }, { status: 400 });
  }
}
