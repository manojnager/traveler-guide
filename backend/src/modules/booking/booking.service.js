import bcrypt from "bcrypt";
import crypto from "crypto";
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
      { destination: { title: { contains: query.search } } },
      { contactFirstName: { contains: query.search } },
      { contactLastName: { contains: query.search } }
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

export const createPublicBooking = async (data) => {
  const destination = await prisma.destination.findUnique({
    where: { id: data.destinationId }
  });

  if (!destination || !destination.isPublished) {
    throw new AppError("Destination not found or unavailable.", 404);
  }

  let user = await prisma.user.findUnique({
    where: { email: data.email }
  });

  let isNewAccount = false;

  if (!user) {
    const customerRole = await prisma.role.findFirst({
      where: { name: "Customer" }
    });

    const randomPassword = crypto.randomBytes(16).toString("hex");
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    user = await prisma.user.create({
      data: {
        roleId: customerRole.id,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: hashedPassword,
        phone: data.phone || null
      }
    });

    isNewAccount = true;
  }

  const totalAmount = Number(destination.price) * data.guests;

  const booking = await prisma.$transaction(async (tx) => {
    const createdBooking = await tx.booking.create({
      data: {
        userId: user.id,
        destinationId: destination.id,
        travelDate: new Date(data.travelDate),
        guests: data.guests,
        totalAmount,
        status: "PENDING",
        contactFirstName: data.firstName,
        contactLastName: data.lastName,
        contactPhone: data.phone || null
      }
    });

    await tx.payment.create({
      data: {
        bookingId: createdBooking.id,
        amount: totalAmount,
        method: data.paymentMethod,
        status: "PENDING"
      }
    });

    return tx.booking.findUnique({
      where: { id: createdBooking.id },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true }
        },
        destination: {
          select: { id: true, title: true, slug: true, thumbnail: true, price: true, duration: true }
        },
        payment: true
      }
    });
  });

  return { booking, isNewAccount };
};