import prisma from "../src/lib/prisma.js";

const sampleBookings = [
  { userId: 2, destinationId: 1, travelDate: "2026-08-15", guests: 2, totalAmount: 2400.0, status: "CONFIRMED" },
  { userId: 2, destinationId: 3, travelDate: "2026-09-02", guests: 4, totalAmount: 5200.0, status: "PENDING" },
  { userId: 3, destinationId: 2, travelDate: "2026-07-28", guests: 2, totalAmount: 1800.0, status: "CONFIRMED" },
  { userId: 3, destinationId: 4, travelDate: "2026-10-10", guests: 3, totalAmount: 3300.0, status: "PENDING" },
  { userId: 2, destinationId: 5, travelDate: "2026-06-20", guests: 2, totalAmount: 2100.0, status: "CANCELLED" },
  { userId: 3, destinationId: 1, travelDate: "2026-11-05", guests: 5, totalAmount: 6000.0, status: "PENDING" },
  { userId: 2, destinationId: 4, travelDate: "2026-05-14", guests: 2, totalAmount: 1950.0, status: "CANCELLED" },
  { userId: 3, destinationId: 5, travelDate: "2026-12-01", guests: 2, totalAmount: 2600.0, status: "CONFIRMED" }
];

async function seedBookings() {
  console.log("Seeding sample bookings...");

  for (const booking of sampleBookings) {
    await prisma.booking.create({
      data: {
        userId: booking.userId,
        destinationId: booking.destinationId,
        travelDate: new Date(booking.travelDate),
        guests: booking.guests,
        totalAmount: booking.totalAmount,
        status: booking.status
      }
    });
  }

  console.log(`Created ${sampleBookings.length} sample bookings.`);
}

seedBookings()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exit(1);
  })
  .finally(() => process.exit(0));