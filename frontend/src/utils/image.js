export const PLACEHOLDER_IMAGE = "https://placehold.co/800x600/1a1d21/6c7a91?text=No+Image";

export const getImageUrl = (imagePath) => {
  if (!imagePath) return PLACEHOLDER_IMAGE;
  if (imagePath.startsWith("http")) return imagePath;

  const apiBase = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const origin = apiBase.replace(/\/api\/?$/, "");

  return `${origin}${imagePath}`;
};