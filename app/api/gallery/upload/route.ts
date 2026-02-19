import { NextResponse } from "next/server";
import { requireApiAuth } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import {
  maxUploadSizeBytes,
  validateUploadMimeType,
} from "@/lib/schemas";
import { buildStoredFileName, saveUploadedFile } from "@/lib/upload";

export async function POST(request: Request) {
  const auth = await requireApiAuth();
  if (auth.response) {
    return auth.response;
  }

  const formData = await request.formData();
  const file = formData.get("image");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Keine Datei empfangen." }, { status: 400 });
  }

  if (!validateUploadMimeType(file.type)) {
    return NextResponse.json(
      { error: "Nur JPG, PNG und WEBP sind erlaubt." },
      { status: 400 },
    );
  }

  if (file.size > maxUploadSizeBytes) {
    return NextResponse.json(
      { error: "Datei ist zu groß (max. 10 MB)." },
      { status: 400 },
    );
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);
  const storedName = buildStoredFileName(file.name);

  await saveUploadedFile(buffer, storedName);

  const image = await prisma.image.create({
    data: {
      filename: storedName,
      originalName: file.name,
      mimeType: file.type,
      sizeBytes: file.size,
    },
  });

  return NextResponse.json({ image }, { status: 201 });
}
