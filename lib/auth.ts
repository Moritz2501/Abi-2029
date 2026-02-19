import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { env } from "@/lib/env";

export const SESSION_COOKIE_NAME = "abi2029_session";

type SessionPayload = {
  username: string;
};

function secretKey() {
  return new TextEncoder().encode(env.SESSION_SECRET);
}

export async function hashPassword(password: string) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, passwordHash: string) {
  return bcrypt.compare(password, passwordHash);
}

export async function createSessionToken(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secretKey());
}

export async function verifySessionToken(token: string) {
  try {
    const verified = await jwtVerify(token, secretKey());
    const payload = verified.payload as SessionPayload;

    if (!payload.username) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  return verifySessionToken(sessionToken);
}

export async function isAuthenticated() {
  const session = await getSession();
  return Boolean(session?.username);
}

export async function requirePageAuth(pathAfterLogin = "/") {
  const authenticated = await isAuthenticated();

  if (!authenticated) {
    redirect(`/login?next=${encodeURIComponent(pathAfterLogin)}`);
  }
}
