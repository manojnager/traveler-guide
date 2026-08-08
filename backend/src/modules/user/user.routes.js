import { Router } from "express";
import auth from "../../middlewares/auth.js";
import { updateProfile, changePassword } from "./user.controller.js";

const router = Router();

router.patch("/profile", auth, updateProfile);
router.patch("/change-password", auth, changePassword);

export default router;