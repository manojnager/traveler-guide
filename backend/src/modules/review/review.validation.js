import { z } from "zod";

export const createReviewSchema = z.object({
  bookingId: z.coerce.number().int().positive("Booking is required."),
  rating: z.coerce.number().min(1, "Rating must be at least 1.").max(5, "Rating cannot exceed 5."),
  review: z.string().min(10, "Review must be at least 10 characters.").max(2000)
});