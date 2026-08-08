import { Router } from "express";
import auth from "../../middlewares/auth.js";
import {
  register,
  login,
  me,
  forgotPasswordHandler,
  resetPasswordHandler
} from "./auth.controller.js";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", auth, me);
router.post("/forgot-password", forgotPasswordHandler);
router.post("/reset-password", resetPasswordHandler);

export default router;