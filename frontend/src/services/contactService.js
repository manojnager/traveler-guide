import api from "./api";

export const submitContactMessage = async (payload) => {
  const response = await api.post("/contact", payload);
  return response.data.data;
};