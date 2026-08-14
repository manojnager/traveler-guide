import { Router } from "express";
import { publicIndex, publicCategories, publicLatest, publicShow } from "./blog.controller.js";

const router = Router();

router.get("/", publicIndex);
router.get("/categories", publicCategories);
router.get("/latest", publicLatest);
router.get("/:slug", publicShow);

export default router;