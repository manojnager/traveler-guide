import { Router } from "express";
import upload from "./multer.js";
import auth from "../../middlewares/auth.js";
import {
  uploadThumbnail,
  uploadHero,
  uploadGallery,
  uploadAvatar
} from "./upload.controller.js";
const router = Router();
router.post(
  "/thumbnail",
  upload.single("image"),
  uploadThumbnail
);
router.post(
  "/hero",
  upload.single("image"),
  uploadHero
);
router.post(
  "/gallery",
  upload.array("image", 20),
  uploadGallery
);
router.post(
  "/avatar",
  auth,
  upload.single("image"),
  uploadAvatar
);
export default router;