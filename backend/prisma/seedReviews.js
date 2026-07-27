import prisma from "../src/lib/prisma.js";

const REVIEW_TEMPLATES = [
  { rating: 5, text: "Absolutely incredible experience! The views were breathtaking and everything was perfectly organized from start to finish." },
  { rating: 5, text: "Best trip I've ever taken. The guide was knowledgeable and the itinerary hit every highlight without feeling rushed." },
  { rating: 5, text: "Exceeded all expectations. Worth every penny — we're already planning our next trip through this platform." },
  { rating: 4, text: "Really enjoyed this destination. A couple of minor hiccups with check-in timing, but overall a great stay." },
  { rating: 4, text: "Beautiful location and friendly staff. Would have liked a bit more free time in the schedule, but no major complaints." },
  { rating: 4, text: "Solid experience overall. The photos matched reality, which I appreciated. Would recommend to friends." },
  { rating: 3, text: "It was okay. Some parts of the trip felt rushed and the accommodation was average for the price point." },
  { rating: 3, text: "Decent but not exceptional. The highlights were great but the logistics could be smoother." },
  { rating: 2, text: "Disappointed with the cleanliness of the accommodation. The location itself is nice but the service needs work." },
  { rating: 2, text: "Itinerary didn't match what was advertised. Had to change plans last minute which was frustrating." },
  { rating: 1, text: "Would not recommend. Poor communication before the trip and several issues that were never resolved." },
  { rating: 5, text: "A dream come true! Every detail was thought through and our family had the best vacation in years." },
  { rating: 3, text: "Average experience. Nothing went wrong but nothing stood out either." },
  { rating: 4, text: "Great value for money. The destination itself is stunning, just wish the tour guide spoke more English." },
  { rating: 1, text: "Cancelled last minute with barely any notice and refund process was painfully slow." }
];

const randomFrom = (arr) =>
  arr[Math.floor(Math.random() * arr.length)];

const randomPastDate = (daysBack = 180) => {
  const now = new Date();
  const past = new Date(
    now.getTime() - Math.random() * daysBack * 24 * 60 * 60 * 1000
  );
  return past;
};

const seedReviews = async () => {
  const destinations = await prisma.destination.findMany({
    select: { id: true }
  });

  const customerRole = await prisma.role.findFirst({
    where: { name: "Customer" }
  });

  const customers = await prisma.user.findMany({
    where: customerRole ? { roleId: customerRole.id } : {},
    select: { id: true }
  });

  if (!destinations.length) {
    console.log(
      "No destinations found. Seed destinations first."
    );
    return;
  }

  if (!customers.length) {
    console.log(
      "No customer users found. Seed users first."
    );
    return;
  }

  const reviewsToCreate = [];

  destinations.forEach((destination) => {
    const reviewCount = 3 + Math.floor(Math.random() * 6); // 3–8 reviews per destination

    for (let i = 0; i < reviewCount; i++) {
      const template = randomFrom(REVIEW_TEMPLATES);
      const user = randomFrom(customers);

      reviewsToCreate.push({
        destinationId: destination.id,
        userId: user.id,
        rating: template.rating,
        review: template.text,
        isHidden: Math.random() < 0.1, // ~10% hidden, for testing moderation
        createdAt: randomPastDate()
      });
    }
  });

  await prisma.review.createMany({
    data: reviewsToCreate
  });

  console.log(
    `Seeded ${reviewsToCreate.length} reviews across ${destinations.length} destinations.`
  );
};

seedReviews()
  .catch((error) => {
    console.error("Failed to seed reviews:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });