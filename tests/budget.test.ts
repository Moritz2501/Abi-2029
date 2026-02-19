import { describe, expect, it } from "vitest";
import bcrypt from "bcryptjs";
import { verifyBudgetPasswordHash } from "@/lib/budget-password";

describe("budget password", () => {
  it("erlaubt Einzahlung nur mit richtigem Budget-Passwort", async () => {
    const hash = await bcrypt.hash(process.env.BUDGET_PASSWORD ?? "budget", 10);

    const valid = await verifyBudgetPasswordHash(
      process.env.BUDGET_PASSWORD ?? "budget",
      hash,
    );
    const invalid = await verifyBudgetPasswordHash("falsch", hash);

    expect(valid).toBe(true);
    expect(invalid).toBe(false);
  });
});
