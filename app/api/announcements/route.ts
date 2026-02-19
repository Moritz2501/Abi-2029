import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { announcementSchema } from "@/lib/schemas";

export async function GET() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  return NextResponse.json({ announcements });
}

export async function POST(request: Request) {
  const auth = await requireApiAuth();
  if (auth.response) {
    return auth.response;
  }

  try {
    const payload = announcementSchema.parse(await request.json());

    const announcement = await prisma.announcement.create({
      data: {
        title: payload.title,
        body: payload.body,
      },
    });

    return NextResponse.json({ announcement }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Ungültige Ankündigungsdaten." }, { status: 400 });
  }
}
