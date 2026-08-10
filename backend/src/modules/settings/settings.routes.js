import { Router } from "express";
import { publicIndex } from "./settings.controller.js";

const router = Router();

router.get("/", publicIndex);

export default router;