import api from "./api";

export const getAdminReviews = async (params) => {
  const response = await api.get("/admin/reviews", { params });
  return response.data.data;
};

export const setReviewVisibility = async (id, isHidden) => {
  const response = await api.patch(`/admin/reviews/${id}/visibility`, { isHidden });
  return response.data.data;
};

export const deleteReview = async (id) => {
  const response = await api.delete(`/admin/reviews/${id}`);
  return response.data;
};