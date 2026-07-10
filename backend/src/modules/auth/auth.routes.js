import { Router } from "express";

import auth from "../../middlewares/auth.js";

import {
  register,
  login,
  me
} from "./auth.controller.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", auth, me);

export default router;