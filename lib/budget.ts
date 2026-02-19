import { prisma } from "@/lib/prisma";
import { verifyBudgetPasswordHash } from "@/lib/budget-password";

export async function verifyBudgetPassword(password: string) {
  const config = await prisma.budgetConfig.findUnique({ where: { id: 1 } });

  if (!config) {
    return false;
  }

  return verifyBudgetPasswordHash(password, config.budgetPasswordHash);
}

export async function getBudgetSummary() {
  const deposits = await prisma.deposit.findMany({
    orderBy: { createdAt: "desc" },
  });

  const totalCents = deposits.reduce((acc, entry) => acc + entry.amountCents, 0);

  return {
    deposits,
    totalCents,
  };
}
