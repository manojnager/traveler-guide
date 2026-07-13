import api from "./api";

export const getPublicDestinations = async () => {
  const response = await api.get("/destinations");
  return response.data.data;
};

export const getPublicDestinationBySlug = async (slug) => {
  const response = await api.get(`/destinations/${slug}`);
  return response.data.data;
};