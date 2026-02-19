import { NextRequest, NextResponse } from "next/server";
import { createSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth";
import { verifyLoginCredentials } from "@/lib/login-service";
import { prisma } from "@/lib/prisma";
import { isRateLimited } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/schemas";

function getRequestIp(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() ?? "unknown";
  }

  return "unknown";
}

export async function POST(request: NextRequest) {
  try {
    const payload = loginSchema.parse(await request.json());
    const ip = getRequestIp(request);
    const rateKey = `${ip}:${payload.username}`;

    if (isRateLimited(rateKey, 5, 15 * 60 * 1000)) {
      return NextResponse.json(
        { error: "Zu viele Login-Versuche. Bitte später erneut probieren." },
        { status: 429 },
      );
    }

    const user = await prisma.user.findUnique({
      where: { username: payload.username },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Ungültiger Benutzername oder Passwort." },
        { status: 401 },
      );
    }

    const valid = await verifyLoginCredentials({
      password: payload.password,
      passwordHash: user.passwordHash,
    });
    if (!valid) {
      return NextResponse.json(
        { error: "Ungültiger Benutzername oder Passwort." },
        { status: 401 },
      );
    }

    const token = await createSessionToken({ username: user.username });
    const response = NextResponse.json({ success: true });

    response.cookies.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Ungültige Eingabedaten." }, { status: 400 });
  }
}
