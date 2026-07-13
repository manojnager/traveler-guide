import prisma from "../src/lib/prisma.js";

const randomPastDate = (daysBack = 120) => {
  const now = new Date();
  const past = new Date(
    now.getTime() - Math.random() * daysBack * 24 * 60 * 60 * 1000
  );
  return past;
};

const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const seedWishlist = async () => {
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

  const wishlistToCreate = [];

  customers.forEach((customer) => {
    // each customer wishlists a random 2-6 destinations, no duplicates per user
    const count = Math.min(
      destinations.length,
      2 + Math.floor(Math.random() * 5)
    );

    const picked = shuffle(destinations).slice(0, count);

    picked.forEach((destination) => {
      wishlistToCreate.push({
        userId: customer.id,
        destinationId: destination.id,
        createdAt: randomPastDate()
      });
    });
  });

  const result = await prisma.wishlist.createMany({
    data: wishlistToCreate,
    skipDuplicates: true
  });

  console.log(
    `Seeded ${result.count} wishlist entries across ${customers.length} customers.`
  );
};

seedWishlist()
  .catch((error) => {
    console.error("Failed to seed wishlist:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });