import { describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import { verifyLoginCredentials } from "@/lib/login-service";

describe("login", () => {
  it("akzeptiert korrekte Zugangsdaten", async () => {
    const passwordHash = await bcrypt.hash(process.env.AUTH_PASSWORD ?? "secret", 10);

    const ok = await verifyLoginCredentials({
      expectedUsername: process.env.AUTH_USERNAME ?? "admin",
      username: process.env.AUTH_USERNAME ?? "admin",
      password: process.env.AUTH_PASSWORD ?? "secret",
      passwordHash,
    });

    expect(ok).toBe(true);
  });

  it("lehnt falsches Passwort ab", async () => {
    const passwordHash = await bcrypt.hash(process.env.AUTH_PASSWORD ?? "secret", 10);

    const ok = await verifyLoginCredentials({
      expectedUsername: process.env.AUTH_USERNAME ?? "admin",
      username: process.env.AUTH_USERNAME ?? "admin",
      password: "falsch",
      passwordHash,
    });

    expect(ok).toBe(false);
  });
});
