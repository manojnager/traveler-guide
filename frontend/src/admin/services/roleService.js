import api from "./api";

export const getAllRoles = async () => {
  const response = await api.get("/admin/roles");
  return response.data.data;
};