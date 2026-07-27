import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";

const wishlistSelect = {
  userId: true,
  destinationId: true,
  createdAt: true,
  user: {
    select: { id: true, firstName: true, lastName: true, email: true }
  },
  destination: {
    select: { id: true, title: true, slug: true, thumbnail: true }
  }
};

export const getAdminWishlist = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  if (query.search) {
    where.OR = [
      { user: { firstName: { contains: query.search } } },
      { user: { lastName: { contains: query.search } } },
      { user: { email: { contains: query.search } } },
      { destination: { title: { contains: query.search } } }
    ];
  }

  const [items, totalItems] = await Promise.all([
    prisma.wishlist.findMany({
      where,
      select: wishlistSelect,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.wishlist.count({ where })
  ]);

  return {
    items,
    pagination: {
      page,
      limit,
      totalItems,
      totalPages: Math.ceil(totalItems / limit)
    }
  };
};

export const deleteWishlistItem = async (userId, destinationId) => {
  const existing = await prisma.wishlist.findUnique({
    where: {
      userId_destinationId: {
        userId: Number(userId),
        destinationId: Number(destinationId)
      }
    }
  });

  if (!existing) {
    throw new AppError("Wishlist entry not found.", 404);
  }

  return prisma.wishlist.delete({
    where: {
      userId_destinationId: {
        userId: Number(userId),
        destinationId: Number(destinationId)
      }
    }
  });
};