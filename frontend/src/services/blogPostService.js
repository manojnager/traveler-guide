import api from "./api";

export const getBlogPosts = async ({ page = 1, limit = 9, category } = {}) => {
  const response = await api.get("/blog", { params: { page, limit, category } });
  return response.data.data;
};

export const getBlogCategories = async () => {
  const response = await api.get("/blog/categories");
  return response.data.data;
};

export const getBlogPostBySlug = async (slug) => {
  const response = await api.get(`/blog/${slug}`);
  return response.data.data;
};

export const getLatestBlogPosts = async (limit = 3) => {
  const response = await api.get("/blog/latest", { params: { limit } });
  console.log('posts LETEST CHECK ', response);
  return response.data.data;
}; 