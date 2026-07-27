import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";

export const getAllAmenities = async () => {
  return prisma.amenity.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { destinations: true } }
    }
  });
};

export const getAmenityById = async (id) => {
  const amenity = await prisma.amenity.findUnique({
    where: { id: Number(id) }
  });

  if (!amenity) {
    throw new AppError("Amenity not found.", 404);
  }

  return amenity;
};

export const createAmenity = async (data) => {
  const existing = await prisma.amenity.findFirst({
    where: { name: data.name }
  });

  if (existing) {
    throw new AppError("An amenity with this name already exists.", 409);
  }

  return prisma.amenity.create({ data });
};

export const updateAmenity = async (id, data) => {
  await getAmenityById(id);

  if (data.name) {
    const existing = await prisma.amenity.findFirst({
      where: {
        id: { not: Number(id) },
        name: data.name
      }
    });

    if (existing) {
      throw new AppError("An amenity with this name already exists.", 409);
    }
  }

  return prisma.amenity.update({
    where: { id: Number(id) },
    data
  });
};

export const deleteAmenity = async (id) => {
  const amenity = await prisma.amenity.findUnique({
    where: { id: Number(id) },
    include: { _count: { select: { destinations: true } } }
  });

  if (!amenity) {
    throw new AppError("Amenity not found.", 404);
  }

  if (amenity._count.destinations > 0) {
    throw new AppError(
      `Cannot delete "${amenity.name}" — ${amenity._count.destinations} destination(s) still use it. Remove it from those destinations first.`,
      409
    );
  }

  return prisma.amenity.delete({ where: { id: Number(id) } });
};