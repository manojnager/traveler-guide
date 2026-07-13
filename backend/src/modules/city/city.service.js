import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";

export const getAllCities = async (query) => {
  const where = {};

  if (query.countryId) {
    where.countryId = Number(query.countryId);
  }

  return prisma.city.findMany({
    where,
    orderBy: { name: "asc" },
    include: {
      country: true,
      _count: { select: { destinations: true } }
    }
  });
};

export const getCityById = async (id) => {
  const city = await prisma.city.findUnique({
    where: { id: Number(id) },
    include: { country: true }
  });

  if (!city) {
    throw new AppError("City not found.", 404);
  }

  return city;
};

export const createCity = async (data) => {
  const existing = await prisma.city.findFirst({
    where: { countryId: data.countryId, name: data.name }
  });

  if (existing) {
    throw new AppError("A city with this name already exists in the selected country.", 409);
  }

  return prisma.city.create({ data });
};

export const updateCity = async (id, data) => {
  const current = await getCityById(id);

  const countryId = data.countryId ?? current.countryId;
  const name = data.name ?? current.name;

  if (data.name || data.countryId) {
    const existing = await prisma.city.findFirst({
      where: {
        id: { not: Number(id) },
        countryId,
        name
      }
    });

    if (existing) {
      throw new AppError("A city with this name already exists in the selected country.", 409);
    }
  }

  return prisma.city.update({
    where: { id: Number(id) },
    data
  });
};

export const deleteCity = async (id) => {
  const city = await prisma.city.findUnique({
    where: { id: Number(id) },
    include: { _count: { select: { destinations: true } } }
  });

  if (!city) {
    throw new AppError("City not found.", 404);
  }

  if (city._count.destinations > 0) {
    throw new AppError(
      `Cannot delete "${city.name}" — ${city._count.destinations} destination(s) still use it. Reassign or delete them first.`,
      409
    );
  }

  return prisma.city.delete({ where: { id: Number(id) } });
};