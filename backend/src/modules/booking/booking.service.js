import bcrypt from "bcrypt";
import crypto from "crypto";
import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";
import { sendEmail, getSmtpNotifyEmail } from "../../utils/mailer.js";
import { wrapEmailTemplate } from "../../utils/emailTemplate.js";

const SORT_MAP = {
  date_asc: { travelDate: "asc" },
  date_desc: { travelDate: "desc" },
  amount_low: { totalAmount: "asc" },
  amount_high: { totalAmount: "desc" },
  oldest: { createdAt: "asc" }
};

const formatDate = (date) =>
  new Date(date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

const STATUS_COPY = {
  CONFIRMED: {
    label: "Confirmed",
    color: "#1f9d55",
    heading: "Your Booking is Confirmed!",
    message: "Great news — your trip is officially confirmed. We can't wait for you to experience it."
  },
  CANCELLED: {
    label: "Cancelled",
    color: "#d63939",
    heading: "Your Booking Has Been Cancelled",
    message: "This booking has been cancelled. If you believe this is a mistake, please reach out to our team."
  }
};

const buildBookingDetailsTable = (booking) => `
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
    ${[
      ["Booking Reference", `#${booking.id}`],
      ["Destination", booking.destination?.title],
      ["Travel Date", formatDate(booking.travelDate)],
      ["Guests", booking.guests],
      ["Total Amount", `$${Number(booking.totalAmount).toFixed(2)}`]
    ]
      .map(
        ([label, value]) => `
      <tr>
        <td style="padding:10px 0; font-size:13px; color:#6c7a91; width:160px; border-bottom:1px solid #EEE;">${label}</td>
        <td style="padding:10px 0; font-size:14px; color:#08111F; font-weight:600; border-bottom:1px solid #EEE;">${value}</td>
      </tr>
    `
      )
      .join("")}
  </table>
