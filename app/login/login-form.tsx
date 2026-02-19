"use client";

import { FormEvent, useState } from "react";
import { Alert } from "@/components/alert";
import { Card } from "@/components/card";
import { FormField } from "@/components/form-field";

type LoginFormProps = {
  nextPath: string;
};

export function LoginForm({ nextPath }: LoginFormProps) {
  const [username, setUsername] = useState("admin");
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
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (!response.ok) {
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      setError(data.error ?? "Login fehlgeschlagen.");
      return;
    }

    window.location.assign(nextPath || "/");
  }

  return (
    <Card title="Login">
      <form className="space-y-3" onSubmit={onSubmit}>
        <FormField htmlFor="username" label="Benutzername">
          <input
            className="rounded-xl border border-[#780D16]/35 px-3 py-2"
            id="username"
            onChange={(event) => setUsername(event.target.value)}
            required
            value={username}
          />
        </FormField>

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
