"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  return (
    <button
      className="rounded-xl border border-black/20 px-3 py-1.5 text-sm hover:bg-black/5 disabled:opacity-60"
      disabled={loading}
      onClick={async () => {
        setLoading(true);
        await fetch("/api/auth/logout", { method: "POST" });
        router.push("/");
        router.refresh();
      }}
      type="button"
    >
      {loading ? "Abmelden..." : "Abmelden"}
    </button>
  );
}
