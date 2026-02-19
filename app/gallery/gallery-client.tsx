"use client";

import Image from "next/image";
import { FormEvent, useState } from "react";
import { Alert } from "@/components/alert";
import { Card } from "@/components/card";

type GalleryImage = {
  id: number;
  filename: string;
  originalName: string;
  createdAt: string;
};

type GalleryClientProps = {
  initialImages: GalleryImage[];
};

export function GalleryClient({ initialImages }: GalleryClientProps) {
  const [images, setImages] = useState<GalleryImage[]>(initialImages);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  async function onUpload(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setSuccess("");

    const form = new FormData(event.currentTarget);
    setLoading(true);

    const response = await fetch("/api/gallery/upload", {
      method: "POST",
      body: form,
    });

    const data = (await response.json().catch(() => ({}))) as {
      error?: string;
      image?: GalleryImage;
    };
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? "Upload fehlgeschlagen.");
      return;
    }

    setSuccess("Bild erfolgreich hochgeladen.");
    event.currentTarget.reset();
    if (data.image) {
      setImages((current) => [data.image as GalleryImage, ...current]);
    }
  }

  return (
    <div className="space-y-4">
      <Card title="Bild hochladen">
        <form className="space-y-3" onSubmit={onUpload}>
          <input
            accept="image/jpeg,image/png,image/webp"
            className="rounded-md border border-black/20 p-2"
            name="image"
            required
            type="file"
          />
          <p className="text-xs text-black/60">Erlaubt: JPG, PNG, WEBP · Maximal 10 MB</p>
          {error ? <Alert message={error} type="error" /> : null}
          {success ? <Alert message={success} type="success" /> : null}
          <button
            className="rounded-md bg-black px-4 py-2 text-white disabled:opacity-60"
            disabled={loading}
            type="submit"
          >
            {loading ? "Lädt hoch..." : "Hochladen"}
          </button>
        </form>
      </Card>

      <Card title="Galerie">
        {images.length === 0 ? (
          <p className="text-sm text-black/70">Noch keine Bilder vorhanden.</p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
            {images.map((image) => (
              <li className="space-y-1" key={image.id}>
                <a href={`/api/uploads/${image.filename}`} rel="noreferrer" target="_blank">
                  <Image
                    alt={image.originalName}
                    className="aspect-square w-full rounded-md border border-black/10 object-cover"
                    height={200}
                    src={`/api/uploads/${image.filename}`}
                    unoptimized
                    width={200}
                  />
                </a>
                <p className="truncate text-xs text-black/70">{image.originalName}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
