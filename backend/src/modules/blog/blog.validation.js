import { z } from "zod";

export const createBlogPostSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters.").max(255),
  slug: z.string().min(3).max(255).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase letters, numbers, and hyphens only."),
  excerpt: z.string().min(10, "Excerpt is required.").max(500),
  content: z.string().min(20, "Content is required."),
  coverImage: z.string().optional().or(z.literal("")),
  category: z.string().min(2, "Category is required.").max(50),
  status: z.enum(["DRAFT", "PUBLISHED"]).default("DRAFT")
});

export const updateBlogPostSchema = createBlogPostSchema.partial();