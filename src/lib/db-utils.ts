import { prisma } from "@/lib/prisma";

// User Management
export async function getUserByUsername(username: string) {
  return await prisma.user.findUnique({
    where: { username },
  });
}

// Transaction Management
export async function getTotalCash() {
  const result = await prisma.transaction.aggregate({
    where: { status: "APPROVED" },
    _sum: {
      amount: true,
    },
  });
  return result._sum.amount || 0;
}

// Stats
export async function getStats() {
  const [totalUsers, approvedUsers, pendingUsers, totalCash] = await Promise.all([
    prisma.user.count(),
    prisma.user.count({
      where: { onboardingStatus: "APPROVED" },
    }),
    prisma.user.count({
      where: { onboardingStatus: "PENDING" },
    }),
    prisma.transaction.aggregate({
      where: { status: "APPROVED" },
      _sum: { amount: true },
    }),
  ]);

  return {
    totalUsers,
    approvedUsers,
    pendingUsers,
    totalCash: totalCash._sum.amount || 0,
  };
}

