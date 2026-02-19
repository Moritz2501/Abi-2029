import Link from "next/link";
import { Card } from "@/components/card";
import { isAuthenticated } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const announcements = await prisma.announcement.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
  });
  const loggedIn = await isAuthenticated();

  return (
    <div className="space-y-6">
      <Card>
        <h1 className="text-2xl font-bold">Abitur 2029 – Maria Wächtler Gymnasium</h1>
        <p className="mt-2 text-sm text-[#780D16]/80">
          Willkommen im internen Portal für Kommunikation, Galerie, Budget und Ankündigungen.
        </p>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <Link className="rounded-xl border border-[#780D16]/35 px-3 py-1.5 hover:bg-[#780D16]/5" href="/login">
            {loggedIn ? "Zum Bereich" : "Login"}
          </Link>
          {loggedIn ? (
            <>
              <Link className="rounded-xl border border-[#780D16]/35 px-3 py-1.5 hover:bg-[#780D16]/5" href="/chat">
                Chat öffnen
              </Link>
              <Link className="rounded-xl border border-[#780D16]/35 px-3 py-1.5 hover:bg-[#780D16]/5" href="/gallery">
                Galerie öffnen
              </Link>
              <Link className="rounded-xl border border-[#780D16]/35 px-3 py-1.5 hover:bg-[#780D16]/5" href="/budget">
                Budget öffnen
              </Link>
            </>
          ) : null}
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
