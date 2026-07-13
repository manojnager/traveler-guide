import { z } from "zod";

export const updateBookingStatusSchema = z.object({
  status: z.enum(["PENDING", "CONFIRMED", "CANCELLED"], {
    errorMap: () => ({ message: "Status must be PENDING, CONFIRMED, or CANCELLED." })
  })
});