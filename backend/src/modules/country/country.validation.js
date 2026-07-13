import { z } from "zod";

export const countrySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100),
  code: z
    .string()
    .min(2, "Code must be at least 2 characters.")
    .max(5)
    .regex(/^[A-Z]+$/, "Code must be uppercase letters only (e.g. US, IN, UK).")
});

export const updateCountrySchema = countrySchema.partial();