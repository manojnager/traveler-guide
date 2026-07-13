import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";

const reviewSelect = {
  id: true,
  rating: true,
  review: true,
  isHidden: true,
  createdAt: true,
  destination: {
    select: { id: true, title: true, slug: true }
  },
  user: {
    select: { id: true, firstName: true, lastName: true, email: true }
  }
};

export const getAdminReviews = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  if (query.search) {
    where.review = { contains: query.search };
  }

  if (query.rating) {
    where.rating = Number(query.rating);
  }

  const [items, totalItems] = await Promise.all([
    prisma.review.findMany({
      where,
      select: reviewSelect,
      orderBy: { id: "desc" },
      skip,
      take: limit
    }),
    prisma.review.count({ where })
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

export const getReviewById = async (id) => {
  const review = await prisma.review.findUnique({
    where: { id: Number(id) },
    select: reviewSelect
  });

  if (!review) {
    throw new AppError("Review not found.", 404);
  }

  return review;
};

export const setReviewVisibility = async (id, isHidden) => {
  const existing = await prisma.review.findUnique({
    where: { id: Number(id) }
  });

  if (!existing) {
    throw new AppError("Review not found.", 404);
  }

  return prisma.review.update({
    where: { id: Number(id) },
    data: { isHidden },
    select: reviewSelect
  });
};

export const deleteReview = async (id) => {
  const existing = await prisma.review.findUnique({
    where: { id: Number(id) }
  });

  if (!existing) {
    throw new AppError("Review not found.", 404);
  }

  return prisma.review.delete({ where: { id: Number(id) } });
};