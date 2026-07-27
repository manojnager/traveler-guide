import { z } from "zod";

export const categorySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters.")
    .max(150)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only.")
});

export const updateCategorySchema = categorySchema.partial();