import prisma from "../../lib/prisma.js";

export const getDashboardStats = async () => {
  const [
    totalDestinations,
    publishedDestinations,
    totalBookings,
    totalUsers,
    revenueResult,
    recentDestinations,
    recentBookings,
    recentUsers
  ] = await prisma.$transaction([
    prisma.destination.count(),

    prisma.destination.count({
      where: { isPublished: true }
    }),

    prisma.booking.count(),

    prisma.user.count(),

    prisma.booking.aggregate({
      _sum: { totalAmount: true },
      where: { status: "CONFIRMED" }
    }),

    prisma.destination.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        category: true,
        country: true,
        city: true
      }
    }),

    prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true
          }
        },
        destination: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        }
      }
    }),

    prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        status: true,
        createdAt: true,
        role: true
      }
    })
  ]);

  return {
    counts: {
      totalDestinations,
      publishedDestinations,
      totalBookings,
      totalUsers,
      totalRevenue: Number(revenueResult._sum.totalAmount || 0)
    },
    recent: {
      destinations: recentDestinations,
      bookings: recentBookings,
      users: recentUsers
    }
  };
};