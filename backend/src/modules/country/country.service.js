import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";

export const getAllCountries = async () => {
  return prisma.country.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { cities: true, destinations: true } }
    }
  });
};

export const getCountryById = async (id) => {
  const country = await prisma.country.findUnique({
    where: { id: Number(id) }
  });

  if (!country) {
    throw new AppError("Country not found.", 404);
  }

  return country;
};

export const createCountry = async (data) => {
  const existing = await prisma.country.findFirst({
    where: {
      OR: [{ name: data.name }, { code: data.code }]
    }
  });

  if (existing) {
    throw new AppError("A country with this name or code already exists.", 409);
  }

  return prisma.country.create({ data });
};

export const updateCountry = async (id, data) => {
  await getCountryById(id);

  if (data.name || data.code) {
    const existing = await prisma.country.findFirst({
      where: {
        id: { not: Number(id) },
        OR: [
          data.name ? { name: data.name } : undefined,
          data.code ? { code: data.code } : undefined
        ].filter(Boolean)
      }
    });

    if (existing) {
      throw new AppError("A country with this name or code already exists.", 409);
    }
  }

  return prisma.country.update({
    where: { id: Number(id) },
    data
  });
};

export const deleteCountry = async (id) => {
  const country = await prisma.country.findUnique({
    where: { id: Number(id) },
    include: {
      _count: { select: { cities: true, destinations: true } }
    }
  });

  if (!country) {
    throw new AppError("Country not found.", 404);
  }

  if (country._count.cities > 0 || country._count.destinations > 0) {
    const parts = [];
    if (country._count.cities > 0) parts.push(`${country._count.cities} city(ies)`);
    if (country._count.destinations > 0) parts.push(`${country._count.destinations} destination(s)`);

    throw new AppError(
      `Cannot delete "${country.name}" — ${parts.join(" and ")} still reference it. Reassign or delete them first.`,
      409
    );
  }

  return prisma.country.delete({ where: { id: Number(id) } });
};