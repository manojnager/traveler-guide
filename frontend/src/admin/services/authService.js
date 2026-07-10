import api from "./api";

export const loginAdmin = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/me");
  return response.data.data;
};

export const logoutAdmin = () => {
  localStorage.removeItem("admin_token");
  localStorage.removeItem("admin_user");
};