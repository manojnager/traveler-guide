import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6),
  phone: z.string().optional()
});
export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});