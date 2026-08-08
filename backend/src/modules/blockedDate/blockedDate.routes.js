import { Router } from "express";
import { publicIndex } from "./blockedDate.controller.js";

const router = Router();

router.get("/:destinationId/blocked-dates", publicIndex);

export default router;