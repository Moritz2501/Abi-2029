import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  BUDGET_PASSWORD: z.string().min(1),
  UPLOAD_DIR: z.string().min(1).default("uploads"),
});

export const env = envSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  BUDGET_PASSWORD: process.env.BUDGET_PASSWORD,
  UPLOAD_DIR: process.env.UPLOAD_DIR ?? "uploads",
});
