import api from "./api";

export const getAdminUsers = async (params) => {
  const response = await api.get("/admin/users", { params });
  return response.data.data;
};

export const getUserById = async (id) => {
  const response = await api.get(`/admin/users/${id}`);
  return response.data.data;
};

export const createUser = async (payload) => {
  const response = await api.post("/admin/users", payload);
  return response.data.data;
};

export const updateUser = async (id, payload) => {
  const response = await api.patch(`/admin/users/${id}`, payload);
  return response.data.data;
};

export const deleteUser = async (id) => {
  const response = await api.delete(`/admin/users/${id}`);
  return response.data;
};