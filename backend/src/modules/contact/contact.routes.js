import { Router } from "express";
import { store } from "./contact.controller.js";

const router = Router();

router.post("/", store);

export default router;