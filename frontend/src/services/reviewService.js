import api from "./api";

export const getMyReviewableBookings = async () => {
  const response = await api.get("/reviews/my-reviewable-bookings");
  return response.data.data;
};

export const submitReview = async (payload) => {
  const response = await api.post("/reviews", payload);
  return response.data.data;
};