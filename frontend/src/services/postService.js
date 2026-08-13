import api from "./api";

export const getPosts = async ({ page = 1, limit = 9, category } = {}) => {
  const response = await api.get("/posts", { params: { page, limit, category } });
  return response.data.data;
};

export const getFeaturedPost = async () => {
  const response = await api.get("/posts/featured");
  return response.data.data;
};

export const getPostBySlug = async (slug) => {
  const response = await api.get(`/posts/${slug}`);
  return response.data.data;
};