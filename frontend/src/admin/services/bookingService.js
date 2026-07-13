import api from "./api";

export const getAdminBookings = async (params) => {
  const response = await api.get("/admin/bookings", { params });
  return response.data.data;
};

export const getBookingById = async (id) => {
  const response = await api.get(`/admin/bookings/${id}`);
  return response.data.data;
};

export const updateBookingStatus = async (id, status) => {
  const response = await api.patch(`/admin/bookings/${id}/status`, { status });
  return response.data.data;
};

export const deleteBooking = async (id) => {
  const response = await api.delete(`/admin/bookings/${id}`);
  return response.data;
};