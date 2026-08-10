import api from "./api";

export const getPublicSettings = async () => {
  const response = await api.get("/settings");
  return response.data.data;
};