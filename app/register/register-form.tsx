"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/alert";
import { Card } from "@/components/card";
import { FormField } from "@/components/form-field";

export function RegisterForm() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const response = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = (await response.json().catch(() => ({}))) as { error?: string };

    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Registrierung fehlgeschlagen.");
      return;
    }

    setSuccess("Benutzer angelegt. Du kannst dich jetzt einloggen.");
    setPassword("");

    setTimeout(() => {
      router.push("/login");
    }, 700);
  }

  return (
    <Card title="Neuen Benutzer anlegen">
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

        <FormField htmlFor="password" label="Passwort (mind. 8 Zeichen)">
          <input
            className="rounded-xl border border-[#780D16]/35 px-3 py-2"
            id="password"
            minLength={8}
            onChange={(event) => setPassword(event.target.value)}
            required
            type="password"
            value={password}
          />
        </FormField>

        {error ? <Alert message={error} type="error" /> : null}
        {success ? <Alert message={success} type="success" /> : null}

        <button
          className="rounded-xl bg-[#780D16] px-4 py-2 text-white disabled:opacity-60"
          disabled={loading}
          type="submit"
        >
          {loading ? "Erstelle..." : "Registrieren"}
        </button>
      </form>
    </Card>
  );
}
