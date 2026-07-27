import { Router } from "express";
import { store } from "./booking.controller.js";

const router = Router();

router.post("/", store);

export default router;