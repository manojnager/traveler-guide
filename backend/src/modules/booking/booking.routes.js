import { Router } from "express";
import auth from "../../middlewares/auth.js";
import optionalAuth from "../../middlewares/optionalAuth.js";
import { store, myBookings } from "./booking.controller.js";

const router = Router();

router.post("/", optionalAuth, store);
router.get("/my", auth, myBookings);

export default router;