import { z } from "zod";

export const citySchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters.").max(100),
  countryId: z.coerce.number().int().positive("Country is required.")
});

export const updateCitySchema = citySchema.partial();