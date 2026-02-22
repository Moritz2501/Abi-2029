import { GalleryClient } from "@/app/gallery/gallery-client";
import { prisma } from "@/lib/prisma";

export default async function GalleryPage() {
  const images = await prisma.image.findMany({
    orderBy: { createdAt: "desc" },
  });

  return <GalleryClient initialImages={images.map((image) => ({ ...image, createdAt: image.createdAt.toISOString() }))} />;
}
