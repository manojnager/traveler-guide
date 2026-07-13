import api from "./api";

export const getAllAmenities = async () => {
  const response = await api.get("/admin/amenities");
  return response.data.data;
};

export const getAmenityById = async (id) => {
  const response = await api.get(`/admin/amenities/${id}`);
  return response.data.data;
};

export const createAmenity = async (payload) => {
  const response = await api.post("/admin/amenities", payload);
  return response.data.data;
};

export const updateAmenity = async (id, payload) => {
  const response = await api.patch(`/admin/amenities/${id}`, payload);
  return response.data.data;
};

export const deleteAmenity = async (id) => {
  const response = await api.delete(`/admin/amenities/${id}`);
  return response.data;
};