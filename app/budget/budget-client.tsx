"use client";

import { FormEvent, useMemo, useState } from "react";
import { Alert } from "@/components/alert";
import { Card } from "@/components/card";
import { FormField } from "@/components/form-field";

type Deposit = {
  id: number;
  amountCents: number;
  note: string | null;
  createdAt: string;
};

type BudgetResponse = {
  balanceCents: number;
  totalCents: number;
  deposits: Deposit[];
};

type BudgetClientProps = {
  initialBudget: BudgetResponse;
};

function formatEuro(cents: number) {
  return new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  }).format(cents / 100);
}

export function BudgetClient({ initialBudget }: BudgetClientProps) {
  const [budget, setBudget] = useState<BudgetResponse>(initialBudget);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [budgetPassword, setBudgetPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const response = await fetch("/api/budget/deposit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        note,
        budgetPassword,
      }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      deposit?: Deposit;
    };
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Einzahlung fehlgeschlagen.");
      return;
    }

    setAmount("");
    setNote("");
    setBudgetPassword("");
    setSuccess("Einzahlung erfolgreich gespeichert.");
    if (data.deposit) {
      setBudget((current) => {
        const totalCents = current.totalCents + data.deposit!.amountCents;
        return {
          balanceCents: totalCents,
          totalCents,
          deposits: [data.deposit as Deposit, ...current.deposits],
        };
      });
    }
  }

  const totalText = useMemo(() => formatEuro(budget.totalCents), [budget]);

  return (
    <div className="space-y-4">
      <Card title="Budgetübersicht">
        <p className="text-sm text-[#780D16]/75">Aktueller Kontostand</p>
        <p className="mt-1 text-2xl font-semibold">{totalText}</p>
      </Card>

      <Card title="Einzahlung hinzufügen">
        <form className="space-y-3" onSubmit={onSubmit}>
          <FormField htmlFor="amount" label="Betrag (EUR)">
            <input
              className="rounded-xl border border-[#780D16]/35 px-3 py-2"
              id="amount"
              min={0.01}
              onChange={(event) => setAmount(event.target.value)}
              required
              step="0.01"
              type="number"
              value={amount}
            />
          </FormField>

          <FormField htmlFor="note" label="Notiz (optional)">
            <input
              className="rounded-xl border border-[#780D16]/35 px-3 py-2"
              id="note"
              onChange={(event) => setNote(event.target.value)}
              value={note}
            />
          </FormField>

          <FormField htmlFor="budgetPassword" label="Budget-Passwort">
            <input
              className="rounded-xl border border-[#780D16]/35 px-3 py-2"
              id="budgetPassword"
              onChange={(event) => setBudgetPassword(event.target.value)}
              required
              type="password"
              value={budgetPassword}
            />
          </FormField>

          {error ? <Alert message={error} type="error" /> : null}
          {success ? <Alert message={success} type="success" /> : null}

          <button
            className="rounded-xl bg-[#780D16] px-4 py-2 text-white disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Speichert..." : "Einzahlung speichern"}
          </button>
        </form>
      </Card>

      <Card title="Verlauf">
        <ul className="space-y-2">
          {budget.deposits.map((deposit) => (
            <li className="rounded-xl border border-[#780D16]/20 p-3" key={deposit.id}>
              <p className="font-medium">{formatEuro(deposit.amountCents)}</p>
              {deposit.note ? <p className="text-sm text-[#780D16]/85">{deposit.note}</p> : null}
              <p className="text-xs text-[#780D16]/65">{new Date(deposit.createdAt).toLocaleString("de-DE")}</p>
            </li>
          ))}
          {budget.deposits.length === 0 ? (
            <li className="text-sm text-[#780D16]/70">Noch keine Einzahlungen vorhanden.</li>
          ) : null}
        </ul>
      </Card>
    </div>
  );
}
