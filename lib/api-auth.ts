import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";

export async function requireApiAuth() {
  const session = await getSession();

  if (!session) {
    return {
      session: null,
      response: NextResponse.json({ error: "Nicht eingeloggt." }, { status: 401 }),
    };
  }

  return {
    session,
    response: null,
  };
}
