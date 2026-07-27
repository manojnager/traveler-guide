import api from "./api";

export const getAdminWishlist = async (params) => {
  const response = await api.get("/admin/wishlist", { params });
  return response.data.data;
};

export const deleteWishlistItem = async (userId, destinationId) => {
  const response = await api.delete(`/admin/wishlist/${userId}/${destinationId}`);
  return response.data;
};