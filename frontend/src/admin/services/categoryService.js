import api from "./api";

export const getAllCategories = async () => {
  const response = await api.get("/admin/categories");
  return response.data.data;
};

export const getCategoryById = async (id) => {
  const response = await api.get(`/admin/categories/${id}`);
  return response.data.data;
};

export const createCategory = async (payload) => {
  const response = await api.post("/admin/categories", payload);
  return response.data.data;
};

export const updateCategory = async (id, payload) => {
  const response = await api.patch(`/admin/categories/${id}`, payload);
  return response.data.data;
};

export const deleteCategory = async (id) => {
  const response = await api.delete(`/admin/categories/${id}`);
  return response.data;
};