import prisma from "../../lib/prisma.js";

export const getAllRoles = async () => {
  return prisma.role.findMany({
    orderBy: { name: "asc" }
  });
};