import { GalleryClient } from "@/app/gallery/gallery-client";
import { requirePageAuth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function GalleryPage() {
  await requirePageAuth("/gallery");
  const images = await prisma.image.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <GalleryClient initialImages={images.map((image) => ({ ...image, createdAt: image.createdAt.toISOString() }))} />;
}
