import api from "./api";

const uploadConfig = { headers: { "Content-Type": "multipart/form-data" } };

export const uploadThumbnail = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await api.post("/upload/thumbnail", formData, uploadConfig);
  return response.data.data;
};

export const uploadHero = async (file) => {
  const formData = new FormData();
  formData.append("image", file);
  const response = await api.post("/upload/hero", formData, uploadConfig);
  return response.data.data;
};

export const uploadGallery = async (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append("image", file));
  const response = await api.post("/upload/gallery", formData, uploadConfig);
  return response.data.data;
};