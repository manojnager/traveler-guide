import api from "./api";

export const uploadAvatar = async (file) => {
  const formData = new FormData();
  formData.append("image", file);

  const response = await api.post("/upload/avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });

  return response.data.data;
};