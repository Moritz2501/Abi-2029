import { AdminAnnouncementsClient } from "@/app/admin/announcements/admin-announcements-client";
import { prisma } from "@/lib/prisma";

export default async function AdminAnnouncementsPage() {
  const announcements: Array<{
    id: number;
    title: string;
    body: string;
    createdAt: Date;
  }> = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <AdminAnnouncementsClient
      initialAnnouncements={announcements.map((announcement) => ({
        ...announcement,
        createdAt: announcement.createdAt.toISOString(),
      }))}
    />
  );
}
