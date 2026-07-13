import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";

const SORT_MAP = {
  date_asc: { travelDate: "asc" },
  date_desc: { travelDate: "desc" },
  amount_low: { totalAmount: "asc" },
  amount_high: { totalAmount: "desc" },
  oldest: { createdAt: "asc" }
};

export const getAdminBookings = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.destinationId) {
    where.destinationId = Number(query.destinationId);
  }

  if (query.search) {
    where.OR = [
      { user: { firstName: { contains: query.search } } },
      { user: { lastName: { contains: query.search } } },
      { user: { email: { contains: query.search } } },
      { destination: { title: { contains: query.search } } }
    ];
  }

  const orderBy = SORT_MAP[query.sort] || { createdAt: "desc" };

  const [items, totalItems] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true }
        },
        destination: {
          select: { id: true, title: true, slug: true, thumbnail: true }
        }
      },
      orderBy,
      skip,
      take: limit
    }),
    prisma.booking.count({ where })
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

export const getBookingById = async (id) => {
  const booking = await prisma.booking.findUnique({
    where: { id: Number(id) },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, email: true, phone: true }
      },
      destination: {
        select: { id: true, title: true, slug: true, thumbnail: true, price: true, duration: true }
      }
    }
  });

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  return booking;
};

export const updateBookingStatus = async (id, status) => {
  await getBookingById(id);

  return prisma.booking.update({
    where: { id: Number(id) },
    data: { status },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, email: true, phone: true }
      },
      destination: {
        select: { id: true, title: true, slug: true, thumbnail: true }
      }
    }
  });
};

export const deleteBooking = async (id) => {
  await getBookingById(id);
  return prisma.booking.delete({ where: { id: Number(id) } });
};