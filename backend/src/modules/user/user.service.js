import bcrypt from "bcrypt";
import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";

const userSelect = {
  id: true,
  roleId: true,
  firstName: true,
  lastName: true,
  email: true,
  phone: true,
  avatar: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  role: { select: { id: true, name: true } }
};

export const getAdminUsers = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  if (query.roleId) {
    where.roleId = Number(query.roleId);
  }

  if (query.status) {
    where.status = query.status;
  }

  if (query.search) {
    where.OR = [
      { firstName: { contains: query.search } },
      { lastName: { contains: query.search } },
      { email: { contains: query.search } }
    ];
  }

  const [items, totalItems] = await Promise.all([
    prisma.user.findMany({
      where,
      select: userSelect,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.user.count({ where })
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

export const getUserById = async (id) => {
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    select: userSelect
  });

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  return user;
};

export const createUser = async (data) => {
  const existing = await prisma.user.findUnique({ where: { email: data.email } });

  if (existing) {
    throw new AppError("Email already exists.", 409);
  }

  const hashedPassword = await bcrypt.hash(data.password, 10);

  return prisma.user.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      phone: data.phone || null,
      roleId: data.roleId,
      status: data.status || "ACTIVE"
    },
    select: userSelect
  });
};

export const updateUser = async (id, data, currentUserId) => {
  const target = await prisma.user.findUnique({ where: { id: Number(id) } });

  if (!target) {
    throw new AppError("User not found.", 404);
  }

  if (data.email && data.email !== target.email) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new AppError("Email already exists.", 409);
    }
  }

  const isSelf = Number(id) === Number(currentUserId);

  if (isSelf && data.status === "INACTIVE") {
    throw new AppError("You cannot deactivate your own account.", 403);
  }

  if (isSelf && data.roleId && data.roleId !== target.roleId) {
    throw new AppError("You cannot change your own role.", 403);
  }

  const updateData = {
    ...(data.firstName && { firstName: data.firstName }),
    ...(data.lastName && { lastName: data.lastName }),
    ...(data.email && { email: data.email }),
    ...(data.phone !== undefined && { phone: data.phone || null }),
    ...(data.roleId && { roleId: data.roleId }),
    ...(data.status && { status: data.status })
  };

  if (data.password) {
    updateData.password = await bcrypt.hash(data.password, 10);
  }

  return prisma.user.update({
    where: { id: Number(id) },
    data: updateData,
    select: userSelect
  });
};

export const deleteUser = async (id, currentUserId) => {
  if (Number(id) === Number(currentUserId)) {
    throw new AppError("You cannot delete your own account.", 403);
  }

  const target = await prisma.user.findUnique({ where: { id: Number(id) } });

  if (!target) {
    throw new AppError("User not found.", 404);
  }

  return prisma.user.delete({ where: { id: Number(id) } });
};

export const updateOwnProfile = async (userId, data) => {
  return prisma.user.update({
    where: { id: Number(userId) },
    data: {
      ...(data.firstName && { firstName: data.firstName }),
      ...(data.lastName && { lastName: data.lastName }),
      ...(data.phone !== undefined && { phone: data.phone || null }),
      ...(data.avatar !== undefined && { avatar: data.avatar || null })
    },
    select: userSelect
  });
};

export const changeOwnPassword = async (userId, currentPassword, newPassword) => {
  const user = await prisma.user.findUnique({ where: { id: Number(userId) } });

  if (!user) {
    throw new AppError("User not found.", 404);
  }

  const isValid = await bcrypt.compare(currentPassword, user.password);

  if (!isValid) {
    throw new AppError("Current password is incorrect.", 401);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  await prisma.user.update({
    where: { id: Number(userId) },
    data: { password: hashedPassword }
  });

  return { message: "Password updated successfully." };
};