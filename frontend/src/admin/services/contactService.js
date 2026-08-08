import api from "./api";

export const getAdminContactMessages = async (params) => {
  const response = await api.get("/admin/contact-messages", { params });
  return response.data.data;
};

export const getContactMessageById = async (id) => {
  const response = await api.get(`/admin/contact-messages/${id}`);
  return response.data.data;
};

export const updateContactMessageStatus = async (id, status) => {
  const response = await api.patch(`/admin/contact-messages/${id}/status`, { status });
  return response.data.data;
};

export const deleteContactMessage = async (id) => {
  const response = await api.delete(`/admin/contact-messages/${id}`);
  return response.data;
};