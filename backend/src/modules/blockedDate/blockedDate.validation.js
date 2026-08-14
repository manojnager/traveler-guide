import { z } from "zod";

export const createBlockedDateSchema = z.object({
  date: z.string().refine((val) => !isNaN(Date.parse(val)), "Enter a valid date."),
  reason: z.string().max(200).optional().or(z.literal(""))
});

export const createBulkBlockedDatesSchema = z.object({
  dates: z.array(z.string()).min(1, "At least one date is required."),
  reason: z.string().max(200).optional().or(z.literal(""))
});