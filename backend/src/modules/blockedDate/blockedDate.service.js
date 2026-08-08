import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";

export const getBlockedDatesForDestination = async (destinationId) => {
  return prisma.destinationBlockedDate.findMany({
    where: { destinationId: Number(destinationId) },
    orderBy: { date: "asc" }
  });
};

export const addBlockedDate = async (destinationId, data) => {
  const destination = await prisma.destination.findUnique({
    where: { id: Number(destinationId) }
  });

  if (!destination) {
    throw new AppError("Destination not found.", 404);
  }

  const existing = await prisma.destinationBlockedDate.findFirst({
    where: { destinationId: Number(destinationId), date: new Date(data.date) }
  });

  if (existing) {
    throw new AppError("This date is already blocked.", 409);
  }

  return prisma.destinationBlockedDate.create({
    data: {
      destinationId: Number(destinationId),
      date: new Date(data.date),
      reason: data.reason || null
    }
  });
};

export const addBulkBlockedDates = async (destinationId, data) => {
  const destination = await prisma.destination.findUnique({
    where: { id: Number(destinationId) }
  });

  if (!destination) {
    throw new AppError("Destination not found.", 404);
  }

  const results = await Promise.allSettled(
    data.dates.map((date) =>
      prisma.destinationBlockedDate.create({
        data: {
          destinationId: Number(destinationId),
          date: new Date(date),
          reason: data.reason || null
        }
      })
    )
  );

  const created = results.filter((r) => r.status === "fulfilled").length;
  const skipped = results.length - created;

  return { created, skipped };
};

export const removeBlockedDate = async (id) => {
  const blockedDate = await prisma.destinationBlockedDate.findUnique({
    where: { id: Number(id) }
  });

  if (!blockedDate) {
    throw new AppError("Blocked date not found.", 404);
  }

  return prisma.destinationBlockedDate.delete({ where: { id: Number(id) } });
};