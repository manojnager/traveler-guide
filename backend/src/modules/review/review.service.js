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

export const getMyReviewableBookings = async (userId) => {
  const bookings = await prisma.booking.findMany({
    where: {
      userId: Number(userId),
      status: "CONFIRMED",
      travelDate: { lte: new Date() },
      review: null
    },
    include: {
      destination: {
        select: { id: true, title: true, slug: true, thumbnail: true }
      }
    },
    orderBy: { travelDate: "desc" }
  });

  return bookings;
};

export const createReview = async (userId, data) => {
  const booking = await prisma.booking.findUnique({
    where: { id: data.bookingId },
    include: { review: true }
  });

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  if (booking.userId !== Number(userId)) {
    throw new AppError("This booking does not belong to your account.", 403);
  }

  if (booking.status !== "CONFIRMED") {
    throw new AppError("Only confirmed bookings can be reviewed.", 400);
  }

  if (new Date(booking.travelDate) > new Date()) {
    throw new AppError("You can only review a trip after your travel date has passed.", 400);
  }

  if (booking.review) {
    throw new AppError("You have already submitted a review for this booking.", 409);
  }

  return prisma.review.create({
    data: {
      destinationId: booking.destinationId,
      userId: Number(userId),
      bookingId: booking.id,
      rating: data.rating,
      review: data.review
    },
    select: reviewSelect
  });
};