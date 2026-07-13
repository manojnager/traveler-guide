import api from "./api";

export const getAllCities = async (countryId) => {
  const response = await api.get("/admin/cities", {
    params: countryId ? { countryId } : {}
  });
  return response.data.data;
};

export const getCityById = async (id) => {
  const response = await api.get(`/admin/cities/${id}`);
  return response.data.data;
};

export const createCity = async (payload) => {
  const response = await api.post("/admin/cities", payload);
  return response.data.data;
};

export const updateCity = async (id, payload) => {
  const response = await api.patch(`/admin/cities/${id}`, payload);
  return response.data.data;
};

export const deleteCity = async (id) => {
  const response = await api.delete(`/admin/cities/${id}`);
  return response.data;
};