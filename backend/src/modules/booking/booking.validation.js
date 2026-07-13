import { z } from "zod";

export const updateBookingStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"], {
    errorMap: () => ({ message: "Status must be PENDING, CONFIRMED, or CANCELLED." })
  })
});

export const createPublicBookingSchema = z.object({
  destinationId: z.coerce.number().int().positive("Destination is required."),
  travelDate: z.string().refine((val) => !isNaN(Date.parse(val)), "Enter a valid travel date."),
  guests: z.coerce.number().int().min(1, "At least 1 guest is required."),
  firstName: z.string().min(2, "First name is required.").max(100),
  lastName: z.string().min(2, "Last name is required.").max(100),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().max(20).optional().or(z.literal("")),
  paymentMethod: z.enum(["Credit Card", "PayPal", "Bank Transfer"]).default("Credit Card")
});