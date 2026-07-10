const BREADCRUMB_LABELS = {
  admin: "Dashboard",
  destinations: "Destinations",
  create: "Create",
  edit: "Edit",
  categories: "Categories",
  countries: "Countries",
  cities: "Cities",
  bookings: "Bookings",
  users: "Users",
  reviews: "Reviews",
  wishlist: "Wishlist",
  settings: "Settings"
};

export const resolveBreadcrumbLabel = (segment) => {
  if (BREADCRUMB_LABELS[segment]) return BREADCRUMB_LABELS[segment];
  if (/^\d+$/.test(segment)) return `#${segment}`;
  return segment.split("-").map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
};

export default BREADCRUMB_LABELS;