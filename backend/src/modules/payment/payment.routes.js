import { Router } from "express";
import { config, createIntent, confirm } from "./payment.controller.js";

const router = Router();

router.get("/config", config);
router.post("/create-intent", createIntent);
router.post("/confirm", confirm);

export default router;