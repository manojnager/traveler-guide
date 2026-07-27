const STORAGE_KEY = "guest_wishlist";

const readList = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeList = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

export const isWishlisted = (slug) => readList().includes(slug);

export const toggleWishlist = (slug) => {
  const list = readList();
  const exists = list.includes(slug);
  const updated = exists ? list.filter((item) => item !== slug) : [...list, slug];
  writeList(updated);
  return !exists;
};

export const getWishlist = () => readList();