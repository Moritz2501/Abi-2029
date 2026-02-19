import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getUploadDirectoryAbsolutePath } from "@/lib/upload";

type Context = {
  params: Promise<{ filename: string }>;
};

export async function GET(_request: Request, context: Context) {
  const params = await context.params;
  const filename = params.filename;

  if (filename.includes("/") || filename.includes("\\")) {
    return new NextResponse("Invalid filename", { status: 400 });
  }

  const image = await prisma.image.findUnique({ where: { filename } });

  if (!image) {
    return new NextResponse("Not Found", { status: 404 });
  }

  const target = path.join(getUploadDirectoryAbsolutePath(), filename);
  const data = await readFile(target);

  return new NextResponse(data, {
    status: 200,
    headers: {
      "Content-Type": image.mimeType,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
