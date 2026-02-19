"use client";

import { FormEvent, useState } from "react";
import { Alert } from "@/components/alert";
import { Card } from "@/components/card";
import { FormField } from "@/components/form-field";

type Announcement = {
  id: number;
  title: string;
  body: string;
  createdAt: string;
};

type AdminAnnouncementsClientProps = {
  initialAnnouncements: Announcement[];
};

export function AdminAnnouncementsClient({
  initialAnnouncements,
}: AdminAnnouncementsClientProps) {
  const [announcements, setAnnouncements] = useState<Announcement[]>(initialAnnouncements);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const isEditing = editingId !== null;
    const endpoint = isEditing ? `/api/announcements/${editingId}` : "/api/announcements";
    const method = isEditing ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, body }),
    });

    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      announcement?: Announcement;
    };

    if (!response.ok) {
      setError(data.error ?? "Aktion fehlgeschlagen.");
      return;
    }

    setTitle("");
    setBody("");
    setEditingId(null);
    setSuccess(isEditing ? "Ankündigung aktualisiert." : "Ankündigung erstellt.");

    if (data.announcement) {
      setAnnouncements((current) => {
        if (isEditing) {
          return current.map((entry) =>
            entry.id === data.announcement!.id ? (data.announcement as Announcement) : entry,
          );
        }

        return [data.announcement as Announcement, ...current];
      });
    }
  }

  async function onDelete(id: number) {
    setError("");
    setSuccess("");

    const response = await fetch(`/api/announcements/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      setError("Löschen fehlgeschlagen.");
      return;
    }

    setAnnouncements((current) => current.filter((entry) => entry.id !== id));
    setSuccess("Ankündigung gelöscht.");
    if (editingId === id) {
      setEditingId(null);
      setTitle("");
      setBody("");
    }
  }

  function startEdit(entry: Announcement) {
    setEditingId(entry.id);
    setTitle(entry.title);
    setBody(entry.body);
    setSuccess("");
    setError("");
  }

  return (
    <div className="space-y-4">
      <Card title="Ankündigung erstellen / bearbeiten">
        <form className="space-y-3" onSubmit={onSubmit}>
          <FormField htmlFor="title" label="Titel">
            <input
              className="rounded-xl border border-[#780D16]/35 px-3 py-2"
              id="title"
              onChange={(event) => setTitle(event.target.value)}
              required
              value={title}
            />
          </FormField>

          <FormField htmlFor="body" label="Text">
            <textarea
              className="min-h-28 rounded-xl border border-[#780D16]/35 px-3 py-2"
              id="body"
              onChange={(event) => setBody(event.target.value)}
              required
              value={body}
            />
          </FormField>

          {error ? <Alert message={error} type="error" /> : null}
          {success ? <Alert message={success} type="success" /> : null}

          <div className="flex gap-2">
            <button className="rounded-xl bg-[#780D16] px-4 py-2 text-white" type="submit">
              {editingId ? "Aktualisieren" : "Erstellen"}
            </button>
            {editingId ? (
              <button
                className="rounded-xl border border-[#780D16]/35 px-4 py-2"
                onClick={() => {
                  setEditingId(null);
                  setTitle("");
                  setBody("");
                }}
                type="button"
              >
                Abbrechen
              </button>
            ) : null}
          </div>
        </form>
      </Card>

      <Card title="Alle Ankündigungen">
        <ul className="space-y-3">
          {announcements.map((entry) => (
            <li className="rounded-xl border border-[#780D16]/20 p-3" key={entry.id}>
              <h3 className="font-semibold">{entry.title}</h3>
              <p className="mt-1 whitespace-pre-wrap text-sm text-[#780D16]/85">{entry.body}</p>
              <p className="mt-2 text-xs text-[#780D16]/65">{new Date(entry.createdAt).toLocaleString("de-DE")}</p>
              <div className="mt-2 flex gap-2">
                <button
                  className="rounded-xl border border-[#780D16]/35 px-3 py-1 text-sm"
                  onClick={() => startEdit(entry)}
                  type="button"
                >
                  Bearbeiten
                </button>
                <button
                  className="rounded-xl border border-[#780D16]/50 bg-[#780D16] px-3 py-1 text-sm text-white"
                  onClick={() => onDelete(entry.id)}
                  type="button"
                >
                  Löschen
                </button>
              </div>
            </li>
          ))}
          {announcements.length === 0 ? (
            <li className="text-sm text-[#780D16]/70">Noch keine Ankündigungen vorhanden.</li>
          ) : null}
        </ul>
      </Card>
    </div>
  );
}
