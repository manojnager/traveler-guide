import api from "./api";

export const registerCustomer = async (payload) => {
  const response = await api.post("/auth/register", payload);
  return response.data.data;
};

export const loginCustomer = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data.data;
};

export const getProfile = async () => {
  const response = await api.get("/auth/me");
  return response.data.data;
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return response.data;
};

export const resetPassword = async (token, password) => {
  const response = await api.post("/auth/reset-password", { token, password });
  return response.data;
};

export const logoutCustomer = () => {
  localStorage.removeItem("customer_token");
  localStorage.removeItem("customer_user");
};