import { getImageUrl } from "./image";

export const mapDestination = (destination) => ({
  id: destination.id,
  slug: destination.slug,
  title: destination.title,
  shortDescription: destination.shortDescription,
  description: destination.description,
  image: getImageUrl(destination.thumbnail),
  heroImage: getImageUrl(destination.heroImage),
  gallery: destination.images?.map((img) => getImageUrl(img.image)) || [],
  category: destination.category?.name || "",
  country: destination.country?.name || "",
  city: destination.city?.name || "",
  location: [destination.city?.name, destination.country?.name].filter(Boolean).join(", "),
  price: Number(destination.price),
  duration: destination.duration,
  rating: Number(destination.rating),
  maxGuests: destination.maxGuests,
  checkIn: destination.checkIn,
  checkOut: destination.checkOut,
  cancellationPolicy: destination.cancellationPolicy,
  featured: destination.featured,
  amenities: destination.amenities?.map((a) => a.amenity?.name || a.name) || [],
  highlights: destination.highlights?.map((h) => h.title) || [],
  itinerary: destination.itineraries?.map((i) => ({ day: i.day, title: i.title, description: i.description })) || [],
  reviews: destination.reviews?.map((r) => ({
    id: r.id,
    name: `${r.user?.firstName || "Anonymous"} ${r.user?.lastName || ""}`.trim(),
    rating: Number(r.rating),
    review: r.review
  })) || []
});