`;

export const getAdminBookings = async (query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = {};

  if (query.status) {
    where.status = query.status;
  }

  if (query.destinationId) {
    where.destinationId = Number(query.destinationId);
  }

  if (query.search) {
    where.OR = [
      { user: { firstName: { contains: query.search } } },
      { user: { lastName: { contains: query.search } } },
      { user: { email: { contains: query.search } } },
      { destination: { title: { contains: query.search } } },
      { contactFirstName: { contains: query.search } },
      { contactLastName: { contains: query.search } }
    ];
  }

  const orderBy = SORT_MAP[query.sort] || { createdAt: "desc" };

  const [items, totalItems] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true }
        },
        destination: {
          select: { id: true, title: true, slug: true, thumbnail: true }
        },
        payment: true
      },
      orderBy,
      skip,
      take: limit
    }),
    prisma.booking.count({ where })
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

export const getMyBookings = async (userId, query) => {
  const page = Number(query.page) || 1;
  const limit = Number(query.limit) || 10;
  const skip = (page - 1) * limit;

  const where = { userId: Number(userId) };

  if (query.status) {
    where.status = query.status;
  }

  const [items, totalItems] = await Promise.all([
    prisma.booking.findMany({
      where,
      include: {
        destination: {
          select: { id: true, title: true, slug: true, thumbnail: true, duration: true }
        },
        payment: true
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit
    }),
    prisma.booking.count({ where })
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

export const getBookingById = async (id) => {
  const booking = await prisma.booking.findUnique({
    where: { id: Number(id) },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, email: true, phone: true }
      },
      destination: {
        select: { id: true, title: true, slug: true, thumbnail: true, price: true, duration: true }
      },
      payment: true
    }
  });

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  return booking;
};

export const updateBookingStatus = async (id, status) => {
  await getBookingById(id);

  const booking = await prisma.booking.update({
    where: { id: Number(id) },
    data: { status },
    include: {
      user: {
        select: { id: true, firstName: true, lastName: true, email: true, phone: true }
      },
      destination: {
        select: { id: true, title: true, slug: true, thumbnail: true }
      }
    }
  });

  const statusInfo = STATUS_COPY[status];

  if (statusInfo) {
    const recipientEmail = booking.user?.email;
    const recipientName = booking.contactFirstName || booking.user?.firstName || "Traveler";

    if (recipientEmail) {
      await sendEmail({
        to: recipientEmail,
        subject: `Booking ${statusInfo.label} — TravelerGuide`,
        type: `booking_status_${status.toLowerCase()}`,
        html: wrapEmailTemplate({
          title: statusInfo.heading,
          preheader: statusInfo.message,
          bodyHtml: `
            <table role="presentation" cellpadding="0" cellspacing="0" style="margin-bottom:16px;">
              <tr>
                <td style="background-color:${statusInfo.color}1A; border:1px solid ${statusInfo.color}; border-radius:30px; padding:6px 16px; font-size:12px; font-weight:bold; letter-spacing:1px; text-transform:uppercase; color:${statusInfo.color};">
                  ${statusInfo.label}
                </td>
              </tr>
            </table>

            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
              <tr><td style="font-family: 'Times New Roman', Georgia, serif; font-size:24px; font-weight:bold; color:#08111F; line-height:1.4;">${statusInfo.heading}</td></tr>
            </table>

            <p style="margin:0 0 24px; font-size:15px; color:#4b5563; line-height:1.8;">
              Hi ${recipientName}, ${statusInfo.message}
            </p>

            ${buildBookingDetailsTable(booking)}
          `
        })
      });
    }
  }

  return booking;
};

export const deleteBooking = async (id) => {
  await getBookingById(id);
  return prisma.booking.delete({ where: { id: Number(id) } });
};

export const createPublicBooking = async (data, loggedInUser) => {
  const destination = await prisma.destination.findUnique({
    where: { id: data.destinationId }
  });

  if (!destination || !destination.isPublished) {
    throw new AppError("Destination not found or unavailable.", 404);
  }

  let user;
  let isNewAccount = false;

  if (loggedInUser) {
    // Customer is logged in — always attach the booking to their real account,
    // regardless of what email they typed in the checkout form. The typed
    // name/phone are still saved separately as the trip's contact snapshot.
    user = await prisma.user.findUnique({ where: { id: loggedInUser.id } });

    if (!user) {
      throw new AppError("Your account could not be found. Please log in again.", 401);
    }
  } else {
    // Guest checkout — find or create an account by the email they typed
    user = await prisma.user.findUnique({
      where: { email: data.email }
    });

    if (!user) {
      const customerRole = await prisma.role.findFirst({
        where: { name: "Customer" }
      });

      const randomPassword = crypto.randomBytes(16).toString("hex");
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      user = await prisma.user.create({
        data: {
          roleId: customerRole.id,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          password: hashedPassword,
          phone: data.phone || null
        }
      });

      isNewAccount = true;
    }
  }

  const totalAmount = Number(destination.price) * data.guests;

  const booking = await prisma.$transaction(async (tx) => {
    const createdBooking = await tx.booking.create({
      data: {
        userId: user.id,
        destinationId: destination.id,
        travelDate: new Date(data.travelDate),
        guests: data.guests,
        totalAmount,
        status: "PENDING",
        contactFirstName: data.firstName,
        contactLastName: data.lastName,
        contactPhone: data.phone || null
      }
    });

    await tx.payment.create({
      data: {
        bookingId: createdBooking.id,
        amount: totalAmount,
        method: data.paymentMethod,
        status: "PENDING"
      }
    });

    return tx.booking.findUnique({
      where: { id: createdBooking.id },
      include: {
        user: {
          select: { id: true, firstName: true, lastName: true, email: true, phone: true }
        },
        destination: {
          select: { id: true, title: true, slug: true, thumbnail: true, price: true, duration: true }
        },
        payment: true
      }
    });
  });

  // Customer confirmation email
  await sendEmail({
    to: data.email,
    subject: "Booking Received — TravelerGuide",
    type: "booking_received",
    html: wrapEmailTemplate({
      title: "Booking Received",
      preheader: "We've received your booking and it's now pending confirmation.",
      bodyHtml: `
        <p style="margin:0 0 6px; font-size:13px; color:#C8A96A; letter-spacing:2px; text-transform:uppercase;">Thank You</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
          <tr><td style="font-family: 'Times New Roman', Georgia, serif; font-size:24px; font-weight:bold; color:#08111F; line-height:1.4;">Your booking is on its way, ${data.firstName}!</td></tr>
        </table>

        <p style="margin:0 0 24px; font-size:15px; color:#4b5563; line-height:1.8;">
          We've received your booking for <strong>${destination.title}</strong>. Our team will confirm it shortly —
          you'll receive another email as soon as it's confirmed.
        </p>

        ${buildBookingDetailsTable(booking)}
      `
    })
  });

  // Admin notification email
  const notifyEmail = await getSmtpNotifyEmail();

  if (notifyEmail) {
    await sendEmail({
      to: notifyEmail,
      subject: `New Booking: ${destination.title}`,
      type: "booking_admin_notification",
      html: wrapEmailTemplate({
        title: "New Booking Received",
        preheader: `New booking from ${data.firstName} ${data.lastName}`,
        bodyHtml: `
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr><td style="font-family: 'Times New Roman', Georgia, serif; font-size:22px; font-weight:bold; color:#08111F; padding-bottom:20px;">New Booking Received</td></tr>
          </table>

          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:20px;">
            ${[
              ["Customer", `${data.firstName} ${data.lastName}`],
              ["Email", data.email],
              ["Phone", data.phone || "-"],
              ["New Account", isNewAccount ? "Yes" : "No — existing customer"]
            ]
              .map(
                ([label, value]) => `
              <tr>
                <td style="padding:10px 0; font-size:13px; color:#6c7a91; width:160px; border-bottom:1px solid #EEE;">${label}</td>
                <td style="padding:10px 0; font-size:14px; color:#08111F; font-weight:600; border-bottom:1px solid #EEE;">${value}</td>
              </tr>
            `
              )
              .join("")}
          </table>

          ${buildBookingDetailsTable(booking)}
        `
      })
    });
  }

  return { booking, isNewAccount };
};