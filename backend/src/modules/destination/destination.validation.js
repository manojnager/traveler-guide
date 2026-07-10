import { z } from "zod";

const destinationSchema = z.object({
  categoryId: z.number().int(),
  countryId: z.number().int(),
  cityId: z.number().int(),
  title: z.string().min(3).max(200),
  slug: z.string().min(3).max(200),
  shortDescription: z.string().min(10).max(500),
  description: z.string().min(20),
  thumbnail: z.string(),
  heroImage: z.string(),
  price: z.number().positive(),
  duration: z.string(),
  rating: z.number().min(0).max(5).default(5),
  featured: z.boolean().default(false),
  maxGuests: z.number().default(2),
  checkIn: z.string(),
  checkOut: z.string(),
  cancellationPolicy: z.string(),
  metaTitle: z.string(),
  metaDescription: z.string(),
  displayOrder: z.number().default(0),
  isPublished: z.boolean().default(true),
  gallery: z.array(z.string()),
  amenities: z.array(z.number()),
  highlights: z.array(z.string()),
  itinerary: z.array(
    z.object({
      day: z.number(),
      title: z.string(),
      description: z.string()
    })
  )
});

export const createDestinationSchema = destinationSchema;

export const updateDestinationSchema =  destinationSchema.partial();