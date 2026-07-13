import api from "./api";

export const getAdminDestinations = async (params) => {
  const response = await api.get("/admin/destinations", { params });
  return response.data.data;
};

export const getAdminDestinationById = async (id) => {
  const response = await api.get(`/admin/destinations/${id}`);
  return response.data.data;
};

export const createDestination = async (payload) => {
  const response = await api.post("/admin/destinations", payload);
  return response.data.data;
};

export const updateDestination = async (id, payload) => {
  const response = await api.patch(`/admin/destinations/${id}`, payload);
  return response.data.data;
};

export const deleteDestination = async (id) => {
  const response = await api.delete(`/admin/destinations/${id}`);
  return response.data;
};

export const bulkDeleteDestinations = async (ids) => {
  return Promise.all(ids.map((id) => deleteDestination(id)));
};

export const toggleDestinationField = async (id, field, value) => {
  return updateDestination(id, { [field]: value });
};

export const getPublicDestinations = async () => {
  const response = await api.get("/destinations");
  return response.data.data;
};

export const getPublicDestinationBySlug = async (slug) => {
  const response = await api.get(`/destinations/${slug}`);
  return response.data.data;
};