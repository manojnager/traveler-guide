import { Router } from "express";
import auth from "../../middlewares/auth.js";
import { myReviewableBookings, store } from "./review.controller.js";

const router = Router();

router.get("/my-reviewable-bookings", auth, myReviewableBookings);
router.post("/", auth, store);

export default router;