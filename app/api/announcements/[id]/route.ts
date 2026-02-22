import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { announcementSchema } from "@/lib/schemas";

type Context = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, context: Context) {
  const params = await context.params;
  const id = Number(params.id);

  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Ungültige ID." }, { status: 400 });
  }

  try {
    const payload = announcementSchema.parse(await request.json());

    const announcement = await prisma.announcement.update({
      where: { id },
      data: {
        title: payload.title,
        body: payload.body,
      },
    });

    return NextResponse.json({ announcement });
  } catch {
    return NextResponse.json({ error: "Ankündigung konnte nicht aktualisiert werden." }, { status: 400 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  const params = await context.params;
  const id = Number(params.id);

  if (!Number.isInteger(id)) {
    return NextResponse.json({ error: "Ungültige ID." }, { status: 400 });
  }

  await prisma.announcement.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
