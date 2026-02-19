import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import crypto from "node:crypto";
import { env } from "@/lib/env";

export function getUploadDirectoryAbsolutePath() {
  return path.join(process.cwd(), env.UPLOAD_DIR);
}

export async function ensureUploadDirectory() {
  await mkdir(getUploadDirectoryAbsolutePath(), { recursive: true });
}

export function buildStoredFileName(originalName: string) {
  const extension = path.extname(originalName).toLowerCase();
  const safeExtension = extension || ".bin";
  return `${crypto.randomUUID()}${safeExtension}`;
}

export async function saveUploadedFile(buffer: Buffer, fileName: string) {
  await ensureUploadDirectory();
  const targetPath = path.join(getUploadDirectoryAbsolutePath(), fileName);
  await writeFile(targetPath, buffer);
}
