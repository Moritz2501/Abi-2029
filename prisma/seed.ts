import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const budgetPassword = process.env.BUDGET_PASSWORD;

  if (!budgetPassword) {
    throw new Error("BUDGET_PASSWORD muss gesetzt sein.");
  }

  const budgetPasswordHash = await bcrypt.hash(budgetPassword, 12);

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
