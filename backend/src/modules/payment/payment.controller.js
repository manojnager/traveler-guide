import { successResponse } from "../../responses/apiResponse.js";
import { getPublicStripeConfig, createPaymentIntent, confirmPayment } from "./payment.service.js";
import { createPaymentIntentSchema, confirmPaymentSchema } from "./payment.validation.js";

export const config = async (req, res, next) => {
  try {
    const stripeConfig = await getPublicStripeConfig();
    return successResponse(res, "Stripe config fetched successfully.", stripeConfig);
  } catch (error) {
    next(error);
  }
};

export const createIntent = async (req, res, next) => {
  try {
    const { bookingId } = createPaymentIntentSchema.parse(req.body);
    const result = await createPaymentIntent(bookingId);
    return successResponse(res, "Payment intent created successfully.", result);
  } catch (error) {
    next(error);
  }
};

export const confirm = async (req, res, next) => {
  try {
    const { bookingId, paymentIntentId } = confirmPaymentSchema.parse(req.body);
    const payment = await confirmPayment(bookingId, paymentIntentId);
    return successResponse(res, "Payment confirmed successfully.", payment);
  } catch (error) {
    next(error);
  }
};