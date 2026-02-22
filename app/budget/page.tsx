import { BudgetClient } from "@/app/budget/budget-client";
import { getBudgetSummary } from "@/lib/budget";

export default async function BudgetPage() {
  const summary = await getBudgetSummary();

  return (
    <BudgetClient
      initialBudget={{
        balanceCents: summary.totalCents,
        totalCents: summary.totalCents,
        deposits: summary.deposits.map((deposit) => ({
          ...deposit,
          createdAt: deposit.createdAt.toISOString(),
        })),
      }}
    />
  );
}
