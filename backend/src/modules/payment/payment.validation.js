import { z } from "zod";

export const createPaymentIntentSchema = z.object({
  bookingId: z.coerce.number().int().positive("Booking ID is required.")
});

export const confirmPaymentSchema = z.object({
  bookingId: z.coerce.number().int().positive("Booking ID is required."),
  paymentIntentId: z.string().min(1, "Payment Intent ID is required.")
});