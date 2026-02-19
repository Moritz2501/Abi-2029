"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/alert";
import { Card } from "@/components/card";
import { FormField } from "@/components/form-field";

type LoginFormProps = {
  nextPath: string;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Login fehlgeschlagen.");
      return;
    }

    router.push(nextPath);
    router.refresh();
  }

  return (
    <Card title="Login">
      <form className="space-y-3" onSubmit={onSubmit}>
        <FormField htmlFor="password" label="Passwort">
          <input
            className="rounded-xl border border-[#780D16]/35 px-3 py-2"
            id="password"
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </FormField>

        {error ? <Alert message={error} type="error" /> : null}

        <button
          className="rounded-xl bg-[#780D16] px-4 py-2 text-white disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Anmelden..." : "Anmelden"}
        </button>
      </form>
    </Card>
  );
}
