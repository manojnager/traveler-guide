import { z } from "zod";

export const createContactMessageSchema = z.object({
  name: z.string().min(2, "Name is required.").max(150),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().max(20).optional().or(z.literal("")),
  destination: z.string().max(150).optional().or(z.literal("")),
  travelDate: z.string().optional().or(z.literal("")),
  guests: z.coerce.number().int().positive().optional(),
  budget: z.string().max(50).optional().or(z.literal("")),
  subject: z.string().max(200).optional().or(z.literal("")),
  message: z.string().min(5, "Message is required.").max(3000)
});

export const updateContactMessageStatusSchema = z.object({
  status: z.enum(["NEW", "READ", "RESPONDED"])
});