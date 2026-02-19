import bcrypt from "bcryptjs";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";

let lastSyncKey: string | null = null;
let lastSyncAt = 0;

export async function ensureFixedAccountSynced() {
  const syncKey = `${env.AUTH_USERNAME}:${env.AUTH_PASSWORD}:${env.BUDGET_PASSWORD}`;
  const now = Date.now();

  if (lastSyncKey === syncKey && now - lastSyncAt < 10 * 60 * 1000) {
    return;
  }

  const [passwordHash, budgetPasswordHash] = await Promise.all([
    bcrypt.hash(env.AUTH_PASSWORD, 12),
    bcrypt.hash(env.BUDGET_PASSWORD, 12),
  ]);

  await prisma.user.upsert({
    where: { username: env.AUTH_USERNAME },
    update: { passwordHash },
    create: {
      username: env.AUTH_USERNAME,
      passwordHash,
    },
  });

  await prisma.budgetConfig.upsert({
    where: { id: 1 },
    update: { budgetPasswordHash },
    create: {
      id: 1,
      budgetPasswordHash,
    },
  });

  lastSyncKey = syncKey;
  lastSyncAt = now;
}
