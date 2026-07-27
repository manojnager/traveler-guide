import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";

export const getAllCategories = async () => {
  return prisma.category.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: { select: { destinations: true } }
    }
  });
};

export const getCategoryById = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id: Number(id) }
  });

  if (!category) {
    throw new AppError("Category not found.", 404);
  }

  return category;
};

export const createCategory = async (data) => {
  const existing = await prisma.category.findFirst({
    where: {
      OR: [{ name: data.name }, { slug: data.slug }]
    }
  });

  if (existing) {
    throw new AppError("A category with this name or slug already exists.", 409);
  }

  return prisma.category.create({ data });
};

export const updateCategory = async (id, data) => {
  await getCategoryById(id);

  if (data.name || data.slug) {
    const existing = await prisma.category.findFirst({
      where: {
        id: { not: Number(id) },
        OR: [
          data.name ? { name: data.name } : undefined,
          data.slug ? { slug: data.slug } : undefined
        ].filter(Boolean)
      }
    });

    if (existing) {
      throw new AppError("A category with this name or slug already exists.", 409);
    }
  }

  return prisma.category.update({
    where: { id: Number(id) },
    data
  });
};

export const deleteCategory = async (id) => {
  const category = await prisma.category.findUnique({
    where: { id: Number(id) },
    include: { _count: { select: { destinations: true } } }
  });

  if (!category) {
    throw new AppError("Category not found.", 404);
  }

  if (category._count.destinations > 0) {
    throw new AppError(
      `Cannot delete "${category.name}" — ${category._count.destinations} destination(s) still use it. Reassign or delete them first.`,
      409
    );
  }

  return prisma.category.delete({ where: { id: Number(id) } });
};