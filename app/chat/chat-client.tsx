"use client";

import { FormEvent, useState } from "react";
import { Alert } from "@/components/alert";
import { Card } from "@/components/card";
import { FormField } from "@/components/form-field";

type Message = {
  id: number;
  text: string;
  displayName: string | null;
  createdAt: string;
};

type ChatClientProps = {
  initialMessages: Message[];
};

export function ChatClient({ initialMessages }: ChatClientProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [text, setText] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const response = await fetch("/api/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, displayName }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      message?: Message;
    };

    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Nachricht konnte nicht gespeichert werden.");
      return;
    }

    setText("");
    setDisplayName("");
    setSuccess("Nachricht gespeichert.");
    if (data.message) {
      setMessages((current) => [data.message as Message, ...current]);
    }
  }

  return (
    <div className="space-y-4">
      <Card title="Neue Nachricht">
        <form className="space-y-3" onSubmit={onSubmit}>
          <FormField htmlFor="displayName" label="Name (optional)">
            <input
              className="rounded-md border border-black/20 px-3 py-2"
              id="displayName"
              onChange={(event) => setDisplayName(event.target.value)}
              value={displayName}
            />
          </FormField>

          <FormField htmlFor="text" label="Nachricht">
            <textarea
              className="min-h-24 rounded-md border border-black/20 px-3 py-2"
              id="text"
              onChange={(event) => setText(event.target.value)}
              required
              value={text}
            />
          </FormField>

          {error ? <Alert message={error} type="error" /> : null}
          {success ? <Alert message={success} type="success" /> : null}

          <button
            className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Sende..." : "Senden"}
          </button>
        </form>
      </Card>

      <Card title="Pinnwand">
        <ul className="space-y-3">
          {messages.map((message) => (
            <li className="rounded-md border border-black/10 p-3" key={message.id}>
              <p className="whitespace-pre-wrap">{message.text}</p>
              <p className="mt-2 text-xs text-black/60">
                {(message.displayName || "Anonym")} · {new Date(message.createdAt).toLocaleString("de-DE")}
              </p>
            </li>
          ))}
          {messages.length === 0 ? (
            <li className="text-sm text-black/70">Noch keine Nachrichten vorhanden.</li>
          ) : null}
        </ul>
      </Card>
    </div>
  );
}
