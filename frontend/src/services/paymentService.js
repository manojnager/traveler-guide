import api from "./api";

export const getStripeConfig = async () => {
  const response = await api.get("/payments/config");
  return response.data.data;
};

export const createPaymentIntent = async (bookingId) => {
    console.log("bookingId before sending:", bookingId, typeof bookingId);
  const response = await api.post("/payments/create-intent", { bookingId });
  return response.data.data;
};

export const confirmPayment = async (bookingId, paymentIntentId) => {
  const response = await api.post("/payments/confirm", { bookingId, paymentIntentId });
  return response.data.data;
};