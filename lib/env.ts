import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  AUTH_USERNAME: z.string().min(1),
  AUTH_PASSWORD: z.string().min(1),
  BUDGET_PASSWORD: z.string().min(1),
  SESSION_SECRET: z.string().min(16),
  UPLOAD_DIR: z.string().min(1).default("uploads"),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  AUTH_USERNAME: process.env.AUTH_USERNAME,
  AUTH_PASSWORD: process.env.AUTH_PASSWORD,
  BUDGET_PASSWORD: process.env.BUDGET_PASSWORD,
  SESSION_SECRET: process.env.SESSION_SECRET,
  UPLOAD_DIR: process.env.UPLOAD_DIR ?? "uploads",
});
