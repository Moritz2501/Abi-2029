import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireApiAuth();
  if (auth.response) {
    return auth.response;
  }

  const images = await prisma.image.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ images });
}
