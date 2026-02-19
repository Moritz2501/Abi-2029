import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const username = process.env.AUTH_USERNAME;
  const authPassword = process.env.AUTH_PASSWORD;
  const budgetPassword = process.env.BUDGET_PASSWORD;

  if (!username || !authPassword || !budgetPassword) {
    throw new Error(
      "AUTH_USERNAME, AUTH_PASSWORD und BUDGET_PASSWORD müssen gesetzt sein.",
    );
  }

  const [passwordHash, budgetPasswordHash] = await Promise.all([
    bcrypt.hash(authPassword, 12),
    bcrypt.hash(budgetPassword, 12),
  ]);

  await prisma.user.upsert({
    where: { username },
    update: { passwordHash },
    create: {
      username,
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

  console.log("Seed erfolgreich ausgeführt.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
