import { z } from "zod";

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
