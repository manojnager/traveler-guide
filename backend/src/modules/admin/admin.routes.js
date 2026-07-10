import { Router } from "express";

import auth from "../../middlewares/auth.js";
import admin from "../../middlewares/admin.js";

import {
  store,
  update,
  destroy,
  adminIndex
} from "../destination/destination.controller.js";

import { stats } from "../dashboard/dashboard.controller.js";

const router = Router();

router.use(auth);

router.use(admin);

router.get(
  "/dashboard/stats",
  stats
);

router.get(
  "/destinations",
  adminIndex
);

router.post(
  "/destinations",
  store
);

router.patch(
  "/destinations/:id",
  update
);

router.delete(
  "/destinations/:id",
  destroy
);

export default router;