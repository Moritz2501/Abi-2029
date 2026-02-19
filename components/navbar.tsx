import Link from "next/link";
import { isAuthenticated } from "@/lib/auth";
import { LogoutButton } from "@/components/logout-button";

export async function Navbar() {
  const loggedIn = await isAuthenticated();

  return (
    <header className="border-b border-[#780D16]/30 bg-[#780D16] text-white">
      <nav className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-3 px-4 py-3">
        <Link className="font-semibold" href="/">
          Abitur 2029
        </Link>

        <div className="flex flex-wrap items-center gap-2 text-sm">
          <Link className="rounded-xl px-3 py-1.5 hover:bg-white/15" href="/">
            Start
          </Link>
          {loggedIn ? (
            <>
              <Link className="rounded-xl px-3 py-1.5 hover:bg-white/15" href="/chat">
                Chat
              </Link>
              <Link className="rounded-xl px-3 py-1.5 hover:bg-white/15" href="/gallery">
                Galerie
              </Link>
              <Link className="rounded-xl px-3 py-1.5 hover:bg-white/15" href="/budget">
                Budget
              </Link>
              <Link className="rounded-xl px-3 py-1.5 hover:bg-white/15" href="/admin/announcements">
                Admin
              </Link>
              <LogoutButton />
            </>
          ) : (
            <>
              <Link
                className="rounded-xl border border-white/70 bg-white px-3 py-1.5 text-[#780D16] hover:bg-white/90"
                href="/login"
              >
                Login
              </Link>
              <Link
                className="rounded-xl border border-white/70 px-3 py-1.5 text-white hover:bg-white/15"
                href="/register"
              >
                Registrieren
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
