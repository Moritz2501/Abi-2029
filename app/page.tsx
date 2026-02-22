import Link from "next/link";
import { Card } from "@/components/card";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function Home() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-2xl font-bold">Abitur 2029 – Maria Wächtler Gymnasium</h1>
        <p className="mt-2 text-sm text-[#780D16]/80">
          Willkommen im internen Portal für Kommunikation, Budget und Ankündigungen.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link className="rounded-xl border border-[#780D16]/35 px-3 py-1.5 hover:bg-[#780D16]/5" href="/chat">
            Zum Bereich
          </Link>
          <Link className="rounded-xl border border-[#780D16]/35 px-3 py-1.5 hover:bg-[#780D16]/5" href="/budget">
            Budget öffnen
          </Link>
        </div>
      </Card>

      <Card title="Neueste Ankündigungen">
        {announcements.length === 0 ? (
          <p className="text-sm text-[#780D16]/70">Noch keine Ankündigungen vorhanden.</p>
        ) : (
          <ul className="space-y-3">
            {announcements.map((announcement) => (
              <li className="rounded-xl border border-[#780D16]/20 p-3" key={announcement.id}>
                <h3 className="font-semibold">{announcement.title}</h3>
                <p className="mt-1 whitespace-pre-wrap text-sm text-[#780D16]/85">{announcement.body}</p>
                <p className="mt-2 text-xs text-[#780D16]/65">
                  {new Date(announcement.createdAt).toLocaleString("de-DE")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
