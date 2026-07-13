import { z } from "zod";

export const createUserSchema = z.object({
  firstName: z.string().min(2, "First name is required.").max(100),
  lastName: z.string().min(2, "Last name is required.").max(100),
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  phone: z.string().max(20).optional().or(z.literal("")),
  roleId: z.coerce.number().int().positive("Role is required."),
  status: z.enum(["ACTIVE", "INACTIVE"]).default("ACTIVE")
});

export const updateUserSchema = z.object({
  firstName: z.string().min(2).max(100).optional(),
  lastName: z.string().min(2).max(100).optional(),
  email: z.string().email("Enter a valid email address.").optional(),
  password: z.string().min(8, "Password must be at least 8 characters.").optional().or(z.literal("")),
  phone: z.string().max(20).optional().or(z.literal("")),
  roleId: z.coerce.number().int().positive().optional(),
  status: z.enum(["ACTIVE", "INACTIVE"]).optional()
});