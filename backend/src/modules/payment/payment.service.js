import prisma from "../../lib/prisma.js";
import AppError from "../../errors/AppError.js";
import { getStripeClient, getStripeConfig } from "../../utils/stripe.js";

export const getPublicStripeConfig = async () => {
  const config = await getStripeConfig();

  if (!config.enabled || !config.publishableKey) {
    return { enabled: false, publishableKey: null };
  }

  return { enabled: true, publishableKey: config.publishableKey };
};

export const createPaymentIntent = async (bookingId) => {
  const booking = await prisma.booking.findUnique({
    where: { id: Number(bookingId) },
    include: { payment: true }
  });

  if (!booking) {
    throw new AppError("Booking not found.", 404);
  }

  if (booking.payment?.status === "PAID") {
    throw new AppError("This booking has already been paid.", 409);
  }

  const stripe = await getStripeClient();

  const amountInCents = Math.round(Number(booking.totalAmount) * 100);

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amountInCents,
    currency: "usd",
    description: `Booking payment for Booking #${booking.id} - Traveler Guide`,
    metadata: {
      bookingId: String(booking.id)
    },
    automatic_payment_methods: { enabled: true },
  });

  await prisma.payment.update({
    where: { bookingId: booking.id },
    data: {
      stripePaymentIntentId: paymentIntent.id,
      method: "Stripe"
    }
  });

  return {
    clientSecret: paymentIntent.client_secret
  };
};

export const confirmPayment = async (bookingId, paymentIntentId) => {
  const payment = await prisma.payment.findUnique({
    where: { bookingId: Number(bookingId) }
  });

  if (!payment) {
    throw new AppError("Payment record not found for this booking.", 404);
  }

  if (payment.stripePaymentIntentId !== paymentIntentId) {
    throw new AppError("Payment Intent does not match this booking.", 400);
  }

  const stripe = await getStripeClient();
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status === "succeeded") {
    const [updatedPayment] = await prisma.$transaction([
      prisma.payment.update({
        where: { bookingId: Number(bookingId) },
        data: { status: "PAID", failureReason: null }
      }),
      prisma.booking.update({
        where: { id: Number(bookingId) },
        data: { status: "CONFIRMED" }
      })
    ]);

    return updatedPayment;
  }

  const failureReason = paymentIntent.last_payment_error?.message || `Payment status: ${paymentIntent.status}`;

  await prisma.payment.update({
    where: { bookingId: Number(bookingId) },
    data: { status: "FAILED", failureReason }
  });

  throw new AppError(failureReason, 402);
};