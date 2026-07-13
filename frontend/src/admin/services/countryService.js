import api from "./api";

export const getAllCountries = async () => {
  const response = await api.get("/admin/countries");
  return response.data.data;
};

export const getCountryById = async (id) => {
  const response = await api.get(`/admin/countries/${id}`);
  return response.data.data;
};

export const createCountry = async (payload) => {
  const response = await api.post("/admin/countries", payload);
  return response.data.data;
};

export const updateCountry = async (id, payload) => {
  const response = await api.patch(`/admin/countries/${id}`, payload);
  return response.data.data;
};

export const deleteCountry = async (id) => {
  const response = await api.delete(`/admin/countries/${id}`);
  return response.data;
};