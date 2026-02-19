import { describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import { verifyLoginCredentials } from "@/lib/login-service";

describe("login", () => {
  it("akzeptiert korrekte Zugangsdaten", async () => {
    const passwordHash = await bcrypt.hash(process.env.AUTH_PASSWORD ?? "secret", 10);

    const ok = await verifyLoginCredentials({
      password: process.env.AUTH_PASSWORD ?? "secret",
      passwordHash,
    });

    expect(ok).toBe(true);
  });

  it("lehnt falsches Passwort ab", async () => {
    const passwordHash = await bcrypt.hash(process.env.AUTH_PASSWORD ?? "secret", 10);

    const ok = await verifyLoginCredentials({
      password: "falsch",
      passwordHash,
    });

    expect(ok).toBe(false);
  });
});
