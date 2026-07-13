import { Router } from "express";

import auth from "../../middlewares/auth.js";
import admin from "../../middlewares/admin.js";

import {
  store,
  update,
  destroy,
  adminIndex,
  adminShow
} from "../destination/destination.controller.js";

import { stats } from "../dashboard/dashboard.controller.js";

import {
  index as categoryIndex,
  show as categoryShow,
  store as categoryStore,
  update as categoryUpdate,
  destroy as categoryDestroy
} from "../category/category.controller.js";

import {
  index as countryIndex,
  show as countryShow,
  store as countryStore,
  update as countryUpdate,
  destroy as countryDestroy
} from "../country/country.controller.js";

import {
  index as cityIndex,
  show as cityShow,
  store as cityStore,
  update as cityUpdate,
  destroy as cityDestroy
} from "../city/city.controller.js";

import {
  index as amenityIndex,
  show as amenityShow,
  store as amenityStore,
  update as amenityUpdate,
  destroy as amenityDestroy
} from "../amenity/amenity.controller.js";

import {
  adminIndex as bookingAdminIndex,
  adminShow as bookingAdminShow,
  updateStatus as bookingUpdateStatus,
  destroy as bookingDestroy
} from "../booking/booking.controller.js";

import {
  adminIndex as userAdminIndex,
  adminShow as userAdminShow,
  store as userStore,
  update as userUpdate,
  destroy as userDestroy
} from "../user/user.controller.js";

import {
  adminIndex as reviewAdminIndex,
  adminShow as reviewAdminShow,
  updateVisibility as reviewUpdateVisibility,
  destroy as reviewDestroy
} from "../review/review.controller.js";

import {
  adminIndex as wishlistAdminIndex,
  destroy as wishlistDestroy
} from "../wishlist/wishlist.controller.js";

import { index as settingsIndex, update as settingsUpdate } from "../settings/settings.controller.js";
import { index as roleIndex } from "../role/role.controller.js";

const router = Router();

router.use(auth);
router.use(admin);

router.get("/dashboard/stats", stats);

router.get("/destinations", adminIndex);
router.get("/destinations/:id", adminShow);
router.post("/destinations", store);
router.patch("/destinations/:id", update);
router.delete("/destinations/:id", destroy);

router.get("/categories", categoryIndex);
router.get("/categories/:id", categoryShow);
router.post("/categories", categoryStore);
router.patch("/categories/:id", categoryUpdate);
router.delete("/categories/:id", categoryDestroy);

router.get("/countries", countryIndex);
router.get("/countries/:id", countryShow);
router.post("/countries", countryStore);
router.patch("/countries/:id", countryUpdate);
router.delete("/countries/:id", countryDestroy);

router.get("/cities", cityIndex);
router.get("/cities/:id", cityShow);
router.post("/cities", cityStore);
router.patch("/cities/:id", cityUpdate);
router.delete("/cities/:id", cityDestroy);

router.get("/amenities", amenityIndex);
router.get("/amenities/:id", amenityShow);
router.post("/amenities", amenityStore);
router.patch("/amenities/:id", amenityUpdate);
router.delete("/amenities/:id", amenityDestroy);

router.get("/bookings", bookingAdminIndex);
router.get("/bookings/:id", bookingAdminShow);
router.patch("/bookings/:id/status", bookingUpdateStatus);
router.delete("/bookings/:id", bookingDestroy);

router.get("/users", userAdminIndex);
router.get("/users/:id", userAdminShow);
router.post("/users", userStore);
router.patch("/users/:id", userUpdate);
router.delete("/users/:id", userDestroy);

router.get("/roles", roleIndex);

router.get("/reviews", reviewAdminIndex);
router.get("/reviews/:id", reviewAdminShow);
router.patch("/reviews/:id/visibility", reviewUpdateVisibility);
router.delete("/reviews/:id", reviewDestroy);

router.get("/wishlist", wishlistAdminIndex);
router.delete("/wishlist/:userId/:destinationId", wishlistDestroy);

router.get("/settings", settingsIndex);
router.put("/settings", settingsUpdate);

export default router;