import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});

export const registerSchema = z.object({
  username: z.string().min(3).max(40).regex(/^[a-zA-Z0-9_.-]+$/),
  password: z.string().min(8).max(100),
});

export const announcementSchema = z.object({
  title: z.string().min(1).max(120),
  body: z.string().min(1).max(5000),
});

export const messageSchema = z.object({
  text: z.string().min(1).max(2000),
  displayName: z.string().max(60).optional(),
});

export const depositSchema = z.object({
  amount: z.coerce.number().positive(),
  note: z.string().max(200).optional(),
  budgetPassword: z.string().min(1),
});

export const allowedImageMimeTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
] as const;

export const maxUploadSizeBytes = 10 * 1024 * 1024;

export function validateUploadMimeType(type: string) {
  return allowedImageMimeTypes.includes(type as (typeof allowedImageMimeTypes)[number]);
}
