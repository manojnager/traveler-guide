import api from "./api";

export const updateProfile = async (payload) => {
  const response = await api.patch("/users/profile", payload);
  return response.data.data;
};

export const changePassword = async (payload) => {
  const response = await api.patch("/users/change-password", payload);
  return response.data;
};