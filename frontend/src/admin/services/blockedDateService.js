import api from "./api";

export const getBlockedDates = async (destinationId) => {
  const response = await api.get(`/admin/destinations/${destinationId}/blocked-dates`);
  return response.data.data;
};

export const addBlockedDate = async (destinationId, payload) => {
  const response = await api.post(`/admin/destinations/${destinationId}/blocked-dates`, payload);
  return response.data.data;
};

export const addBulkBlockedDates = async (destinationId, payload) => {
  const response = await api.post(`/admin/destinations/${destinationId}/blocked-dates/bulk`, payload);
  return response.data.data;
};

export const removeBlockedDate = async (id) => {
  const response = await api.delete(`/admin/blocked-dates/${id}`);
  return response.data;
};