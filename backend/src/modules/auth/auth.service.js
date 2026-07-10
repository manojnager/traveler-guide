import bcrypt from "bcrypt";
import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";
import { generateToken } from "../../utils/jwt.js";

export const registerUser = async (data) => {
  const existingUser = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  });

  if (existingUser) {
    throw new AppError("Email already exists.", 400);
  }

  const customerRole = await prisma.role.findFirst({
    where: {
      name: "Customer"
    }
  });

  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await prisma.user.create({
    data: {
      roleId: customerRole.id,
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: hashedPassword,
      phone: data.phone
    },
    select: {
      id: true,
      roleId: true,
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      avatar: true,
      status: true,
      createdAt: true,
      updatedAt: true
    }
  });

  const token = generateToken(user);

  return {
    token,
    user
  };
};

export const loginUser = async ({ email, password }) => {
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  });

  if (!user) {
    throw new AppError("Invalid email or password.", 401);
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password.", 401);
  }

  const token = generateToken(user);

  return {
    token,
    user: {
      id: user.id,
      roleId: user.roleId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
      status: user.status
    }
  };
};