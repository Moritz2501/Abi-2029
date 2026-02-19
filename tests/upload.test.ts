import { describe, expect, it } from "vitest";
import { validateUploadMimeType } from "@/lib/schemas";

describe("upload validation", () => {
  it("blockiert einen falschen Dateityp", () => {
    expect(validateUploadMimeType("application/pdf")).toBe(false);
  });

  it("erlaubt gültige Bildtypen", () => {
    expect(validateUploadMimeType("image/jpeg")).toBe(true);
    expect(validateUploadMimeType("image/png")).toBe(true);
    expect(validateUploadMimeType("image/webp")).toBe(true);
  });
});
