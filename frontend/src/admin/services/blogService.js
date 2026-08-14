import api from "./api";

export const getAdminBlogPosts = async (params) => {
  const response = await api.get("/admin/blog", { params });
  return response.data.data;
};

export const getAdminBlogPostById = async (id) => {
  const response = await api.get(`/admin/blog/${id}`);
  return response.data.data;
};

export const createBlogPost = async (payload) => {
  const response = await api.post("/admin/blog", payload);
  return response.data.data;
};

export const updateBlogPost = async (id, payload) => {
  const response = await api.patch(`/admin/blog/${id}`, payload);
  return response.data.data;
};

export const deleteBlogPost = async (id) => {
  const response = await api.delete(`/admin/blog/${id}`);
  return response.data;
};