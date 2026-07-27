import api from "./api";

export const getSettings = async () => {
  const response = await api.get("/admin/settings");
  return response.data.data;
};

export const updateSettings = async (payload) => {
  const response = await api.put("/admin/settings", payload);
  return response.data.data;
};